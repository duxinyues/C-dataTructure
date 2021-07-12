import './App.css';

import NotFound from './views/notFound';
import App from './views/baseLayout/index';
const { HashRouter, Route, Switch, Redirect } = require('react-router-dom')
const Page = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/home" push />} />
      <Route path="/app" component={App} />
      <Route path="/404" component={NotFound} />
    </Switch>
  </HashRouter>
);


export default Page;
