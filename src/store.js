/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-17 22:53:41
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-23 18:53:58
 * @FilePath: \cloud-admin\src\store.js
 * @Description: 
 */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {
    loginReducer,
    userInfoReducer,
    selectOrderDataReducer,
    selectDataReducer,
    outStockOrderBarCode_listReducer,
    createOrderParam
} from "./reducer/reducer";

const reducers = combineReducers({
    loginReducer,
    userInfoReducer,
    selectOrderDataReducer,
    selectDataReducer,
    outStockOrderBarCode_listReducer,
    createOrderParam
})


const initialState = {};
const middleware = [thunk];
const store = createStore(
    reducers,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window .__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
    )
);

export default store
