<!--
* @desc 答题卡
* @author 戴聪杰
* @date 2021年12月31日
-->
<template>
	<view>
		<view class="answer-card flex-center text-size-main common-text common-text-700" @tap="openSheet">答题卡</view>
		<move-popup title="答题卡" v-model="isOpen" :showClose="false" @changeShow="closeShow">
			<view class="sheet-modal">
				<view class="sheet-box">
					<view v-for="(item,index) in questionList" :key="index" class=" text-size-main common-message"
						@tap="selectQuestion(index)">
						<view v-show="!ifUpload" class="sheet-item flex-center"
							:class="item.userAnswer?[$tm.vx.state().tmVuetify.color]:''">{{index+1}}
						</view>
						<view v-show="ifUpload" class="sheet-item flex-center"
							:class="item.accuracy=='1'?'item-right':'item-error'">{{index+1}}</view>
					</view>
				</view>
				<view class="common-button flex-center text-size-main common-click" :class="[$tm.vx.state().tmVuetify.color]"
					v-show="ifButton && !ifUpload" @tap="submit">
					交卷并查看结果</view>
			</view>
		</move-popup>

		<!-- <view class="answer-sheet" :class="isOpen?'answer-sheet-open':'answer-sheet-close'">
			<view @tap="openSheet">
				<view class="common-open"></view>
				<view class="text-size-main common-text common-text-700 my-32">答题卡</view>
			</view>
			<view class="sheet-box">
				<view v-for="(item,index) in questionList" :key="index" class=" text-size-main common-message"
					@tap="selectQuestion(index)">
					<view v-show="!ifUpload" class="sheet-item flex-center"
						:class="item.hasAnswer?[$tm.vx.state().tmVuetify.color]:''">{{index+1}}
					</view>
					<view v-show="ifUpload" class="sheet-item flex-center"
						:class="item.accuracy=='1'?'item-right':'item-error'">{{index+1}}</view>
				</view>
			</view>
			<view class="common-button flex-center text-size-main" :class="[$tm.vx.state().tmVuetify.color]"
				v-show="ifButton" @tap="submit">
				交卷并查看结果</view>
		</view> -->
	</view>
</template>

<script>
	import {
		Component,
		Vue,
		Prop,
		Watch,
		Emit
	} from "vue-property-decorator";
	import movePopup from '@/components/MovePopup/move-popup.vue';

	@Component({
		components: {
			movePopup
		}
	})
	export default class AnswerSheet extends Vue {
		@Prop({
			default: []
		}) questionList;
		@Prop({
			default: false
		}) isOpen;
		@Prop({
			default: false
		}) ifButton;
		@Prop({
			default: false
		}) ifUpload;
		@Emit('delOpen') openSheet(event) {}
		@Emit('delClose') closeShow(event) {}
		@Emit('submit') submit(event) {}
		@Emit('select') selectQuestion(index) {
			return index;
		}
		showPop = false
	}
</script>

<style lang="scss" scoped>
	.answer-card {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 160rpx;
		background-color: #FFFFFF;
		border-radius: 40rpx 40rpx 0 0;
		box-shadow: 0 -8rpx 32rpx 0 #dcdde8;
	}

	.sheet-modal {
		padding: 32rpx 39rpx 96rpx 39rpx;
	}

	.sheet-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		height: 100%;

		.sheet-item {
			width: 80rpx;
			height: 80rpx;
			border-radius: 24rpx;
			background: #f5f6fa;
			margin: 16rpx;
		}

		.item-right {
			background: #5cc9a5;
			color: #FFFFFF;
		}

		.item-error {
			background: #ff6c56;
			color: #FFFFFF;
		}
	}

	.common-button {
		margin: 0;
		margin-top: 50rpx;
		width: 100%
	}

	@keyframes close {
		from {
			bottom: 0rpx;
		}
		to {
			bottom: -100%;
		}
	}

	@keyframes open {
		from {
			bottom: -100%;
		}
		to {
			bottom: 0rpx;
		}
	}
</style>
