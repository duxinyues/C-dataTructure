/*
 * @Author       : duxinyue
 * @Date         : 2021-04-27 15:10:25
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-25 23:35:18
 * @FilePath: \app1\src\Page.js
 */
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/notFound';
import App from './App';

 const Page= () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />
            <Route path="/app" component={App} />
            {/* <Route path="/404" component={NotFound} />
            <Route component={NotFound} /> */}
        </Switch>
    </Router>
);

export default Page