"use strict";

/*
|--------------------------------------------------------------------------
| Sale Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Env = use("Env");

const prefixApiV1 = Env.get("PREFIX_API_V1", "api/v1");

Route.group(() => {
  Route.post("/search", "SaleController.search")
    .validator("Account/Sale/Search")
    .as("search");
})
  .prefix(`${prefixApiV1}/account/sale`)
  .namespace("Account")
  .middleware(["auth:jwt", "information"])
  .as("account.sale");
