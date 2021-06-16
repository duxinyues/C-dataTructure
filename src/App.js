/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-06-09 23:06:18
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-06-16 23:55:14
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