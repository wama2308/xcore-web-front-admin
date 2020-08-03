'use strict'

/*
|--------------------------------------------------------------------------
| Service Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ServiceController.index')
    .as('index')

  Route.get('/disabled', 'ServiceController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'ServiceController.select')
    .as('select')

  Route.get('/:_id', 'ServiceController.show')
    .as('show')

  Route.post('/store', 'ServiceController.store')
    .validator('Account/Service/Store')
    .as('store')

  Route.put('/update/:_id', 'ServiceController.update')
    .validator('Account/Service/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ServiceController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/service`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.service')