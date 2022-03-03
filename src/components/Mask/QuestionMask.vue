<template>
	<view>
		<view class="common-guide-mask" v-if="hasMask" @tap="overMask()">
			<!-- <view class="common-guide-button" @tap="overMask()">跳过</view> -->
			<tm-translate animation-name="fadeIn" class="mask-box">
				<view>
					<!-- <image class="first-mask-img" src="../../static/img/mask/question-mask.png"></image> -->
					<view class="flex-center mask-list">
						<view class="frist-mask-box"></view>
						<view class="sceond-mask-box"></view>
					</view>
					<view class="point-mask"></view>
					<image class="second-mask-img" src="../../static/img/mask/hand.png"></image>
					<view class="mask-tip">左右滑动可切换题目</view>
				</view>
			</tm-translate>
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
		onLoad() {
			this.hasMask = uni.getStorageSync('hasMask') ? uni.getStorageSync('hasMask') : true;
		},
		methods: {
			overMask() {
				uni.setStorageSync('hasMask', 'false')
				uni.reLaunch({
					url: '/pages/index/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./homeMask.scss";

	@keyframes moveToLeft {
		from {
			left: 70%;
		}

		to {
			left: 30%;
		}
	}

	@keyframes moveToBig {
		from {
			width: 152rpx;
			height: 326rpx;
		}

		to {
			width: 190rpx;
			height: 410rpx;
		}
	}

	@keyframes moveToSmall {
		from {
			width: 190rpx;
			height: 410rpx;
		}

		to {
			width: 152rpx;
			height: 326rpx;
		}
	}

	@keyframes moveToColor {
		from {
		   width: 20rpx;
		}

		to {
			width: 100rpx;
		}
	}

	.mask-box {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.mask-list {
			height: 460rpx;

			.frist-mask-box {
				background: rgba(255, 255, 255, 0.5);
				width: 140rpx;
				height: 230rpx;
				animation-delay: 0.5s;
				animation: moveToSmall 3s 0.2s linear infinite alternate;
			}

			.sceond-mask-box {
				margin-left: 40rpx;
				background: rgba(255, 255, 255, 0.5);
				width: 280rpx;
				height: 460rpx;
				animation-delay: 0.5s;
				animation: moveToBig 3s 0.2s linear infinite alternate;
			}
		}

		.point-mask {
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translateX(-50%);
			width: 100rpx;
			height: 20rpx;
			border-radius: 50rpx;
			background: linear-gradient(129.1deg, #e3edff 0%, #eaf0fc 57%, rgba(235, 242, 255, 0.1) 100%);
			animation: moveToColor 3s 0.2s linear infinite alternate;
		}

		.second-mask-img {
			position: absolute;
			width: 200rpx;
			height: 200rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			animation: moveToLeft 3s 0.2s linear infinite alternate;
		}

		.mask-tip {
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 400;
			text-align: center;
		}
	}
</style>
