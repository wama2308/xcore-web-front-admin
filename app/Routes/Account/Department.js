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

  Route.get('/', 'DepartmentController.index')
    .as('index')

  Route.get('/disabled', 'DepartmentController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'DepartmentController.select')
    .as('select')

  Route.post('/store', 'DepartmentController.store')
    .validator('Account/Department/Store')
    .as('store')

  Route.get('/:_id', 'DepartmentController.show')
    .as('show')

  Route.put('/update/:_id', 'DepartmentController.update')
    .validator('Account/Department/Update')
    .as('update')

  Route.put('/change-status/:_id', 'DepartmentController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/departments`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.departments')
