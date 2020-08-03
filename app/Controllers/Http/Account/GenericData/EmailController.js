'use strict'

const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const Email = use('App/Models/GenericData/Email')
const emailRepository = use('App/Repositories/GenericData/EmailRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class EmailController {

  async store({ params, request, response, auth }) {
    let email,
      obje,
      data = request.only([
        'type',
        'email',
      ]);

    if (params.person_id) {
      obje = await Person.findOrFail(params.person_id)
    } else if (params.enterprise_id) {
      obje = await Enterprise.findOrFail(params.enterprise_id)
    }

    email = await obje
      .emails()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      email,
      ...new MessageFrontEnd('Email creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    if (params.person_id) {
      try {
        await emailRepository.findOneEmail(params.person_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    } else if (params.enterprise_id) {
      try {
        await emailRepository.findOneEmailEnterprise(params.enterprise_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let data = request.only([
      'type',
      'email',
    ])

    let email = await Email.findOrFail(params._id)
    email.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await email.save()

    return response.status(200).json({
      email,
      ...new MessageFrontEnd('Email editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    if (params.person_id) {
      try {
        await emailRepository.findOneEmailWithoutStatus(params.person_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    } else if (params.enterprise_id) {
      try {
        await emailRepository.findOneEmailEnterpriseWithoutStatus(params.enterprise_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let email = await Email.findOrFail(params._id)
    let message = (email.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'
    
    email.enabled = !email.enabled
    email.updated_by = auth.user._id

    await email.save()

    return response.status(200).json({
      email,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = EmailController
