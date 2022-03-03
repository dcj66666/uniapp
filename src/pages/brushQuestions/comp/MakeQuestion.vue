<template>
	<view class="question-box">
		<view class="question-numBox">
			<view class="question-type text-size-s">{{questionList.questionType==1?'单项选择题':'多项选择题'}}</view>
			<view><text class="text-size-l text-main text-weight-b">{{questionNum+1}}</text>/<text
					class="text-size-sl">{{questionIdsList.length}}</text></view>
		</view>
		<view class="compBox">
			<view class="question-card">
				<data-textarea :textData="questionList.questionStem"></data-textarea>
				<view class="mt-76" v-if="questionList.questionOptions">
					<!-- 题目 -->
					<view v-for="(item,index) in questionList.questionOptions" :key="index" class="option-box"
						@tap="selectOption(item.optionName)">
						<view class="text-size-main question-optionName flex-center"
							:class="questionList.userAnswer?questionList.hasAnalysis? item.optionIsRight?'option-right': questionList.userAnswer.indexOf(item.optionName)==-1?'':'option-error':questionList.userAnswer.indexOf(item.optionName)==-1? '':[$tm.vx.state().tmVuetify.color]:''">
							{{item.optionName}}
						</view>
						<option-textarea :optionType="item.optionType" :optionValue="item.optionValue">
						</option-textarea>
					</view>
				</view>
				<!-- 收藏 -->
				<view class="flex-center" :class="questionList.hasAnalysis?'collection-box':'analysis-style'"
					@tap="collection()">
					<view class="t-icon t-icon-jiexi" v-if="!questionList.hasAnalysis"></view>
					<tm-icons size="25" v-if="questionList.hasAnalysis"
						:name="!questionList.isColl?'icon-like':'icon-heart-fill'" color="white">
					</tm-icons>
					<text
						class="text-size-xxs ml-16">{{!questionList.hasAnalysis?'查看解析':!questionList.isColl?'收藏':'取消'}}</text>
				</view>
			</view>
		</view>
		<view class="delete-style flex-center" @tap="deleteWrong()" v-show="questionList.hasAnalysis && !isFavorites">
			<view class="text-style">考点已掌握，移出错题集</view>
			<view class="t-icon t-icon-yichu"></view>
		</view>
		<view class="analysis-box" v-show="questionList.hasAnalysis">
			<view class="flex-start">
				<image class="analysis-icon" src="@/static/img/home/Frame4.png"></image>
				<text class="text-size-main common-text text-weight-b">答案解析</text>
			</view>
			<view class="text-size-sn mx-12 mt-20">
				<text>答案：</text>
				<text class="text-main">{{questionList.questionAnswer}}</text>
			</view>
			<view class="text-size-sn mx-12">
				<data-textarea :textData="questionList.questionAnalysis"></data-textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import DataTextarea from '@/pages/brushQuestions/comp/DataTextarea.vue';
	import OptionTextarea from '@/pages/brushQuestions/comp/OptionTextarea.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	@Component({
		components: {
			tmIcons,
			DataTextarea,
			OptionTextarea
		}
	})
	export default class dailyTest extends Vue {
		@Prop({
			default: []
		}) questionList;
		@Prop({
			default: true
		}) isFavorites;
		@Prop({
			default: 0
		}) questionNum;
		@Emit('selectOption') selectOption(name) {}
		@Emit('collection') collection() {}
		@Emit('deleteWrong') deleteWrong() {}
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
