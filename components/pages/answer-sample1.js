//受講結果確認画面
const answerSample1 = {
    template: (function() {/*
        <main>
            <div id = "inContent" v-if="questionObjects">
                <ul class="cp_stepflow01">
                    <li class="bubble"><span class="bubble"></span>テスト(1/2)</li>
                    <li class="bubble"><span class="bubble"></span>テスト(2/2)</li>
                    <li class="completed"><span class="bubble"></span>結果・解説</li>
                </ul>
                <section class="answer-head">
                    <div class="result-pass-fail">
                        <p class="pass-fail-title">テスト結果</p>
                        <p class="pass-fail">合格</p>
                    </div>
                    <div class="result-message">
                        <p class="large">テストお疲れ様でした！結果確認！！</p>
                        <p class="small">{{questionCnt}}問中{{okCnt}}問正解です。</p>
                        <div v-if="questionCnt===okCnt"> 
                            <p class="small">おめでとうございます。資格を取得することができました。</p>
                        </div>
                        <div v-else>
                            <p class="small">全問正解すれば、資格を取得できます。</p>
                        </div>
                    </div>
                </section>

                <ul class="box">
                    <li class="answer1-item" v-for="(questionObject,index) in questionObjects" :key="questionObject.questionId">
                        <div class="question">
                            <div class="question-number"><span>Q{{index + 1}}</span></div>
                            <div class="question-sentence"><span>{{questionObject.question}}</span></div>
                        </div>
                        <div class="choices">
                            <div class="users-answer">
                                <p>あなたの回答</p>
                                <ul>
                                    <li v-for="(choice,choiceIndex) in questionObject.choices" :key="choiceIndex">
                                        <span v-if="questionObject.answerStatus[choiceIndex]==='ユーザの選択' " class="user-check"><span /></span>
                                        <span v-else class="no-check" /></span>
                                        {{choice}}
                                    </li>
                                </ul>
                            </div>
                            <div class="pass-answer">
                                <p>正答</p>
                                <ul>
                                    <li v-for="(choice,choiceIndex) in questionObject.choices" :key="choiceIndex">
                                        <span v-if="questionObject.answer.indexOf(choiceIndex) !== -1" class="pass-check"><span class="small-circle"></span></span>
                                        <span v-else class="no-check" /></span>
                                        {{choice}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="question-explanation">
                            <p class="explanation-title">解説</p>
                            <p class="explanation">{{questionObject.answerSentence}}</p>
                        </div>
                    </li>
                </ul>
                <button id="retest" @click="restartClick">再テスト</button>
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
    methods: {
        //受講画面に遷移する
        restartClick : function () {
            window.scrollTo(0,0)
            this.$router.push({name: 'questionTop'})
        },
    },
    created: function() {
        if(!this.questionObjects){
            this.$router.push({name: 'questionTop'})
        }
    }
}