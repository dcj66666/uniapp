import request from '@/api/request'

enum Api {
   SubmitExchange = '/exchange/active/',
   Units = '/exchange/get/units/',
	 Product = '/exchange/list',
	 Questions = '/exchange/query/all/questions',
	 Answer = '/exchange/submit/answer',
}

// 兑换接口
export const submitExchange = (data:any) => {
    return Promise.resolve(request({
        url:Api.SubmitExchange+data,
        method: "GET",
    }))
}
// 学习单元列表
export const getStudyUnits = (data:any) => {
    return Promise.resolve(request({
        url:Api.Units+data,
        method: "GET",
    }))
}
// 兑换产品列表
export const getProductList = () => {
    return Promise.resolve(request({
        url:Api.Product,
        method: "GET"
    }))
}
// 查看题集合
export const getExchangeQuestions = (data:any) => {
    return Promise.resolve(request({
        url:Api.Questions,
        method: "POST",
        data
    }))
}
// 答题卡提交
export const submitUnit = (data:any) => {
    return Promise.resolve(request({
        url:Api.Answer,
        method: "POST",
        data
    }))
}