/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

// rct theme provider
import RctThemeProvider from './RctThemeProvider';

//Horizontal Layout
import HorizontalLayout from './HorizontalLayout';

//Agency Layout
import AgencyLayout from './AgencyLayout';

//Main App
import RctDefaultLayout from './DefaultLayout';

// boxed layout
import RctBoxedLayout from './RctBoxedLayout';

// CRM layout
import CRMLayout from './CRMLayout';

// app signin
import AppSignIn from './SigninFirebase';
import AppSignUp from './SignupFirebase';

// app validate code
import AppRequestCode from './RequestCode';
import AppValidateCode from './ValidateCode';
import AppRegisterUser from './RegisterUser';
import AppForgotPassword from './ForgotPassword';
import AppCodeForgotPassword from './CodeForgotPassword';
import AppChangePassword from './ChangePassword';
// async components
import {
   AsyncSessionLoginComponent,
   AsyncSessionRegisterComponent,
   AsyncSessionLockScreenComponent,
   AsyncSessionForgotPasswordComponent,
   AsyncSessionPage404Component,
   AsyncSessionPage500Component,
} from 'Components/AsyncComponent/AsyncComponent';

import { getTokenInfo, verify } from "../actions/AuthActions";
// import { addDataBaseLocalStore } from "../actions/EcommerceActions";
import { ConfigGeneralFunction, closeDialog } from "../actions/aplicantionActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert } from "../components/Confirm";

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         actionReducer: 0
      };
   }

   componentDidMount() {
      if (localStorage.getItem("token") && this.props.dataGeneral === null && this.state.actionReducer === 0) {
         this.setState({ actionReducer: 1 });
         this.props.ConfigGeneralFunction();
         //this.props.verify();
         //this.props.addDataBaseLocalStore();
      }
   }

   componentWillReceiveProps = props => {
      if (props.dataGeneral === null) {
         this.setState({ actionReducer: 0 });
      }
      if (localStorage.getItem("token") && props.dataGeneral === null && this.state.actionReducer === 0) {
         this.setState({ actionReducer: 1 });
         props.ConfigGeneralFunction();
         //props.addDataBaseLocalStore();   
      }
   }

   existMenuRute(data, url) {
      let menu = null;
      data.map((dato, i) => {
         if (dato.child_routes.find(child => child.path === url)) {
            menu = dato.child_routes.find(child => child.path === url);
         }
      })
      return menu;
   }

   render() {
      //console.log("app authUser ", this.props.authUser)      
      //console.log("dataGeneral ", this.props.dataGeneral)
      //console.log("APP ecommerce ", this.props.ecommerce)
      const token = localStorage.getItem("token")
      const { location, match } = this.props;
      let menuRute;
      if (this.props.dataGeneral) {
         //menuRute = this.existMenuRute(this.props.dataGeneral.dataMenu, location.pathname);
      }

      if (!token && location.pathname === "/forgot/password") {
         return <Route path="/forgot/password" component={AppForgotPassword} />
      } else if (!token && location.pathname === "/code/forgot/password/") {
         return <Route path="/code/forgot/password" component={AppCodeForgotPassword} />
      } else if (!token && location.pathname === "/change/password/") {
         return <Route path="/change/password" component={AppChangePassword} />
      } else if (!token && location.pathname === "/request/code/") {
         return <Route path="/request/code" component={AppRequestCode} />
      } else if (!token && location.pathname === "/validate/code/") {
         return <Route path="/validate/code" component={AppValidateCode} />
      } else if (!token && location.pathname === "/register/user/") {
         return <Route path="/register/user" component={AppRegisterUser} />
      } else if (token && (
         (location.pathname === "/forgot/password") ||
         (location.pathname === "/code/forgot/password/") ||
         (location.pathname === "/change/password/") ||
         (location.pathname === "/request/code/") ||
         (location.pathname === "/validate/code/") ||
         (location.pathname === "/register/user/")
      )
      ) {
         return <Redirect to="/app/dashboard" />;
      } else if (token && location.pathname === "/signin") {
         return <Redirect to="/app/dashboard" />;
      } else if (!token && location.pathname !== "/signin") {
         return <Redirect to="/signin" />;
      } else if (token && location.pathname === "/") {
         return <Redirect to="/app/dashboard" />;
      }
      // else if (token && location.pathname !== "/app/dashboard" && location.pathname !== "/signin" && !menuRute && this.props.dataGeneral) {
      //    return <Redirect to="/app/dashboard" />;         
      // }
      return (
         <RctThemeProvider>
            <Alert {...this.props.alertConfirm} close={this.props.closeDialog} />
            {/* {
               ((this.props.dataGeneral === null && localStorage.getItem("token")) ||
                  (this.props.dataGeneral && this.props.dataGeneral.loading))
               && (
                  <CircularProgress
                     style={{
                        position: " absolute",
                        height: 40,
                        top: "45%",
                        right: "50%",
                        zIndex: 2
                     }}
                  />
               )
            } */}
            <NotificationContainer />
            {/* {
               (this.props.dataGeneral && !this.props.dataGeneral.loading) &&
               <Route
                  path={`${match.url}app`}
                  render={(props) =>
                     token
                        ? <RctDefaultLayout {...props} />
                        : <Redirect
                           to={{
                              pathname: '/signin',
                              state: { from: props.location }
                           }}
                        />}
               />
            } */}

            <Route
               path={`${match.url}app`}
               render={(props) =>
                  token
                     ? <RctDefaultLayout {...props} />
                     : <Redirect
                        to={{
                           pathname: '/signin',
                           state: { from: props.location }
                        }}
                     />}
            />

            <Route path="/horizontal" component={HorizontalLayout} />
            <Route path="/agency" component={AgencyLayout} />
            <Route path="/boxed" component={RctBoxedLayout} />
            <Route path="/dashboard" component={CRMLayout} />
            <Route path="/signin" component={AppSignIn} />
            <Route path="/request/code" component={AppRequestCode} />
            <Route path="/validate/code" component={AppValidateCode} />
            <Route path="/register/user" component={AppRegisterUser} />
            <Route path="/forgot/password" component={AppForgotPassword} />
            <Route path="/code/forgot/password" component={AppCodeForgotPassword} />
            <Route path="/change/password" component={AppChangePassword} />
            <Route path="/session/login" component={AsyncSessionLoginComponent} />
            <Route path="/session/register" component={AsyncSessionRegisterComponent} />
            <Route path="/session/lock-screen" component={AsyncSessionLockScreenComponent} />
            <Route path="/session/forgot-password" component={AsyncSessionForgotPasswordComponent} />
            <Route path="/session/404" component={AsyncSessionPage404Component} />
            <Route path="/session/500" component={AsyncSessionPage500Component} />

         </RctThemeProvider>

      );
   }
}

// map state to props
const mapStateToProps = state => ({
   logged: state.authUser.get("logged"),
   authUser: state.authUser.toJS(),
   dataGeneral: state.general.dataGeneral,
   alertConfirm: state.general.confirm,
   ecommerce: state.ecommerce,
});

const mapDispatchToProps = dispatch => ({
   getTokenInfo: () => dispatch(getTokenInfo()),
   verify: () => dispatch(verify()),
   ConfigGeneralFunction: () => dispatch(ConfigGeneralFunction()),
   closeDialog: () => dispatch(closeDialog()),
   // addDataBaseLocalStore: () => dispatch(addDataBaseLocalStore()),
});

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(App);