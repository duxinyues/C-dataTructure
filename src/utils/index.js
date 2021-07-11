/*
 * @Author: duxinyue
 * @Date: 2021-04-27 17:04:49
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-04-27 17:45:05
 * @FilePath: \app1\src\utils\index.js
 */

import queryString from 'query-string';
/**
 * 获取URL参数
 */
export function parseQuery() {
    return queryString.parseUrl(window.location.href).query;
}

/**
 * 校验是否登录
 * @param permits
 */
export const checkLogin = (permits) =>
    (process.env.NODE_ENV === 'production' && !!permits) || process.env.NODE_ENV === 'development';
