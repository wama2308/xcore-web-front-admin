'use strict'

/*
|--------------------------------------------------------------------------
| Group Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'GroupController.index')
    .as('index')

  Route.get('/disabled', 'GroupController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'GroupController.select')
    .as('select')

  Route.get('/:_id', 'GroupController.show')
    .as('show')

  Route.post('/store', 'GroupController.store')
    .validator('Account/Group/Store')
    .as('store')

  Route.put('/update/:_id', 'GroupController.update')
    .validator('Account/Group/Update')
    .as('update')

  Route.put('/change-status/:_id', 'GroupController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/group`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.group')