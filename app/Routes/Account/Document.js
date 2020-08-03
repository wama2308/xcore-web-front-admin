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

  Route.get('/', 'DocumentController.index')
    .as('index')

  Route.get('/disabled', 'DocumentController.indexDisabled')
    .as('indexDisabled')
  
  Route.post('/store', 'DocumentController.store')
    .validator('Account/Document/Store')
    .as('store')

  Route.get('/:_id', 'DocumentController.show')
    .as('show')

  Route.put('/update/:_id', 'DocumentController.update')
    .validator('Account/Document/Update')
    .as('update')

  Route.put('/change-status/:_id', 'DocumentController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/documents`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.documents')
