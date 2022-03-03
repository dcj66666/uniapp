<!--
* @desc 每日一练结果
* @author 戴聪杰
* @date 2021年12月28日
-->
<template>
	<view class="page-bg">
		<view class="head-bar flex-start">
			<tm-icons size="32" name="icon-angle-left" color="black" @tap="commonFun.goback()"></tm-icons>
		</view>
		<view class="tab-box">
			<view class="tab-list">
				<view v-for="(item,index) in unitData.subjectList" :key="index" class="tab-item"
					@tap="item.currentSelected==1?'':chocieTab(item)"
					:class="item.currentSelected==1?'text-main text-size-main common-text-700':''">
					<view v-show="item.currentSelected==1" class="acitiveNum"></view>
					<text class="tab-text">{{item.subjectName}}</text>
				</view>
			</view>
			<view class="setting-box flex-center">
				<view class="setting-btn flex-center">
					<view class="ml-10 t-icon t-icon-Setting"></view>
					<view class="text-size-xxs"
						@tap="commonFun.routeTo('/pages/index/selectSubjectSecond')">管理</view>
				</view>
			</view>
		</view>
		<view class="padding-box"></view>
		<!-- 日期&信息栏 -->
		<view class="report-box">
			<view>
				<view class="common-text report-day">{{unitData.stuSignNum}}</view>
				<view class="text-size-sl common-message report-text">已累计打卡（天）</view>
				<view>
					<tm-avatarGroup :posX="10">
						<tm-avatar :size="30" custom-class="avatarBorder" v-for="(item,index) in imageList" :src="item"
							:key="index">
						</tm-avatar>
						<text class="text-size-s"><text
								class="common-waringColor mx-6">{{unitData.nowSign*3 + 1688}}</text>人已打卡</text>
					</tm-avatarGroup>
				</view>
			</view>
			<view class="calender-box">
				<view class="calender-month">
					{{calenderDate.month}}
				</view>
				<view class="calender-day">{{calenderDate.day}}</view>
			</view>
		</view>
		<view class="calendar-content">
			<calendar :signeddates="markDays" @on-click="selectCalendar" ref="calendar">
			</calendar>

			<view class="practice-card">
				<view class="text-size-g common-text common-text-700">今日打卡</view>
				<view class="text-size-main common-message">
					{{chioceUnit.unitName?`《`+chioceUnit.unitName+`》`:"产品暂不可用"}}
				</view>
				<view class="practice-button flex-center text-size-main common-click"
					:class="chioceUnit.unitName?'':'disable-Btn'" @tap="startBrush" v-show="!chioceUnit.ifSubmit">
					开始答题
				</view>
				<view class="practice-button flex-center text-size-main common-click" @tap="lookReport"
					v-show="chioceUnit.ifSubmit">
					查看报告
				</view>
				<view class="again-button flex-center text-size-main common-click" @tap="startBrush"
					v-show="chioceUnit.ifSubmit">
					重新练习
				</view>
			</view>
		</view>
		<daily-mask @setClick="commonFun.relunch('/pages/login/login')" :hasMask="hasMask">
		</daily-mask>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import Calendar from '@/components/Calendar/Calendar.vue'
	import tmPropressRound from '@/tm-vuetify/components/tm-propressRound/tm-propressRound.vue';
	import tmAvatar from '@/tm-vuetify/components/tm-avatar/tm-avatar.vue';
	import tmAvatarGroup from '@/tm-vuetify/components/tm-avatarGroup/tm-avatarGroup.vue';
	import tmSticky from '@/tm-vuetify/components/tm-sticky/tm-sticky.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import DailyMask from '@/components/Mask/DailyMask.vue';


	import {
		getUnitsList,
		changeUnits
	} from "@/api/modules/question/exercise";
	@Component({
		components: {
			Calendar,
			tmPropressRound,
			tmAvatarGroup,
			tmAvatar,
			tmSticky,
			tmIcons,
			DailyMask
		}
	})
	export default class dailyTest extends Vue {
		markDays = []
		hasMask = false
		unitData = {
			nowSign: '',
			stuSignNum: '',
			unitList: [],
			subjectList: []
		}
		chioceUnit = {
			unitName: ""
		}
		calenderDate = {
			month: '',
			day: ''
		}
		month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
			"November", "December"
		]
		imageList = []
		onLoad(option) {
			this.imageList =JSON.parse(option.photoList)
		}
		onShow() {
			if (!uni.getStorageSync('hasMask')) {
				(this.hasMask = true)
			} else {
				this.getData()
			}
		}
		shuffle(arr, number) {
			let i = arr.length;
			while (i) {
				let j = Math.floor(Math.random() * i--);
				[arr[j], arr[i]] = [arr[i], arr[j]];
			}
			return arr.slice(0, number)
		}
		async getData() {
			// 获取今天日期
			var d = new Date();
			this.calenderDate.month = this.month[d.getMonth()];
			this.calenderDate.day = d.getDate();
			this.unitData = await getUnitsList({
				projectId: uni.getStorageSync('projectId')
			})
			let choiceSubject = this.unitData.subjectList.find((item) => {
				return item.currentSelected == 1
			})
			uni.setStorageSync('subjectId', choiceSubject.subjectId)
			uni.setStorageSync('subjectName', choiceSubject.subjectName)
			this.unitData.unitList.map((item) => {
				if (item.currentUnit) {
					this.chioceUnit = item
				}
				this.markDays.push(item.dateNum)
			})
		}
		// 选择科目
		async chocieTab(e) {
			let params = {
				projectId: uni.getStorageSync('projectId'),
				subjectId: e.subjectId,
				subjectName: e.subjectName
			}
			uni.setStorageSync('subjectId', e.subjectId)
			uni.setStorageSync('subjectName', e.subjectName)
			this.unitData.subjectList.map((item) => {
				item.currentSelected = 0
				if (item.subjectId === e.subjectId) item.currentSelected = 1
			})
			this.unitData.unitList = await changeUnits(params)
			this.chioceUnit = {
				unitName: ""
			}
			this.markDays = []
			this.unitData.unitList.map((item) => {
				if (item.currentUnit) {
					this.chioceUnit = item
				}
				this.markDays.push(item.dateNum)
			})
			this.$refs.calendar.cleanDate()
		}
		startBrush() {
			if (this.chioceUnit.unitName) {
				uni.navigateTo({
					url: `/pages/brushQuestions/dailyTest/dailyTest?unitId=${this.chioceUnit.unitId}&brushTime=${Date.parse(new Date())}&currentUnit=${this.chioceUnit.currentUnit}&ifSubmit=${this.chioceUnit.ifSubmit}`
				})
			}

		}
		lookReport() {
			uni.navigateTo({
				url: `/pages/brushQuestions/report?unitId=${this.chioceUnit.unitId}&currentUnit=${this.chioceUnit.currentUnit}&ifSubmit=${this.chioceUnit.ifSubmit}`
			})
		}
		maskRouteTo(url) {
			uni.navigateTo({
				url
			})
		}
		// 日历选择日期
		selectCalendar(data) {
			let findData = this.unitData.unitList.find((item) => {
				return item.dateNum == data
			})
			if (findData) {
				this.chioceUnit = findData
			} else {
				this.chioceUnit = {
					unitName: ""
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-bg {
		min-height: 100vh;
		background-color: #F5F6FA !important;
	}

	.head-bar {
		background: linear-gradient(180deg, #D7E7FF 0%, #E7F1FF 100%);
	}

	.tab-box {
		position: fixed;
		top: calc(88rpx + var(--status-bar-height));
		width: 100%;
		background: linear-gradient(180deg, #E7F1FF 0%, #EEF5FF 100%);
		z-index: 997;
		padding-top: 24rpx;

		.tab-list {
			.tab-item {
				white-space: nowrap;
				margin-right: 32rpx;
				font-size: 28rpx;

				&:last-child {
					margin-right: 0;
				}
			}
		}

		.setting-box {
			top: 24rpx;
		}
	}

	.padding-box {
		height: calc(186rpx + var(--status-bar-height));
	}

	.report-box {
		position: relative;
		z-index: 200;
		width: calc(100% - 96rpx);
		padding: 64rpx 48rpx 76rpx 48rpx;
		display: flex;
		justify-content: space-between;
		background: linear-gradient(180deg, #EEF5FF 0%, #FFFFFF 100%);

		.report-text {
			margin: 20rpx 0 48rpx 0;
		}

		.report-day {
			font-size: 112rpx;
			font-weight: 700;
			line-height: 1;
			font-family: cursive;
		}

		.avatarBorder {
			border: 1rpx solid #FFFFFF;
		}

		.calender-box {
			width: 128rpx;
			height: 128rpx;
			background: url("../../../static/img/test/calendar.png") no-repeat;
			background-size: 128rpx 128rpx;
			text-align: center;

			.calender-month {
				font-size: 20rpx;
				font-weight: 400;
				line-height: 52rpx;
				color: #FFFFFF;
			}

			.calender-day {
				color: #9caaff;
				font-size: 56rpx;
				font-weight: 700;
				line-height: 56rpx;
				font-family: "D-DIN";
			}
		}
	}

	.calendar-content {
		border-radius: 40rpx 40rpx 0 0;
		text-align: center;

		.practice-card {
			width: 700rpx;
			border-radius: 24rpx;
			margin: 0 auto;
			background: #ffffff;
			padding: 64rpx 0;

			.common-message {
				margin: 16rpx 0 42rpx 0;
			}

			.practice-button {
				height: 88rpx;
				margin: 50rpx 51rpx;
				border-radius: 24rpx;
				background: #475ffd;
				color: #FFFFFF;
			}

			.again-button {
				height: 84rpx;
				margin: 50rpx 51rpx;
				border-radius: 24rpx;
				background: #FFFFFF;
				border: 2rpx solid #475FFD;
				color: #475FFD;
			}
		}
	}
</style>
