'use strict'

/*
|--------------------------------------------------------------------------
| Term Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'TermController.index')
    .as('index')

  Route.get('/disabled', 'TermController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'TermController.show')
    .as('show')

  Route.post('/store', 'TermController.store')
    .validator('Account/Term/Store')
    .as('store')

  Route.put('/update/:_id', 'TermController.update')
    .validator('Account/Term/Update')
    .as('update')

  Route.put('/change-status/:_id', 'TermController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/term`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.term')