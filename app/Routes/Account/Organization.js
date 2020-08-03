'use strict'

/*
|--------------------------------------------------------------------------
| Account Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'OrganizationController.index')
    .as('index')

}).prefix(`${prefixApiV1}/account/organizations`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.organizations')
