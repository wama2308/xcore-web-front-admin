'use strict'

/*
|--------------------------------------------------------------------------
| Product Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ProductController.index')
    .as('index')

  Route.get('/disabled', 'ProductController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'ProductController.select')
    .as('select')

  Route.get('/:_id', 'ProductController.show')
    .as('show')

  Route.post('/store', 'ProductController.store')
    .validator('Account/Product/Store')
    .as('store')

  Route.put('/update/:_id', 'ProductController.update')
    .validator('Account/Product/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ProductController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/product`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.product')