/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-16 22:00:17
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-23 18:54:24
 * @FilePath: \cloud-admin\src\actons\type.js
 * @Description: 定义redux的状态变量
 */
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT"; // 退出登录
export const GET_MENUS = "GET_MENUS";
export const USER_INFO = "USER_INFO";
export const SAVE_ORDER = "SAVE_ORDER"; // 保存出货单选中的订单
export const SAVE_SELECTDATA = "SAVE_SELECTDATA"; //保存选中的数据
export const OUT_STOCK_ORDER_BARCODE = "OUT_STOCK_ORDER_BARCODE"; // 出货单的条码
export const CREATE_ORDER = "CREATE_ORDER"; //  创建订单
export const CREATE_ORDER_PARAMS = "CREATE_ORDER_PARAMS"; // 订单参数
export const CLEAR_ORDER_PARAMS = "CLEAR_ORDER_PARAMS"; // 清空订单参数；