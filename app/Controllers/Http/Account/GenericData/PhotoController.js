'use strict'

const Person = use('App/Models/Person')
const Photo = use('App/Models/GenericData/Photo')
const photoRepository = use('App/Repositories/GenericData/PhotoRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class PhotoController {

  async store({ params, request, response, auth }) {
    let data = request.only([
      'photo',
    ])

    const person = await Person.findOrFail(params.person_id)
    let photo = await person
      .photos()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      photo,
      ...new MessageFrontEnd('Foto creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await photoRepository.findOnePhoto(params.person_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let data = request.only([
      'photo',
    ])

    let photo = await Photo.findOrFail(params._id)
    photo.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await photo.save()

    return response.status(200).json({
      photo,
      ...new MessageFrontEnd('Foto editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await photoRepository.findOnePhotoWithoutStatus(params.person_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let photo = await Photo.findOrFail(params._id)
    let message = (photo.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'
    photo.enabled = !photo.enabled
    photo.updated_by = auth.user._id

    await photo.save()

    return response.status(200).json({
      photo,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = PhotoController
