'use strict'

/*
|--------------------------------------------------------------------------
| License Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')
// const prefixBackEnd = 'api/back-end'

Route.group(() => {

  Route.get('/', 'LicenseController.index')
    .as('index')

  Route.get('/disabled', 'LicenseController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'LicenseController.show')
    .as('show')

  Route.post('/assign-license', 'LicenseController.assignLicense')
    // .validator('Account/License/Store')
    .as('store')

  Route.post('/store', 'LicenseController.store')
    // .validator('Account/License/Store')
    .as('store')

  Route.put('/update/:_id', 'LicenseController.update')
    // .validator('Account/License/Update')
    .as('update')

  Route.put('/change-status/:_id', 'LicenseController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/back-end/license`)
  .namespace('BackEnd')
  // .middleware(['auth:jwt', 'information'])
  .as('backend.license')