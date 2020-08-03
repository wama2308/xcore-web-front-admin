/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import {
  AsyncCategoriesComponent,
  
} from "Components/AsyncComponent/AsyncComponent";

const Dashboard = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/categories`} />
      <Route
        path={`${match.url}/categories`}
        component={AsyncCategoriesComponent}
      />      
    </Switch>
  </div>
);

export default Dashboard;
