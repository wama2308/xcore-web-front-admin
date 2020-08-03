'use strict'

/*
|--------------------------------------------------------------------------
| Reward Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'RewardController.index')
    .as('index')

  Route.get('/disabled', 'RewardController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'RewardController.show')
    .as('show')

  Route.post('/store', 'RewardController.store')
    .validator('Account/Reward/Store')
    .as('store')

  Route.put('/update/:_id', 'RewardController.update')
    .validator('Account/Reward/Update')
    .as('update')

  Route.put('/change-status/:_id', 'RewardController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/reward`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.reward')