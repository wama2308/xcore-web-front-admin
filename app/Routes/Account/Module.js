'use strict'

/*
|--------------------------------------------------------------------------
| Module Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ModuleController.index')
    .as('index')

  Route.get('/:_id', 'ModuleController.show')
    .as('show')

}).prefix(`${prefixApiV1}/account/module`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.module')