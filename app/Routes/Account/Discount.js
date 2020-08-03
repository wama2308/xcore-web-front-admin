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

  Route.get('/', 'DiscountController.index')
    .as('index')

  Route.get('/disabled', 'DiscountController.indexDisabled')
    .as('indexDisabled')

  Route.get('/is-all', 'DiscountController.isAll')
    .as('isAlls')

  Route.get('/select', 'DiscountController.select')
    .as('select')
  
  Route.post('/store', 'DiscountController.store')
    .validator('Account/Discount/Store')
    .as('store')

  Route.get('/:_id', 'DiscountController.show')
    .as('show')

  Route.put('/update/:_id', 'DiscountController.update')
    .validator('Account/Discount/Update')
    .as('update')

  Route.put('/change-status/:_id', 'DiscountController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/discounts`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.discounts')
