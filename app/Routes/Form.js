'use strict'

/*
|--------------------------------------------------------------------------
| Form Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/secret-questions', 'FormController.selectForm')
    .as('secret-questions')

  Route.get('/select-load', 'FormController.selectLoad')
    .as('select-load')

  Route.get('/select-country', 'FormController.selectCountries')
    .as('select-country')

  Route.get('/country-configuration', 'FormController.countryConfiguration')
    .middleware(['auth:jwt', 'information'])
    .as('country-configuration')

  Route.get('/select-rule', 'FormController.selectRule')
    .middleware(['auth:jwt', 'information'])
    .as('select-rule')

}).prefix(`${prefixApiV1}/form`)
  .namespace('Form')
  .as('form')
