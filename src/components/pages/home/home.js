/*
 * @Author: duxinyue
 * @Date: 2021-04-27 17:44:40
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 15:27:25
 * @FilePath: \app1\src\components\pages\home\home.js
 */
import  React, { useEffect } from "react"
import  {connect}  from  "react-redux"
import { withRouter } from "react-router-dom";
import {fetchPost}  from "../../../actions/actions"
function Home(props){
    console.log(props)
    useEffect(()=>{
        props.fetchPost()
    },[])
    return <div>首页</div>
}

const  mapStateToProps=(state)=>{
    return {
        homeData:state.posts
    }
}
export default connect(mapStateToProps,{fetchPost})(withRouter(Home)) 