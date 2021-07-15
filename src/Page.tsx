/*
 * @Author: yongyuan at <yongyuan253015@gmail.com>
 * @Date: 2021-07-11 18:28:35
 * @LastEditTime: 2021-07-15 22:54:42
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @Description: 
 * @FilePath: \works_space\src\Page.tsx
 * 
 */

import './App.css';
import App from "./App"

const { HashRouter, Route, Switch, Redirect } = require('react-router-dom')
const Page = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />
      <Route path="/app" component={App} />
      {/* <Route path="/404" component={NotFound} /> */}
    </Switch>
  </HashRouter>
);


export default Page;
