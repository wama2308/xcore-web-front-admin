/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncPurchasesComponent,    

} from 'Components/AsyncComponent/AsyncComponent';

const Dashboard = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/purchases`} />
            <Route path={`${match.url}/purchases`} component={AsyncPurchasesComponent} />            

        </Switch>
    </div>
);

export default Dashboard;
