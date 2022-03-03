<!--
* @desc 个人中心
* @author 戴聪杰
* @date 2021年12月30日
-->
<template>
	<view class="page-bg">
		<!-- 头部信息 -->
		<view class="mine-headBg">
			<view class="mine-headMsg">
				<view class="mine-Name">
					<view class="text-size-xxl common-text-700 common-text" v-show="token">{{userInfo.nickName}}</view>
					<view class="text-size-xxl common-text-700 common-text flex-start"
						@tap="commonFun.routeTo('/pages/login/login')" v-show="!token">点击登录
						<view  class="t-icon t-icon-arrow-right-circle"></view>
					</view>
					<view class="text-size-sn common-tip mt-16">只要你肯去努力，你就是幸运的</view>
				</view>
				<image :src="token?userInfo.avatarUrl:'../../static/img/mine/default-Avatar.png'">
				</image>
			</view>
		</view>
		<!-- 用户 -->
		<view class="mine-yetBox">
			<image style="width: 328rpx;height: 212rpx;" src="../../static/img/mine/wrong.png"
				@tap="commonFun.routeTo('/pages/marketCenter/wrongList')"></image>
			<image style="width: 328rpx;height: 212rpx;" src="../../static/img/mine/favorite.png"
				@tap="commonFun.routeTo('/pages/marketCenter/collection')"></image>
		</view>
		<view class="mine-setting">
			<view v-for="(item,index) in settingList" :key="index" class="flex-between" @tap="goTo(index)">
				<view class="setting-item">
					<view class="setting-iconfont" :class="item.iconfont"></view>
					<view class="text-size-main common-text common-text-700 ml-12">{{item.name}}</view>
				</view>
				<view class="back-box">
					<button open-type="share" v-show="index===0">
						<view class="text-size-sn text-main mr-6">去邀请</view>
					</button>
					<view v-show="index===1" class="text-size-sn common-tip mr-6">查看历史兑换试题</view>
					<tm-icons size="25" name="icon-angle-right" color="grey-lighten-1 mb-6"></tm-icons>
				</view>
			</view>
		</view>
		<view class="flex-center">
			<image class="logo-box" src="https://app.static.wangxiao.cn/ztb/logo.png">
			</image>
		</view>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	@Component({
		components: {
			tmIcons
		}
	})
	export default class mine extends Vue {
		userInfo = {}
		token = ''
		settingList = [{
			iconfont: 't-icon t-icon-fenxiang',
			name: '分享应用'
		}, {
			iconfont: 't-icon t-icon-duihuan',
			name: '兑换记录'
		}, {
			iconfont: 't-icon t-icon-fenxiang',
			name: '关于我们'
		}, ]
		onLoad() {
			this.token = uni.getStorageSync('token')
			if (this.token)(this.userInfo = JSON.parse(uni.getStorageSync('userInfo')))
		}
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: '好友邀请@你一起刷题',
				path: '/pages/index/home'
			}
		}
		goTo(index) {
			switch (index) {
				case 0:
					this.sharePoster()
					break;
				case 1:
					this.commonFun.routeTo('/pages/userCenter/exchangeList');
					break;
				case 2:
					this.commonFun.routeTo('/pages/userCenter/about');
					break;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-bg {
		height: 100vh;
	}

	.mine-headBg {
		background-image: url("https://app.static.wangxiao.cn/ztb/mine-bg.png");
		width: 100%;
		height: 230rpx;
		background-size: 100%;
		padding-top: 220rpx;
		position: relative;

		.mine-headMsg {
			display: flex;
			justify-content: space-between;
			margin: 0 40rpx;
			position: relative;

			.mine-Name {
				line-height: 1.5;
			}
			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 2rpx solid #FFFFFF;
			}
			.t-icon-arrow-right-circle {
				width: 40rpx;
				height: 40rpx;
				margin-left: 22rpx;
			}
		}
	}

	.mine-yetBox {
		margin-top: -30rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	.mine-setting {
		margin-top: 80rpx;
		padding: 0 48rpx;
		.flex-between {
			margin-bottom: 80rpx;
		}
		.setting-item {
			display: flex;
			.setting-iconfont {
				width: 48rpx;
				height: 48rpx;
			}
		}
		.back-box {
			display: flex;
			align-items: center;
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
		position: fixed;
		bottom: 200rpx;
		width: 176rpx;
		height: 32rpx;
	}
</style>
