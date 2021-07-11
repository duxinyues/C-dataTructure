/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-05-19 12:03:03
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 14:50:29
 * @FilePath: \app1\src\actions\actions.js
 * @Description: 
 */
export const FETCH_POST = "FETCH_POST";
export const fetchPost = () => (dispatch) => {
    fetch("https://my-json-server.typicode.com/duxinyues/duxinyues/posts")
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            dispatch({
                type: FETCH_POST,
                payload: data
            })
        })
}