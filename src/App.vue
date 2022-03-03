<script>
	export default {
		mpType: "app",
		onLaunch() {
			let token = uni.getStorageSync('token')
			if(!token){
			    // 第一次进入不跳转
			    // uni.switchTab({
			    //     url:'/pages/index/index'
			    // })
			   uni.reLaunch({
			       url:'/pages/index/selectExam'
			   })
			}
		},
		onShow() {
			// console.log('App Show')
		},
		onHide() {
			// console.log('App Hide')
		}
	};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./tm-vuetify/mian.min.css";
	/* <!-- 主题包 --> */
	@import "./tm-vuetify/scss/theme.css";
	@import "./static/css/common.scss";
</style>
