<!--
* @desc 主页
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view class="common-bg ">
		<view class="pa-24" v-show="!dataShow">
			<tm-skeleton model='list'></tm-skeleton>
			<tm-skeleton model='cardActions'></tm-skeleton>
			<tm-skeleton model='cardActions'></tm-skeleton>
		</view>
		<view class="px-24" v-show="dataShow">
			<view class="flex-start text-size-xl common-text common-text-700">{{homeData.projectName}}
				<view class="ml-10 t-icon t-icon-qiehuanxiangmu"
					@tap="commonFun.routeTo('/pages/index/selectExam?ifUpload=true')"></view>
			</view>
			<!-- 状态信息栏 -->
			<view class="state-box">
				<view class="state-bg">
					<view class="flex-between">
						<view class="state-user" @click="token?'':commonFun.routeTo('/pages/login/login')">
							<image class="state-photo"
								:src="token?userInfo.avatarUrl:'../../static/img/mine/default-Avatar.png'">
							</image>
							<text class="state-text text-size-main">{{token?userInfo.nickName:'未登录'}}</text>
						</view>
						<scroll-bar height="36rpx" fontSize="24rpx" :list="['每天练习，及时了解学习情况']"></scroll-bar>
					</view>
				</view>
				<view class="state-msg">
					<view class="state-msg-item flex-center">
						<view class="flex-center logoMsg">
							<image src="../../static/img/home/day.png"></image>
							<text class="text-size-sn common-message">坚持天数</text>
						</view>
						<view class="text-size-xxxl">{{token?homeData.signCount:'--'}}</view>
					</view>
					<view class="state-msg-item flex-center">
						<view class="flex-center logoMsg">
							<image src="../../static/img/home/questionNum.png"></image>
							<text class="text-size-sn common-message">做题总数量</text>
						</view>
						<view class="text-size-xxxl common-text">{{token?homeData.queCount:'--'}}</view>
					</view>
				</view>
			</view>
			<view @tap="commonFun.routeTo('/pages/brushQuestions/comp/swiper')">swiper</view>
			<!-- 每日打卡 -->
			<view class="practice-box">
				<view class="practice-content flex-between">
					<view>
						<text class="common-text text-size-l common-text-700">打卡学习</text>
						<view class="mt-10">
							<tm-avatarGroup :posX="0">
								<tm-avatar :size="30" custom-class="avatarBorder" v-for="(item,index) in imageList"
									:src="item" :key="index">
								</tm-avatar>
								<text class="text-size-s"><text
										class="common-waringColor mx-6">{{homeData.nowSign*3 + 1688}}</text>人已打卡</text>
							</tm-avatarGroup>
						</view>
					</view>
					<image src="@/static/img/home/Frame1.png"></image>
				</view>
				<view class="practice-button flex-center text-size-sn mt-50 relative common-click"
					@tap="commonFun.routeTo(`/pages/brushQuestions/dailyTest/testResult?photoList=${photoString}`)">
					<image style="width: 220rpx;" src="@/static/img/home/clock-tips.png" v-show="!homeData.ifSign">
					</image>
					去打卡
				</view>
			</view>
			<!-- 广告卡片 -->
			<image class="banner" src="../../static/img/home/question.png"
				@tap="commonFun.routeTo('/pages/userCenter/exchange')"></image>
			<!-- 章节练习 -->
			<view class="practice-box">
				<view class="chapter-box flex-between"
					@tap="commonFun.routeTo('/pages/brushQuestions/chapterExercise/exercise')">
					<view>
						<view class="common-text text-size-l common-text-700">章节精炼</view>
						<view class="common-message text-size-sn mt-16">摒弃题海战术，锁定核心知识点</view>
					</view>
					<image src="../../static/img/home/Frame2.png"></image>
				</view>
			</view>
			<view class="logo-box">
				<view class="t-icon t-icon-zhongdalogo">
				</view>
			</view>
		</view>
		<home-mask @setClick="maskRouteTo('/pages/brushQuestions/dailyTest/testResult')" :hasMask="hasMask"
			:photoList="imageList"></home-mask>
		<tm-message ref="toast"></tm-message>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmAvatar from '@/tm-vuetify/components/tm-avatar/tm-avatar.vue';
	import tmAvatarGroup from '@/tm-vuetify/components/tm-avatarGroup/tm-avatarGroup.vue';
	import tmSheet from '@/tm-vuetify/components/tm-sheet/tm-sheet.vue';
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import HomeMask from '@/components/Mask/HomeMask.vue';
	import ScrollBar from '@/components/ScrollBar/index.vue';
	import publicFun from '@/utils/public.js'
	import {
		getHomeIndex,
		getCountNumber
	} from "@/api/modules/user/index";
	import {
		getRecord
	} from '@/api/modules/chapter/index.ts'

	@Component({
		components: {
			tmAvatarGroup,
			tmAvatar,
			tmSheet,
			tmSkeleton,
			HomeMask,
			ScrollBar
		}
	})
	export default class Home extends Vue {
		get dataShow() {
			return this.homeData.projectName != '';
		}
		get photoString(){
			return JSON.stringify(this.imageList)
		}
		imageList = []
		homeData = {
			projectName: "",
			signCount: "",
			queCount: "",
			ifSign: '',
			nowSign: 0,
		}
		userInfo = {
			avatarUrl: '../../static/img/mine/default-Avatar.png',
			nickName: '普通用户'
		}
		hasMask = false
		token = ''
		hasShare = false
		onShow() {
			if (!uni.getStorageSync('subjectsList')) {
				uni.reLaunch({
					url: '/pages/index/selectExam'
				})
			} else {
				!uni.getStorageSync('hasMask') && (this.hasMask = true)
				this.token = uni.getStorageSync('token')
				if (this.token) {
					this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.getExamList()
					//当有做题记录时
					if (uni.getStorageSync('chapterRecord') && uni.getStorageSync('chapterAnswerList')) {
						var params = {
							...JSON.parse(uni.getStorageSync('chapterRecord')),
							...JSON.parse(uni.getStorageSync('chapterAnswerList'))
						}
						getRecord(params).then(() => {
							uni.removeStorageSync('chapterAnswerList')
							uni.removeStorageSync('chapterRecord')
						})
					}
				} else {
					let projectData = JSON.parse(uni.getStorageSync('projectData'));
					let nowSign = 0
					getCountNumber(projectData.id).then((item) => {
						nowSign = item
					})
					this.homeData = {
						projectName: projectData.name,
						signCount: "",
						queCount: "",
						ifSign: '',
						nowSign: nowSign,
					}
				}
			}
		}
		onLoad() {
			uni.request({
				url: 'https://app.static.wangxiao.cn/ztb/resources/users.json',
				method: "GET",
				data: {},
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					this.imageList = this.shuffle(res.data, 6)
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
		shuffle(arr, number) {
			let i = arr.length;
			while (i) {
				let j = Math.floor(Math.random() * i--);
				[arr[j], arr[i]] = [arr[i], arr[j]];
			}
			return arr.slice(0, number)
		}

		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				uni.setStorageSync('shareTime', (new Date().getDate()).toString())
				this.hasShare = true
			}
			return {
				title: '好友邀请@你一起刷题',
				path: '/pages/index/home'
			}
		}
		async getExamList() {
			this.homeData = await getHomeIndex()
			uni.setStorageSync('projectId', this.homeData.projectId)
			uni.setStorageSync('projectName', this.homeData.projectName)
		}
		maskRouteTo(url) {
			publicFun.throttle(function() {
				uni.navigateTo({
					url
				})
			}, 2000)
		}
	}
</script>

<style lang="scss" scoped>
	.common-bg {
		padding-bottom: 50rpx;
	}

	.avatarBorder {
		border: 1rpx solid #FFFFFF;
	}

	.t-icon-qiehuanxiangmu {
		width: 48rpx;
		height: 48rpx;
	}

	//状态栏
	.state-box {
		width: 100%;
		position: relative;
		margin-top: 32rpx;

		.state-bg {
			padding: 20rpx 26rpx 0 26rpx;
			background-image: url(https://app.static.wangxiao.cn/ztb/userBg.png);
			background-size: 100% 100%;
			height: 225rpx;

			.state-user {
				display: flex;
				align-items: center;

				.state-photo {
					flex-shrink: 0;
					width: 60rpx;
					height: 60rpx;
					border: 4rpx solid #FFFFFF;
					background-color: #FFFFFF;
					border-radius: 50%;
				}

				.state-text {
					color: #FFFFFF;
					margin-left: 20rpx;
				}
			}
		}

		.state-msg {
			width: 100%;
			height: 196rpx;
			border-radius: 24rpx;
			background: linear-gradient(-0.2deg, #ffffff 0%, #ffffff 54%, #ECF2FF 100%);
			box-shadow: 0 8rpx 20rpx 0 #F1F3FA;
			position: absolute;
			top: 108rpx;
			display: flex;
			justify-content: space-between;

			.state-msg-item {
				width: 50%;
				flex-flow: column;

				.logoMsg {
					text-align: center;

					image {
						margin-right: 10rpx;
						width: 32rpx;
						height: 36rpx;
					}
				}
			}
		}
	}

	// 广告卡
	.banner {
		width: 100%;
		height: 206rpx;
	}

	//考前练习
	.practice-box {
		margin: 32rpx auto;
		padding: 40rpx 40rpx;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 20rpx 0 #f1f3fa;

		.practice-content {
			image {
				width: 112rpx;
				height: 112rpx;
			}
		}

		.practice-button {
			height: 72rpx;
			border-radius: 24rpx;
			background: #475ffd;
			box-shadow: 0 8rpx 24rpx 0 #d3d6ff;
			color: #FFFFFF;

			image {
				position: absolute;
				width: 200rpx;
				height: 64rpx;
				top: -30rpx;
				right: 0;
			}
		}
	}

	//章节练习
	.chapter-box {
		image {
			width: 112rpx;
			height: 112rpx;
		}
	}

	.common-barItem {
		display: flex;
		justify-content: center;
		flex-flow: column;
		align-items: center;

		image {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.logo-box {
		margin: 40rpx auto;
		text-align: center;

		.t-icon-zhongdalogo {
			width: 176rpx;
			height: 32rpx;
		}
	}
</style>
