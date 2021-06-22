/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-22 17:16:01
 * @LastEditTime: 2021-06-22 17:36:28
 * @LastEditors: 1638877065@qq.com
 * @Description: 工具类函数
 * @FilePath: \cloud-admin\src\utils\utils.js
 *
 */
import { message } from "antd";

export const verify_value = (value) => {
    if (typeof parseFloat(value) === "number" && parseFloat(value)) {
        return true
    }
    message.error("只能输入数字！");
    return false;
}