//受講画面
const questionSample1 = {
    template: (function() {/*
        <main>
            <div id = "inContent">
                <ul class="cp_stepflow01">
                    <li v-if="currentIndex===0"class="completed"><span class="bubble"></span>テスト(1/2)</li>
                    <li v-else class="bubble"><span class="bubble"></span>テスト(1/2)</li>
                    <li v-if="currentIndex===0"class="bubble"><span class="bubble"></span>テスト(2/2)</li>
                    <li v-else class="completed"><span class="bubble"></span>テスト(2/2)</li>
                    <li class="bubble"><span class="bubble"></span>結果・解説</li>
                </ul>
                <ul class="box">
                    <li class="question1-item" v-for="(questionObject,itemIndex) in splitQuestionObjects[currentIndex]" :key="questionObject.questionId">
                        <h3 class="question-title">
                        <ul>
                            <li class="question-cnt" v-if="currentIndex===0">Q{{itemIndex + 1}} </li>
                            <li class="question-cnt" v-else>Q{{itemIndex + 6}} </li>
                            <li><span>{{questionObject.question}}</span></li>
                        </ul>
                        </h3>
                        <ul class="choices">
                            <li class="choice" v-for="(choice,choiceIndex) in questionObject.choices" :key="choiceIndex">
                                <div class="checkbox">
                                    <input v-if="currentIndex===0" :id="questionObject.questionId + choiceIndex" class="check" type="checkbox" v-model="usersAnswer" :value="itemIndex+1 + '-' + questionObject.questionId + '-' + choiceIndex">
                                    <input v-else :id="questionObject.questionId + choiceIndex" class="check" type="checkbox" v-model="usersAnswer" :value="itemIndex+6 + '-' + questionObject.questionId + '-' + choiceIndex">
                                    <label :for="questionObject.questionId + choiceIndex"><span>{{choice}}</span></label>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <p id="alert-msg">{{alertMessage}}</p>
                <div class="under-buttons clear-fix">
                    <button class="under-button" id="prev-button" v-if="currentIndex===1" @click="prevClick" aria-label="前へ">prev</button>
                    <button class="under-button" id="next-button" v-if="currentIndex===0" @click="nextClick" aria-label="次へ">next</button>
                    <button class="under-button" v-if="currentIndex === maxPageNumber　- 1" id="send-answer" @click="checkAnswerClick">回答送信</button>
                </div>      
            </div>
        </main>
    */}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, ""),
    data: function () {
        return {
            currentIndex: 0,
            questionObjects: questionObjects.concat(),//question-sample-dataの問題オブジェクトからコピー
            splitQuestionObjects: [
                questionObjects.concat().slice(0,5),
                questionObjects.concat().slice(-5)
            ],
            usersAnswer: [],//ユーザの回答（チェックボックスから選択された項目が格納される配列）
            pageQuestionCnt: 5, //1ページに表示する問題数
            alertMessage: '',
            checkChoicesFlg: true, //選択肢を確認判定用フラグ　初期値はtrue
            checkErrorMessage: '' //アラート表示用メッセージ
        }
    },
    computed: {
        //最大のページ番号
        maxPageNumber: function(){
            return questionObjects.length / 5
        },
        /*
        checkされた項目を整形する算出プロパティ　構成は下記
        ◯整形前(配列（中身が文字列))
        形式：[問題番号(1〜10)-問題id(Qxxx)-選択肢の番号(1〜4),...,[問題番号(1〜10)-問題id(Qxxx)-選択肢の番号(1〜4)]
        例:['1-Q001-1','9-Q047-2,'2-Q050-1','1-Q001-4']
        ◯整形後(配列（中身がオブジェクトで問題番号、問題idの重複をなくし、問題番号の昇順にする)）
        形式:[{questionNumber: 問題番号(数値の1〜10),questionId: 問題id(Qxxx),checkNumber: 選択肢の配列([])}
                ...
            {questionNumber: 問題番号(数値の1〜10),questionId: 問題id(Qxxx),checkNumber: 選択肢の配列([])}]
        例；[{questionNumber: 1,questionId: Q001,checkNumbers: [1,4]},{questionNumber: 2,questionId: Q050,checkNumbers: 1},
            {questionNumber: 9,questionId: Q047,checkNumbers: 2}
        */
        shapingusersAnswer: function(){
            var shapeCheckNameArray = []　//check項目整形用配列
            //check整形用配列初期値設定
            for(var i=0; i<this.questionObjects.length; i++){
                shapeCheckNameArray.push({
                    questionNumber: 99999, //問題番号(99999を入れる理由：0にすると昇順にした時におかしくなる99999は使われることはない)
                    questionId: '', //問題id
                    checkNumbers: [] //選択肢の番号
                })
            }
            /*ユーザの回答の要素分繰り返す。
            この時点では、問題番号、問題idが重複しているため、問題数とユーザの回答のオブジェクトそれぞれのループを回す必要がある
            ユーザの回答の[i]番目を'-'で分解して、[問題番号、問題id、選択肢の番号に分離
            その後、二重ループで、ユーザの回答を追加更新
            */
            for(var i=0; i<this.usersAnswer.length;i++){
                var usersAnswerplit = this.usersAnswer[i].split('-') //-で分解
                //問題数の要素分繰り返す
                for(var j=0; j<this.questionObjects.length; j++){
                    //問題番号と、ユーザの回答の問題番号が等しければ、ユーザの回答を追加更新。j+1にしているのは、問題番号は1〜10であるため
                    if(j+1 === parseInt(usersAnswerplit[0])){
                        shapeCheckNameArray[j].questionNumber = parseInt(usersAnswerplit[0]) //問題番号を上書き
                        shapeCheckNameArray[j].questionId = usersAnswerplit[1] //問題idを上書き
                        shapeCheckNameArray[j].checkNumbers.push(parseInt(usersAnswerplit[2])) //回答の選択を追加
                    }
                }
            }
            //昇順並べ替え
            shapeCheckNameArray = shapeCheckNameArray.sort(this.sortObjects)
            return shapeCheckNameArray
        }
    },

    methods:{
        //問題の中で1つでも未選択の問題がないかを確認
        checkChoices: function(){
            this.alertMessage = ''
            this.checkChoicesFlg=true 
            //shapingeCheckNamsからキーがquestionNumberのもののみを取得
            var questionNumbers = this.shapingusersAnswer.concat().map(function(row){
                return[row['questionNumber']]
                }).reduce(function(a,b){
                    return a.concat(b)
            })
            this.checkErrorMessage='以下の問題の選択がされていません\n' 
            /*
            現在のページ*1ページに表示項目数(5)+1から、(現在のページ数 + 1)*1ページに表示項目数(5)回+1繰り返し。
            （このようにしているのはページや表示項目が増えても対応できるように。
            全て未選択の問題が出てくるたびにアラート表示用メッセージに問題番号を私、回答確認判定用フラグをfalseにする
            繰り返しを1から問題数の+1までに未満にしている理由は問題番号は、1から始まるため。
            */
           for(var i=(this.currentIndex) * this.pageQuestionCnt +1; i < (this.currentIndex + 1 ) * this.pageQuestionCnt +1; i++){
            if(questionNumbers.indexOf(i) === -1 ){
                this.checkErrorMessage += 'Q'+i+' '
                this.checkChoicesFlg = false
            }
        }
        },
        //前のページへボタン押下時
        prevClick: function() {
            this.currentIndex--
            window.scrollTo(0,0)
        },
        //次のページへボタン押下時
        nextClick: function() {
            this.checkChoices()
            //選択判定用フラグがtrue→ページを1プラス。　false→alertを表示 
            if(this.checkChoicesFlg){
                this.currentIndex++
                window.scrollTo(0,0)
            }else{
                this.alertMessage = this.checkErrorMessage+'\nチェックをしてください'
            }

        },
        //問題番号(1〜10)をキーに昇順に並べ替えを実行用(sortに渡すコールバック関数として機能)
        sortObjects: function(a,b) {
            if (a.questionNumber < b.questionNumber) return -1
            if (a.questionNumber > b.questionNumber) return 1
            return 0
        },

        // 回答結果を確認ボタン押下時に以下の処理を実行
        checkAnswerClick: function () {
            this.checkChoices()
            //選択判定用フラグがtrue→checkAnswerを実行し回答確認　false→alertを表示
            if(this.checkChoicesFlg){
                this.checkAnswer()
            }else{
                this.alertMessage = this.checkErrorMessage+'\nチェックをしてください'
            }
        },
        //回答確認　確認後受講結果画面に遷移
        checkAnswer: function () {
            var okList = [];
            for(var i=0; i<this.questionObjects.length; i++){
                okList[i] = false;
            }
            var okCnt = 0 //正解数
            //問題オブジェクトの要素数分、問題オブジェクトの[i]番目にusersAnswer（ユーザの回答：配列）を追加
            for(var i=0; i<this.questionObjects.length; i++){
                this.questionObjects[i].usersAnswer= []
                this.questionObjects[i].answerStatus= ["","","",""]
            }
            var usersAnswer = this.shapingusersAnswer //
            for(var i=0;i<usersAnswer.length;i++){
                var okFlg = true //正解フラグ 正解数を加算する判断材料の1つに使用
                /*
                ユーザの回答の[i]番目の要素数分（ユーザが選択した数分）繰り返す
                answerStatusを更新する。
                問題オブジェクトに、ユーザの回答を追加。また、ユーザの回答が問題オブジェクトの回答に存在しなければ正解フラグをfalseにする。
                */
                for(var j=0; j<usersAnswer[i].checkNumbers.length;j++){
                    this.questionObjects[i].usersAnswer.push(usersAnswer[i].checkNumbers[j])
                    if(this.questionObjects[i].answer.indexOf(usersAnswer[i].checkNumbers[j]) === -1 ){
                        this.questionObjects[i].answerStatus[usersAnswer[i].checkNumbers[j]] = "ユーザの選択"
                        okFlg = false 
                    }else{
                        this.questionObjects[i].answerStatus[usersAnswer[i].checkNumbers[j]] = "ユーザの選択"
                    }
                }
                /*
                正解の回答の[i]番目の要素数分（正解の選択肢分）繰り返す
                正解の回答が、ユーザの回答に存在しなければanswerStatusを更新し、正解フラグをfalseにする。
                */
                for(var j=0 ;j<this.questionObjects[i].answer.length; j++){
                    if(usersAnswer[i].checkNumbers.indexOf(this.questionObjects[i].answer[j]) === -1 ){
                        okFlg = false 
                    }
                }
                //okFlgがtrueの場合のみ正解数を加算
                if(okFlg ){
                    okList[i] = true;
                    okCnt += 1
                }
            }
            window.scrollTo(0,0)
            //受講結果確認画面に遷移、遷移する時に正解数と正解リストと問題オブジェクトを渡す（ユーザの解答を含む）
            this.$router.push({name: 'answerSample1' ,params: {questionObjects: this.questionObjects,okCnt: okCnt,okList: okList }})
        }
    },
    created: function() {
        if(!this.$route.params.readyFlg){
            this.$router.push({name: 'questionTop'})
        }
    }
}