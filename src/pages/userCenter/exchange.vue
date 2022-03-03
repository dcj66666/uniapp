<!--
* @desc 兑换码
* @author 戴聪杰
* @date 2021年12月31日
-->
<template>
	<view class="common-bg">
		<view class="head-bar flex-start">
			<tm-icons size="32" name="icon-angle-left" color="white" @tap="commonFun.goback()"></tm-icons>
		</view>
		<view class="exchange-bg"></view>
		<view class="exchange-title">
			<text class="text-size-xxl common-text-700">真题兑换</text>
			<view class="head-title"> 兑换立即开始试题练习</view>
		</view>
		<view class="exchange-box">
			<tm-input :vertical="true" border-color="main" :round="6" align="center" placeholder="请输入兑换码"
				v-model="exchangeCode"></tm-input>
			<view class="common-button flex-center text-size-main common-click"
				:class="!isDisable?'disable-btn':[$tm.vx.state().tmVuetify.color]" @tap="isDisable?activation():''">
				激活</view>
			<view class="text-size-sl common-message explain-box">
				<view class="message-title">
					<view class="main-line"></view>
					<view class="common-text-700 instructions">使用说明：</view>
				</view>
				<view>1、参与活动的兑换码，输入即可获得对应的资料；</view>
				<view>2、兑换的资料，可在兑换记录中查看；</view>
				<view>3、若兑换码不存在，请联系直播客服人员。</view>
			</view>
		</view>
		<view class="redeemed">
			<view class="text-size-lg flex-center common-text-700">兑换记录</view>
			<view v-for="(item,idx) in exerciseList" :key="idx" v-if="exerciseList.length>0">
				<view class="content-item">
					<view class="flex flex-between">
						<view class="chapter-text">{{item.productName}}</view>
						<view class="exercise-button text-size-sl flex-center mb--50 common-click"
							@tap="commonFun.routeTo(`/pages/userCenter/productName?id=${item.productId}`)">查看</view>
					</view>
					<view class="mt-12">
						<text class="text-size-sl common-tip">{{item.time}}</text>
					</view>
				</view>
			</view>
			<view class="text-align-center" v-if="exerciseList.length<=0">
				<image src="../../static/img/empty/image-107.png" class="img"></image>
				<view class="text-size-sl empty-title">暂无兑换记录</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
	import {
		submitExchange,
		getProductList
	} from '@/api/modules/exchange/index.ts';
	@Component({
		components: {
			tmIcons,
			tmInput
		}
	})
	export default class exchange extends Vue {
		exchangeCode = ""
		exerciseList = [];
		onLoad() {
			this.getExchangeList();
		}
		get isDisable() {
			return this.exchangeCode != ""
		}
		activation() {
			if (/[\u4E00-\u9FA5]/g.test(this.exchangeCode)) {
				uni.showToast({
					title: '请输入正确的兑换码',
					icon: 'none'
				});
			} else {
				submitExchange(this.exchangeCode)
					.then(() => {
						uni.showToast({
							title: '兑换成功',
						});
						this.exchangeCode = "";
						this.getExchangeList();
					})
			}
		}
		async getExchangeList() {
			let res: any = await getProductList();
			this.exerciseList = res.productions;
		}
		onShow() {
			let height = uni.getSystemInfoSync().statusBarHeight
		}
	}
</script>

<style lang="scss" scoped>
	.common-bg {
		min-height: 100vh;

		.head-bar {
			height: 88rpx;
			position: fixed;
			top: var(--status-bar-height);
			width: 100%;
			z-index: 999;
			padding: 0 32rpx;
			background: linear-gradient(143.4deg, #667AFF 0%, #4F60FF 100%);
		}

		.uni-status-bar {
			width: 750rpx;
			height: 20px;
			height: var(--status-bar-height);
		}
	}

	.exchange-bg {
		width: 750rpx;
		height: 600rpx;
		border-radius: 0 0 8rpx 260rpx;
		background: linear-gradient(143.4deg, #667AFF 0%, #4F60FF 100%);
		position: fixed;
		top: 0;
	}

	.exchange-title {
		position: relative;
		padding: calc(var(--status-bar-height) + 120rpx) 48rpx 20rpx 48rpx;
		color: #FFFFFF;
		line-height: 1.5;
		z-index: 2;
	}

	.exchange-box {
		position: relative;
		z-index: 200;
		width: 686rpx;
		margin: 40rpx auto;
		border-radius: 24rpx;
		padding: 72rpx 0 72rpx 0;
		background: linear-gradient(0.6deg, #FFFFFF 0%, #FFFFFF 90%, #ECF2FF 100%);
		box-shadow: 0 8px 20px 0 #F1F3FA;

		.explain-box {
			margin-top: 40rpx;
		}

		.common-button {
			margin-top: 20rpx;
			width: calc(100% - 64rpx);
		}
	}

	.redeemed {
		position: relative;
		width: 686rpx;
		min-height: 420rpx;
		margin: 40rpx auto;
		border-radius: 24rpx;
		background: #FFFFFF;
		box-shadow: 0 8rpx 20rpx 0 #F1F3FA;
		padding: 32rpx 12rpx 72rpx 12rpx;
	}

	.common-message {
		padding: 0 46rpx;
		line-height: 2;
		margin-top: 30rpx;

		.message-title {
			display: flex;
			align-items: center;

			.main-line {
				margin-right: 10rpx;
				width: 8rpx;
				height: 24rpx;
				border-radius: 16rpx;
				background: #475FFD;
			}
		}
	}

	.head-title {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: #DAE2FF;
	}

	.instructions {
		margin-left: 20rpx;
	}

	.content-item {
		background-color: #F5F6FA;
		margin: 30rpx 20rpx 0 20rpx;
		padding: 22rpx;
		border-radius: 24rpx;

		.exercise-button {
			color: #FFFFFF;
			width: 120rpx;
			height: 56rpx;
			border-radius: 24rpx;
			opacity: 1;
			background: linear-gradient(143.4deg, #4F60FF 0%, #667AFF 100%);
			box-shadow: inset 0 0 14rpx 0 #CADCFC, 0 4rpx 10rpx 0 #CADCFC;
		}
	}

	.img {
		width: 200rpx;
		height: 198rpx;
		margin-top: 40rpx;
	}

	.empty-title {
		color: #A2A6B9;
	}

	.disable-btn {
		background-color: #DCDFED;
	}

	.chapter-text {
		font-size: 32rpx;
		font-weight: 700;
	}
</style>
