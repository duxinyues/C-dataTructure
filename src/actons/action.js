/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-17 22:53:41
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-27 21:00:50
 * @FilePath: \cloud-admin\src\actons\action.js
 * @Description: 
 */
import {
    LOGIN,
    LOGOUT,
    GET_MENUS,
    SAVE_ORDER,
    SAVE_SELECTDATA,
    OUT_STOCK_ORDER_BARCODE,
    CREATE_ORDER,
    CREATE_ORDER_PARAMS,
    CLEAR_ORDER_PARAMS
} from "./type";
import {
    message
} from "antd"
import {
    requestUrl
} from "../utils/config";
// 登录
export const login = (params) => dispatch => {
    fetch(requestUrl + `/api-uaa/oauth/token?username=${params.username}&password=${params.password}&grant_type=password&scope=app&client_id=webApp&client_secret=webApp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((res) => {
        return res.json()
    }).then((res) => {
        console.log(res)
        if (res.code == 200) {
            dispatch({
                type: LOGIN,
                payload: res.data
            });
            getMenus()
            return;
        }
        message.error("登录失败请重新登录！")
    }).catch((err) => console.log(err))
}
const getMenus = () => dispatch => {
    fetch(requestUrl + "/api-user/user/findById?id=1", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    }).then(res => {
        return res.json()
    }).then((res) => {
        console.log("menus", res)
        if (res.code == 200) {
            dispatch({
                type: GET_MENUS,
                payload: res.data.menus
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}
// 退出登录
export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
        payload: {}
    })
}
export const saveOrderData = (value) => (dispatch) => {
    dispatch({
        type: SAVE_ORDER,
        payload: value
    })
}
export const saveSelectData = (value) => (dispatch) => {
    dispatch({
        type: SAVE_SELECTDATA,
        payload: value
    })
}
// 
export const getOutStockOrderBarCode = (outId, orderId) => (dispatch) => {
    fetch(requestUrl + "/api-stock/fabricStockIo/findOutBarcodeByOrderId?id=" + outId + "&orderId=" + orderId, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then(res => { return res.json() })
        .then((res) => {
            console.log(res)
            dispatch({
                type: OUT_STOCK_ORDER_BARCODE,
                payload: res.data
            })
        })
}


// 订单参数
export const createOrderParams = (value) => (dispatch) => {
    dispatch({
        type: CREATE_ORDER_PARAMS,
        payload: value
    })
}
// 清空订单参数
export const clearOrderParams = (value) => (dispatch) => {
    dispatch({
        type: CLEAR_ORDER_PARAMS,
        payload: value
    })
}
/**
 * 创建、修改订单
 * @param {*} params 
 * @returns 
 */
export const createOrder = (params) => (dispatch) => {
    if (!params.customerId) {
        message.error("请选择客户！");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.fabricType) {
        message.error("请选择布类！");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.inches || !params.needles) {
        message.error("请先设置针寸！");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.type) {
        message.error("请设置类型！");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.customerBillCode) {
        message.error("请输入合同号！");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.orderYarnInfos || params.orderYarnInfos.length == 0) {
        message.error("必须添加用料信息");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.orderLooms || params.orderLooms.length == 0) {
        message.error("必须添加机台信息");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    if (!params.weight) {
        message.error("请输入订单");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    const yarnInfo = params.orderYarnInfos.some((item) => (item.yarnName == ""));
    if (yarnInfo) {
        message.error("请完善用料信息");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }

    const loomEmpty = params.orderLooms.some((item) => item.loomCode == "");
    if (loomEmpty) {
        message.error("请完善机台信息");
        dispatch({
            type: CREATE_ORDER,
            payload: {
                code: 600
            }
        })
        return;
    }
    // 删除多余的key值
    params.orderYarnInfos.map((item) => {
        delete item.key;
    })
    // 删除多余的key、loom
    params.orderLooms.map((item) => {
        delete item.loom;
        delete item.key;
    });
    fetch(requestUrl + "/api-production/order/saveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            console.log(res)
            if (res.code === 200) {
                message.success("订单创建成功！")
                dispatch({
                    type: CREATE_ORDER,
                    payload: res
                })
            } else {
                message.error("创建失败！")
            }
        })
}

