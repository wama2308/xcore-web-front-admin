'use strict'

/*
|--------------------------------------------------------------------------
| Admin Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('business/store', 'BusinessController.store')
    .validator('Admin/BusinessStore')
    .as('store')

}).prefix(`${prefixApiV1}/admin`)
  .namespace('Admin')
  .middleware(['information'])
  .as('admin.business')
