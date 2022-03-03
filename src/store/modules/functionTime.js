const state = {
     //上一次事件的时间戳
	 lastTime:0
};

const getters = {
};

const actions = {
	lastTimeLoad(context, lastTime) {
		context.commit('setLastTime', lastTime);
	}
};

const mutations = {
	setLastTime(state, lastTime) {
		state.lastTime = lastTime;
	},
};
export default {
	state,
	getters,
	actions,
	mutations
};
