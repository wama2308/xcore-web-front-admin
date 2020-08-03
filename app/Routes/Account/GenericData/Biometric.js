'use strict'

/*
|--------------------------------------------------------------------------
| Biometric Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('/store/:person_id', 'GenericData/BiometricController.store')
    .validator('Account/GenericData/Biometric/Store')
    .as('store')

  Route.put('/update/:person_id/:_id', 'GenericData/BiometricController.update')
    .validator('Account/GenericData/Biometric/Update')
    .as('update')

  Route.put('/change-status/:person_id/:_id', 'GenericData/BiometricController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/biometric`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.biometric')