//受講画面
const questionSample1 = {
    template: (function() {/*
        <main>
            <question-modal v-if="readyModal" @closemodal="closeReadyModal()" />
            <div id = "inContent" v-if="!readyModal">
                <timer @checkAnswer="checkAnswer"/>
                <ul class="box">
                    <li class="question1-item" v-for="(questionObject,itemIndex) in splitQuestionObjects[currentIndex]" :key="questionObject.questionId">
                        <h3 class="question-title">
                        <ul>
                            <li class="question-cnt" v-if="currentIndex===0">Q{{itemIndex + 1}} </li>
                            <li  class="question-cnt" v-else>Q{{itemIndex + 6}} </li>
                            <li><span>{{questionObject.question}}</span></li>
                        </ul>
                        </h3>
                        <ul class="choises">
                            <li class="choise" v-for="(choise,choiseIndex) in questionObject.choises" :key="choiseIndex">
                                <div class="checkbox">
                                    <input v-if="currentIndex===0" :id="questionObject.questionId + choiseIndex" class="check" type="checkbox" v-model="usersAnswer" :value="itemIndex+1 + '-' + questionObject.questionId + '-' + choiseIndex">
                                    <input v-else :id="questionObject.questionId + choiseIndex" class="check" type="checkbox" v-model="usersAnswer" :value="itemIndex+6 + '-' + questionObject.questionId + '-' + choiseIndex">
                                    <label :for="questionObject.questionId + choiseIndex"><span>{{choise}}</span></label>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <p id="alert-msg">{{alertMessage}}</p>
                <div class="prev-next-buttons clear-fix">
                    <button class="prev-next-button" id="prev-button" v-if="currentIndex===1" @click="prevClick" aria-label="前へ">prev</button>
                    <button class="prev-next-button" id="next-button" v-if="currentIndex===0" @click="nextClick" aria-label="次へ">next</button>
                </div>              
                <button id="send-answer" @click="checkAnswerClick">回答結果を確認</button>
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
            readyModal: true, //初期表示時のモーダルを表示非表示フラグ
            questionCnt: questionObjects.length,//問題数
            alertMessage: ''
        }
    },
    mounted: function(){
        if(this.$route.params.fromAnswerFlg){
            this.readyModal = false;
        }
    },
    components: {
        'timer': timer, //カウントダウンタイマー
        'questionModal': questionModal //初期表示時のモーダル
    },
    computed: {
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
            for(var i=0; i<this.questionCnt; i++){
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
                for(var j=0; j<this.questionCnt; j++){
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
        //初期表示で受講開始ボタンを押下時にモーダルを閉じる
        closeReadyModal: function() {
            window.scrollTo(0,0)
            this.readyModal = false
        },
        prevClick: function() {
            this.currentIndex--;
            window.scrollTo(0,0)
        },
        nextClick: function() {
            this.currentIndex++;
            window.scrollTo(0,0)
        },
        //問題番号(1〜10)をキーに昇順に並べ替えを実行用(sortに渡すコールバック関数として機能)
        sortObjects: function(a,b) {
            if (a.questionNumber < b.questionNumber) return -1
            if (a.questionNumber > b.questionNumber) return 1
            return 0
        },

        /*
        回答結果を確認ボタン押下時に以下の処理を実行
        問題1〜10の問題のうち回答が1つも選択されていない問題を確認
            問題1〜10の問題全て選択された場合:
            　　　checkAnswerを実行し、回答を確認する
            それ以外(1つでも回答が1つも選択されていなかった時）の場合；
                回答が1つも選択されていなかった問題番号を全てアラートで表示し回答を確認しない。
        */
        checkAnswerClick: function () {
            this.alertMessage = ''
            var checkCount=1 //未選択の問題番号アラート表示用カウント
            var checkAnswerFlg=true //回答を確認判定用フラグ　初期値はtrue
            //shapingeCheckNamsからキーがquestionNumberのもののみを取得
            var questionNumbers = this.shapingusersAnswer.concat().map(function(row){
                return[row['questionNumber']]
                }).reduce(function(a,b){
                    return a.concat(b)
                })
            var checkErrorMessage='以下の問題の選択がされていません\n' //アラート表示用メッセージ
            /*
            10回繰り返し、1〜10のうち、全て未選択の問題がないかを確認。
            全て未選択の問題が出てくるたびにアラート表示用メッセージに問題番号を私、回答確認判定用フラグをfalseにする
            繰り返しを1から問題数の+1までに未満にしている理由は問題番号は0〜9ではなく、1〜10であるため
            */
            for(var i=1; i <this.questionCnt+1; i++){
                if(questionNumbers.indexOf(i) === -1 ){
                    checkErrorMessage += 'Q'+checkCount+' '
                    checkAnswerFlg = false
                }
                checkCount++
            }
            //回答判定用フラグがtrue→checkAnswerを実行し回答確認　false→alertを表示
            if(checkAnswerFlg){
                this.checkAnswer()
            }else{
                this.alertMessage = checkErrorMessage+'\nチェックをしてください'
            }
        },
        sessionUpdate: function() {
            console.log('テスト')
        },
        //回答確認　確認後受講結果画面に遷移
        checkAnswer: function () {
            var okList = [];
            for(var i=0; i<this.questionCnt; i++){
                okList[i] = false;
            }
            console.log(okList)
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
                answerStatusを更新んする。
                問題オブジェクトに、ユーザの回答を追加。また、ユーザの回答が問題オブジェクトの回答に存在しなければ正解フラグをfalseにする。
                */
                for(var j=0; j<usersAnswer[i].checkNumbers.length;j++){
                    this.questionObjects[i].usersAnswer.push(usersAnswer[i].checkNumbers[j])
                    if(this.questionObjects[i].answer.indexOf(usersAnswer[i].checkNumbers[j]) === -1 ){
                        this.questionObjects[i].answerStatus[usersAnswer[i].checkNumbers[j]] = "間違った回答を選択"
                        okFlg = false 
                    }else{
                        this.questionObjects[i].answerStatus[usersAnswer[i].checkNumbers[j]] = "正解の回答を選択"
                    }
                }
                /*
                正解の回答の[i]番目の要素数分（正解の選択肢分）繰り返す
                正解の回答が、ユーザの回答に存在しなければanswerStatusを更新し、正解フラグをfalseにする。
                */
                for(var j=0 ;j<this.questionObjects[i].answer.length; j++){
                    if(usersAnswer[i].checkNumbers.indexOf(this.questionObjects[i].answer[j]) === -1 ){
                        this.questionObjects[i].answerStatus[this.questionObjects[i].answer[j]] = "正解の回答を未選択"
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
            console.log(this.questionObjects)
            //受講結果確認画面に遷移、遷移する時に正解数と正解リストと問題オブジェクトを渡す（ユーザの解答を含む）
            this.$router.push({name: 'answerSample1' ,params: {questionObjects: this.questionObjects,okCnt: okCnt,okList: okList }})
        }
    }
}