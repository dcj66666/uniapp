/**
 * 简单的canvas操作类
 * 作者：tmzdy
 * 时间：2021年7月30日22:00:05
 * 联系：zhongjihan@sina.com
 */
class canvas {
	dom=null;
	width=0;
	height=0
	constructor({dom,width,height}) {
	    if(arguments.length!==1){
			throw "参数错误";
			return;
		}
		let arg = arguments[0];
		this.dom = arg?.dom??null;
		this.width = arg?.width??0;
		this.height = arg?.height??0;
	}
	
	drawimageByBase64(img){
		let t = this;
		
			var fsm =  uni.getFileSystemManager();
		  var filePath = uni.env.USER_DATA_PATH + '/share_img.png';
		  var buffer =  uni.base64ToArrayBuffer(img);
		  let p = []
		  for(let i=0;i<buffer.length;i++){
			  p.push(buffer[i].charAt(buffer[i]))
		  }
		 // t.dom.drawImage(img,0,0,this.width,this.height,0,0,300,300)
		console.log(p);
		
	}
}


export default canvas;