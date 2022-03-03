<!--
* @desc 选择科目最后一步
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view>
		<view class="common-bg">
			<view class="pa-48" v-show="projectData.children.length<=0 && projectData.name==''">
				<tm-skeleton model='list'></tm-skeleton>
			</view>
			<view class="pa-48" v-show="projectData.name&&projectData.children.length>0">
				<view class="flex-start text-size-xl common-text common-text-700">{{projectData.name}}
					<view class="ml-10 t-icon t-icon-qiehuanxiangmu" v-show="changeImg"
						@tap="commonFun.routeTo('/pages/index/selectSubject')"></view>
				</view>
				<view class=" text-size-n mt-16 common-text">选择需要学习的科目</view>

				<view class="subject-box">
					<view class="outlined flex-between itemBox" v-for="(item,index) in projectData.children"
						:key="index" :class="item.checked==true?[$tm.vx.state().tmVuetify.color]:''"
						@tap="selectSubject(item)">
						<view class="text-overflow text-size-sn ">{{item.name}}</view>
						<view>
							<view class="circle" v-if="!item.checked"></view>
							<tm-icons size="32" name="icon-check-circle" color="main" v-else></tm-icons>
						</view>
					</view>
				</view>
			</view>
			<view class="common-buttonBox">
				<view class="common-button flex-center common-click text-size-main"
					:class="!isDisable?'disable-Btn':[$tm.vx.state().tmVuetify.color]" @tap="isDisable?getChoice():''">
					确定选择</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmCheckbox from '@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';

	import {
		chooseSubject
	} from "@/api/modules/user/index.ts";
	@Component({
		components: {
			tmSkeleton,
			tmCheckbox,
			tmIcons
		}
	})
	export default class selectSS extends Vue {
		projectData = {
			name: "",
			id: "",
			children: []
		}
		changeImg = true
		get isDisable() {
			let hasItem = this.projectData.children.find(function(item) {
				return item.checked
			})
			if (hasItem) {
				return true
			} else {
				return false
			}
		}
		onShow() {
			let pages = getCurrentPages() // 获取栈实例
			let prevPage = pages[pages.length - 2].route // 获取上个页面的数据，包含页面路由
			if (prevPage == 'pages/brushQuestions/dailyTest/testResult' || prevPage ==
				'pages/brushQuestions/chapterExercise/exercise') {
				this.changeImg = false
			}
			this.getExamList()
		}
		selectSubject(data) {
			data.checked = !data.checked
		}
		getExamList() {
			this.projectData = JSON.parse(uni.getStorageSync('projectData'));
			if (!this.changeImg) {
				let subjectsList = JSON.parse(uni.getStorageSync('subjectsList'))
				subjectsList.forEach((item) => {
					this.projectData.children.forEach((data, index) => {
						if (data.id == item.subjectId)(this.$set(this.projectData.children, index, {
							...data,
							checked: true
						}))
					})
				})
			}
		}
		async getChoice() {
			let list = []
			this.projectData.children.forEach((item) => {
				if (item.checked) {
					list.push({
						subjectId: item.id,
						subjectName: item.name,
						currentSelected: 0
					})
				}
			})
			if (list.length > 0)(list[0].currentSelected = 1)
			this.token = uni.getStorageSync('token')
			if (this.token) {
				await chooseSubject({
					projectName: this.projectData.name,
					subjects: list,
					projectId: this.projectData.id
				})
			}
			//把选中的科目放入缓存
			uni.setStorageSync('subjectsList', JSON.stringify(list));

			if (!this.changeImg) {
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2].route
				let url = '/' + prevPage
				if (prevPage == 'pages/brushQuestions/dailyTest/testResult') {
					url = '/' + prevPage + '?photoList=' + JSON.stringify(pages[pages.length - 2].data.imageList)
				}
				console.log(url)
				uni.redirectTo({
					url: url
				})
			} else {
				uni.switchTab({
					url: '/pages/index/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.subject-box {
		flex-wrap: wrap;
		display: flex;
		justify-content: space-between;
		margin-top: 48rpx;
		padding-bottom: 208rpx;

		.itemBox {
			border: 2rpx solid #FFFFFF;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			width: calc(50% - 96rpx);
			height: 100rpx;
			margin-bottom: 32rpx;
			padding: 0 32rpx;

			.circle {
				width: 28rpx;
				height: 28rpx;
				border: 2rpx solid;
				border-radius: 50%;
			}
		}
	}
</style>
