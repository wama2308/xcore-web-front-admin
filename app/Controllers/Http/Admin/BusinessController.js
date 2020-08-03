'use strict'

const User = use('App/Models/User')
const Business = use('App/Models/Business')
const Mail = use('Mail')
const Env = use('Env')
const Database = use('Database')
const moment = require('moment')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with businesses
 */
class BusinessController {

  constructor() {
    this.from = Env.get('MAIL_CONTACT', 'contact@xcore.com')
    this.baseUrl = Env.get('BASE_URL', 'http://localhost:3000')
  }

  /**
   * Show a list of all businesses.
   * GET businesses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new business.
   * POST businesses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    const user = new User(request.only(['email']))
    
    user.merge({
      verified: false,
      enabled: true
    })

    let baseUrl = `${this.baseUrl}/request/code/?email=${user.email}`

    let errorEmail = false
    
    await Mail.send('emails.welcome', { user, baseUrl }, (message) => {
      message.to(user.email)
      message.from(this.from)
      message.subject('Bienvenido a XCORE')
    }).catch(error => {
      console.log(error)
      errorEmail = true
    })

    let message = 'Usuario registrado con éxito'
    let title = 'Éxito'
    let status = 201

    if (!errorEmail) {
      
      await user.save()

      let {name, logo} = request.only(['name', 'logo'])
      let oneYear = moment().add(1, 'years')

      const business = await Business.create({
        name,
        logo,
        enabled: true,
        expire_date: oneYear.format("DD-MM-YYYY")
      })

      const business_user = await user
        .business()
        .attach([business._id], (row) => {
            row.is_master = true
        })

      user.merge({
        business_default: business._id
      })

      await user.save()

    } else {
      title = 'Error'
      message = 'Error al enviar el correo'
      status = 417
    }

    return response.status(status).json({
      message,
      title,
      interceptor: true,
      plugin: 'modal', //modal
    })

  }

  /**
   * Display a single business.
   * GET businesses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update business details.
   * PUT or PATCH businesses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

}

module.exports = BusinessController
