/*
 * @Author: yongyuan at <yongyuan253015@gmail.com>
 * @Date: 2021-07-15 23:09:14
 * @LastEditTime: 2021-07-15 23:28:34
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @Description: 路由
 * @FilePath: \works_space\src\routes\routes.tsx
 *
 */
import { menus } from "../config/menux";
import AllComponent from "../components/allComponents";
import RouteWrapper from "./routeWrapper";
const { Route, Redirect, Switch, withRouter } = require("react-router-dom");

function ContentRouter(props: any) {

    const { auth } = props;
    const getPermits = () => {
        return auth ? auth.permissions : null;
    };
    const requireAuth = (permit: any, component: any) => {
        const permits = getPermits();
        if (!permits || !permits.includes(permit)) return <Redirect to={'404'} />;
        return component;
    };
    const requireLogin = (component: any, permit: any) => {
        const permits = getPermits();
        // if (!checkLogin(permits)) {
        //     // 线上环境判断是否登录
        //     return <Redirect to={'/login'} />;
        // }
        return permit ? requireAuth(permit, component) : component;
    };
    return <Switch>
        {
            menus.map((key: any) => {
                console.log(key)
                // const Component = key.component && AllComponent[key.component];
                const Component = ""
                return (
                    <Route
                        key={key.key}
                        exact
                        path={key.key}
                        render={(props: any) => {
                            // 重新包装组件
                            const wrapper = (
                                <RouteWrapper {...{ ...props, Comp: Component, route: key }} />
                            );
                            // 判断是否已经登录
                            // return key.login ? wrapper : requireLogin(wrapper, key.requireAuth);
                            return wrapper
                        }}
                    />
                );
            })
        }
        <Route render={() => <Redirect to="/404" />} />
    </Switch>
}

export default ContentRouter