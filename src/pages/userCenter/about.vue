<!--
* @desc 选择考试
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view class="page-bg about-page">
		<image src="../../static/img/logo.jpg" class="logo-image" @tap="loginout"></image>
		<view class="text-size-xxs">版本 {{version_number}}</view>
		<view class="about-content common-text">
			<view class="txt-indent">准题宝是一款自学考试题库学习小程序，主要涵盖二级建造师、社会工作者、护士资格，教师资格等考试项目的相关习题。</view>
			<view class="txt-indent">
				用户可进行每日刷题、章节练习，还可以使用兑换码获得免费定制习题。同时准题宝可以准确分析高频考点和高频易错点，能随时随地带给用户方便快捷的刷题体验。
			</view>
		</view>
		<image src="../../static/img/home/logo.png" class="zhongda-logo"></image>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	@Component({
		components: {

		}
	})
	export default class about extends Vue {
		version_number = '1.0.1'
		clickTime = 0
		startTime = ''
		lastTime = ''
		onLoad() {
			uni.getSystemInfo({
				success: () => {}
			});
			// #ifdef MP-WEIXIN
			const accountInfo = wx.getAccountInfoSync();
			this.version_number = accountInfo.miniProgram.version // 小程序 版本号
			// #endif
		}
		loginout() {
			if (this.clickTime === 0) {
				this.startTime = new Date()
				this.lastTime = this.startTime
			} else if (this.clickTime >= 1) {
				let nextTime = new Date()
				if ((nextTime - this.lastTime) >= 3000 || (nextTime - this.startTime) >= 5000) {
					this.startTime = nextTime
					this.lastTime = nextTime
					this.clickTime = 0
				} else {
					this.lastTime = nextTime
				}
				if (this.clickTime === 7) {
					uni.clearStorageSync()
					uni.navigateTo({
						url: '/pages/index/selectExam'
					})
				}
			}
			this.clickTime++
		}
	}
</script>

<style lang="scss" scoped>
	.about-page {
		text-align: center;
		min-height: 100vh;

		.logo-image {
			width: 160rpx;
			height: 160rpx;
			margin: 128rpx auto 22rpx auto;
		}

	}

	.about-content {
		text-align: left;
		margin: 128rpx 48rpx 0 48rpx;
		font-size: 26rpx;
		font-weight: 400;
		line-height: 48rpx;
	}

	.zhongda-logo {
		position: fixed;
		bottom: 138rpx;
		height: 36rpx;
		width: 200rpx;
		transform: translateX(-50%);
	}

	.txt-indent {
		text-indent: 54rpx;
	}
</style>
