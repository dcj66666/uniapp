<template>
	<view>
		<view class="common-guide-mask" v-if="hasMask">
			<view class="common-guide-button" @tap="overMask()">跳过</view>
			<view v-show="step===1">
				<tm-translate animation-name="fadeIn">
					<view class="common-guide-light first-mask text-size-xl common-text flex-center">
						所选项目
						<view class="ml-10 t-icon t-icon-qiehuanxiangmu"></view>
					</view>
					<view class="first-mask-model text-size-sn py-32 flex-between">
						切换考试项目
						<view class="first-mask-button text-size-sl text-main flex-center" @tap="nestStep(1)">我知道了
						</view>
					</view>
				</tm-translate>
			</view>
			<view v-if="step===2">
				<tm-translate animation-name="fadeIn">
					<view class="common-guide-light second-mask">
						<view class="practice-content flex-between">
							<view>
								<text class="practice-text">打卡学习</text>
								<tm-avatarGroup :posX="0">
									<tm-avatar :size="30" custom-class="avatarBorder" v-for="(item,index) in photoList" :src="item"
										:key="index">
									</tm-avatar>
									<text class="text-size-s"><text
											class="common-waringColor mx-6">4396</text>人已打卡</text>
								</tm-avatarGroup>
							</view>
							<image src="@/static/img/home/Frame1.png"></image>
						</view>
						<view class="practice-button flex-center text-size-n mt-50 relative">
							<image src="@/static/img/home/clock-tips.png"></image>
							去打卡
						</view>
					</view>
					<view class="second-mask-model text-size-sn py-32 flex-between">
						<view class="mb-15">每日一练，养成学习好习惯~</view>
						<view class="second-mask-button text-size-sl text-main flex-center" @tap="nestStep(2)">立即打卡
						</view>
					</view>
				</tm-translate>
			</view>
		</view>
	</view>
</template>

<script>
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import TreeSection from '@/components/treeSection/TreeSection.vue';
	import tmAvatar from '@/tm-vuetify/components/tm-avatar/tm-avatar.vue';
	import tmAvatarGroup from '@/tm-vuetify/components/tm-avatarGroup/tm-avatarGroup.vue';
	export default {
		name: 'HomeMask',
		components: {
			tmTranslate,
			TreeSection,
			tmAvatar,
			tmAvatarGroup
		},
		props: {
			hasMask: {
				type: Boolean,
				default: true
			},
			photoList:{
				type: Array,
				default: []
			}
		},
		data() {
			return {
				step: 1
			}
		},
		onLoad() {
			this.hasMask = uni.getStorageSync('hasMask') ? uni.getStorageSync('hasMask') : true;
		},
		methods: {
			overMask() {
				uni.setStorageSync('hasMask', 'false')
				uni.reLaunch({
					url: '/pages/index/home'
				})
			},
			nestStep(num) {
				this.step = num + 1
				switch (num) {
					case 1:
						break
					case 2:
						this.$emit("setClick")
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./homeMask.scss";
</style>
