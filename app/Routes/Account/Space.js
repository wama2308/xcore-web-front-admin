'use strict'

/*
|--------------------------------------------------------------------------
| Space Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'SpaceController.index')
    .as('index')

  Route.get('/disabled', 'SpaceController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'SpaceController.show')
    .as('show')

  Route.post('/store', 'SpaceController.store')
    .validator('Account/Space/Store')
    .as('store')

  Route.put('/update/:_id', 'SpaceController.update')
    .validator('Account/Space/Update')
    .as('update')

  Route.put('/change-status/:_id', 'SpaceController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/space`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.space')