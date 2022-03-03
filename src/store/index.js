import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
import outLine from '@/store/modules/outLine.js';
import functionTime from '@/store/modules/functionTime.js';

let store = new Vuex.Store({
  modules: {
    outLine,
	functionTime
  }
});
export default store;