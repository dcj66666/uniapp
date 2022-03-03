import request from '@/api/request'

enum Api {
	 ChooseSubject= '/stu/choose/subject',
	 Register= '/stu/register',
	 Login= '/stu/login',
	 HomeIndex= '/exercise/home',
	 Question= '/stu/ids/questions',
	 countNum = `/exercise/sign/count/`
	 }

// export const loginApi = (params: type.UserLoginReqVO, config = {}) => http.post<any>(Api.Login, params, config)
// export const checkName = (params) => defHttp.post<any>({ url: Api.checkName, params });

// 保存选择科目
export const chooseSubject = (data:String) => {
    return Promise.resolve(request({
        url:Api.ChooseSubject,
        method: "POST",
        data
    }))
}
// 授权
export const getRegister = (data:String) => {
    return Promise.resolve(request({
        url:Api.Register,
        method: "POST",
        data
    }))
}
// 登录
export const getLogin = (data:String) => {
    return Promise.resolve(request({
        url:Api.Login,
        method: "POST",
        data
    }))
}

// 登录首页
export const getHomeIndex = () => {
    return Promise.resolve(request({
        url:Api.HomeIndex,
        method: "GET"
    }))
}
  // 根据试题ID集合查询相关试题
  export const getQuestion = (data:String) => {
      return Promise.resolve(request({
          url:Api.Question,
          method: "POST",
          data
      }))
  }
  // 根据试题ID集合查询相关试题
  export const getCountNumber = (data:string) => {
      return Promise.resolve(request({
          url:Api.countNum+data,
          method: "GET"
      }))
  }