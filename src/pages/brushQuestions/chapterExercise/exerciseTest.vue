<!--
* @desc 章节练习
* @author 江玉龙
* @date 2022年2月14日
-->
<template>
	<view>
		<view class="head-bar flex-start">
			<tm-icons size="32" name="icon-angle-left" color="black" @tap="goback"></tm-icons>
		</view>
		<swiper  :circular="circular" :duration="0" @change="swiperChange" :current="questionNum"
			class="swiper">
			<swiper-item v-for="(data,key) in allQuestion" :key="key">
				<view class="question-box">
					<view class="question-numBox">
						<view class="question-type text-size-s">{{data.questionType==1?'单项选择题':'多项选择题'}}</view>
						<view><text class="text-size-l text-main text-weight-b">{{key+1}}</text>/<text
								class="text-size-sl">{{allQuestion.length}}</text></view>
					</view>
					<view class="compBox">
						<view class="question-card">
							<data-textarea :textData="data.questionStem"></data-textarea>
							<view class="mt-76">
								<view v-for="(item,index) in data.questionOptions" :key="index" class="option-box"
									@tap="ifUpload||data.hasAnalysis?'':selectOption(data,item.optionName)">
									<view class="text-size-main question-optionName flex-center"
										:class="data.hasAnalysis? item.optionIsRight?'option-right': data.userAnswer.indexOf(item.optionName)==-1?'':'option-error':data.userAnswer.indexOf(item.optionName)==-1? '':[$tm.vx.state().tmVuetify.color]">
										{{item.optionName}}
									</view>
									<option-textarea :optionType="item.optionType" :optionValue="item.optionValue">
									</option-textarea>
								</view>
							</view>
							<!-- 收藏 -->
							<view class="flex-center" :class="data.hasAnalysis?'collection-box':'analysis-style'"
								@tap="collection(data,key)">
								<view class="t-icon t-icon-jiexi" v-if="!data.hasAnalysis"></view>
								<tm-icons size="25" v-if="data.hasAnalysis"
									:name="!data.isColl?'icon-like':'icon-heart-fill'" color="white">
								</tm-icons>
								<text
									class="text-size-xxs ml-16">{{!data.hasAnalysis?'查看解析':!data.isColl?'收藏':'取消'}}</text>
							</view>
						</view>
					</view>
					<!-- //解析 -->
					<view class="analysis-box" v-show="data.hasAnalysis">
						<view class="flex-start">
							<image class="analysis-icon" src="@/static/img/home/Frame4.png"></image>
							<text class="text-size-main common-text text-weight-b">答案解析</text>
						</view>
						<view class="text-size-sn mx-12 mt-20">
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
		<AnswerSheet :questionList="allQuestion" :isOpen="sheetOpen" v-if="hasSheet" @delOpen="delemit"
			@submit="submitTest" :ifButton="!ifUpload" @delClose="delClose" @select="selectOne"></AnswerSheet>
		<ChapterModal :modalHeight="352" ref="poster">
			<view class="pa-36">
				<view class="top-text">退出答题</view>
				<view class="content-text">是否确认退出答题？</view>
				<view class="flex flex-between mt-40">
					<view class="cancel common-click" @click="cancel">取消</view>
					<view class="close common-click" @click="close">退出</view>
				</view>
			</view>
		</ChapterModal>
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
	import ChapterModal from '@/pages/brushQuestions/comp/ChapterModal.vue';
	import {
		getUnits,
		getRecord,
		getAnalysis
	} from '@/api/modules/chapter/index.ts'
	import {
		addFavorite,
		removeFavorite
	} from '@/api/modules/user/aggregate.ts'
	@Component({
		components: {
			AnswerSheet,
			tmIcons,
			DataTextarea,
			OptionTextarea,
			ChapterModal
		}
	})
	export default class dailyTest extends Vue {
		ifUpload = false
		// 当前题目
		questionNum = 0
		//是否有答题卡
		hasSheet = true
		sheetOpen = false
		// 章节题数据
		allQuestion = []
		brushTime = 0
		// 答案数据
		answerList = []
		//是否有点击答案
		hasTap = false
		// 获取收藏或者错题的id列表
		onLoad(option) {
			this.brushTime = Date.parse(new Date());
			this.unitId = option.unitId;
			this.ifUpload = option.ifUpload ? option.ifUpload : false
			this.queStatus = option.queStatus;
			if (this.ifUpload) {
				getAnalysis({
					unitId: this.unitId,
				}).then((res) => {
					this.allQuestion = [...res.questionList];
					this.answerList = res.answerList ? res.answerList : [];
				})
			} else {
				getUnits({
					queStatus: this.queStatus,
					unitId: this.unitId,
				}).then((res) => {
					this.allQuestion = [...res.questionList];
					this.answerList = res.answerList ? res.answerList : [];
					console.log(this.queStatus)
					if (this.queStatus == 1) {
						let data = this.allQuestion.find((item) => {
							return item.questionId == res.curQueId;
						})
						this.questionNum = data.questionNo - 1
					}
				})
			}
			// 首次进入页面即将此学习单元base信息存入缓存
			this.saveBaseMsg()
		}
		// 轮播图切换
		swiperChange(e) {
			if (this.hasTap) this.saveDataStorage();
			this.questionNum = e.target.current
			this.hasTap = false
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		}
		// 单选题点击
		selectOption(data, name) {
			let index = this.questionNum;
			this.hasTap = true
			if (this.questionType === 2) {
				// 多选题进行答案处理
				if (data.userAnswer.indexOf(name) == -1) {
					data.userAnswer = data.userAnswer + name
				} else {
					let userAnswer = data.userAnswer.replace(name.toString(), '')
					let questionId = data.userAnswer.questionId
					this.$set(this.allQuestion, index, {
						...data,
						userAnswer,
						questionId
					})
				}
			} else {
				// 单选题进行答案处理
				this.$set(this.allQuestion, index, {
					...data,
					userAnswer: name
				})
			}
			if (this.questionNum + 1 >= this.allQuestion.length) {
				this.sheetOpen = true;
				this.saveDataStorage();
				this.hasTap = false
			}
		}
		// 收藏
		collection(data, key) {
			let that = this
			if (!data.isColl && data.hasAnalysis) {
				addFavorite({
						questionId: data.questionId,
					})
					.then(() => {
						that.$set(this.allQuestion, key, {
							...data,
							isColl: true
						})
						uni.showToast({
							title: '收藏成功',
							duration: 2000
						});
					})
					.catch(() => {
						uni.showToast({
							icon: 'none',
							title: '收藏失败',
							duration: 2000
						});
					});
			} else if (data.isColl && data.hasAnalysis) {
				removeFavorite({
						questionId: data.questionId
					})
					.then(() => {
						that.$set(this.allQuestion, key, {
							...data,
							isColl: false
						})
						uni.showToast({
							title: '取消成功',
							duration: 2000
						});
					})
					.catch(() => {
						uni.showToast({
							icon: 'none',
							title: '取消失败',
							duration: 2000
						});
					});
			} else if (!data.hasAnalysis) {
				this.$set(this.allQuestion, key, {
					...data,
					hasAnalysis: true
				})
			}
		}
		delemit() {
			this.sheetOpen = !this.sheetOpen
		}
		delClose() {
			this.sheetOpen = false
		}
		selectOne(data) {
			this.questionNum = data;
			this.sheetOpen = false;
		}
		// 答题卡提交
		async submitTest() {
			if (this.hasTap) {
				this.saveDataStorage();
				this.hasTap = false
			}
			uni.showLoading({
				title: '提交中'
			});
			let unitTime = (Date.parse(new Date()) - this.brushTime) / 1000
			var data = await getRecord({
				answerList: this.answerList,
				unitId: this.unitId,
				queStatus: 2,
				unitTime
			})
			if (data) {
				uni.showToast({
					title: '提交成功',
					duration: 2000
				});
				uni.hideLoading();
				uni.removeStorageSync('chapterAnswerList')
				uni.removeStorageSync('chapterRecord')
				let sheetList = []
				console.log(this.allQuestion)
				this.allQuestion.map((item) => {
					sheetList.push({

					})
				})
				this.commonFun.redirectTo(
					`/pages/brushQuestions/report?unitId=${this.unitId}&urlFrom=1`
				)
			}
		}
		// 退出时弹窗
		goback() {
			if (this.ifUpload) {
				uni.navigateBack({})
			} else {
				this.$refs.poster.openModal()
			}
		}
		cancel() {
			this.$refs.poster.closeModal()
		}
		// 弹窗退出事件
		async close() {
			if (this.hasTap) {
				this.saveDataStorage();
				this.hasTap = false
			}
			let unitTime = (Date.parse(new Date()) - this.brushTime) / 1000
			getRecord({
				answerList: this.answerList,
				unitId: this.unitId,
				queStatus: 1,
				unitTime
			}).then(() => {
				uni.removeStorageSync('chapterAnswerList')
				uni.removeStorageSync('chapterRecord')
				uni.navigateBack();
			})
		}
		// 将数据存到本地
		saveDataStorage() {
			this.answerList.push({
				questionId: this.allQuestion[this.questionNum].questionId,
				userAnswer: this.allQuestion[this.questionNum].userAnswer,
				hasAnalysis: this.allQuestion[this.questionNum].hasAnalysis
			})
			let unitTime = (Date.parse(new Date()) - this.brushTime) / 1000
			let storageData = {
				answerList: this.answerList,
				unitTime
			}
			uni.setStorageSync('chapterAnswerList', JSON.stringify(storageData));
		}
		saveBaseMsg() {
			let saveData = {
				subjectId: uni.getStorageSync('subjectId'),
				projectId: uni.getStorageSync('projectId'),
				subjectName: uni.getStorageSync('subjectName'),
				projectName: uni.getStorageSync('projectName'),
				unitId: this.unitId,
				queStatus: 1,
			};
			uni.setStorageSync('chapterRecord', JSON.stringify(saveData));
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

	.common-button {
		margin: 40rpx auto;
	}

	.swiper {
		margin-top: 200rpx;
		height: calc(100vh - 360rpx);
		max-width: 100vw;
	}

	.top-text {
		font-size: 36rpx;
		font-weight: 700;
		text-align: center;
		line-height: 80rpx;
	}

	.content-text {
		font-size: 32rpx;
		font-weight: 400;
		text-align: center;
		line-height: 60rpx;
	}

	.cancel {
		width: 256rpx;
		height: 88rpx;
		border-radius: 24rpx;
		text-align: center;
		line-height: 80rpx;
		background: #F5F6FA;
		font-size: 32rpx;
		font-weight: 700;
		color: #5B648D;
	}

	.close {
		width: 256rpx;
		height: 88rpx;
		border-radius: 24rpx;
		text-align: center;
		line-height: 80rpx;
		background: #475FFD;
		font-size: 32rpx;
		font-weight: 700;
		color: #FFFFFF;
	}
</style>
