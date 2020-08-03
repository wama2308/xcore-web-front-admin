'use strict'

/*
|--------------------------------------------------------------------------
| Back Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'BackController.index')
    .as('index')

  Route.get('/disabled', 'BackController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'BackController.show')
    .as('show')

  Route.post('/store', 'BackController.store')
    // .validator('Account/Back/Store')
    .as('store')

  Route.put('/update/:_id', 'BackController.update')
    // .validator('Account/Back/Update')
    .as('update')

  Route.put('/change-status/:_id', 'BackController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/back`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.back')
