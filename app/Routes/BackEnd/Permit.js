'use strict'

/*
|--------------------------------------------------------------------------
| Permit Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')
// const prefixBackEnd = 'api/back-end'

Route.group(() => {

  Route.get('/', 'PermitController.index')
    .as('index')

  Route.get('/disabled', 'PermitController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'PermitController.show')
    .as('show')

}).prefix(`${prefixApiV1}/back-end/permit`)
  .namespace('BackEnd')
  // .middleware(['auth:jwt', 'information'])
  .as('backend.permit')