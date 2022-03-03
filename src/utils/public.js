import store from '@/store/index.js';
/**
 * 节流函数
 * 当持续触发事件时，保证在一定时间内只调用一次事件处理函数，意思就是说，假设一个用户一直触发这个函数，且每次触发
 * 小于既定值，函数节流会每隔这个时间调用一次
 * 用一句话总结防抖和节流的区别：防抖是将多次执行变为最后一次执行，节流是将多次执行变为每隔一段时间执行
 * 实现函数节流我们主要有两种方法：时间戳和定时器
 *
 * @param fn 执行函数
 * @param delay 间隔时间
 */
export function throttle(fn, delay) {
	//上一次函数调用时间
	var lastTime = store.state.functionTime.lastTime;
	//间隔时间
	var delay = delay || 5000;
	var args = arguments;
	// 记录当前函数触发的时间
	var nowTime = Date.now();
	if (lastTime && nowTime - lastTime < delay) {
		setTimeout(function() {
			// 记录上一次函数触发的时间
			lastTime = nowTime;
			store.dispatch('lastTimeLoad', lastTime);
			// 修正this指向问题
			fn.apply(this, args);
		}, delay);
	} else {
		lastTime = nowTime;
		store.dispatch('lastTimeLoad', lastTime);
		fn.apply(this, args);
	}
}
/**
 * 防抖函数(可用于防止重复提交)
 * 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，
 * 如果设定时间到来之前，又触发了事件，就重新开始延时。也就是说当一个用户一直触发这个函数，
 * 且每次触发函数的间隔小于既定时间，那么防抖的情况下只会执行一次。
 *
 * @param fn 执行函数
 * @param delay 间隔时间
 */
function debounce(fn, delay) {
	//上一次函数调用时间
	var lastTime = store.state.functionTime.lastTime;
	//间隔时间
	var delay = delay || 2000;
	var args = arguments;
	// 记录当前函数触发的时间
	var nowTime = Date.now();
	if (lastTime && nowTime - lastTime < delay) {
		return;
	} else {
		lastTime = nowTime;
		store.dispatch('lastTimeLoad', lastTime);
		fn.apply(this, args);
	}

}
module.exports = {
	debounce: debounce,
	throttle: throttle
};
