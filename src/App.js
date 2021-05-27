import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './views/login/index';
import Index from './views/index/index';
import PrivateRoute from './router/PrivateRoute';
import NoMatch from './views/noMatch';
import history from './api/history';
import './App.css';
function App() {
  return (
    <Provider store={store}>
      <Router basename="/cloud" history={history}>
        <Switch>
          <Route path="/login" component={Login} exact />
          <PrivateRoute path="/" component={Index} />
          <Route path="/404" component={NoMatch} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    </Provider>
  );
}
export default App;