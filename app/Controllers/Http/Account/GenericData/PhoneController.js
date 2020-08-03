'use strict'

const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const Phone = use('App/Models/GenericData/Phone')
const phoneRepository = use('App/Repositories/GenericData/PhoneRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class PhoneController {

  async store({ params, request, response, auth }) {
    let data,
      obje;

    if (params.person_id) {
      obje = await Person.findOrFail(params.person_id)

      data = request.only([
        'type',
        'emergency',
        'number'
      ])

      if (data.emergency) {
        data = {
          ...data,
          ...request.only(['names', 'surnames'])
        }
      }

    } if (params.enterprise_id) {
      obje = await Enterprise.findOrFail(params.enterprise_id)
      data = request.only([
        'type',
        'number'
      ])
    }

    let phone = await obje
      .phones()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      phone,
      ...new MessageFrontEnd('Telefono creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let data

    if (params.person_id) {
      try {
        await phoneRepository.findOnePhone(params.person_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }

      data = request.only([
        'type',
        'emergency',
        'number'
      ])

      if (data.emergency) {
        data = {
          ...data,
          ...request.only(['names', 'surnames'])
        }
      } else {
        data = {
          ...data,
          'names': null,
          'surnames': null
        }
      }
    } else if (params.enterprise_id) {
      try {
        await phoneRepository.findOnePhoneEnterprise(params.enterprise_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }

      data = request.only([
        'type',
        'number'
      ])
    }

    let phone = await Phone.findOrFail(params._id)
    phone.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await phone.save()

    return response.status(200).json({
      phone,
      ...new MessageFrontEnd('Telefono editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    if (params.person_id) {
      try {
        await phoneRepository.findOnePhoneWithoutStatus(params.person_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    } else if (params.enterprise_id) {
      try {
        await phoneRepository.findOnePhoneEnterpriseWithoutStatus(params.enterprise_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let phone = await Phone.findOrFail(params._id)
    let message = (phone.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'
    
    phone.enabled = !phone.enabled
    phone.updated_by = auth.user._id

    await phone.save()

    return response.status(200).json({
      phone,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = PhoneController
