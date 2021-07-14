
import './App.css';


const { HashRouter, Route, Switch, Redirect } = require('react-router-dom')
const Page = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />
      {/* <Route path="/app" component={App} />
      <Route path="/404" component={NotFound} /> */}
    </Switch>
  </HashRouter>
);


export default Page;
