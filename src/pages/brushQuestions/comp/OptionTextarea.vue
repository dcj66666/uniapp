<!--
* @desc  选项文本组件
* @author 江玉龙
* @date 2021年1月21日
-->
<template>
	<view>
		<!-- 公式 -->
		<view v-show="optionType==1" class="text-size-sn text-align-left">
			{{optionValue}}
		</view>
		<!-- 文本 -->
		<view v-show="optionType==2">
			<tm-images :src="optionValue" mode="aspectFit"></tm-images>
		</view>
		<!-- 图片 -->
		<view v-show="optionType==3">
			<tm-images :src="optionValue" mode="aspectFit"></tm-images>
		</view>
	</view>
</template>

<script>
	import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
	export default {
		name: 'data-textare',
		components: {
			tmImages
		},
		props: {
			optionType: {
				type: Number,
				default: 1
			},
			optionValue: {
				type: String,
				default: ''
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
</style>
