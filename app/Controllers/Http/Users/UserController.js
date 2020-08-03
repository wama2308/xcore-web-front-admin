'use strict'

const Env = use('Env')
const User = use('App/Models/User')
const Hash = use('Hash')
const userRepository = use('App/Repositories/UserRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')
const SecretQuestion = use('App/Models/GeneralConfiguration/SecretQuestion')

class UserController {

  async index({ request, response }) {
    const users = await userRepository.datatable(request)
    
    return response.status(200).json(users)
  }

  async indexDisabled({ request, response }){
    const users = await userRepository.datatable(request, false)
    
    return response.status(200).json(users)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const users = await userRepository.allEnabled(business_id)
    const select = (users && users.rows)? users.toJSON().map(item => {
      return {
        "label": `${item.username} | ${item.names} ${item.surnames} | ${item.email}`,
        "value": item._id
      }
    }): []
    return response.status(200).json(select)
  }

  async show({ params, response }) {
    const user = await User.findOrFail(params._id)
    return response.status(200).json(user)
  }

  async store({ request, response }) {
    const data = request.only([
      'names',
      'surnames',
      'username',
      'email',
      'password',
    ])

    let dataArray = request.only([
      'secret'
    ])

    const user = await userRepository.byEmail(data.email)

    let aux, arrayIds = [];
    for (let obj of dataArray.secret) {
      aux = await SecretQuestion.findOrFail(obj.question_id)
      arrayIds.push(aux._id)
    }

    user.password = await Hash.make(data.password)

    user.merge(data)
    await user.save()

    await user.secretQuestions().sync(arrayIds, (row) => {
      let element = dataArray.secret.find(item =>
        `${item.question_id}` == `${row.secret_question_id}`
      )

      row.answer = element.answer
    })

    return response.status(200).json({
      ...new MessageFrontEnd('Usuario registrado con éxito')
    })

  }

  async update({ request, response, auth }) {
    return "update"
  }

  async changeStatus({ request, response, auth }) {
    return "changeStatus"
  }

}

module.exports = UserController
