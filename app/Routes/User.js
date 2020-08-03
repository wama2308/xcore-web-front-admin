'use strict'

/*
|--------------------------------------------------------------------------
| User Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.get('/', 'UserController.index')
    .as('index')

  Route.get('/select', 'UserController.select')
    .as('select')

  Route.get('/disabled', 'UserController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'UserController.show')
    .as('show')

  Route.post('/store', 'UserController.store')
    .validator('Users/UserStore')
    .middleware(['emailVerified'])
    .as('store')

  Route.put('/update/:_id', 'UserController.update')
    .as('update')

  Route.get('/change-status/:_id', 'UserController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/users`)
  .namespace('Users')
  //.middleware(['auth', 'country'])
  .as('users.index')