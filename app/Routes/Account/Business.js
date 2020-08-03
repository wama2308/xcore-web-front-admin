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

  Route.get('/business', 'BusinessController.index')
    .as('index')

  Route.get('/business/:_id', 'BusinessController.show')
    .as('show')

  Route.put('/business/update/:_id', 'BusinessController.update')
    .validator('Account/BusinessUpdate')
    .as('update')

}).prefix(`${prefixApiV1}/account`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.business')
