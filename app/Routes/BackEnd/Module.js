'use strict'

/*
|--------------------------------------------------------------------------
| Module Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')
// const prefixBackEnd = 'api/back-end'

Route.group(() => {

  Route.get('/', 'ModuleController.index')
    .as('index')

  Route.get('/disabled', 'ModuleController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'ModuleController.show')
    .as('show')

  Route.post('/store', 'ModuleController.store')
    // .validator('Account/Module/Store')
    .as('store')

  Route.put('/update/:_id', 'ModuleController.update')
    // .validator('Account/Module/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ModuleController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/back-end/module`)
  .namespace('BackEnd')
  // .middleware(['auth:jwt', 'information'])
  .as('backend.module')