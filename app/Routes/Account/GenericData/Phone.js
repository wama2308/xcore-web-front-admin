'use strict'

/*
|--------------------------------------------------------------------------
| Phone Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('/store/:person_id', 'GenericData/PhoneController.store')
    .validator('Account/GenericData/Phone/Person/Store')
    .as('store')

  Route.put('/update/:person_id/:_id', 'GenericData/PhoneController.update')
    .validator('Account/GenericData/Phone/Person/Update')
    .as('update')

  Route.put('/change-status/:person_id/:_id', 'GenericData/PhoneController.changeStatus')
    .as('changeStatus')

  Route.post('/store-enterprise/:enterprise_id', 'GenericData/PhoneController.store')
    .validator('Account/GenericData/Phone/Enterprise/Store')
    .as('store')

  Route.put('/update-enterprise/:enterprise_id/:_id', 'GenericData/PhoneController.update')
    .validator('Account/GenericData/Phone/Enterprise/Update')
    .as('update')

  Route.put('/change-status-enterprise/:enterprise_id/:_id', 'GenericData/PhoneController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/phone`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.phone')