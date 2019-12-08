//受講画面遷移時のモーダル。受講開始ボタンが押されると、モーダルが閉じ、受講が開始する。
const questionTop = {
    template: (function() {/*    
        <div class="modal-mask">
            <router-link :to="{name: 'questionSample1',params:{readyFlg: true} }" ><button id="start-btn" @click="$emit('closemodal')">受講開始</button></router-link>
        </div>
    */}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, ""),

}
