'use strict'

/*
|--------------------------------------------------------------------------
| Account Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'RolController.index')
    .as('index')

  Route.get('/disabled', 'RolController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'RolController.select')
    .as('select')

  Route.get('/:_id', 'RolController.show')
    .as('show')

  Route.post('/store', 'RolController.store')
    .validator('Account/Rol/Store')
    .as('store')

  Route.put('/update/:_id', 'RolController.update')
    .validator('Account/Rol/Update')
    .as('update')

  Route.put('/change-status/:_id', 'RolController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/rols`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.rol')
