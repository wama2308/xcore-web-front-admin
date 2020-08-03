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

  // Route.get('/', 'GoodController.index')
  //   .as('index')

  // Route.get('/disabled', 'GoodController.indexDisabled')
  //   .as('indexDisabled')

  Route.get('/select', 'GoodController.select')
    .as('select')
  
  // Route.post('/store', 'GoodController.store')
  //   .validator('Account/Good/Store')
  //   .as('store')

  // Route.get('/:_id', 'GoodController.show')
  //   .as('show')

  // Route.put('/update/:_id', 'GoodController.update')
  //   .validator('Account/Good/Update')
  //   .as('update')

  // Route.put('/change-status/:_id', 'GoodController.changeStatus')
  //   .as('changeStatus')

}).prefix(`${prefixApiV1}/account/goods`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.goods')
