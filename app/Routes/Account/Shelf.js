'use strict'

/*
|--------------------------------------------------------------------------
| Shelf Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ShelfController.index')
    .as('index')

  Route.get('/disabled', 'ShelfController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id/:store_id', 'ShelfController.show')
    .as('show')

  Route.post('/store/:store_id', 'ShelfController.store')
    .validator('Account/Shelf/Store')
    .as('store')

  Route.put('/update/:_id/:store_id', 'ShelfController.update')
    .validator('Account/Shelf/Update')
    .as('update')

  Route.put('/change-status/:_id/:store_id', 'ShelfController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/shelf`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.shelf')