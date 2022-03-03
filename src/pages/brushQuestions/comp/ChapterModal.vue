<template>
	<view class="content" v-if="isShow" @click.stop="isShow=false">
		<view class="modal-exit" :style="{'height': modalHeight+'rpx'}" @click.stop>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ChapterModal",
		props: {
			modalHeight: {
				type: Number,
				default: 352
			}
		},
		data() {
			return {
				isShow: false
			}
		},
		methods: {
			openModal() {
				this.isShow = true
			},
			closeModal() {
				this.isShow = false
			}
		},
	}
</script>

<style>
	.content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 99;
	}
	.modal-exit {
		width: 600rpx;
		height: 352rpx;
		border-radius: 24rpx;
		background: linear-gradient(-0.2deg, #FFFFFF 0%, #F7FAFE 81%, #EBF1FD 100%);
	}
</style>
