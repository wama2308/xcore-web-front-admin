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

  Route.get('/', 'AreaController.index')
    .as('index')

  Route.get('/disabled', 'AreaController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'AreaController.select')
    .as('select')

  Route.post('/store', 'AreaController.store')
    .validator('Account/Area/Store')
    .as('store')

  Route.get('/:_id', 'AreaController.show')
    .as('show')

  Route.put('/update/:_id', 'AreaController.update')
    .validator('Account/Area/Update')
    .as('update')

  Route.put('/change-status/:_id', 'AreaController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/areas`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.areas')
