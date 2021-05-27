import {
    LOGIN,
    LOGOUT,
    GET_MENUS
} from "./type";
import { message } from "antd"
import { requestUrl } from "../utils/config";
// 登录
export const login = (params) => dispatch => {
    fetch(requestUrl + `/api-uaa/oauth/token?username=${params.username}&password=${params.password}&grant_type=password&scope=app&client_id=webApp&client_secret=webApp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                type:GET_MENUS,
                payload:res.data.menus
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