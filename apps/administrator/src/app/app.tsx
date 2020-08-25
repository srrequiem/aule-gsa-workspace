import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './app.css';
import { Routes } from './constants/Routes';
import { Home, Login, Dashboard, Accounts, ServicesFees } from './routes';
import { withAuthentication } from './hoc/Auth';

export const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path={Routes.HOME} component={Home} />
                <Route exact path={Routes.LOGIN} component={Login} />
                <Route exact path={Routes.DASHBOARD} component={Dashboard} />
                <Route exact path={Routes.ACCOUNTS} component={Accounts} />
                <Route
                    exact
                    path={Routes.SERVICES_FEES}
                    component={ServicesFees}
                />
            </Switch>
        </Router>
    );
};

export default withAuthentication(App);
