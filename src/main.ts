import Vue from 'vue'
import App from '@/App.vue'
// import './static/icon/iconfont.js'
import './static/icon/iconfont-weapp-icon.css'
import tmVuetify from "./tm-vuetify/index.js";
Vue.use(tmVuetify)

import commonFun from './utils/common.js'
Vue.prototype.commonFun = commonFun 

// import publicFun from './utils/public.js'
// Vue.prototype.$publicFun = publicFun;

import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue'
import tmMessage from '@/tm-vuetify/components/tm-message/tm-message.vue'
import shareCanvas from '@/components/ShareCanvas/ShareCanvas.vue'

Vue.component('tmButton', tmButton)
Vue.component('tmMessage', tmMessage)
Vue.component('shareCanvas', shareCanvas)
Vue.config.productionTip = false
// new App().$mount()

import store from '@/store/index.js'
Vue.prototype.$store = store
const app = new Vue({
    ...App,
    store
})
app.$mount()

