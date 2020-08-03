'use strict'

/*
|--------------------------------------------------------------------------
| Billing Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'BillingController.index')
    .as('index')

  Route.get('/disabled', 'BillingController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'BillingController.show')
    .as('show')

  Route.post('/store', 'BillingController.store')
    .validator('Account/Billing/Store')
    .as('store')

  Route.put('/update/:_id', 'BillingController.update')
    .validator('Account/Billing/Update')
    .as('update')

  Route.put('/change-status/:_id', 'BillingController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/billing`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.billing')
