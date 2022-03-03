import request from '@/api/request'
let commonParams={
	subjectId : uni.getStorageSync('subjectId'),
	projectId : uni.getStorageSync('projectId'),
	subjectName : uni.getStorageSync('subjectName'),
	projectName : uni.getStorageSync('projectName')
}
function getData(){
	return commonParams={
		subjectId : uni.getStorageSync('subjectId'),
		projectId : uni.getStorageSync('projectId'),
		subjectName : uni.getStorageSync('subjectName'),
		projectName : uni.getStorageSync('projectName')
	}
}
enum Api {
     Chapter = '/chapter/home/tree',
     Report = '/chapter/query/report',
	 Units = '/chapter/query/all/questions',
	 Share = '/chapter/share/unlock',
	 Card = '/chapter/answer/card',
	 Record = '/chapter/save/record',
	 Change = '/chapter/change/tree',
	 Analysis = '/chapter/view/analysis/questions'
}

// export const loginApi = (params: type.UserLoginReqVO, config = {}) => http.post<any>(Api.Login, params, config)
// export const checkName = (params) => defHttp.post<any>({ url: Api.checkName, params });

// 章节练习首页
export const getChapter = (data:any) => {
	let res = getData()
	data = {...res,...data }
    return Promise.resolve(request({
        url:Api.Chapter,
        method: "GET",
        data
    }))
}
// 获取提交后的答题卡
export const getAnswerCard = (data:any) => {
    return Promise.resolve(request({
        url:Api.Card,
        method: "POST",
        data
    }))
}
// 查看学习报告
export const getChapterReport = (data:any) => {
	let res = getData()
	data = {...res,...data }
    return Promise.resolve(request({
        url:Api.Report,
        method: "POST",
        data
    }))
}
// 获取学习单元题资源或者记录
export const getUnits = (data:any) => {
	let res = getData()
	data = {...res,...data }
    return Promise.resolve(request({
        url:Api.Units,
        method: "POST",
        data
    }))
}
// 保存做题提交或记录
export const getRecord = (data:any) => {
	let res = getData()
	data = {...res,...data }
    return Promise.resolve(request({
        url:Api.Record,
        method: "POST",
        data
    }))
}
// 分享解锁
export const ShareUnlock = (data:any) => {
	let res = getData()
	data = {...res,...data }
    return Promise.resolve(request({
        url:Api.Share,
        method: "POST",
        data
    }))
}

// 分享解锁
export const changeTree = (data:any) => {
    return Promise.resolve(request({
        url:Api.Change,
        method: "POST",
        data
    }))
}
// 分享解锁
export const getAnalysis = (data:any) => {
	let res = getData()
	data = {...res,...data,queStatus:2 }
    return Promise.resolve(request({
        url:Api.Analysis,
        method: "POST",
        data
    }))
}
