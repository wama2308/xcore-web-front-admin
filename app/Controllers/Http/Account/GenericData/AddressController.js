'use strict'

const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const Address = use('App/Models/GenericData/Address')
const addressRepository = use('App/Repositories/GenericData/AddressRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class AddressController {

  async store({ params, request, response, auth }) {
    let address,
      obje,
      data;

    if (params.person_id) {
      obje = await Person.findOrFail(params.person_id)
      data = request.only([
        'type',
        'work',
        'address',
      ])
    } else if (params.enterprise_id) {
      obje = await Enterprise.findOrFail(params.enterprise_id)
      data = request.only([
        'type',
        'address',
      ])
    }

    address = await obje
      .addresses()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      address,
      ...new MessageFrontEnd('Dirección creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let address,
      data;

    if (params.person_id) {
      try {
        await addressRepository.findOneAddress(params.person_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }

      data = request.only([
        'type',
        'work',
        'address',
      ])

    } else if (params.enterprise_id) {
      try {
        await addressRepository.findOneAddressEnterprise(params.enterprise_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }

      data = request.only([
        'type',
        'address',
      ])
    }

    address = await Address.findOrFail(params._id)
    address.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await address.save()

    return response.status(200).json({
      address,
      ...new MessageFrontEnd('Dirección editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    if (params.person_id) {
      try {
        await addressRepository.findOneAddressWithoutStatus(params.person_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    } else if (params.enterprise_id) {
      try {
        await addressRepository.findOneAddressEnterpriseWithoutStatus(params.enterprise_id, params._id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let address = await Address.findOrFail(params._id)
    let message = (address.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    address.enabled = !address.enabled
    address.updated_by = auth.user._id

    await address.save()

    return response.status(200).json({
      address,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = AddressController
