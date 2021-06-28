/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-06-09 23:06:18
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-28 14:22:43
 * @FilePath: \cloud-admin\src\App.js
 * @Description: 
 */
import { BrowserRouter as Router, HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './views/login/index';
import Index from './views/index/index';
import PrivateRoute from './router/PrivateRoute';
import NoFind from './views/noFind';
import './App.css';
function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        {/* <Router basename="/cloud" history={history}> */}
        <Switch>
          <Route path="/login" component={Login} exact />
          <PrivateRoute path="/" component={Index} />
          <Route component={NoFind} />
        </Switch>
        {/* </Router> */}
      </HashRouter>
    </Provider>
  );
}
export default App;