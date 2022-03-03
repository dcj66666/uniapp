<!--
* @desc 节-递归组件
* @author 戴聪杰
* @date 2022年1月7日
-->
<template>
	<view>
		<view v-for="(item,index) in treedata_copy" class="tree-item-box">
			<view v-if="item.leaf===0 && item.display" class="fatherHeight" @tap="open(item)">
				<view class="flex-top-start">
					<view class=" mr-16 t-icon t-icon-a-Group10493" :class="item.checked?'rotate':''"></view>
					<view>
						<view class="common-text text-size-sn common-text-700">{{item.nodeName}}</view>
						<view class="mt-16 mb-32 text-size-sl common-tip">
							<text>{{item.finQueCount}}</text>
							<text class="mx-4">/</text>
							<text>{{item.queCount}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="item.leaf===1 && item.display" class="treeHeight last-section flex-between">
				<view>
					<view class="flex-start">
						<view class="ml-24 mr-24" :class="item.permission==1?'open-dort':'open-dort-lock'"></view>
						<view class="common-text text-size-sn common-text-700">{{item.nodeName}}</view>
					</view>
					<view class="ml-50 mt-16 mb-32 text-size-sl">
						<text class="text-main">{{item.finQueCount}}</text>
						<text class="mx-4 text-main">/</text>
						<text class="common-tip">{{item.queCount}}</text>
					</view>
				</view>
				<view v-if="item.permission==1">
					<view class="reportBtn" v-if="item.queStatus==2" @tap.stop="commonFun.routeTo(`/pages/brushQuestions/report?unitId=${item.unitId}&urlFrom=1`)">报告</view>
					<view class="continueBtn" v-if="item.queStatus==1"
						@tap.stop="commonFun.routeTo(`/pages/brushQuestions/chapterExercise/exerciseTest?unitId=${item.unitId}&queStatus=1&finCount=${item.finQueCount}`)">
						继续</view>
					<view class="practiceBtn" v-if="item.queStatus==0"
						@tap.stop="commonFun.routeTo(`/pages/brushQuestions/chapterExercise/exerciseTest?unitId=${item.unitId}&queStatus=0`)">
						练习</view>
				</view>
				<view v-if="item.permission == 0">
					<view class="t-icon t-icon-suo" @tap="openMoadl()"></view>
				</view>
			</view>
			<view v-if="item.children && item.children.length>0">
				<tree-section :treedata="item['children']"></tree-section>
			</view>
		</view>
		<ChapterModal :modalHeight="448" ref="poster">
			<view class="common-text text-size-main text-align-center modal-text">
				<view>恭喜你完成上节练习</view>
				<view>分享至<text class="text-main">{{productName}}微信群</text></view>
				<view>马上解锁下一节学习</view>
				<button open-type="share">	
						<view class="share-button flex-center common-text-700" @tap="shareUnlock()">
							分享学习
						</view>
				</button>
			</view>
		</ChapterModal>
	</view>
</template>

<script>
	import TreeSection from '@/components/treeSection/TreeSection.vue';
	import ChapterModal from '@/pages/brushQuestions/comp/ChapterModal.vue';
	import {
		ShareUnlock
	} from "@/api/modules/chapter/index";
	export default {
		name: 'tree-section',
		components: {
			TreeSection,
			ChapterModal
		},
		props: {
			treedata: {
				type: Array,
				default: () => {
					return [];
				}
			},
		},
		watch: {
			treedata: {
				deep: true,
				handler() {
					this.treedata_copy = this.treedata;
				}
			}
		},
		computed: {
			treedata_copy: {
				get() {
					return this.treedata;
				},
				set(val) {}
			},
			productName:{
				get(){
					return uni.getStorageSync('projectName')
				}
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: '好友邀请@你一起刷题',
				path: '/pages/index/home'
			}
		},
		methods: {
			open(data) {
				if (data.checked) {
					data.checked = false
					data.children.map((item) => {
						item.display = false
					})
				} else {
					
					data.checked = true
					data.children.map((item) => {
						item.display = true
					})
				}
			},
			//解锁
		 	 openMoadl(){
				this.$refs.poster.openModal()
			},
			async shareUnlock(){
				let res = await ShareUnlock()
				switch (res.todayTimes){
					case '-1':
					uni.showToast({
						icon: 'none',
						title: '分享失败',
						duration: 2000
					});
					break;
					case '0':
					uni.showToast({
						icon: 'none',
						title: '本章已经全部解锁',
						duration: 2000
					});
					break;
					case '1':
					break;
					case '2':
					break;
					case '3':
					break;
					case '4':
					uni.showToast({
						icon: 'none',
						title: '今日分享超过次数',
						duration: 2000
					});
					break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.treeHeight {
		margin-bottom: 24rpx;
	}

	.t-icon-a-Group10493 {
		width: 40rpx;
		height: 40rpx;
	}

	.open-dort {
		width: 8rpx;
		height: 8rpx;
		border-radius: 4rpx;
		background: #475ffd;
	}

	.open-dort-lock {
		width: 8rpx;
		height: 8rpx;
		border-radius: 4rpx;
		background: #A2A6B9;
	}

	.rotate {
		transform: rotate(-180deg);
	}

	.last-section {
		border-bottom: 2rpx solid #F5F6FA;
	}

	.reportBtn {
		width: 112rpx;
		height: 56rpx;
		border-radius: 24rpx;
		color: #FFA800;
		font-family: "PingFang SC";
		text-align: center;
		line-height: 54rpx;
		font-size: 24rpx;
		opacity: 1;
		border: 2rpx solid #ffa800;
	}

	.continueBtn {
		width: 112rpx;
		height: 56rpx;
		border-radius: 24rpx;
		color: #FFFFFF;
		font-family: "PingFang SC";
		text-align: center;
		line-height: 54rpx;
		font-size: 24rpx;
		opacity: 1;
		background: #ffa800;
	}

	.practiceBtn {
		width: 112rpx;
		height: 56rpx;
		border-radius: 24rpx;
		color: #FFA800;
		font-family: "PingFang SC";
		text-align: center;
		line-height: 54rpx;
		font-size: 24rpx;
		opacity: 1;
		background: #fff7d3;
	}

	.t-icon-qiehuanxiangmu {
		width: 32rpx;
		height: 32rpx;
	}
	.modal-text{
		padding: 64rpx 48rpx;
		line-height: 56rpx;
	}
	.share-button{
		width: 506rpx;
		height: 88rpx;
		border-radius: 24rpx;
		margin-top: 64rpx;
		background: #475ffd;
		color: #FFFFFF;
	}
</style>
