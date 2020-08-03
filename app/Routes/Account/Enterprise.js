'use strict'

/*
|--------------------------------------------------------------------------
| Enterprise Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'EnterpriseController.index')
    .as('index')

  Route.get('/disabled', 'EnterpriseController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'EnterpriseController.select')
    .as('select')

  Route.get('/:_id', 'EnterpriseController.show')
    .as('show')

  Route.post('/store', 'EnterpriseController.store')
    .validator('Account/Enterprise/Store')
    .as('store')

  Route.put('/update/:_id', 'EnterpriseController.update')
    .validator('Account/Enterprise/Update')
    .as('update')

  Route.put('/change-status/:_id', 'EnterpriseController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/enterprise`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.enterprise')