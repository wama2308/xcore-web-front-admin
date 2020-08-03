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

  Route.get('/', 'PackageController.index')
    .as('index')

  Route.get('/disabled', 'PackageController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'PackageController.select')
    .as('select')
  
  Route.post('/store', 'PackageController.store')
    .validator('Account/Package/Store')
    .as('store')

  Route.get('/:_id', 'PackageController.show')
    .as('show')

  Route.put('/update/:_id', 'PackageController.update')
    .validator('Account/Package/Update')
    .as('update')

  Route.put('/change-status/:_id', 'PackageController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/packages`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.packages')
