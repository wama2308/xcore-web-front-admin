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

  Route.delete('/destroy/:_id', 'ContactController.destroy')
    .as('destroy')

}).prefix(`${prefixApiV1}/account/contacts`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.contacts')
