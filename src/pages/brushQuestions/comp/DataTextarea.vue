<!--
* @desc  题目文本组件
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view>
		<view v-for="(item,index) in textData" :key="index">
			<!-- 公式 -->
			<view v-show="item.type==1" class="my-20 text-align-left">
				{{item.content}}
			</view>
			<!-- 文本 -->
			<view v-show="item.type==2" class="my-20">
				<tm-images :src="item.content" mode="aspectFit"></tm-images>
			</view>
			<!-- 图片 -->
			<view v-show="item.type==3" class="my-20">
				<tm-images :src="item.content" mode="aspectFit"></tm-images>
			</view>
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
			textData: {
				type: Array,
				default: () => {
					return [];
				}
			},
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
</style>
