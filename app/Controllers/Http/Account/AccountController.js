'use strict'

class AccountController {

  async account({ auth, response }) {
    const user = auth.user
    return response.status(200).json(user)
  }

  async logout({ auth, response, request }) {

    try {
      const check = await auth.check()
      if (check) {
        const user = auth.user
        const token = await auth.getAuthHeader()

        await auth
          .authenticator()
          .revokeTokens([token])

        await auth
          .authenticator('jwt')
          .revokeTokens([token], false)

        const revokeTokens_ = await auth
          .authenticator('jwt')
          .revokeTokens()

        const apiToken = auth.getAuthHeader()

        const revokeTokensApi = await auth
          .authenticator('api')
          .revokeTokens([apiToken])

        const revokeTokensForUser = await auth
          .authenticator('jwt')
          .revokeTokensForUser(user)
          
        return response.status(200).send({
          title: 'Alerta',
          message: "Sesión cerrada con éxito!",
          interceptor: true,
          plugin: 'notification', //modal
        })
      }
    } catch (error) {
      return response.send({
        message: "Invalid jwt token"
      })
    }

  }

}

module.exports = AccountController
