'use strict'

/*
|--------------------------------------------------------------------------
| Category Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')
// const prefixBackEnd = 'api/back-end'

Route.group(() => {

  Route.get('/', 'CategoryController.index')
    .as('index')

  Route.get('/disabled', 'CategoryController.indexDisabled')
    .as('indexDisabled')

  Route.get('/:_id', 'CategoryController.show')
    .as('show')

  Route.post('/store', 'CategoryController.store')
    // .validator('Account/Category/Store')
    .as('store')

  Route.put('/update/:_id', 'CategoryController.update')
    // .validator('Account/Category/Update')
    .as('update')

  Route.put('/change-status/:_id', 'CategoryController.changeStatus')
    .as('changeStatus')

}).prefix(`${prefixApiV1}/back-end/category`)
  .namespace('BackEnd')
  // .middleware(['auth:jwt', 'information'])
  .as('backend.category')