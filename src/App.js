/**
 * Main App
 */
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "./lib/reactifyCss";
import App from "./container/App";
import { configureStore } from "./store";
import { verify } from "./actions/AuthActions";

//configureStore().dispatch(verify());

const MainApp = () => (
  <Provider store={configureStore()}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Router>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </MuiPickersUtilsProvider>
  </Provider>
);

export default MainApp;
