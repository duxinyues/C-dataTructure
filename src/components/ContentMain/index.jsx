import React, { Component } from 'react';
import { Switch, withRouter, Route, Redirect } from 'react-router-dom';
import PrivateRoute from '../../router/PrivateRoute';
import { routes } from '../../router/route';
import NoFind from '../../views/noFind';
import './index.css';
class ContentMain extends Component {
    render() {
        return (
            <div className="routeWrap">
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/dataCount" push />} />
                    {
                        routes.map((item,key) => {
                            return (
                                item.path ? <PrivateRoute path={item.path} exact component={item.component} /> : <Route key={key} component={NoFind} />
                            )
                        })
                    }
                    <Redirect to="/404" push />
                </Switch>
            </div>
        )
    }
}
export default withRouter(ContentMain);