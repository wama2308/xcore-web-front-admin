'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')
const Config = use('Config')
const Hash = use('Hash')
const shortid = require('shortid')
const Encryption = use('Encryption')
const Env = use('Env')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

const userRepository = use('App/Repositories/UserRepository')

var moment = require('moment')

class AuthController {

  constructor() {
    this.from = Env.get('MAIL_CONTACT', 'contact@xcore.com')
    this.baseUrl = Env.get('BASE_URL', 'http://localhost:3000')
  }

  /**
   * Generate code
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @returns
   *
   * @memberOf AuthController
   *
   */
  async generateCode({ request, response }) {

    const { email } = request.only(['email'])
    const user = await userRepository.byEmail(email)

    if (!user) {
      return response.status(404).json({
        field: "email",
        validation: "not found",
        ...new MessageFrontEnd('Email no encotrado', 'Alerta')
      })
    } else if (user && user.verified === true) {
      return response.status(200).json({
        ...new MessageFrontEnd('Email verificado')
      })
    }

    const code = shortid.generate()
    const code_encrypted = Encryption.encrypt(code)

    if (!user.check) {
      user.check = {
        code: code_encrypted,
        created_at: new Date,
      }
      await user.save()
    } else {
      user.check.code = code_encrypted
      user.check.updated_at = new Date
      await user.save()
    }

    let baseUrl = `${this.baseUrl}/request/code/?email=${user.email}&code=${code}`

    let errorEmail = false

    // await Mail.send('emails.verification', { user, code, baseUrl }, (message) => {
    //   message.to(user.email)
    //   message.from(this.from)
    //   message.subject('Código de verificación de email')
    // }).catch(error => {
    //   console.log(error)
    //   errorEmail = true
    // })

    let message = 'Se le ha enviado un correo con su código de acceso'
    let title = 'Éxito'
    let status = 200

    if (errorEmail) {
      title = 'Error'
      message = 'Error al enviar el correo'
      status = 417
    }

    return response.status(status).json({
      code,
      ...new MessageFrontEnd(message, title)
    })

  }

  async virifyCode({ request, response }) {

    const { email, code } = request.only(['email', 'code'])
    const user = await userRepository.byEmail(email)

    if (!user) {
      return response.status(404).json({
        field: "email",
        validation: "not found",
        ...new MessageFrontEnd('Email no encotrado', 'Alerta')
      })
    } else if (user && user.verified === true) {

      return response.status(200).json({
        ...new MessageFrontEnd('Email verificado')
      })

    }

    if (!user.check) {
      return response.status(404).json({
        field: "code",
        validation: "not found",
        ...new MessageFrontEnd('Código no encotrado', 'Alerta')
      })
    }

    const code_decrypted = Encryption.decrypt(user.check.code)

    if (code_decrypted !== code) {

      return response.status(422).json({
        field: "code",
        validation: "invalid Code",
        ...new MessageFrontEnd('Código no valido', 'Alerta')
      })

    } else {

      let now = moment()
      let updated_at = moment(user.check.updated_at)
      let diff = now.diff(updated_at, 'hours')

      if (diff && diff > 0) {

        return response.status(422).json({
          field: "code",
          validation: "expired code",
          ...new MessageFrontEnd('Código expirado', 'Alerta')
        })

      } else {

        user.verified = true
        await user.save()

        return response.status(200).json({
          ...new MessageFrontEnd('Código verificado corectamente')
        })

      }

    }

  }

  async login({ request, response, auth }) {

    const { email, password } = request.only([
      'email',
      'password'
    ])

    const user = await User.where('email', email).first()

    if (user.enabled !== true) {
      return response.status(202).json({
        ...new MessageFrontEnd('usuario deshabilitado para mas información contacte con los administradores.', 'Alerta')
      })
    }

    try {
      const token = await auth.authenticator('jwt').attempt(email, password)
      return response.status(200).json({
        ...token,
        user,
        ...new MessageFrontEnd('Usuario autenticado con éxito')
      })
    } catch (error) {
      return response.status(401).json({
        ...new MessageFrontEnd('Datos de acceso incorrectos', 'Alerta')
      })
    }

  }

  async recoveryPassword({ request, response }) {

    const { email } = request.only(['email'])
    const user = await userRepository.byEmail(email)


    const code = shortid.generate()
    const code_encrypted = Encryption.encrypt(code)

    if (!user.recovery_password) {
      user.recovery_password = {
        code: code_encrypted,
        validated: false,
        created_by: user._id,
        created_at: new Date
      }
      await user.save()

    } else {
      user.recovery_password.code = code_encrypted
      user.recovery_password.validated = false
      user.recovery_password.updated_by = user._id
      user.recovery_password.updated_at = new Date

      await user.save()

    }

    let baseUrl = `${this.baseUrl}/request/code/?email=${user.email}&code=${code}`

    let errorEmail = false

    // await Mail.send('emails.verification', { user, code, baseUrl }, (message) => {
    //   message.to(user.email)
    //   message.from(this.from)
    //   message.subject('Código de recuperación de contraseña')
    // }).catch(error => {
    //   console.log(error)
    //   errorEmail = true
    // })

    let message = 'Se le ha enviado un correo con su código de acceso'
    let title = 'Éxito'
    let status = 200

    if (errorEmail) {
      title = 'Error'
      message = 'Error al enviar el correo'
      status = 417
    }

    return response.status(status).json({
      code,
      ...new MessageFrontEnd(message, title)
    })

  }

  async verifyCodeRecoveryPassword({ request, response }) {

    const { email } = request.only(['email'])
    const user = await userRepository.byEmail(email)

    if (!user.recovery_password) {
      return response.status(404).json({
        ...new MessageFrontEnd('Código no encontrado', 'Alerta')
      })

    } else {
      const { code } = request.only(['code'])
      const code_decrypted = Encryption.decrypt(user.recovery_password.code)

      if (code !== code_decrypted) {
        return response.status(403).json({
          ...new MessageFrontEnd('Código no valido', 'Alerta')
        })

      } else {
        let now = moment()
        let updated_at = moment(user.recovery_password.updated_at)
        let diff = now.diff(updated_at, 'hours')

        if (diff && diff > 0) {
          return response.status(422).json({
            field: 'code',
            validation: 'expired code',
            ...new MessageFrontEnd('Código expirado', 'Alerta')
          })

        } else {
          user.recovery_password.validated = true
          user.recovery_password.updated_by = user._id
          user.recovery_password.updated_at = new Date

          await user.save()

          return response.status(200).json({
            ...new MessageFrontEnd('Código verificado corectamente')
          })

        }
      }
    }

  }

  async changePasswordRecovery({ request, response }) {

    let { email, password } = request.only(['email', 'password'])
    const user = await userRepository.byEmail(email)

    if (!user.recovery_password || (user.recovery_password.validated === false)) {
      return response.status(404).json({
        field: "code",
        validation: "not found",
        ...new MessageFrontEnd('Código no encotrado', 'Alerta')
      })

    } else {
      let data = {
        password: password,
        recovery_password: {
          validated: false,
          updated_by: user._id,
          updated_at: new Date
        }
      }
      user.merge(data)
      await user.save()

      return response.status(200).json({
        ...new MessageFrontEnd('Nueva clave registrada con éxito.')
      })

    }

  }

}

module.exports = AuthController
