'use strict'

/*
|--------------------------------------------------------------------------
| Screen Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ScreenController.index')
    .as('index')

  Route.get('/disabled', 'ScreenController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select-screen', 'ScreenController.selectScreen')
    .as('selectScreen')

  Route.get('/:_id', 'ScreenController.show')
    .as('show')

  Route.post('/store', 'ScreenController.store')
    .validator('Account/Screen/Store')
    .as('store')

  Route.put('/update/:_id', 'ScreenController.update')
    .validator('Account/Screen/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ScreenController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/screen`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.screen')