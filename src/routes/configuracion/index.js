/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import {
  AsyncEmpresaConfiguracionComponent,
  AsyncSucursalConfiguracionComponent,
  AsyncAreaConfiguracionComponent,
  AsyncPlanesConfiguracionComponent,
  AsyncLessonsConfiguracionComponent,
  AsyncServicesConfiguracionComponent,
  AsyncSchedulesConfiguracionComponent,
  AsyncScreensConfiguracionComponent,
  AsyncDepartamentsConfiguracionComponent,
  AsyncPositionsConfiguracionComponent,
  AsyncStoreConfiguracionComponent,
  AsyncPackagesConfiguracionComponent,
  AsyncDiscountsConfiguracionComponent,
  AsyncTypeClientConfiguracionComponent,
  AsyncRewardsComponent,
  AsyncSettingBillsConfiguracionComponent,
  AsyncExchangesConfiguracionComponent,
  AsyncProviderComponent,
} from "Components/AsyncComponent/AsyncComponent";

const Dashboard = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/business`} />
      <Route
        path={`${match.url}/business`}
        component={AsyncEmpresaConfiguracionComponent}
      />
      <Route
        path={`${match.url}/branchoffices`}
        component={AsyncSucursalConfiguracionComponent}
      />
      <Route
        path={`${match.url}/areas`}
        component={AsyncAreaConfiguracionComponent}
      />
      <Route
        path={`${match.url}/planes`}
        component={AsyncPlanesConfiguracionComponent}
      />
      <Route
        path={`${match.url}/lessons`}
        component={AsyncLessonsConfiguracionComponent}
      />
      <Route
        path={`${match.url}/services`}
        component={AsyncServicesConfiguracionComponent}
      />
      <Route
        path={`${match.url}/schedules`}
        component={AsyncSchedulesConfiguracionComponent}
      />
      <Route
        path={`${match.url}/screens`}
        component={AsyncScreensConfiguracionComponent}
      />
      <Route
        path={`${match.url}/departaments`}
        component={AsyncDepartamentsConfiguracionComponent}
      />
      <Route
        path={`${match.url}/positions`}
        component={AsyncPositionsConfiguracionComponent}
      />
      <Route
        path={`${match.url}/store`}
        component={AsyncStoreConfiguracionComponent}
      />
      <Route
        path={`${match.url}/packages`}
        component={AsyncPackagesConfiguracionComponent}
      />
      <Route
        path={`${match.url}/discounts`}
        component={AsyncDiscountsConfiguracionComponent}
      />
      <Route
        path={`${match.url}/typeclient`}
        component={AsyncTypeClientConfiguracionComponent}
      />
      <Route
        path={`${match.url}/setting_bills`}
        component={AsyncSettingBillsConfiguracionComponent}
      />
      <Route
        path={`${match.url}/exchanges`}
        component={AsyncExchangesConfiguracionComponent}
      />
      <Route
        path={`${match.url}/rewards`}
        component={AsyncRewardsComponent}
      />
      <Route
        path={`${match.url}/provider`}
        component={AsyncProviderComponent}
      />
    </Switch>
  </div>
);

export default Dashboard;
