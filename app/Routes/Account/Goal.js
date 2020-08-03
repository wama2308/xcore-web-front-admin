'use strict'

/*
|--------------------------------------------------------------------------
| Goal Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'GoalController.index')
    .as('index')

  Route.get('/disabled', 'GoalController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'GoalController.show')
    .as('show')

  Route.post('/store', 'GoalController.store')
    .validator('Account/Goal/Store')
    .as('store')

  Route.put('/update/:_id', 'GoalController.update')
    .validator('Account/Goal/Update')
    .as('update')

  Route.put('/change-status/:_id', 'GoalController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/goal`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.goal')