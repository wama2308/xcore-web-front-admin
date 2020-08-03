'use strict'

/*
|--------------------------------------------------------------------------
| TypeClient Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'TypeClientController.index')
    .as('index')

  Route.get('/disabled', 'TypeClientController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'TypeClientController.show')
    .as('show')

  Route.post('/store', 'TypeClientController.store')
    .validator('Account/TypeClient/Store')
    .as('store')

  Route.put('/update/:_id', 'TypeClientController.update')
    .validator('Account/TypeClient/Update')
    .as('update')

  Route.put('/change-status/:_id', 'TypeClientController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/type-client`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.type-client')
