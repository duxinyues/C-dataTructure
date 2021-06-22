/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-22 17:16:01
 * @LastEditTime: 2021-06-22 17:36:28
 * @LastEditors: 1638877065@qq.com
 * @Description: 工具类函数
 * @FilePath: \cloud-admin\src\utils\utils.js
 *
 */
import {
    message
} from "antd";

export const verify_value = (value) => {
    if (typeof parseFloat(value) === "number" && parseFloat(value)) {
        return true
    }
    message.error("只能输入数字！");
    return false;
}

/**
 * 
 */
export const arrToObj = (arr) => {
    // 默认对象
    var defaultObj = {};
    // 默认数组
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
        // 数组转为对象，对象的键=数组值， 对象的值=数组值
        obj[arr[i]] = arr[i];
        // 如果是数组，就再次调用自身 (this.arrToObj),递归接着循环
        if (Object.prototype.toString.call(arr[i]) == "[object Array]") {
            arrToObj(arr[i])
            continue;
        } else {
            defaultObj[arr[i]] = arr[i]
        }
    }
    return defaultObj
}