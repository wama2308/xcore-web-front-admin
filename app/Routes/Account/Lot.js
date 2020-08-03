'use strict'

/*
|--------------------------------------------------------------------------
| Lot Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'LotController.index')
    .as('index')

  Route.get('/disabled', 'LotController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'LotController.show')
    .as('show')

  Route.post('/store', 'LotController.store')
    .validator('Account/Lot/Store')
    .as('store')

  Route.put('/update/:_id', 'LotController.update')
    .validator('Account/Lot/Update')
    .as('update')

  Route.put('/change-status/:_id', 'LotController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/lot`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.lot')