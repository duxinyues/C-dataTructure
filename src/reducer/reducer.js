//引入dispatch的type类型
import { LOGIN, LOGOUT, USER_INFO } from "../actons/type"

//reducer的作用就是返回一个新的状态
const initialState = {
    //存储自己想要的状态
    tokenInfor: {}       //访问当前文件中的时候定义一个初始状态(数据)
}

/**
 * reducer是一个纯函数，接收旧的state和action，返回新的state
 * @param {*} state 
 * @param {*} action 
 */
// 登录
export function loginReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                tokenInfor: action.payload
            }
        default:
            return state
    }
}

// 退出登录
export function logoutReducer(state = initialState, action) {
    switch (action.type) {
        case LOGOUT:
            return {
                ...state,
                tokenInfor: {}
            }
        default:
            return state
    }
}

const userDataState = { userData: {} }
export function userInfoReducer(state = userDataState, action) {
    switch (action.type) {
        case USER_INFO:
            return {
                ...state,
                userData: action.userData
            }
        default:
            return state
    }
}