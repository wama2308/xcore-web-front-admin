'use strict'

/*
|--------------------------------------------------------------------------
| Email Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('/store/:person_id', 'GenericData/EmailController.store')
    .validator('Account/GenericData/Email/Store')
    .as('store')

  Route.put('/update/:person_id/:_id', 'GenericData/EmailController.update')
    .validator('Account/GenericData/Email/Update')
    .as('update')

  Route.put('/change-status/:person_id/:_id', 'GenericData/EmailController.changeStatus')
    .as('changeStatus')

  Route.post('/store-enterprise/:enterprise_id', 'GenericData/EmailController.store')
    .validator('Account/GenericData/Email/Store')
    .as('store')

  Route.put('/update-enterprise/:enterprise_id/:_id', 'GenericData/EmailController.update')
    .validator('Account/GenericData/Email/Update')
    .as('update')

  Route.put('/change-status-enterprise/:enterprise_id/:_id', 'GenericData/EmailController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/email`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.email')