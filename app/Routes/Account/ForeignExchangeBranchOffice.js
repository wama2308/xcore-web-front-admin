'use strict'

/*
|--------------------------------------------------------------------------
| ForeignExchangeBranchOffice Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'ForeignExchangeBranchOfficeController.index')
    .as('index')

  Route.get('/:_id', 'ForeignExchangeBranchOfficeController.show')
    .as('show')

  Route.post('/store', 'ForeignExchangeBranchOfficeController.store')
    .validator('Account/ForeignExchangeBranchOffice/Store')
    .as('store')

  Route.put('/update/:_id', 'ForeignExchangeBranchOfficeController.update')
    .validator('Account/ForeignExchangeBranchOffice/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ForeignExchangeBranchOfficeController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/foreignExchangeBranchOffice`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.foreignExchangeBranchOffice')
