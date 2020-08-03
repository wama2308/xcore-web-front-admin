'use strict'

/*
|--------------------------------------------------------------------------
| Auth Routers
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const prefixApiV1 = Env.get('PREFIX_API_V1', 'api/v1')

Route.group(() => {

  Route.post('generate-code', 'AuthController.generateCode')
    .validator('Auth/GenerateCode')
    .as('generate-code')

  Route.post('virify-code', 'AuthController.virifyCode')
    .validator('Auth/VirifyCode')
    .as('virify-code')

  Route.post('login', 'AuthController.login')
    .validator('Auth/LoginUser')
    .middleware(['emailVerified'])
    .as('login')

  Route.post('recovery-password', 'AuthController.recoveryPassword')
    .validator('Auth/RecoveryPassword')
    .as('recovery-password')

  Route.post('verify-code-recovery-password', 'AuthController.verifyCodeRecoveryPassword')
    .validator('Auth/VerifyCodeRecoveryPassword')
    .as('verify-code-recovery-password')

  Route.post('change-password-recovery', 'AuthController.changePasswordRecovery')
    .validator('Auth/ChangePasswordRecovery')
    .as('change-password-recovery')

}).prefix(`${prefixApiV1}/auth`)
  .namespace('Auth')
  .middleware(['guest', 'information'])
  .as('auth')
