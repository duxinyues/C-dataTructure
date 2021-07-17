/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-05-19 12:24:56
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 12:37:45
 * @FilePath: \app1\src\reducers\index.js
 * @Description: 
 */

// 组合多个reducer函数

import {
    combineReducers
} from "redux";

import postReducer from "./reducer1";

export default combineReducers({
    posts: postReducer
})