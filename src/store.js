/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-05-19 12:38:28
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 12:49:39
 * @FilePath: \app1\src\store.js
 * @Description: 
 */
import {
    createStore,
    applyMiddleware,
    compose
} from "redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers/index"

const initialState = {};

const middleware = [thunk];

const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))


export default store