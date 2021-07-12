import React from "react";
import AllComponent from "../components/allComponent"
import RouteWrapper from "./routerWrapper"
import { menus } from "../config/menus";
import {checkLogin}  from "../utils/index"
const { Route, Redirect, Switch, withRouter } = require("react-router-dom")
function ContentRouter(props) {
    console.log(props)
    const { auth } = props;
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
    return <Switch>
        {
            menus.map((key) => {
                console.log(key)
                const Component = key.component && AllComponent[key.component];
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

export default ContentRouter