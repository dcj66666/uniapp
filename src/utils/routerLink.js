import publicFun from './public.js';
export function routeTo(url) {
	try {
		const value = uni.getStorageSync('token');
		if (value) {
			publicFun.debounce(function() {
				uni.navigateTo({
					url
				});
			});
		} else {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		}
	} catch (e) {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
}

export function redirectTo(url) {
	try {
		uni.redirectTo({
			url
		});
	} catch (e) {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
}

export function relunch(url) {
	try {
		uni.reLaunch({
			url
		});
	} catch (e) {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
}
export function goback() {
	uni.navigateBack({});
}
export function switchTab(url) {
	try {
		uni.switchTab({
			url
		});
	} catch (e) {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
}
