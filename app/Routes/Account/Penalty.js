'use strict'

/*
|--------------------------------------------------------------------------
| Penalty Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'PenaltyController.index')
    .as('index')

  Route.get('/disabled', 'PenaltyController.indexDisabled')
    .as('indexDisabled')

  Route.get('/type-penalties', 'PenaltyController.typePenalties')
  .as('typePenalties')

  Route.get('/:_id', 'PenaltyController.show')
    .as('show')

  Route.post('/store', 'PenaltyController.store')
    .validator('Account/Penalty/Store')
    .as('store')

  Route.put('/update/:_id', 'PenaltyController.update')
    .validator('Account/Penalty/Update')
    .as('update')

  Route.put('/change-status/:_id', 'PenaltyController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/penalty`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.penalty')