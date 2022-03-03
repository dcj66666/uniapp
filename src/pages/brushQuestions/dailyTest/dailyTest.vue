<!--
* @desc 每日一练
* @author 戴聪杰
* @date 2021年12月28日
-->
<template>
	<view>
		<swiper :circular="circular" :duration="0" @change="swiperChange" :current="questionNum" class="swiper">
			<swiper-item v-for="(data,key) in questionList" :key="key" @touchmove="handletouchmove"
				@touchstart="handletouchstart" @touchend="handletouchend">
				<view class="question-box">
					<view class="question-numBox">
						<view class="question-type text-size-s">{{data.questionType=='1'?'单项选择题':'多项选择题'}}</view>
						<view><text class="text-size-l text-main">{{key+1}}</text>/<text
								class="text-size-sl">{{questionList.length}}</text></view>
					</view>
					<view class="compBox">
						<view class="question-card">
							<data-textarea :textData="data.questionStem"></data-textarea>
							<view class="mt-76">
								<view v-for="(item,index) in data.questionOptions" :key="index" class="option-box"
									@tap="ifUpload?'':selectOption(data,item.optionName)">
									<view class="text-size-main question-optionName flex-center"
										:class="data.userAnswer?data.hasAnalysis? item.optionIsRight?'option-right': data.userAnswer.indexOf(item.optionName)==-1?'':'option-error':data.userAnswer.indexOf(item.optionName)==-1? '':[$tm.vx.state().tmVuetify.color]:''">
										{{item.optionName}}
									</view>
									<option-textarea :optionType="item.optionType" :optionValue="item.optionValue">
									</option-textarea>
								</view>
							</view>
							<!-- 收藏 -->
							<view v-if="data.hasAnalysis" class="collection-box" @tap="collection(data,key)">
								<tm-icons size="25" :name="!data.isColl?'icon-like':'icon-heart-fill'" color="white">
								</tm-icons>
								<text class="text-size-xxs ml-16">{{!data.isColl?'收藏':'取消'}}</text>
							</view>
						</view>
					</view>
					<view class="analysis-box" v-show="data.hasAnalysis">
						<view class="flex-start">
							<image class="analysis-icon" src="@/static/img/home/Frame4.png"></image>
							<text class="text-size-main common-text">答案解析</text>
						</view>
						<view class="text-size-sn mx-12">
							<text>答案：</text>
							<text class="text-main">{{data.questionAnswer}}</text>
						</view>
						<view class="text-size-sn mx-12">
							<data-textarea :textData="data.questionAnalysis"></data-textarea>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<AnswerSheet :questionList="questionList" :isOpen="sheetOpen" @delOpen="delemit" @submit="submitTest"
			@delClose="delClose" @select="selectOne" :ifButton="!ifUpload" :ifUpload="hasAnalysis"></AnswerSheet>
		<question-mask :hasMask="hasMask">
		</question-mask>
		<tm-dialog confirmText="退出" confirmColor="bg-gradient-pink-accent" cancelColor="pink" v-model="outShow"
			content="是否退出答题" title="退出答题" theme="split"></tm-dialog>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import AnswerSheet from '../comp/AnswerSheet.vue';
	import DataTextarea from '@/pages/brushQuestions/comp/DataTextarea.vue';
	import OptionTextarea from '@/pages/brushQuestions/comp/OptionTextarea.vue'
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import QuestionMask from '@/components/Mask/QuestionMask.vue';
	import tmDialog from '@/tm-vuetify/components/tm-dialog/tm-dialog.vue';

	import {
		submitAnswer,
		getAnalytical,
		getAnswerCard
	} from '@/api/modules/question/exercise';

	import {
		addFavorite,
		removeFavorite
	} from '@/api/modules/user/aggregate.ts';

	import {
		getExchangeQuestions,
		submitUnit
	} from '@/api/modules/exchange/index.ts';

	@Component({
		components: {
			AnswerSheet,
			tmIcons,
			DataTextarea,
			QuestionMask,
			tmDialog,
			OptionTextarea
		}
	})
	export default class dailyTest extends Vue {
		// 当前题目
		questionNum = 0
		//答题卡是否打开
		sheetOpen = false
		//是否有新手指引
		hasMask = false
		//答案列表
		answerList = []
		//提交的传参，从上个页面来
		submitData = {}
		//弹窗是否显示
		outShow = false
		// 判断每日一练和兑换码
		urlFrom = 0
		// 轮播图最后一页滑动事件
		flag = 0
		text = ''
		lastX = 0
		lastY = 0
		index = 0
		ifUpload = false
		//从查看解析进入
		provisionalAnswer = []
		//题目信息
		questionList = [{
			questionId: '10086',
			questionStem: [{
				type: 1,
				content: "建设工程采用工程量清单招标模式时，关于投标报价的说法正确的有（ ）。"
			}],
			questionType: '1',
			questionOptions: [{
				optionName: 'A',
				optionIsRight: false,
				optionValue: '投标人应以施工方案、技术措施等作为投标报价计算的基本条件',
			}, {
				optionName: 'B',
				optionIsRight: false,
				optionValue: '投标报价不得低于工程成本',
			}, {
				optionName: 'C',
				optionIsRight: false,
				optionValue: '投标报价只能由投标人编制，不能委托造价咨询机构编制',
			}, {
				optionName: 'D',
				optionIsRight: true,
				optionValue: '投标报价应以招标文件中设定的发承包责任划分，作为设定投标报价费用项目和费用计算的基础',
			}]
		}, {}]
		onLoad(options) {
			if (!uni.getStorageSync('hasMask')) {
				(this.hasMask = true)
			} else {
				this.submitData = {
					unitId: options.unitId,
					currentUnit: options.currentUnit,
					ifSubmit: options.ifSubmit,
					projectId: uni.getStorageSync('projectId'),
					projectName: uni.getStorageSync('projectName'),
					subjectId: uni.getStorageSync('subjectId'),
					subjectName: uni.getStorageSync('subjectName'),
				}
				this.brushTime = options.brushTime
				if (options.urlFrom == 2) {
					this.urlFrom = 2;
					this.getExchange(options.unitId)
					if (options.ifUpload) {
						this.ifUpload = true
						this.provisionalAnswer = JSON.parse(options.provisionalAnswer)
					}
				} else if (options.ifUpload) {
					this.ifUpload = true
					this.getAnalytical(options.unitId)
				} else {
					this.getAnalytical(options.unitId)
				}
				uni.showLoading({
					title: '加载中'
				});
			}
		}
		// 查看解析时请求解析的题目列表
		async getAnalytical(id) {
			let data = await getAnalytical({
				unitId: id
			})
			if (data) {
				uni.hideLoading();
				this.questionList = data.questionList
				if (this.ifUpload) {
					this.answerList = await getAnswerCard({
						projectId: this.submitData.projectId,
						subjectId: this.submitData.subjectId,
						unitId: id
					})
					this.questionList.map((item, key) => {
						item.hasAnalysis = true
						item.userAnswer = this.answerList[key].userAnswer
					})
				}
			}
		}
		// 查看兑换码的题目列表
		async getExchange(id) {
			let data = await getExchangeQuestions({
				unitId: id
			})
			if (data) {
				uni.hideLoading();
				this.questionList = data.questionList;
				if (this.ifUpload) {
					data.questionList.map((item, key) => {
						item.hasAnalysis = true
						item.userAnswer = this.provisionalAnswer[key].userAnswer
					})
				}
			}
		}
		swiperChange(e) {
			this.questionNum = e.target.current
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		}
		selectOption(data, name) {
			let index = this.questionNum;
			if (data.questionType == 2 && data.userAnswer) {
				// 多选题进行答案处理
				if (data.userAnswer.indexOf(name) == -1) {
					this.$set(this.questionList, index, {
						...data,
						userAnswer: data.userAnswer + name,
						questionId: data.questionId
					})
				} else {
					let userAnswer = data.userAnswer.replace(name.toString(), '')
					this.$set(this.questionList, index, {
						...data,
						userAnswer,
						questionId: data.questionId
					})
				}
			} else {
				// 单选题进行答案处理
				this.$set(this.questionList, index, {
					...data,
					userAnswer: name
				})
			}
			if (this.questionNum + 1 > this.questionList.length)(this.sheetOpen = true)
		}
		delemit() {
			this.sheetOpen = !this.sheetOpen
		}
		delClose() {
			this.sheetOpen = false
		}
		// 答题卡提交
		async submitTest() {
			uni.showLoading({
				title: '提交中'
			});
			let answerList = []
			this.questionList.map((item) => {
				answerList.push({
					userAnswer: item.userAnswer ? item.userAnswer : '',
					questionId: item.questionId,
				})
			})

			let unitTime = (Date.parse(new Date()) - this.brushTime) / 1000
			if (this.urlFrom == 2) {
				let res = await submitUnit({
					answerList: answerList,
					unitId: this.submitData.unitId,
					unitTime
				})
				if (res) {
					uni.hideLoading();
					this.provisionalAnswer = []
					this.questionList.map((item) => {
						this.provisionalAnswer.push({
							userAnswer: item.userAnswer ? item.userAnswer : '',
						})
					})
					this.commonFun.redirectTo(
						`/pages/brushQuestions/report?unitId=${this.submitData.unitId}&unitNum=${res.unitNum}&unitTime=${res.unitTime}&correctRate=${res.correctRate}&urlFrom=2&answerSheetList=${JSON.stringify(res.answerSheetList)}&provisionalAnswer=${JSON.stringify(this.provisionalAnswer)}`
					)
				}
			} else {
				let data = await submitAnswer({
					answerList: answerList,
					...this.submitData,
					unitTime
				})
				if (data) {
					uni.hideLoading();
					this.commonFun.redirectTo(
						`/pages/brushQuestions/report?unitId=${this.submitData.unitId}&currentUnit=${this.submitData.currentUnit}&ifSubmit=${this.submitData.ifSubmit}`
					)
				}
			}
		}
		// 选择题目
		selectOne(data) {
			this.questionNum = data;
			this.sheetOpen = false
		}
		// 收藏
		collection(data, key) {
			if (!data.isColl) {
				addFavorite({
						questionId: data.questionId,
						subjectId: this.submitData.subjectId,
						projectId: this.submitData.projectId,
						subjectName: this.submitData.subjectName,
						projectName: this.submitData.projectName
					})
					.then(() => {
						uni.showToast({
							title: '收藏成功',
							duration: 2000
						});
						this.$set(this.questionList, key, {
							...this.questionList[key],
							isColl: true
						});
					})
			} else {
				removeFavorite({
						questionId: data.questionId,
						subjectId: this.submitData.subjectId,
						projectId: this.submitData.projectId
					})
					.then(() => {
						uni.showToast({
							title: '取消成功',
							duration: 2000
						});
						this.$set(this.questionList, key, {
							...this.questionList[key],
							isColl: false
						});
					})
			}
		}
		handletouchmove(event) {
			if (this.flag !== 0) {
				return;
			}
			let currentX = event.changedTouches[0].pageX;
			let currentY = event.changedTouches[0].pageY;
			let tx = currentX - this.lastX;
			let ty = currentY - this.lastY;
			let text = '';
			this.mindex = -1;
			//左右方向滑动
			if (Math.abs(tx) > Math.abs(ty)) {
				if (tx < 0) {
					text = '向左滑动';
					this.flag = 1;
					if (this.questionNum + 1 >= this.questionList.length) {
						this.sheetOpen = true
					}
				}
			}
		}
		handletouchstart(event) {
			this.lastX = event.changedTouches[0].pageX;
			this.lastY = event.changedTouches[0].pageY;
		}
		handletouchend(event) {
			this.flag = 0;
			this.text = '没有滑动';
		}
	}
</script>

<style lang="scss" scoped>
	.question-card {
		margin: 0 24rpx;
		padding: 32rpx;
		padding-bottom: 144rpx;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 20rpx 0 #F1F3FA;
		text-align: center;
		position: relative;

		.mt-76 {
			margin-top: 76rpx;
		}

		.option-box {
			display: flex;
			align-items: center;
			margin-top: 32rpx;

			.question-optionName {
				width: 70rpx;
				height: 70rpx;
				border-radius: 24rpx;
				background: #F5F6FA;
				margin-right: 24rpx;
				flex-shrink: 0;
			}

			.option-right {
				background: #5cc9a5;
				color: #FFFFFF;
			}

			.option-error {
				background: #ff6c56;
				color: #FFFFFF;
			}

			.text-size-sn {
				line-height: 1.5;
			}
		}

		.collection-box {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 150rpx;
			height: 50rpx;
			border-radius: 24rpx 24rpx 24rpx 8rpx;
			background: linear-gradient(145.5deg, #ff7456 0%, #ff6060 100%);
			box-shadow: inset 0 0 14rpx 0 #ffe1b8, 0 4rpx 10rpx 0 #dea771;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
		}

		.analysis-style {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 200rpx;
			height: 56rpx;
			border-radius: 24rpx 24rpx 24rpx 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			background: #ffac5f;
			box-shadow: 0 4px 10px 0 #f4cca6;
		}
	}

	.common-button {
		margin: 40rpx auto;
	}

	.swiper {
		height: calc(100vh - 160rpx);
		max-width: 100vw;
	}
</style>
