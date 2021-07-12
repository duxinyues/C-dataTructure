import './App.css';

// import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import NotFound from './components/notFound';
import App from './views/baseLayout/index';
const { HashRouter, Route, Switch, Redirect } = require('react-router-dom')
const Page = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />
      <Route path="/app" component={App} />
      {/* <Route path="/404" component={NotFound} />
            <Route component={NotFound} /> */}
    </Switch>
  </HashRouter>
);


export default Page;
