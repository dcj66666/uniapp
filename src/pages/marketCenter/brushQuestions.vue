<!--
* @desc 错题&收藏走的刷题
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view>
		<swiper @change="swiperChange" :current="swiperIndex" class="swiper" :circular="circular" :duration="0">
			<swiper-item v-for="(value,key) in swiperList" :key="key">
				<view class="question-box">
					<view class="question-numBox">
						<view class="question-type text-size-s">{{value.questionType==1?'单项选择题':'多项选择题'}}</view>
						<view><text class="text-size-l text-main text-weight-b">{{curIndex+1}}</text>/<text
								class="text-size-sl">{{questionIdsList.length}}</text></view>
					</view>
					<view class="compBox">
						<view class="question-card">
							<data-textarea :textData="value.questionStem"></data-textarea>
							<view class="mt-76" v-if="value.questionOptions">
								<!-- 题目 -->
								<view v-for="(item,index) in value.questionOptions" :key="index" class="option-box"
									@tap="selectOption(value,item.optionName)">
									<view class="text-size-main question-optionName flex-center"
										:class="value.userAnswer?value.hasAnalysis? item.optionIsRight?'option-right': value.userAnswer.indexOf(item.optionName)==-1?'':'option-error':value.userAnswer.indexOf(item.optionName)==-1? '':[$tm.vx.state().tmVuetify.color]:''">
										{{item.optionName}}
									</view>
									<option-textarea :optionType="item.optionType" :optionValue="item.optionValue">
									</option-textarea>
								</view>
							</view>
							<!-- 收藏 -->
							<view class="flex-center" :class="value.hasAnalysis?'collection-box':'analysis-style'"
								@tap="collection(value,key)">
								<view class="t-icon t-icon-jiexi" v-if="!value.hasAnalysis"></view>
								<tm-icons size="25" v-if="value.hasAnalysis"
									:name="!value.isColl?'icon-like':'icon-heart-fill'" color="white">
								</tm-icons>
								<text
									class="text-size-xxs ml-16">{{!value.hasAnalysis?'查看解析':!value.isColl?'收藏':'取消'}}</text>
							</view>
						</view>
					</view>
					<view class="delete-style flex-center" @tap="deleteWrong"
						v-show="value.hasAnalysis && !isFavorites">
						<view class="text-style">考点已掌握，移出错题集</view>
						<view class="t-icon t-icon-yichu"></view>
					</view>
					<view class="analysis-box" v-show="value.hasAnalysis">
						<view class="flex-start">
							<image class="analysis-icon" src="@/static/img/home/Frame4.png"></image>
							<text class="text-size-main common-text text-weight-b">答案解析</text>
						</view>
						<view class="text-size-sn mx-12 mt-20">
							<text>答案：</text>
							<text class="text-main">{{value.questionAnswer}}</text>
						</view>
						<view class="text-size-sn mx-12">
							<data-textarea :textData="value.questionAnalysis"></data-textarea>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<AnswerSheet :questionList="allData" :isOpen="sheetOpen" v-if="hasSheet" @delOpen="delemit"
			@select="selectOne"></AnswerSheet>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import AnswerSheet from '@/pages/brushQuestions/comp/AnswerSheet.vue';
	import DataTextarea from '@/pages/brushQuestions/comp/DataTextarea.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import OptionTextarea from '@/pages/brushQuestions/comp/OptionTextarea.vue'
	import {
		getQuestion
	} from '@/api/modules/user/index.ts'
	import {
		removeWrong,
		addFavorite,
		removeFavorite
	} from '@/api/modules/user/aggregate.ts'
	@Component({
		components: {
			AnswerSheet,
			tmIcons,
			DataTextarea,
			OptionTextarea
		}
	})
	export default class dailyTest extends Vue {
		//是否有答题卡
		hasSheet = true
		sheetOpen = false
		// 题目数据
		allData = []
		swiperList = []
		swiperIndex = 0
		curIndex = 0
		// 上级页面传的数据
		questionIdsList = []
		subjectId = 0
		projectId = 0
		subjectName = ""
		projectName = ""
		isFavorites = false
		onLoad(option) {
			this.questionIdsList = option.questionIds.split(',');
			this.subjectId = option.subjectId;
			this.projectId = option.projectId;
			this.subjectName = option.subjectName;
			this.projectName = option.projectName;
			this.isFavorites = option.isFavorites;
			this.getData()
		}
		// 计算属性
		get allQue() {
			return this.allData;
		}
		get circular() {
			if (this.curIndex != 0 && this.allQue.length - 1 != this.curIndex) {
				return true;
			} else {
				return false;
			}
		}
		async getData() {
			let res = await getQuestion({
				questionIds: this.questionIdsList
			})
			this.allData = res
			this.upDateswiperList();
		}
		swiperChange(e) {
			let current = e.target.current
			this.calcCurIndex(current);
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		}
		// 题目点击
		selectOption(data, name) {
			if (this.allData[this.curIndex].questionType == 1) {
				Vue.set(data, 'userAnswer', name);
				Vue.set(this.allData[this.curIndex], 'userAnswer', name);
			} else {
				if (!this.allData[this.curIndex].userAnswer) {
					Vue.set(data, 'userAnswer', name);
					Vue.set(this.allData[this.curIndex], 'userAnswer', name);
				} else {
					if (this.allData[this.curIndex].userAnswer.indexOf(name) == -1) {
						let userAnswer = this.allData[this.curIndex].userAnswer + name;
						Vue.set(this.allData[this.curIndex], 'userAnswer', userAnswer);
						Vue.set(data, 'userAnswer', userAnswer);
					} else {
						let userAnswer = this.allData[this.curIndex].userAnswer.replace(name.toString(), '')
						Vue.set(this.allData[this.curIndex], 'userAnswer', userAnswer);
						Vue.set(data, 'userAnswer', userAnswer);
					}
				}
			}
		}
		// 移除
		deleteWrong() {
			removeWrong({
					questionId: this.questionIdsList[this.curIndex],
					subjectId: this.subjectId,
					projectId: this.projectId
				})
				.then(() => {
					uni.showToast({
						title: '删除成功',
						duration: 2000
					});
				})
		}
		// 收藏
		collection(data, key) {
			if (!data.isColl && data.hasAnalysis) {
				addFavorite({
						questionId: this.questionIdsList[this.curIndex],
						subjectId: this.subjectId,
						projectId: this.projectId,
						subjectName: this.subjectName,
						projectName: this.projectName
					})
					.then(() => {
						uni.showToast({
							title: '收藏成功',
							duration: 2000
						});
						Vue.set(this.allData, this.curIndex, {
							...data,
							isColl: true
						})
						Vue.set(this.swiperList, key, {
							...data,
							isColl: true
						})
					})
			} else if (data.isColl && data.hasAnalysis) {
				removeFavorite({
						questionId: this.questionIdsList[this.curIndex],
						subjectId: this.subjectId,
						projectId: this.projectId
					})
					.then(() => {
						uni.showToast({
							title: '取消成功',
							duration: 2000
						});
						Vue.set(this.allData, this.curIndex, {
							...data,
							isColl: false
						})
						Vue.set(this.swiperList, key, {
							...data,
							isColl: false
						})
					})
			} else if (!data.hasAnalysis) {
				Vue.set(this.allData, this.curIndex, {
					...data,
					hasAnalysis: true
				})
				Vue.set(this.swiperList, key, {
					...data,
					hasAnalysis: true
				})
			}
		}
		delemit() {
			this.sheetOpen = !this.sheetOpen
		}
		// 答题卡点击
		selectOne(data) {
			this.curIndex = data;
			this.sheetOpen = false;
			if (this.curIndex == this.allQue.length - 1) {
				this.swiperIndex = 2;
			}
			if (this.curIndex == 0) {
				this.swiperIndex = 0;
			}
			this.upDateswiperList();
		}
		// 轮播图滑动
		upDateswiperList() {
			this.swiperList = [];
			let temp = this.curIndex == this.allQue.length - 1 ? 2 : this.swiperIndex;
			temp = this.curIndex == 0 ? 0 : temp;
			this.$set(this.swiperList, temp, {
				...this.allQue[this.curIndex]
			})
			// 上一道
			if (this.curIndex != 0) {
				this.$set(this.swiperList, temp - 1 == -1 ? 2 : temp - 1, {
					...this.allQue[this.curIndex - 1 == -1 ? this.allQue.length - 1 : this.curIndex - 1]
				})
			}
			// 下一道
			if (this.questionIdsList.length > 1) {
				this.$set(this.swiperList, temp + 1 == 3 ? 0 : temp + 1, {
					...this.allQue[this.curIndex + 1 == this.allQue.length ? 0 : this.curIndex + 1]
				})
			}
		}
		// 计算swiperIndex
		calcCurIndex(current) {
			// 右滑
			if (this.swiperIndex - current == 2 || this.swiperIndex - current == -1) {
				this.curIndex = this.curIndex + 1 == this.allQue.length ? 0 : this.curIndex + 1;
				this.swiperIndex = 0;
				if (this.curIndex == this.allQue.length - 1) {
					this.$nextTick(() => {
						this.swiperIndex = 2;
					});
				} else {
					this.swiperIndex = current;
				}
			} // 左滑
			else if (this.swiperIndex - current == -2 || this.swiperIndex - current == 1) {
				this.curIndex = this.curIndex - 1 == -1 ? this.allQue.length - 1 : this.curIndex - 1;
				if (this.curIndex == 0) {
					this.swiperIndex = 1;
					this.$nextTick(() => {
						this.swiperIndex = 0;
					});
				} else {
					this.swiperIndex = current;
				}
			}
			this.upDateswiperList();
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
				width: 70rpx;
				height: 70rpx;
				border-radius: 24rpx;
				color: #FFFFFF;
				background: #5CC9A5;
				margin-right: 24rpx;
				flex-shrink: 0;
			}

			.option-error {
				width: 70rpx;
				height: 70rpx;
				border-radius: 24rpx;
				color: #FFFFFF;
				background: #FF6C56;
				margin-right: 24rpx;
				flex-shrink: 0;
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
			background: linear-gradient(145.5deg, #FF7456 0%, #FF6060 100%);
			box-shadow: inset 0 0 14rpx 0 #FFE1B8, 0 4rpx 10rpx 0 #DEA771;
			color: #FFFFFF;
		}

		.analysis-style {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 200rpx;
			height: 56rpx;
			border-radius: 24rpx 24rpx 24rpx 8rpx;
			color: #FFFFFF;
			background: #FFAC5F;
			box-shadow: 0 4px 10px 0 #F4CCA6;
		}
	}

	.swiper {
		height: calc(100vh - 160rpx);
		max-width: 100vw;
	}

	.delete-style {
		margin: 0 24rpx;
		margin-top: 40rpx;
		width: calc(100% - 48rpx);
		height: 80rpx;
		border-radius: 24rpx;
		background: linear-gradient(129.1deg, #E3EDFF 0%, #EAF0FC 57%, #EBF2FF 100%);

		.text-style {
			color: #5B648D;
			font-size: 28rpx;
			text-align: left;
			line-height: 42rpx;
		}

		.t-icon-yichu {
			margin-left: 40rpx;
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
