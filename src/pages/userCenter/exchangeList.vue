<!--
* @desc 兑换记录
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view class="page-bg">
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
		<Empty v-if="exerciseList.length<=0" text="暂无兑换记录" tips="通过视频和直播可免费获取兑换码"
			emptyImg="../../static/img/empty/image-107.png" emptySkip="/pages/userCenter/exchange" buttonText="去兑换">
		</Empty>
	</view>
</template>

<script lang="ts">
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import Empty from "@/components/EmptyState/Empty.vue";
	import {
		getProductList
	} from '@/api/modules/exchange/index.ts';
	@Component({
		components: {
			Empty
		}
	})
	export default class exchangeList extends Vue {
		exerciseList = [];
		onLoad() {
			this.getExchangeList();
		}
		async getExchangeList() {
			let res:any = await getProductList();
			this.exerciseList = res.productions;
		}
	}
</script>

<style lang="scss" scoped>
	.page-bg {
		background-color: #FFFFFF;
		padding-top: 48rpx;
		min-height: 100vh;
	}

	.content-item {
		background-color: #F5F6FA;
		margin: 0 24rpx;
		margin-bottom: 48rpx;
		padding: 32rpx;
		border-radius: 24rpx;
		.exercise-button {
			color: #FFFFFF;
			width: 112rpx;
			height: 56rpx;
			border-radius: 24rpx;
			background: linear-gradient(143.4deg, #4F60FF 0%, #667AFF 100%);
			box-shadow: inset 0 0 14rpx 0 #CADCFC, 0 4rpx 10rpx 0 #CADCFC;
		}
	}

	.chapter-text {
		font-size: 32rpx;
		font-weight: 700;
	}
</style>
