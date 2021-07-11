/*
 * @Author       : duxinyue
 * @Date         : 2021-04-27 16:36:08
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 15:21:50
 * @FilePath: \app1\src\config\route.js
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
        if (!checkLogin(permits)) {
            // 线上环境判断是否登录
            return <Redirect to={'/login'} />;
        }
        return permit ? requireAuth(permit, component) : component;
    };
    return  <Switch>
    {
        menus.map((key)=>{
            console.log(key)
            const Component = key.component && AllComponents[key.component];
            return (
                <Route
                    key={key.route || key.key}
                    exact
                    path={key.route || key.key}
                    render={(props) => {
                        // 重新包装组件
                        const wrapper = (
                            <RouteWrapper {...{ ...props, Comp: Component, route: key }} />
                        );
                        return key.login ? wrapper : requireLogin(wrapper, key.requireAuth);
                    }}
                />
            );
        })
    }
    <Route render={() => <Redirect to="/404" />} />
</Switch>
}


export  default withRouter(ContentRouter) 