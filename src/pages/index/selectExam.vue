<!--
* @desc 选择考试
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view class="common-bg">
		<view class="pa-48">
			<view class="text-size-xxl common-text common-text-700">选择<text class="text"
					:class="[$tm.vx.state().tmVuetify.color]">考试类型</text></view>
			<view class="text-size-main mt-16 common-tip">选择你关心的考试</view>
			<view class="mt-20">
				<tm-skeleton model='grid' v-show="examList.length<=0"></tm-skeleton>
			</view>
			<view class="flex-between flex-wrap">
				<view :key="index" v-for="(item,index) in examList" class="examCard flex-col flex-center common-click"
					@tap="selectExam(item.theme||'main',item.children)">
					<image class="examLogo"
						:src="imgList[index]">
					</image>
					<text class="text-size-g common-text">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	
	@Component({
		components: {
			tmSkeleton
		}
	})
	export default class seletExam extends Vue {
		private examList: any[] = []
		imgList = ['../../static/img/exam/build.png','../../static/img/exam/medicalScience.png','../../static/img/exam/relaz.png']
		private async getExamList() {
			var that = this
			uni.request({
				url: 'https://accelerate.wangxiao.cn/base/json/zdbc35be206c.json',
				method: "GET",
				data: {},
				header: {
					'content-type': 'application/json'
				},
				success: (res: any) => {
					that.$store.dispatch('outLineLoad', res.data.subjectTree);
					this.examList = res.data.subjectTree
				},
				fail: () => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
					uni.showToast({
						title: '网络异常，请稍后重试',
						icon: 'none'
					})
				}
			});
		}
		private onLoad() {
			(this as any).$tm.theme.setTheme('main');
			setTimeout(() => {
				this.getExamList()
			}, 100)
		}
		private async selectExam(theme: string,list:any[]) {
			await (this as any).$tm.theme.setTheme(theme);
			this.$store.dispatch('projectListLoad', list);
			uni.navigateTo({
				url: '/pages/index/selectSubject'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.examCard {
		width: 300rpx;
		height: 300rpx;
		border-radius: 24rpx;
		background: #ffffff;
		margin-top: 68rpx;

		.examLogo {
			width: 150rpx;
			height: 150rpx;
			margin-bottom: 24rpx;
		}
	}
</style>
