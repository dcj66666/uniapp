<!--
* @desc  空白页组件
* @author 江玉龙
* @date 2021年1月18日
-->
<template>
	<view class="empty-background">
		<view class="text-align-center location">
			<image :src="emptyImg" class="img"></image>
			<view class="text-size-lg common-text-700 text-color">{{text}}</view>
			<view class="text-size-sl head-title">{{tips}}</view>
		</view>
		<view @tap="commonFun.relunch(emptySkip)" class="btn-text flex-center text-size-g">{{buttonText}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: '暂无数据',
			},
			emptyImg: {
				type: String,
				default: '../../static/img/empty/image-106.png',
			},
			tips: {
				type: String,
				default: '快去练习吧',
			},
			buttonText: {
				type: String,
				default: '去首页',
			},
			emptySkip: {
				type: String,
				default: '/pages/index/home',
			},
		},
		data() {
			return {}
		},
		onLoad() {},
		methods: {},
	}
</script>

<style scoped lang='scss'>
	.location {
		transform: translateY(80%);
	}

	.empty-background {
		min-height: 100vh;
		min-width: 100vw;
		background-color: #FFFFFF;
	}

	.img {
		width: 324rpx;
		height: 316rpx;
		opacity: 1;
	}

	.head-title {
		margin-top: 10rpx;
		color: #A2A6B9;
	}

	.text-color {
		color: #5B648D;
	}

	.btn-text {
		width: 506rpx;
		height: 88rpx;
		margin: 640rpx auto 24rpx auto;
		border-radius: 24rpx;
		opacity: 1;
		color: #FFFFFF;
		background-color: #475FFD;

		&:active {
			background-color: #394CCA;
		}
	}
</style>
