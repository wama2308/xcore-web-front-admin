/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from "react";
import Loadable from "react-loadable";

// rct page loader
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";


//CATEGORIES
const AsyncCategoriesComponent = Loadable({
  loader: () => import("Routes/configuracion/Categories"),
  loading: () => <RctPageLoader />,
});



const AsyncPaginaInicialComponent = Loadable({
  loader: () => import("Routes/pagina-inicial"),
  loading: () => <RctPageLoader />,
});

// agency dashboard
const AsyncSaasDashboardComponent = Loadable({
  loader: () => import("Routes/dashboard/saas"),
  loading: () => <RctPageLoader />,
});

// agency dashboard
const AsyncAgencyDashboardComponent = Loadable({
  loader: () => import("Routes/dashboard/agency"),
  loading: () => <RctPageLoader />,
});

// boxed dashboard
const AsyncNewsDashboardComponent = Loadable({
  loader: () => import("Routes/dashboard/news"),
  loading: () => <RctPageLoader />,
});

/*---------------- Session ------------------*/

// Session Login
const AsyncSessionLoginComponent = Loadable({
  loader: () => import("Routes/session/login"),
  loading: () => <RctPageLoader />,
});

// Session Register
const AsyncSessionRegisterComponent = Loadable({
  loader: () => import("Routes/session/register"),
  loading: () => <RctPageLoader />,
});

// Session Lock Screen
const AsyncSessionLockScreenComponent = Loadable({
  loader: () => import("Routes/session/lock-screen"),
  loading: () => <RctPageLoader />,
});

// Session Forgot Password
const AsyncSessionForgotPasswordComponent = Loadable({
  loader: () => import("Routes/session/forgot-password"),
  loading: () => <RctPageLoader />,
});

// Session Page 404
const AsyncSessionPage404Component = Loadable({
  loader: () => import("Routes/session/404"),
  loading: () => <RctPageLoader />,
});

// Session Page 404
const AsyncSessionPage500Component = Loadable({
  loader: () => import("Routes/session/500"),
  loading: () => <RctPageLoader />,
});

// shop list
const AsyncShoplistComponent = Loadable({
  loader: () => import("Routes/sales/shop-list"),
  loading: () => <RctPageLoader />,
});

// shop grid
const AsyncShopGridComponent = Loadable({
  loader: () => import("Routes/sales/shop-grid"),
  loading: () => <RctPageLoader />,
});

// shop
const AsyncShopComponent = Loadable({
  loader: () => import("Routes/sales/point-of-sale"),
  loading: () => <RctPageLoader />,
});

// selectCustomer
const AsyncselectCustomerComponent = Loadable({
  loader: () => import("Routes/sales/select-customer"),
  loading: () => <RctPageLoader />,
});

// invoice
const AsyncInvoiceComponent = Loadable({
  loader: () => import("Routes/sales/invoice"),
  loading: () => <RctPageLoader />,
});

export {  
  AsyncPaginaInicialComponent,
  AsyncSessionLoginComponent,
  AsyncSessionRegisterComponent,
  AsyncSessionLockScreenComponent,
  AsyncSessionForgotPasswordComponent,
  AsyncSessionPage404Component,
  AsyncSessionPage500Component,
  AsyncSaasDashboardComponent,
  AsyncAgencyDashboardComponent,
  AsyncNewsDashboardComponent,  
  AsyncShoplistComponent,
  AsyncShopGridComponent,
  AsyncShopComponent,
  AsyncselectCustomerComponent,    
  AsyncInvoiceComponent,

  AsyncCategoriesComponent
};
