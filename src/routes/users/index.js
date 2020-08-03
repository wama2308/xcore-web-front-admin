/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncRolsComponent,
    AsyncUsersComponent,

} from 'Components/AsyncComponent/AsyncComponent';

const Dashboard = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/rols`} />
            <Route path={`${match.url}/rols`} component={AsyncRolsComponent} />
            <Route path={`${match.url}/userConfig`} component={AsyncUsersComponent} />

        </Switch>
    </div>
);

export default Dashboard;
