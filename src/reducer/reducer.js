/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-17 22:53:41
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-29 11:23:10
 * @FilePath: \cloud-admin\src\reducer\reducer.js
 * @Description: 
 * 
 */
//引入dispatch的type类型
import {
    LOGIN,
    LOGOUT,
    USER_INFO,
    SAVE_ORDER,
    SAVE_SELECTDATA,
    OUT_STOCK_ORDER_BARCODE,
    CREATE_ORDER_PARAMS,
    CLEAR_ORDER_PARAMS,
    CREATE_ORDER,
    ADDRESS_INFO
} from "../actons/type"

//reducer的作用就是返回一个新的状态
const initialState = {
    //存储自己想要的状态
    tokenInfor: {} //访问当前文件中的时候定义一个初始状态(数据)
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

const userDataState = {
    userData: {}
}
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

export function addressInfoReducer(state = [], action) {
    switch (action.type) {
        case ADDRESS_INFO:
            return {
                ...state,
                address: action.payload
            }
        default:
            return state
    }
}

/**
 * 创建出库单所选的订单
 */
const selectOrderData = {
    selectOrderData: []
};
export function selectOrderDataReducer(state = selectOrderData, action) {
    switch (action.type) {
        case SAVE_ORDER:
            return {
                ...state,
                selectOrderData: action.payload
            }
        default:
            return state
    }
}
/**
 * 创建出库单所选的条码
 */
const selectData = {
    selectData: {}
};
export function selectDataReducer(state = selectData, action) {
    switch (action.type) {
        case SAVE_SELECTDATA:
            return {
                ...state,
                selectData: action.payload
            }
        default:
            return state
    }
}

/**
 * 出货单的条码列表
 */
export function outStockOrderBarCode_listReducer(state = [], action) {
    switch (action.type) {
        case OUT_STOCK_ORDER_BARCODE:
            return {
                ...state,
                outStockOrderBarCode: action.payload
            }
        default:
            return state
    }
}

// 订单参数

export const createOrderParam = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER_PARAMS:
            return {
                ...state,
                orderParams: { ...action.payload }
            }
        case CLEAR_ORDER_PARAMS:
            console.log("清空参数")
            return state
        default:
            return state
    }
}

export const createOrderState = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER:
            return {
                ...state,
                orderState: action.payload
            }
        default:
            return state
    }
}