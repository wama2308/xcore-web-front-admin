'use strict'

/*
|--------------------------------------------------------------------------
| Class Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ClassController.index')
    .as('index')

  Route.get('/disabled', 'ClassController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'ClassController.select')
    .as('select')

  Route.get('/:_id', 'ClassController.show')
    .as('show')

  Route.post('/store', 'ClassController.store')
    .validator('Account/Class/Store')
    .as('store')

  Route.put('/update/:_id', 'ClassController.update')
    .validator('Account/Class/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ClassController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/class`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.class')
