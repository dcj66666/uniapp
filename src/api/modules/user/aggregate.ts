// 集合：错题&收藏
import request from '@/api/request'

let commonParams={
	subjectId : uni.getStorageSync('subjectId'),
	projectId : uni.getStorageSync('projectId'),
	subjectName : uni.getStorageSync('subjectName'),
	projectName : uni.getStorageSync('projectName')
}
enum Api {
	 Wrong='/stu/wrong/questions',
	 AddWrong = '/stu/add/wrong',
   RemoveWrong = '/stu/delete/wrong',
	
	 Favorite = '/stu/favorite/questions',
   AddFavorite ='/stu/add/favorite',
   RemoveFavorite = '/stu/delete/favorite', 
}
// 错题首页
export const getWrongList = () => {
    return Promise.resolve(request({
        url:Api.Wrong,
        method: "GET"
    }))
}
// 新增错题
export const addWrong = (data:any) => {
    return Promise.resolve(request({
        url:Api.AddWrong,
        method: "POST",
        data
    }))
}
// 删除错题
export const removeWrong = (data:any) => {
    return Promise.resolve(request({
        url:Api.RemoveWrong,
        method: "POST",
        data
    }))
}

// 收藏首页
export const getFavoriteList = () => {
    return Promise.resolve(request({
        url:Api.Favorite,
        method: "GET"
    }))
}
// 新增收藏
export const addFavorite = (data:any) => {
	data = {...commonParams,...data }
    return Promise.resolve(request({
        url:Api.AddFavorite,
        method: "POST",
        data
    }))
}
// 删除收藏
export const removeFavorite = (data:any) => {
	data = {...commonParams,...data }
    return Promise.resolve(request({
        url:Api.RemoveFavorite,
        method: "POST",
        data
    }))
}