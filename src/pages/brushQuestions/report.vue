<!--
* @desc 选择考试
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view class="common-bg">
		<view class="head-bar flex-start">
			<tm-icons size="32" name="icon-angle-left" color="white" @tap="commonFun.goback()"></tm-icons>
		</view>
		<view class="report-bg">
			<view class="report-title text-size-xxl">
				<text>学习报告</text>
				<view class="text-size-sl"> 上岸的距离越来越近了，请继续保持哦！</view>
			</view>
			<view v-if="urlFrom==='1'">
				<view class="report-share-button text-size-xxs flex-center" v-show="nextUnitId"
					@tap.stop="commonFun.routeTo(`/pages/brushQuestions/chapterExercise/exerciseTest?unitId=${nextUnitId}&queStatus=${nextQueStatus}`)">
					练习下一章节</view>
				<button open-type="share" v-show="!nextUnitId">
					<view class="report-share-button text-size-xxs flex-center">解锁下一章节</view>
					<view class="report-share-model flex-center "> 
					 <view class="t-icon t-icon-fenxiangsongli"></view>
					 <view>分享好友解锁</view>
					</view>
				</button>
			</view>
			<view class="report-share-button text-size-xxs flex-center" v-else @tap="sharePoster()">分享打卡</view>
		</view>

		<view class="report-box flex-between">
			<view>
				<view class="text-size-xxl common-text-700 common-text">{{unitNum}}</view>
				<view class="text-size-sl">总题数</view>
			</view>
			<view>
				<view class="text-size-xxl common-text-700 common-text">{{(correctRate*100).toFixed(0)}}%</view>
				<view class="text-size-sl">正确率</view>
			</view>
			<view>
				<view class="text-size-xxl common-text-700 common-text">{{unitTime}}</view>
				<view class="text-size-sl">总用时</view>
			</view>
		</view>
		<view class="answer-sheet">
			<view class="flex-between">
				<view class="flex-start">
					<image class="analysis-icon" src="@/static/img/home/Frame4.png"></image>
					<text class="text-size-main common-text ml-12">答题卡</text>
				</view>
				<view class="flex text-size-xxs common-tip">
					<view class="flex-center mr-12">
						<view class="sheet-dort sheet-bingo mr-12"></view>正确
					</view>
					<view class="flex-center">
						<view class="sheet-dort sheet-wrong mr-12"></view>错误
					</view>
				</view>
			</view>
			<view class="flex-box">
				<view v-for="(item,index) in answerSheetList" :key="index" class="sheet-item text-size-main flex-center"
					:class="item.accuracy=='0'?'sheet-nomorl':item.accuracy=='1'?'sheet-bingo':'sheet-wrong'">
					{{index+1}}
				</view>
			</view>
		</view>
		<view class="common-button flex-center common-click" :class="[$tm.vx.state().tmVuetify.color]"
			@tap="startBrush('upload')">
			查看解析</view>
		<view class="common-button flex-center text bg-gradient-main-lighten outlined common-click"
			:class="[$tm.vx.state().tmVuetify.color]" @tap="startBrush">
			重新练习</view>
		<swiper-canvas ref="poster" :peopleNumber="shareData.nowSign" :dayNumber="shareData.signCount"
			:questionNumber="shareData.questionCount" :timeNumber="shareData.totalTime"></swiper-canvas>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import swiperCanvas from "@/components/ShareCanvas/SwiperCanvas.vue";
	import {
		getReport,
		shareExercise
	} from "@/api/modules/question/exercise";
	import {
		getChapterReport,
		ShareUnlock
	} from "@/api/modules/chapter/index";
	@Component({
		components: {
			tmIcons,
			swiperCanvas
		}
	})
	export default class report extends Vue {
		shareData = {
			nowSign: '0',
			questionCount: '111',
			signCount: '22',
			totalTime: '10'
		}
		//准确率
		correctRate = 80
		//答题卡
		answerSheetList = []
		//题目数
		unitNum = 0
		unitTime = '00:00'
		unitId = ""
		currentUnit = ""
		ifSubmit = ""
		// 是否是兑换码进入
		urlFrom = '0'
		// 兑换码做题数据
		provisionalAnswer = []
		nextUnitId = ""
		nextQueStatus = ""
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				ShareUnlock()
			}
			return {
				title: '好友邀请@你一起刷题',
				path: '/pages/index/home'
			}
		}
		onLoad(option) {
			this.unitId = option.unitId
			this.currentUnit = option.currentUnit
			this.ifSubmit = option.ifSubmit
			if (option.urlFrom)(this.urlFrom = option.urlFrom)
			switch (this.urlFrom) {
				case '0':
					//每日一练
					this.getReport(option.unitId)
					break;
				case '1':
					//章节练习
					this.getChapterReport(option.unitId)
					break;
				case '2':
					//兑换码
					this.correctRate = option.correctRate
					this.answerSheetList = JSON.parse(option.answerSheetList)
					this.unitNum = option.unitNum
					this.unitTime = option.unitTime
					this.provisionalAnswer = option.provisionalAnswer
					break;
			}

		}
		async sharePoster() {
			let params = {
				unitId: this.unitId,
				projectId: uni.getStorageSync('projectId'),
				subjectId: uni.getStorageSync('subjectId'),
			}
			// 获取分享数据
			this.shareData = await shareExercise(params)
			this.$refs.poster.showCanvas()
		}
		//获取每日一练
		async getReport(id) {
			let params = {
				unitId: id,
				projectId: uni.getStorageSync('projectId'),
				subjectId: uni.getStorageSync('subjectId'),
			}
			let res = await getReport(params);
			this.correctRate = res.correctRate
			this.answerSheetList = res.answerSheetList
			this.unitNum = res.unitNum
			this.unitTime = res.unitTime
		}
		//获取章节练习
		async getChapterReport(id) {
			let params = {
				unitId: id
			}
			let res = await getChapterReport(params);
			this.correctRate = res.correctRate
			this.answerSheetList = res.answerSheetList
			this.unitNum = res.unitNum
			this.unitTime = res.unitTime
			this.nextUnitId = res.nextUnitId
			this.nextQueStatus = res.queStatus
		}
		startBrush(status) {
			var url = ''
			if (status == 'upload') {
				switch (this.urlFrom) {
					case '0':
						url =
							`/pages/brushQuestions/dailyTest/dailyTest?unitId=${this.unitId}&brushTime=${Date.parse(new Date())}&currentUnit=${this.currentUnit}&ifSubmit=${this.ifSubmit}&ifUpload=true`
						break;
					case '1':
						url =
							`/pages/brushQuestions/chapterExercise/exerciseTest?unitId=${this.unitId}&queStatus=2&ifUpload=true`
						break;
					case '2':
						url =
							`/pages/brushQuestions/dailyTest/dailyTest?unitId=${this.unitId}&ifUpload=true&provisionalAnswer=${this.provisionalAnswer}&urlFrom=2`
						break;
					default:
						break;
				}
				uni.navigateTo({
					url
				})
			} else {
				switch (this.urlFrom) {
					case '0':
						url =
							`/pages/brushQuestions/dailyTest/dailyTest?unitId=${this.unitId}&brushTime=${Date.parse(new Date())}&currentUnit=${this.currentUnit}&ifSubmit=${this.ifSubmit}`
						break;
					case '1':
						url =
							`/pages/brushQuestions/chapterExercise/exerciseTest?unitId=${this.unitId}&queStatus=2`
						break;
					case '2':
						url =
							`/pages/brushQuestions/dailyTest/dailyTest?unitId=${this.unitId}&urlFrom=2`
						break;
					default:
						break;
				}
				uni.redirectTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.common-bg {
		min-height: 100vh;
	}

	.head-bar {
		height: 88rpx;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
		padding: 0 32rpx;
		padding-top: var(--status-bar-height);
		background: linear-gradient(143.4deg, #667AFF 0%, #4F60FF 100%);
	}

	.report-bg {
		width: calc(100% - 96rpx);
		height: calc(460rpx - var(--status-bar-height));
		padding: calc(var(--status-bar-height) + 140rpx) 48rpx 0 48rpx;
		border-radius: 0 0 8rpx 260rpx;
		background: linear-gradient(143.4deg, #667AFF 0%, #4F60FF 100%);
		position: relative;
		display: flex;
		justify-content: space-between;

		.report-title {
			color: #FFFFFF;
			line-height: 1.5;
		}

		.report-share-button {
			border: 1rpx solid #FFFFFF;
			width: 180rpx;
			height: 56rpx;
			border-radius: 24rpx;
			color: #FFFFFF;
		}

		.report-share-model {
			font-size: 28rpx;
			color: #475FFD;
			 font-weight: 500;
			width: 280rpx;
			height: 74rpx;
			border-radius: 24rpx;
			background: #ffffff;
			position: absolute;
			bottom: -100rpx;
			left: -100rpx;
			.t-icon-fenxiangsongli{
				margin-right: 15rpx;
			}
			&:before {
			  content: "";
			  width: 0;
			  height: 0;
			  position: absolute;
			  top: -18rpx;
			  right: 70rpx;
			  border-right: solid 30rpx transparent;
			  border-left: solid 30rpx transparent;
			  border-bottom: solid 30rpx white;
			}
		}
	}

	.report-box {
		position: relative;
		width: calc(100% - 256rpx);
		margin: 40rpx auto;
		margin-top: -220rpx;
		border-radius: 24rpx;
		padding: 64rpx 96rpx;
		background: #ffffff;
		box-shadow: 0 8rpx 20rpx 0 #f1f3fa;
		line-height: 1.5;

		.text-size-xxl {
			font-family: cursive;
		}
	}

	.answer-sheet {
		margin: 32rpx auto;
		width: calc(100% - 110rpx);
		padding: 48rpx 24rpx;
		border-radius: 24rpx;
		opacity: 1;
		background: #ffffff;
		box-shadow: 0 8rpx 20rpx 0 #f1f3fa;

		.answer-logo {
			width: 46rpx;
			height: 56rpx;
		}

		.sheet-dort {
			width: 16rpx;
			height: 16rpx;
			border-radius: 4rpx;
			background: #f5f6fa;
		}

		.flex-box {
			display: flex;
			flex-wrap: wrap;
			.sheet-item {
				width: 80rpx;
				height: 80rpx;
				border-radius: 24rpx;
				margin: 16rpx;
				&:nth-child(6n+1) {
					margin-left: 0;
				}
				&:nth-child(6n) {
					margin-right: 0;
				}
			}
		}

		.sheet-nomorl {
			background: #f5f6fa;
		}

		.sheet-bingo {
			background: #5cc9a5;
			color: #FFFFFF;
		}

		.sheet-wrong {
			background: #ff6c56;
			color: #FFFFFF;
		}
	}

	.common-button {
		margin-top: 40rpx;
	}

	.common-button:last-child {
		background-color: #FFFFFF !important;
	}

	.analysis-icon {
		width: 50rpx;
		height: 56rpx;
	}
</style>
