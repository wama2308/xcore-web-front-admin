'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

class EmailVerified {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const { email } = request.only(['email'])
    const user = await User.where('email', email)
      .first()
    if (user && user.email && user.verified === true) {
      await next()
    }else {
      return response.status(422).json([{
        message: 'Email no validado',
        field: "email",
        validation: "email not validated"
      }])
    }
  }

}

module.exports = EmailVerified
