<!--
* @desc 错题集
* @author 戴聪杰
* @date 2021年12月30日
-->
<template>
	<view class="white">
		<tm-pullBottom :height="1490" :loading.sync="loading" @refresh="getdata">
			<template v-slot:pull>
				<tm-images :width="120" src="../../static/img/home/logo.png"></tm-images>
				<view class="text-size-xs text-grey">继续下拉</view>
			</template>
			<template v-slot:pullReresh>
				<tm-images :width="120" src="../../static/img/home/logo.png"></tm-images>
				<view class="text-size-xs text-grey">可以松手啦</view>
			</template>
			<template v-slot:default>
				<view v-if="!ifNoData">
					<view class=" tab-box">
						<view class="tab-list">
							<view v-for="(item,index) in wrongList" :key="index" class="tab-style" @tap="activeNum=index"
								:class="activeNum==index?'text-main text-weight-b':''">
								<view v-show="activeNum==index" class="acitiveNum"></view>
								<text class="tab-text">{{item.projectName}}</text>
							</view>
						</view>
					</view>
					<view v-for="(item,idx) in wrongList[activeNum].wroSubQueList" :key="idx">
						<view class="content-item">
							<view class="flex flex-between">
								<view class="common-text text-size-main common-text-700">{{item.subjectName}}</view>
								<view class="exercise-button  flex-center mb--50 common-click">
									<view class="t-icon t-icon-shu"></view>
									<text class="ml-6 text-size-sl"
										@tap="review(item.questionIds,item.subjectId,wrongList[activeNum].projectId,item.subjectName,wrongList[activeNum].projectName)">开始复习</text>
								</view>
							</view>
							<view class="mt-6">
								<text class="text-size-n text-main">{{item.queCount}}</text>
								<text class="text-size-sl">题</text>
							</view>
						</view>
					</view>
				</view>
				<Empty v-if="ifNoData" text="暂无错题" emptyImg="../../static/img/empty/image-106.png"></Empty>
			</template>
		</tm-pullBottom>
	</view>
</template>

<script lang="ts">
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmPullBottom from '@/tm-vuetify/components/tm-pullBottom/tm-pullBottom.vue';
	import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import Empty from "../../components/EmptyState/Empty.vue"
	import {
		getWrongList
	} from "@/api/modules/user/aggregate.ts"
	@Component({
		components: {
			tmPullBottom,
			tmImages,
			tmEmpty,
			Empty
		}
	})
	export default class wrongList extends Vue {
		private loading: boolean = false
		private testData: any[] = []
		activeNum = 0
		wrongList: any = []
		ifNoData = false
		onShow() {
			this.getWrongList()
		}
		async getWrongList() {
			let res = await getWrongList();
			this.wrongList = res
			if (this.wrongList?.length > 0) {
				this.ifNoData = false
			} else {
				this.ifNoData = true
			}
		}
		getdata(e: string) {
			if (e == 'pull') {
				this.loading = false;
				this.testData = [{}, {}];
				uni.showToast({
					title: '下拉刷新',
					duration: 2000
				});
			}
			if (e == 'bottom') {
				this.loading = false;
				this.testData = [{}, {}, {}, {}];
				uni.showToast({
					title: '触底刷新',
					duration: 2000
				});
			}
		}
		review(questionIds: number[], subjectId: number, projectId: number, subjectName: string, projectName: string) {
			let url =
				`/pages/marketCenter/brushQuestions?questionIds=${questionIds}&subjectId=${subjectId}&projectId=${projectId}&subjectName=${subjectName}&projectName=${projectName}`;
			uni.navigateTo({
				url
			});
		}
	}
</script>

<style lang="scss" scoped>
	.tab-box {
		position: relative;
		.tab-list {
			overflow-x: scroll;
			height: 96rpx;
			display: flex;
			align-items: center;
			margin: 0 28rpx;
			position: relative;
		}
	}

	.content-item {
		background: #F5F6FA;
		margin: 48rpx 24rpx;
		padding: 32rpx;
		border-radius: 24rpx;

		.exercise-button {
			color: #FFFFFF;
			width: 196rpx;
			height: 56rpx;
			border-radius: 24rpx;
			background: linear-gradient(143.4deg, #4F60FF 0%, #667AFF 100%);
			box-shadow: inset 0 0 14rpx 0 #CADCFC, 0 4rpx 10rpx 0 #CADCFC;
			image {
				width: 28rpx;
				height: 28rpx;
			}
		}
	}

	.tab-style {
		font-size: 32rpx;
		white-space: nowrap;
		margin-right: 32rpx;
		position: relative;
		&:last-child {
			margin-right: 0;
		}
		.tab-text {
			z-index: 2;
			position: relative;
		}
	}
</style>
