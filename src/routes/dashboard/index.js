/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
   AsyncSaasDashboardComponent,
   AsyncAgencyDashboardComponent,
   AsyncNewsDashboardComponent
} from 'Components/AsyncComponent/AsyncComponent';

const Dashboard = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/ecommerce`} />
         <Route path={`${match.url}/saas`} component={AsyncSaasDashboardComponent} />
         <Route path={`${match.url}/agency`} component={AsyncAgencyDashboardComponent} />
         <Route path={`${match.url}/news`} component={AsyncNewsDashboardComponent} />
      </Switch>
   </div>
);

export default Dashboard;
