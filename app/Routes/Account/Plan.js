'use strict'

/*
|--------------------------------------------------------------------------
| Plan Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'PlanController.index')
    .as('index')

  Route.get('/disabled', 'PlanController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'PlanController.select')
    .as('select')

  Route.get('/:_id', 'PlanController.show')
    .as('show')

  Route.post('/store', 'PlanController.store')
    .validator('Account/Plan/Store')
    .as('store')

  Route.put('/update/:_id', 'PlanController.update')
    .validator('Account/Plan/Update')
    .as('update')

  Route.put('/change-status/:_id', 'PlanController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/plan`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.plan')
