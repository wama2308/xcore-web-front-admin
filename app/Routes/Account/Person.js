"use strict";

/*
|--------------------------------------------------------------------------
| Person Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Env = use("Env");

const prefixApiV1 = Env.get("PREFIX_API_V1", "api/v1");

Route.group(() => {
  Route.get("/", "PersonController.index").as("index");

  Route.get("/disabled", "PersonController.indexDisabled").as("indexDisabled");

  Route.post("/search", "PersonController.search")
    .validator("Account/Person/Search")
    .as("search");

  Route.get("/:_id", "PersonController.show").as("show");

  Route.post("/store", "PersonController.store")
    .validator("Account/Person/Store")
    .as("store");

  Route.put("/update/:_id", "PersonController.update")
    .validator("Account/Person/Update")
    .as("update");

  Route.put("/change-status/:_id", "PersonController.changeStatus").as(
    "changeStatus"
  );
})
  .prefix(`${prefixApiV1}/account/person`)
  .namespace("Account")
  .middleware(["auth:jwt", "information"])
  .as("account.person");
