<!--
* @desc 选择科目
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view>
		<tm-quickIndex :list="subjectList" cellStyle="display:flex;flex-flow: wrap;" @change="changeSubject"
			rangKey="name">
		</tm-quickIndex>
		<tm-poup v-model="posShow" position="bottom" height="600" :is-filter="false">
			<view class="poupBox">
				<view class="common-open"></view>
				<view class="flex-center my-30">选择考试</view>
				<view class="flex poupList">
					<view v-for="(item,index) in checkedItem.children" :key="index" class="poupItem text-size-sn"
						@tap="choiceSubject(item)">
						{{item.name}}
					</view>
				</view>
			</view>
		</tm-poup>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	import tmQuickIndex from '@/tm-vuetify/components/tm-quickIndex/tm-quickIndex.vue';
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
	@Component({
		components: {
			tmQuickIndex,
			tmPoup
		}
	})
	export default class selectSubject extends Vue {
		checkedItem = ''
		posShow = false
		subjectList = [{
				title: "热门",
				index: "HOT",
				children: [{
						name: "护士"
					},
					{
						name: "健康护理师"
					},

				]
			},
			{
				title: "初级卫生职称",
				index: "C",
				children: [{
						name: "初级药学"
					},
					{
						name: "初级技师"
					},
					{
						name: "初级护理"
					}
				]
			}
		]
		onLoad() {
			// this.subjectList = this.$store.state.outLine.projectList
			this.subjectList = [{
				title: "热门",
				index: "HOT",
				children: this.$store.state.outLine.projectList
			}]
			// this.$store.dispatch('projectListLoad', list);
		}
		// 选择科目
		changeSubject(item) {
			this.checkedItem = item.data
			// 当leaf为0时表示项目下面有项目,为1表示无项目
			if (this.checkedItem.leaf == 0) {
				this.posShow = true
			} else {
				this.$store.dispatch('projectDataLoad', this.checkedItem);
				uni.setStorageSync('projectData', JSON.stringify(this.checkedItem));
				uni.navigateTo({
					url: '/pages/index/selectSubjectSecond'
				});
			}
		}
		choiceSubject(data) {
			this.$store.dispatch('projectDataLoad', data);
			uni.setStorageSync('projectData', JSON.stringify(data));
			uni.navigateTo({
				url: '/pages/index/selectSubjectSecond'
			})
		}
	}
</script>


<style lang="scss" scoped>
	.checkedSub {
		border: 1rpx solid;
	}

	.poupBox {
		text-align: center;
		padding: 30rpx;

		.poupList {
			flex-wrap: wrap;
			margin: 24rpx 34rpx;
			overflow-y: scroll;

			.poupItem {
				border-radius: 16rpx;
				padding: 16rpx 24rpx;
				height: 36rpx;
				margin-left: 16rpx;
				margin-bottom: 32rpx;
				opacity: 1;
				background: #f5f6fa;
			}
		}
	}
</style>
