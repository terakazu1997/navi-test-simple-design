//受講結果確認画面
const answerSample1 = {
    template: (function() {/*
        <main>
            <div id = "inContent" v-if="questionObjects">
                <section class="answer-head">
                    <h3>テストお疲れ様でした！結果確認！！</h3>
                    <div class="result-message">
                        <p class="large">xxxxxxxxさん、{{questionCnt}}問中{{okCnt}}問正解です。</p>
                        <div v-if="questionCnt===okCnt"> 
                            <p class="small">おめでとうございます。資格を取得することができました。</p>
                            <p class="small">この資格は2xxx年xx月xx日まで有効です</p>
                        </div>
                        <div v-else>
                            <p class="small">全問正解すれば、資格を取得できます。</p>
                        </div>
                    </div>
                </section>
                <ul class="box">
                    <li class="question1-item" v-for="(questionObject,index) in questionObjects" :key="questionObject.questionId">
                        <h3 class="question-title">
                            <ul>
                                <li class="question-cnt">Q{{index + 1}}</li>
                                <li><span>{{questionObject.question}}</span></li>
                            </ul>
                        </h3>
                        <ul class="choises">
                            <li class="choise" v-for="(choise,choiseIndex) in questionObject.choises" :key="choiseIndex">
                                <div v-if="questionObject.answerStatus[choiseIndex]==='正解の回答を未選択' " class="checkbox answer-check">
                                    <p class="small-circle">◯<span class="small-circle-sentence">これは正解</span></p>
                                    <p class="answer-border"></p>    
                                    <input disabled="disabled" :id="questionObject.questionId + choiseIndex" class="check" type="checkbox" >
                                    <label :for="questionObject.questionId + choiseIndex"><span>{{choise}}</span></label>
                                </div>
                                <div v-else-if="questionObject.answerStatus[choiseIndex]==='間違った回答を選択' " class="checkbox answer-check">
                                    <p class="small-batsu">×<span class="small-batsu-sentence">これは間違え</span></p>
                                    <p class="answer-border"></p> 
                                    <input disabled="disabled" checked="checked" :id="questionObject.questionId + choiseIndex" class="check" type="checkbox" >
                                    <label :for="questionObject.questionId + choiseIndex"><span>{{choise}}</span></label>
                                </div>
                                <div v-else-if="questionObject.answerStatus[choiseIndex]==='正解の回答を選択'" class="checkbox answer-check">
                                    <input disabled="disabled" checked="checked":id="questionObject.questionId + choiseIndex" class="check" type="checkbox">
                                    <label :for="questionObject.questionId + choiseIndex"><span>{{choise}}</span></label>
                                </div>
                                <div v-else class="checkbox answer-check">
                                    <input disabled="disabled" :id="questionObject.questionId + choiseIndex" class="check" type="checkbox">
                                    <label :for="questionObject.questionId + choiseIndex"><span>{{choise}}</span></label>
                                </div>
                            </li>
                        </ul>
                        <ul class = "answer-layout answer-item  clear-fix">
                            <li v-if="okList[index]" class="answer answer-result br-left-none">
                                <p class="circle"></p>
                                <p class="ok-ng">正解</p>
                            </li>
                            <li v-else class="answer answer-result">
                                <p class="square cross batsu"></p>
                                <p class="ok-ng">不正解</p>
                            </li>
                            <li class="answer answer-sentence ">
                                <h3>解説</h3>
                                <p>{{questionObject.answerSentence}}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button id="send-answer" @click="restartClick">もう一度チャレンジ！！</button>
            </div>
            <div v-else>
                <question-modal @closemodal="closeReadyModal()" />
            </div>
        </main>
    */}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, ""),
    data: function () {
        return {
            questionObjects: this.$route.params.questionObjects,//受講画面から受け取った問題オブジェクト
            questionCnt: questionObjects.length,//問題数
            okCnt: this.$route.params.okCnt,　//受講画面から受け取った正解数
            okList: this.$route.params.okList //`受講画面がから受け取った正解不正解のリスト
        }
    },
    components: {
        'questionModal': questionModal //初期表示時のモーダル
    },
    methods: {
        //受講画面に遷移する
        restartClick : function () {
            window.scrollTo(0,0)
            this.$router.push({name: 'questionSample1'})
        },
        //初期表示で受講開始ボタンを押下時にモーダルを閉じる
        closeReadyModal: function() {
            window.scrollTo(0,0)
            this.$router.push({name: 'questionSample1',params: {fromAnswerFlg: true}})
        }
    }
}