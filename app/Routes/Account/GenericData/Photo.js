'use strict'

/*
|--------------------------------------------------------------------------
| Photo Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('/store/:person_id', 'GenericData/PhotoController.store')
    .validator('Account/GenericData/Photo/Store')
    .as('store')

  Route.put('/update/:person_id/:_id', 'GenericData/PhotoController.update')
    .validator('Account/GenericData/Photo/Update')
    .as('update')

  Route.put('/change-status/:person_id/:_id', 'GenericData/PhotoController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/photo`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.photo')