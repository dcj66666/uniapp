// 每日一练所有接口
import request from '@/api/request'

enum Api {
	 ChangeProject= '/exercise/chang/project',
	 ChangeUnits= '/exercise/chang/units',
	 Analytical= '/exercise/query/all/questions',
	 AnswerCard= '/exercise/query/answer/card',
	 Report= '/exercise/query/report',
	 UnitsList= '/exercise/query/units',
	 ShareExercise= '/exercise/share',
	 SubmitAnswer= '/exercise/submit/answer',
}

// 改选项目
export const changeProject = (data:any) => {
    return Promise.resolve(request({
        url:Api.ChangeProject,
        method: "POST",
        data
    }))
}
// 改选科目后的每日一练列表
export const changeUnits = (data:any) => {
    return Promise.resolve(request({
        url:Api.ChangeUnits,
        method: "POST",
        data
    }))
}

// 查看解析题集合
export const getAnalytical = (data:any) => {
    return Promise.resolve(request({
        url:Api.Analytical,
        method: "POST",
        data
    }))
}
// 查看答题卡
export const getAnswerCard = (data:any) => {
    return Promise.resolve(request({
        url:Api.AnswerCard,
        method: "POST",
        data
    }))
}
// 查看报告
export const getReport = (data:any) => {
    return Promise.resolve(request({
        url:Api.Report,
        method: "POST",
        data
    }))
}
// 进入每日一练列表
export const getUnitsList = (data:any) => {
    return Promise.resolve(request({
        url:Api.UnitsList,
        method: "POST",
        data
    }))
}

// 分享
export const shareExercise = (data:any) => {
    return Promise.resolve(request({
        url:Api.ShareExercise,
        method: "POST",
        data
    }))
}
// 交卷提交
export const submitAnswer = (data:any) => {
    return Promise.resolve(request({
        url:Api.SubmitAnswer,
        method: "POST",
        data
    }))
}