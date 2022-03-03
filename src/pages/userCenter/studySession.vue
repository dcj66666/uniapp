<!--
* @desc 学习单元
* @author 江玉龙
* @date 2022年2月28日
-->
<template>
	<view class="page-bg">
		<view v-for="(item,idx) in exerciseList" :key="idx">
			<view class="content-item">
				<view class="flex flex-between">
					<view class="common-text text-size-main">{{item.unitName}}</view>
					<view class="exercise-button text-size-sl flex-center mb--40 common-click"
						@tap="commonFun.routeTo(`/pages/brushQuestions/dailyTest/dailyTest?unitId=${item.unitId}&urlFrom=2&brushTime=${date}`)">
						查看
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import Empty from "../../components/EmptyState/Empty.vue";
	import {
		getStudyUnits
	} from '@/api/modules/exchange/index.ts';
	@Component({
		components: {
			Empty
		}
	})
	export default class exchangeList extends Vue {
		exerciseList = [];
		date = '';
		onLoad(option) {
			this.getExchangeList(option.id);
		}
		async getExchangeList(id) {
			let res = await getStudyUnits(id);
			this.date = Date.parse(new Date());
			this.exerciseList = res;
		}
	}
</script>

<style lang="scss" scoped>
	.page-bg {
		background-color: #FFFFFF;
		padding-top: 48rpx;
		min-height: 100vh;
	}

	.common-text {
		margin-top: 40rpx;
		font-weight: 700;
	}

	.content-item {
		background-color: #F5F6FA;
		margin: 0 24rpx;
		margin-bottom: 24rpx;
		padding: 32rpx;
		border-radius: 24rpx;
		height: 120rpx;
		.exercise-button {
			color: #FFFFFF;
			width: 112rpx;
			height: 56rpx;
			border-radius: 24rpx;
			background: linear-gradient(143.4deg, #4F60FF 0%, #667AFF 100%);
			box-shadow: inset 0 0 14rpx 0 #CADCFC, 0 4rpx 10rpx 0 #CADCFC;
		}
	}
</style>
