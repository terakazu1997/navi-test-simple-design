//カウントダウンタイマー
const timer= {
    template: (function() {/*
    <div id="timer" style="display:none">
        <p>{{ formatTime }}</p>
    </div>
    */}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, ""),
    data: function() {
        return {
            //min:分　sec:秒　デフォルトは10分（共通変数で管理する？）
            min: 10,
            sec: 00,　
        }
    },
    //タイマーが画面に描画された時に、カウントダウンスタート
    mounted: function(){
        this.start()
    },
    methods: {
        /*
        秒と分の値で判定
        秒が0以下で分が1以上なら、1分減らし、秒を59にする。
        そうでなければ、秒を1減らす
        */
        count: function() {
            if (this.sec <= 0 && this.min >= 1) {
                this.min --
                this.sec = 59
            } else {
                this.sec --
            }
        },
        //1秒ごとカウントを減らす
        start: function() {
            var self = this
            setInterval(function() {self.count()}, 1000)
        },
    },
    computed: {
        //画面表示用の時間
        formatTime: function() {
            var min = (this.min.toString().length < 2) ? '0' +this.min.toString(): this.min.toString()
            var sec = (this.sec.toString().length < 2) ? '0' + this.sec.toString(): this.sec.toString()
            return min + ":" + sec
        }
    },
    watch: {
        //秒数が変わるごとに実行
        sec: function(){
            //分・秒がどちらもゼロになったら親のcheckAnswerを実行し結果画面に遷移
            if(this.min ===0 && this.sec === 0){
                this.min = 10
                this.sec = 0
                this.$emit('sessionUpdate')
            }
        }
    }
}
