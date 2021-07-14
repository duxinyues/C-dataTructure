/*
 * @Author: duxinyue
 * @Date: 2021-07-12 23:56:44
 * @LastEditTime: 2021-07-14 23:51:59
 * @LastEditors: duxinyue
 * @Description: 
 * @FilePath: \works_space\src\store.ts
 * 
 */
import {
    createStore,
    applyMiddleware,
    compose
} from "redux";
import thunk from "redux-thunk";

// import rootReducer from "./reducers/index"

const initialState = {};

const middleware = [thunk];

const store = ""
// createStore(rootReducer, initialState, compose(
//     applyMiddleware(...middleware),
//     // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// ))


export default store