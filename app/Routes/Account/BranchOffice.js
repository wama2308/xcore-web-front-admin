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

  Route.get('/', 'BranchOfficeController.index')
    .as('index')
    
  Route.get('/disabled', 'BranchOfficeController.indexDisabled')
    .as('indexDisabled')
  
  Route.post('/store', 'BranchOfficeController.store')
    .validator('Account/BranchOffice/Store')
    .as('store')

  Route.get('/:_id', 'BranchOfficeController.show')
    .as('show')
  
  Route.put('/update/:_id', 'BranchOfficeController.update')
    .validator('Account/BranchOffice/Update')
    .as('update')

   Route.get('/:_id/asociate-user/:user_id', 'BranchOfficeController.asociateUser')
   .as('asociateUser')

}).prefix(`${prefixApiV1}/account/branch-offices`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.branch-offices')
