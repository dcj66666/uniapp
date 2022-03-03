<template>
	<view>
		<view class="common-guide-mask" v-if="hasMask">
			<view class="common-guide-button" @tap="overMask()">跳过</view>
			<view v-show="step===1">
				<tm-translate animation-name="fadeIn">
					<image class="third-mask" src="../../static/img/mask/calendar-mask.png">
					</image>
					<view class="third-mask-model text-size-sn py-32 flex-between">
						每天进步一点点，每天都来打卡
						<view class="third-mask-button text-size-sl text-main flex-center" @tap="nestStep(1)">
							我也能做到哦
						</view>
					</view>
				</tm-translate>
			</view>
			<view v-if="step===2">
				<tm-translate animation-name="fadeIn">
					<view class="common-guide-light last-mask flex-center" @tap="nestStep(2)">
						开始答题
					</view>
					<view class="last-mask-model text-size-sn common-text flex-center">
						开始答题吧！
					</view>
				</tm-translate>
			</view>
		</view>
	</view>
</template>

<script>
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	export default {
		name: 'HomeMask',
		components: {
			tmTranslate
		},
		props: {
			hasMask: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				step: 1
			}
		},
		onLoad() {},
		methods: {
			overMask() {
				uni.setStorageSync('hasMask', 'false')
				uni.reLaunch({
					url: '/pages/index/home'
				})
			},
			nestStep(num) {
				this.step = num + 1
				switch (num) {
					case 1:
						break
					case 2:
						uni.setStorageSync('hasMask', 'false')
						this.$emit("setClick")
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./homeMask.scss";

	.third-mask {
		width: 100%;
		height: 228rpx;
		position: absolute;
		top: 450rpx;

	}

	.third-mask-model {
		position: absolute;
		top: 720rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 488rpx;
		height: 150rpx;
		border-radius: 24rpx;
		background: linear-gradient(143.4deg, #667aff 0%, #4f60ff 100%);
		color: #FFFFFF;
		flex-direction: column;

		&:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
			top: -20rpx;
			left: 200rpx;
			border-right: solid 30rpx transparent;
			border-left: solid 30rpx transparent;
			border-bottom: solid 30rpx #667aff;
		}

		.third-mask-button {
			width: 392rpx;
			height: 64rpx;
			border-radius: 16rpx;
			background: #ffffff;
		}

	}

	.last-mask {
		position: absolute;
		bottom: 465rpx;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 96rpx);
		background-color: #667aff;
		height: 88rpx;
		border-radius: 24rpx;
		color: #FFFFFF;

		&:active {
			background-color: #394CCA;
		}

	}

	.last-mask-model {
		position: absolute;
		bottom: 600rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 232rpx;
		height: 94rpx;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		flex-direction: column;

		&:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
			bottom: -20rpx;
			left: 80rpx;
			border-right: solid 30rpx transparent;
			border-left: solid 30rpx transparent;
			border-top: solid 30rpx #FFFFFF;
		}
	}
</style>
