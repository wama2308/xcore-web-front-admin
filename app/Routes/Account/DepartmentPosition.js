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

  Route.get('/', 'DepartmentPositionController.index')
    .as('index')

  Route.get('/disabled', 'DepartmentPositionController.indexDisabled')
    .as('indexDisabled')

  Route.post('/store', 'DepartmentPositionController.store')
    .validator('Account/DepartmentPosition/Store')
    .as('store')

  Route.get('/:_id', 'DepartmentPositionController.show')
    .as('show')

  Route.put('/update/:_id', 'DepartmentPositionController.update')
    .validator('Account/DepartmentPosition/Update')
    .as('update')

  Route.put('/change-status/:_id', 'DepartmentPositionController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/departmentPositions`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.departmentPositions')
