<template>
	<view class="wrap">
		<swiper :circular="circular" style="width:100%;height:100%;" :current="swiperIndex" @change="changeswiper">
			<swiper-item v-for="(item, i) in swiperList" :key="i">

				<view>swiperIndex：{{ swiperIndex }}</view>
				<view>{{ item.name }}</view>

			</swiper-item>
		</swiper>
		<view class="bottomBox">
			<view @click="
					curIndex = i;
					toQue(allQue[curIndex]);
				" :class="{ act: i == curIndex }" v-for="(item, i) in allQue" :key="item">
				{{ i }}
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				data: [{
					name: '卡片0'
				}, {
					name: '卡片1'
				}, {
					name: '卡片2'
				}, {
					name: '卡片3'
				}, {
					name: '卡片4'
				}, {
					name: '卡片5'
				}, {
					name: '卡片6'
				}],
				swiperIndex: 0,
				curIndex: 0,
				swiperList: []
			};
		},
		onLoad() {
			this.upDateswiperList();
		},
		methods: {
			async toQue(item) {
				// this.currentswiper = 0

				// 由三个siwper滚动,0时swiperindex为0 末尾时为最后一个
				// 实现禁止滑过头
				if (this.curIndex == this.allQue.length - 1) {
					this.swiperIndex = 2;
				}
				if (this.curIndex == 0) {
					this.swiperIndex = 0;
				}

				this.upDateswiperList();
			},
			calcCurIndex(current) {
				// 判断左移还是右移
				if (this.swiperIndex - current == 2 || this.swiperIndex - current == -1) {
					// 计算当前题索引
					this.curIndex = this.curIndex + 1 == this.allQue.length ? 0 : this.curIndex + 1;

					// console.log('右移', this.curIndex, current);

					// 如果是最后一道题时就不更新swiper了,之前上一题的上中下已含有
					this.swiperIndex = 0;
					if (this.curIndex == this.allQue.length - 1) {
						this.$nextTick(() => {
							this.swiperIndex = 2;
						});
					} else {
						this.swiperIndex = current;
					}
					this.upDateswiperList();
				} // 如果两者的差为-2或者1则是向前滑动
				else if (this.swiperIndex - current == -2 || this.swiperIndex - current == 1) {
					this.curIndex = this.curIndex - 1 == -1 ? this.allQue.length - 1 : this.curIndex - 1;
					// console.log('左移', this.curIndex, current);

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
			},
			changeswiper(e) {
				let current = e.detail.current;
				// 计算curIndex
				this.calcCurIndex(current);

				// console.log(`finish当前${this.curIndex}`, `当前轮播图${this.swiperIndex}`, `可轮播${this.circular}`, this.allQue[this
				// 	.curIndex]);
			},
			upDateswiperList() {
				this.swiperList = [];
				// 最后一次时固定为轮播图中的第三张
				let temp = this.curIndex == this.allQue.length - 1 ? 2 : this.swiperIndex;
				temp = this.curIndex == 0 ? 0 : temp;
				// 中间
				this.swiperList[temp] = this.allQue[this.curIndex];
				// 上一道
				if (this.curIndex != 0) {
					this.swiperList[temp - 1 == -1 ? 2 : temp - 1] = this.allQue[this.curIndex - 1 == -1 ? this.allQue
						.length - 1 : this.curIndex - 1];
				}
				// 下一道
				this.swiperList[temp + 1 == 3 ? 0 : temp + 1] = this.allQue[this.curIndex + 1 == this.allQue.length ? 0 :
					this.curIndex + 1];
				// console.log('计算出swiperList', this.swiperList);
			}
		},
		computed: {
			allQue() {
				return this.data;
			},
			circular() {
				if (this.curIndex != 0 && this.allQue.length - 1 != this.curIndex) {
					return true;
				} else {
					return false;
				}
			}
		}
	};
</script>
<style lang="scss">
	page {
		background: #fff;
		height: 100vh;
		font-size: 50rpx;
	}

	.wrap {
		height: 100%;
	}
	.bottomBox{
		display: flex;
		position: fixed;
		bottom: 0;
	}
	.act {
		color: #fff;
		padding: 0 4rpx;
		background: green;
	}
</style>
