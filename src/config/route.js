/*
 * @Author       : duxinyue
 * @Date         : 2021-04-27 16:36:08
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @LastEditTime: 2021-07-17 21:49:45
 * @FilePath: \works_space\src\config\route.js
 */

import React  from "react";
import { Route, Redirect, Switch,withRouter } from 'react-router-dom';
import RouteWrapper  from "./routeWrapper";
import AllComponents from "../components/AllComponents"
import {menus} from "./menu"
import {checkLogin  }  from "../utils/index"
function ContentRouter(props){
 
    const {auth} = props;
    const getPermits = () => {
        return auth ? auth.permissions : null;
    };
    const requireAuth = (permit, component) => {
        const permits = getPermits();
        if (!permits || !permits.includes(permit)) return <Redirect to={'404'} />;
        return component;
    };
    const requireLogin = (component, permit) => {
        const permits = getPermits();
        // if (!checkLogin(permits)) {
        //     // 线上环境判断是否登录
        //     return <Redirect to={'/login'} />;
        // }
        console.log(component)
        console.log(permit)
        return permit ? requireAuth(permit, component) : component;
    };
    return  <Switch>
    {
        menus.map((key)=>{
            console.log(key)
            return (
                <Route
                    key={key.key}
                    path={key.key}
                  component={AllComponents[key.component]}
                />
            );
        })
    }
    <Route render={() => <Redirect to="/404" />} />
</Switch>
}


export  default withRouter(ContentRouter) 