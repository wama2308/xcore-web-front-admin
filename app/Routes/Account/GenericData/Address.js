'use strict'

/*
|--------------------------------------------------------------------------
| Address Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('/store/:person_id', 'GenericData/AddressController.store')
    .validator('Account/GenericData/Address/Person/Store')
    .as('store')

  Route.put('/update/:person_id/:_id', 'GenericData/AddressController.update')
    .validator('Account/GenericData/Address/Person/Update')
    .as('update')

  Route.put('/change-status/:person_id/:_id', 'GenericData/AddressController.changeStatus')
    .as('changeStatus')

  Route.post('/store-enterprise/:enterprise_id', 'GenericData/AddressController.store')
    .validator('Account/GenericData/Address/Enterprise/Store')
    .as('store')

  Route.put('/update-enterprise/:enterprise_id/:_id', 'GenericData/AddressController.update')
    .validator('Account/GenericData/Address/Enterprise/Update')
    .as('update')

  Route.put('/change-status-enterprise/:enterprise_id/:_id', 'GenericData/AddressController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/address`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.address')