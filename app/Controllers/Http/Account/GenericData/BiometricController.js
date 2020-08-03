'use strict'

const Person = use('App/Models/Person')
const Biometric = use('App/Models/GenericData/Biometric')
const Finger = use('App/Models/GeneralConfiguration/Finger')
const biometricRepository = use('App/Repositories/GenericData/BiometricRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class BiometricController {

  async store({ params, request, response, auth }) {
    const data = request.only([
      'hand',
      'finge_print',
    ])

    const { finger_id } = request.only(['finger_id'])
    const finger = await Finger.findOrFail(finger_id)

    const person = await Person.findOrFail(params.person_id)
    let biometric = await person
      .biometrics()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    await biometric.finger().associate(finger)

    return response.status(201).json({
      biometric,
      ...new MessageFrontEnd('Dato biometrico creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await biometricRepository.findOneBiometric(params.person_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const data = request.only([
      'hand',
      'finge_print',
    ])

    const { finger_id } = request.only(['finger_id'])
    const finger = await Finger.findOrFail(finger_id)

    let biometric = await Biometric.findOrFail(params._id)
    biometric.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await biometric.save()
    await biometric.finger().associate(finger)

    return response.status(200).json({
      biometric,
      ...new MessageFrontEnd('Dato editado creado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await biometricRepository.findOneBiometricWithoutStatus(params.person_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let biometric = await Biometric.findOrFail(params._id)
    let message = (biometric.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'
    biometric.enabled = !biometric.enabled
    biometric.updated_by = auth.user._id

    await biometric.save()

    return response.status(200).json({
      biometric,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = BiometricController
