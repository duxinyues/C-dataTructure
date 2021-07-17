/*
 * @Author       : duxinyue
 * @Date         : 2021-04-27 15:10:25
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @LastEditTime: 2021-07-17 21:52:21
 * @FilePath: \works_space\src\Page.js
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