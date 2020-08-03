'use strict'

/*
|--------------------------------------------------------------------------
| Store Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'StoreController.index')
    .as('index')

  Route.get('/disabled', 'StoreController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'StoreController.show')
    .as('show')

  Route.post('/store', 'StoreController.store')
    .validator('Account/Store/Store')
    .as('store')

  Route.put('/update/:_id', 'StoreController.update')
    .validator('Account/Store/Update')
    .as('update')

  Route.put('/change-status/:_id', 'StoreController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/store`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.store')
