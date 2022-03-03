import { getItem,removeItem } from '@/utils/storage.ts'
import { baseUrl } from '../config'
interface RequestOptionsRquest {
    url: string,
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
    data?: object,
    isJson?: boolean,
    rest?: boolean,
    restData?: string | number
}
export default ({ url, method = 'GET', data = {}, isJson = true, rest = false, restData }: RequestOptionsRquest) => {
    const contentType = isJson ? 'application/json' : 'application/x-www-form-urlencoded';
    if (rest) {
        url += '/' + restData
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            method,
            data:{bizBody:data},
            header: {
                'content-type': contentType,
				token: uni.getStorageSync('token')
            },
            success: (res: any) => {
                if (res.data.code == 100000) {
                    resolve(res.data.bizBody)
                }else if(res.data.code == 402005) {
					uni.showToast({
						title: res.data.msg.alert,
						icon: 'none'
					});
				}else if (500000>res.data.code && res.data.code>= 400001) {
                    uni.showToast({
                        title: res.data.msg.alert,
                        icon: 'none'
                    });
                    uni.clearStorageSync();
                    uni.reLaunch({
                        url: '/pages/index/selectExam'
                    })
                } else {
                    uni.showToast({
                        title: '网络异常，请稍后重试',
                        icon: 'none'
                    })
                    reject('网络连接失败');
                }
                uni.stopPullDownRefresh();
            },
            fail: () => {
                uni.hideLoading();
                uni.stopPullDownRefresh();
                uni.showToast({
                    title: '网络异常，请稍后重试',
                    icon: 'none'
                })
                reject('网络连接失败');
            }
        });
    })
}