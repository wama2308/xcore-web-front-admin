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

	Route.get('/', 'ScheduleController.index')
    .as('index')

  Route.get('/disabled', 'ScheduleController.indexDisabled')
    .as('indexDisabled')

  Route.get('/select', 'ScheduleController.select')
    .as('select')

  Route.post('/store', 'ScheduleController.store')
    .validator('Account/Schedule/Store')
    .as('store')

  Route.get('/:_id', 'ScheduleController.show')
    .as('show')

  Route.put('/update/:_id', 'ScheduleController.update')
    .validator('Account/Schedule/Update')
    .as('update')

  Route.put('/change-status/:_id', 'ScheduleController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/account/schedules`)
  .namespace('Account')
  .middleware(['auth:jwt', 'information'])
  .as('account.schedules')
