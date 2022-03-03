<!--
* @desc 选择考试
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view class="common-bg">
		<view class="text-box common-text">
			<view class="text-size-xxl mb-24 common-text-700">授权登录</view>
			<view class="text-size-main">体验更多功能，与千万用户一起刷题</view>
		</view>
		<view class="login-bg">
			<image class="element-main" src="../../static/img/login/element-main.png"></image>
			<image class="element-left" src="../../static/img/login/element-left1.png"></image>
			<image class="element-left2" src="../../static/img/login/element-left-2.png"></image>
			<image class="element-right" src="../../static/img/login/element-right.png"></image>
			<!-- #ifndef MP-BAIDU -->
			<view class="loginBtn flex-center text-size-g" @tap="appLogin">
				抖音授权登录
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-BAIDU -->
			<button type="primary" class="loginBtn text-size-g" contact open-type="getUserInfo"
				@getuserinfo="getUserInfoHandle">登录</button>
			<!-- #endif -->
			<view class="flex-center relative">
				<tm-checkbox v-model="checked" round="rounded" size="30"></tm-checkbox>
				<view class="tipsShow" v-show="dataShow">请先阅读并勾选平台协议</view>
				<text class="text-size-sl">我已阅读并同意<text class="text-main" @tap.stop="userAgreement">《用户协议》</text>和<text
						class="text-main" @tap.stop="privacyAgreement">《隐私协议》</text></text>
			</view>
		</view>
	</view>
</template>

<script>
	var that = this;
	import tmCheckbox from "@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue";
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import {
		getLogin,
		getRegister,
		chooseSubject
	} from "@/api/modules/user/index";
	@Component({
		components: {
			tmCheckbox,
		},
	})
	export default class Login extends Vue {
		checked = false;
		tipsShow = false;
		onLoad() {
			!this.$tm.vx.state().tmVuetify.color && this.$tm.theme.setTheme("main");
		}
		get dataShow() {
			return !this.checked && this.tipsShow;
		}
		// 百度获取用户信息
		getUserInfoHandle(res) {
			uni.setStorageSync("userInfo", JSON.stringify(res.detail.userInfo));
			uni.navigateTo({
				url: `/pages/login/authentication`
			})
		}
		async getLogin(res, mp) {
			let openId = await getRegister({
				code: res.code,
			});
			// 获取用户信息
			uni.getUserInfo({
				provider: mp,
				success: function(infoRes) {
					uni.setStorageSync("userInfo", JSON.stringify(infoRes.userInfo));
					let params = {
						...infoRes.userInfo,
						openId: openId,
					};
					getLogin(params).then((item) => {
						uni.setStorageSync("token", item.token);
						let projectData = JSON.parse(uni.getStorageSync("projectData"));
						chooseSubject({
							projectName: projectData.name,
							projectId: projectData.id,
							subjects: JSON.parse(uni.getStorageSync("subjectsList")),
						});
						var pages = getCurrentPages();
						var page = pages[pages.length - 1].route;
						if (page != "pages/login/login" && page) {
							uni.navigateBack({});
						} else {
							uni.reLaunch({
								url: "/pages/index/home",
							});
						}
					});
				},
			});
		}
		appLogin() {
			if (!this.checked) {
				this.tipsShow = true;
				return;
			}
			let that = this;
			let provider = ''
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					provider = res.provider[0]
				}
			})
			uni.login({
				provider: provider,
				success(res) {
					// 通过code去处理
					that.getLogin(res, provider);
				},
			});
		}
		userAgreement() {
			uni.navigateTo({
				url: "/pages/login/userAgreement",
			});
		}
		privacyAgreement() {
			uni.navigateTo({
				url: "/pages/login/privacyAgreement",
			});
		}
	}
</script>

<style lang="scss" scoped>
	.text-box {
		position: absolute;
		padding: 64rpx;
		padding-top: 96rpx;
		font-size: 36rpx;
		z-index: 9999;
	}

	.login-bg {
		background-image: url(https://app.static.wangxiao.cn/ztb/bg.png);
		background-size: 100% 100%;
		height: 1195rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
	}

	.element-main {
		width: 600rpx;
		height: 556rpx;
		margin: 70rpx 0 0 80rpx;
		z-index: 2;
		position: relative;
	}

	.element-left {
		width: 100rpx;
		height: 135rpx;
		position: absolute;
		top: 180rpx;
		left: 180rpx;
		animation: changes 2s 0.2s linear infinite alternate;
	}

	@keyframes changes {
		from {
			transform: rotate(0);
			transform-origin: right bottom;
		}

		to {
			transform: rotate(-30deg);
			transform-origin: right bottom;
		}
	}

	@keyframes rightChanges {
		from {
			transform: rotate(0);
			transform-origin: left bottom;
		}

		to {
			transform: rotate(30deg);
			transform-origin: left bottom;
		}
	}

	.element-left2 {
		width: 120rpx;
		height: 180rpx;
		position: absolute;
		bottom: 580rpx;
		left: 32rpx;
		animation: changes 2s 0.2s linear infinite alternate;
	}

	.element-right {
		width: 120rpx;
		height: 180rpx;
		position: absolute;
		bottom: 580rpx;
		right: 36rpx;
		animation: rightChanges 2s 0.2s linear infinite alternate;
	}

	.loginBtn {
		width: 654rpx;
		height: 88rpx;
		margin: 140rpx auto 24rpx auto;
		border-radius: 24rpx;
		opacity: 1;
		color: #ffffff;
		background-color: rgba(71, 95, 253, 1);

		&:active {
			background-color: #394cca;
		}
	}

	.tipsShow {
		position: absolute;
		left: 70rpx;
		bottom: -60rpx;
		padding: 12rpx 24rpx;
		border-radius: 10rpx;
		background: rgba(255, 255, 255, 1);
		font-size: 24rpx;
		color: #5b648d;

		&:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
			top: -18rpx;
			left: 6rpx;
			border-right: solid 30rpx transparent;
			border-left: solid 30rpx transparent;
			border-bottom: solid 30rpx white;
		}
	}
</style>
