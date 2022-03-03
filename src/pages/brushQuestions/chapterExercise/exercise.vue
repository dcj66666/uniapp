<!--
* @desc 章节练习
* @author 戴聪杰
* @date 2021年12月30日
-->
<template>
	<view class="page-bg">
		<view class=" tab-box">
			<view class="tab-list">
				<view v-for="(item,index) in subjectList" :key="index" class="tab-item"
					@tap="item.currentSelected==1?'':chocieTab(item)"
					:class="item.currentSelected==1?'text-main text-size-main common-text-700':''">
					<view v-show="item.currentSelected==1" class="acitiveNum"></view>
					<text class="tab-text">{{item.subjectName}}</text>
				</view>
			</view>
			<view class="setting-box flex-center">
				<view class="setting-btn flex-center" @tap="commonFun.routeTo('/pages/index/selectSubjectSecond')">
					<view class="ml-10 t-icon t-icon-Setting"></view>
					<view class="text-size-xxs">管理</view>
				</view>
			</view>
		</view>
		<!-- 章节列表 -->
		<view class="content-box">
			<view v-for="(item,idx) in exerciseList" :key="idx">
				<view class="content-item" :class="item.checked?'active-item':''" @tap="open(item)">
					<view class="flex flex-between">
						<view class="common-text text-size-main common-text-700">{{item.nodeName}}</view>
					</view>
					<view>
						<text class="text-size-n text-main">{{item.finQueCount}}</text>
						<text class="mx-4 text-size-sn text-main">/</text>
						<text class="text-size-sl">{{item.queCount}}</text>
					</view>
				</view>

				<view v-if="item.checked&&item.children.length>0" class="exerise-listBox">
					<tree-section :treedata="item.children"></tree-section>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import TreeSection from '@/components/treeSection/TreeSection.vue';
	import {
		getChapter,
		changeTree
	} from "@/api/modules/chapter/index";
	@Component({
		components: {
			TreeSection
		}
	})
	export default class exercise extends Vue {
		activeNum = 0
		subjectList = [];
		exerciseList = [];
		onShow() {
			this.getChapterTree()
		}
		// 获取章节树结构
		async getChapterTree() {
			let res = await getChapter({});
			res.treeList = this.changeList(res.treeList)
			this.exerciseList = res.treeList
			this.subjectList = [...res.subjectList]
			for (var i = 0; i < this.subjectList.length; i++) {
				if (this.subjectList[i].currentSelected == 1) {
					uni.setStorageSync('subjectId', this.subjectList[i].subjectId)
					uni.setStorageSync('subjectName', this.subjectList[i].subjectName)
					return
				}
			}
		}
		// 选择科目
		async chocieTab(e) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			let params = {
				projectId: uni.getStorageSync('projectId'),
				subjectId: e.subjectId
			}
			this.subjectList.map((item) => {
				item.currentSelected = 0
				if (item.subjectId === e.subjectId) {
					item.currentSelected = 1
					uni.setStorageSync('subjectId', item.subjectId)
					uni.setStorageSync('subjectName', item.subjectName)
				}
			})
			let data = await changeTree(params)
			data.treeList = this.changeList(data.treeList)
			this.exerciseList = [...data.treeList]
			uni.hideLoading()
		}
		changeList(arr) {
			arr.map((item) => {
				if (item.children.length > 0) {
					this.changeList(item.children)
				}
				item.checked = false
			})
			return arr
		}
		open(data) {
			data.checked = !data.checked
			data.children.map((item) => {
				item.display = true
			})
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		position: absolute;
		overflow-y: scroll;
		background-color: #F5F6FA;
		width: 100%;
		padding-bottom: 60rpx;
		height: calc(100% - 156rpx);
		border-radius: 50rpx 50rpx 0 0;

		.content-item {
			background-color: #FFFFFF;
			margin: 48rpx 24rpx;
			padding: 32rpx;
			border-radius: 24rpx;

			.exercise-button {
				color: #FFFFFF;
				width: 196rpx;
				height: 56rpx;
				border-radius: 24rpx;
				opacity: 1;
				background: linear-gradient(143.4deg, #667aff 0%, #4f60ff 100%);
				box-shadow: inset 0 0 14rpx 0 #cadcfc, 0 4rpx 10rpx 0 #cadcfc;

				image {
					width: 28rpx;
					height: 28rpx;
				}
			}
		}

		.active-item {
			background: linear-gradient(129.1deg, #e3edff 0%, #eaf0fc 56%, #ebf2ff 100%);
		}

		.exerise-listBox {
			margin: -16rpx 24rpx 0 48rpx;
			padding: 24rpx;
			border-radius: 24rpx;
			background: #ffffff;
			box-shadow: 0 8rpx 20rpx 0 #f1f3fa;
		}
	}
</style>
