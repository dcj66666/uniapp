<!--
* @desc 认证接口
* @author 戴聪杰
* @date 2022年03月02日
-->
<template>
	<view class="page-bg">
		<image class="logo-img" src="../../static/img/login/logo.png"></image>
		<button type="primary" class="loginBtn" contact open-type="login" @login="appLogin">登录</button>
	</view>
</template>

<script>
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

		}
	})
	export default class authentication extends Vue {
		userInfo = JSON.parse(uni.getStorageSync('userInfo'));
		appLogin(e) {
			if (e.detail.errCode === '10004' || e.detail.errCode === '904') {
				uni.showToast({
					title: '用户未登录',
					icon: 'none'
				});
				return;
			}
			swan.getLoginCode({
				success: res => {
					getRegister({
						code: res.code,
					}).then((data) => {
						let openId = data
					})
					let params = {
						...infoRes.userInfo,
						openId: openId,
					}
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
				fail: err => {
					console.log('getLoginCode fail', err);
				}
			});

		}
	}
</script>

<style lang="scss" scoped>
	.page-bg {
		height: 100%;
	}

	.logo-img {
		margin: 300rpx calc(50% - 118rpx) 250rpx calc(50% - 118rpx);
		width: 236rpx;
		height: 108rpx;
	}

	.text-size-g {
		text-align: center;
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
</style>
