<!--
* @desc 分享
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
	<view>
		<button @tap="sharePoster">11</button>
		<share-canvas ref="poster"></share-canvas>
	</view>
</template>

<script>
	import {
		Component,
		Vue
	} from "vue-property-decorator";
	@Component({
		components: {

		}
	})
	export default class shareCard extends Vue {
		onLoad() {
		}
		sharePoster() {
			this.$refs.poster.showCanvas()
		}
	}
</script>

<style lang="scss" scoped>
</style>
