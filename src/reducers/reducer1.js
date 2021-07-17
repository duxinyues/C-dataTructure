/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-05-19 12:24:44
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 12:33:41
 * @FilePath: \app1\src\reducers\reducer1.js
 * @Description: 
 */
// 引入dispatch的type
import {
    FETCH_POST
} from "../actions/actions";
// reducer的作用是返回一个新的状态
const initialState = {
    // 存储自己想要的状态
    item: [], // 访问当前文件中时定义一个初始状态
}

/**
 *  reducer是一个纯函数，接受旧的state，返回一个state
 * @param {*} state 
 * @param {*} action 
 * @returns 
 */
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_POST:
            return {
                ...state,
                item: action.payload
            }
            default:
                return state
    }
}