'use strict'

/*
|--------------------------------------------------------------------------
| ForeignExchange Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ForeignExchangeController.index')
    .as('index')

  Route.get('/disabled', 'ForeignExchangeController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'ForeignExchangeController.show')
    .as('show')

  Route.post('/store', 'ForeignExchangeController.store')
    .validator('Account/ForeignExchange/Store')
    .as('store')

  Route.put('/update/:_id', 'ForeignExchangeController.update')
    .validator('Account/ForeignExchange/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ForeignExchangeController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/foreignExchange`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.foreignExchange')
