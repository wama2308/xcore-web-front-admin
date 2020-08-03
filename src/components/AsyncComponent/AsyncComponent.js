/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from "react";
import Loadable from "react-loadable";

// rct page loader
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";

//purchases
const AsyncPurchasesComponent = Loadable({
  loader: () => import("Routes/management/purchases"),
  loading: () => <RctPageLoader />,
});

//provider
const AsyncProviderComponent = Loadable({
  loader: () => import("Routes/configuracion/provider"),
  loading: () => <RctPageLoader />,
});

//users
const AsyncUsersComponent = Loadable({
  loader: () => import("Routes/users/users"),
  loading: () => <RctPageLoader />,
});

//rols
const AsyncRolsComponent = Loadable({
  loader: () => import("Routes/users/rols"),
  loading: () => <RctPageLoader />,
});

//rewards
const AsyncRewardsComponent = Loadable({
  loader: () => import("Routes/configuracion/rewards"),
  loading: () => <RctPageLoader />,
});

//discounts
const AsyncTypeClientConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/typeclient"),
  loading: () => <RctPageLoader />,
});

//discounts
const AsyncDiscountsConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/discounts"),
  loading: () => <RctPageLoader />,
});

//packages
const AsyncPackagesConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/packages"),
  loading: () => <RctPageLoader />,
});

//store
const AsyncStoreConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/store"),
  loading: () => <RctPageLoader />,
});

//positions
const AsyncPositionsConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/cargos"),
  loading: () => <RctPageLoader />,
});

//departaments
const AsyncDepartamentsConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/departaments"),
  loading: () => <RctPageLoader />,
});

//monitores
const AsyncScreensConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/screens"),
  loading: () => <RctPageLoader />,
});

//horarios
const AsyncSchedulesConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/schedules"),
  loading: () => <RctPageLoader />,
});

//servicios
const AsyncServicesConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/services"),
  loading: () => <RctPageLoader />,
});

//clases
const AsyncLessonsConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/lessons"),
  loading: () => <RctPageLoader />,
});

//planes
const AsyncPlanesConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/planes"),
  loading: () => <RctPageLoader />,
});

//area
const AsyncAreaConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/area"),
  loading: () => <RctPageLoader />,
});

//sucursal
const AsyncSucursalConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/sucursal"),
  loading: () => <RctPageLoader />,
});

//empresa
const AsyncEmpresaConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/empresa"),
  loading: () => <RctPageLoader />,
});

//setting_bills
const AsyncSettingBillsConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/setting_bills"),
  loading: () => <RctPageLoader />,
});

//exchanges
const AsyncExchangesConfiguracionComponent = Loadable({
  loader: () => import("Routes/configuracion/exchanges"),
  loading: () => <RctPageLoader />,
});

//sales - point-of-sale
const AsyncSalesSalesComponent = Loadable({
  loader: () => import("Routes/sales/point-of-sale"),
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

// cart
const AsyncCartComponent = Loadable({
  loader: () => import("Routes/sales/cart"),
  loading: () => <RctPageLoader />,
});

// checkout
const AsyncCheckoutComponent = Loadable({
  loader: () => import("Routes/sales/checkout"),
  loading: () => <RctPageLoader />,
});

// invoice
const AsyncInvoiceComponent = Loadable({
  loader: () => import("Routes/sales/invoice"),
  loading: () => <RctPageLoader />,
});

export {
  AsyncPurchasesComponent,
  AsyncProviderComponent,
  AsyncUsersComponent,
  AsyncRolsComponent,
  AsyncRewardsComponent,
  AsyncTypeClientConfiguracionComponent,
  AsyncDiscountsConfiguracionComponent,
  AsyncPackagesConfiguracionComponent,
  AsyncStoreConfiguracionComponent,
  AsyncDepartamentsConfiguracionComponent,
  AsyncPositionsConfiguracionComponent,
  AsyncScreensConfiguracionComponent,
  AsyncSchedulesConfiguracionComponent,
  AsyncServicesConfiguracionComponent,
  AsyncLessonsConfiguracionComponent,
  AsyncPlanesConfiguracionComponent,
  AsyncAreaConfiguracionComponent,
  AsyncEmpresaConfiguracionComponent,
  AsyncSucursalConfiguracionComponent,
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
  AsyncSettingBillsConfiguracionComponent,
  AsyncSalesSalesComponent,
  AsyncExchangesConfiguracionComponent,
  AsyncShoplistComponent,
  AsyncShopGridComponent,
  AsyncShopComponent,
  AsyncselectCustomerComponent,
  AsyncCartComponent,
  AsyncCheckoutComponent,
  AsyncInvoiceComponent,
};
