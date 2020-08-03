const Person = use('App/Models/Person')
const exception = use('App/Utils/ExceptionsHelper')

class PhotoRepository {

  async findOnePhoto(person_id, Photo_id, enabled = true) {
    const person = await Person.findOrFail(person_id)
    const Photo = await person.photos()
      .where('_id', Photo_id)
      .where('enabled', enabled)
      .first()

    if (!Photo) {
      throw new exception(
        'Foto no encontrado',
      )
    }

    return Photo
  }

  async findOnePhotoWithoutStatus(person_id, Photo_id) {
    const person = await Person.findOrFail(person_id)
    const Photo = await person.photos()
      .where('_id', Photo_id)
      .first()

    if (!Photo) {
      throw new exception(
        'Foto no encontrado',
      )
    }

    return Photo
  }
}

module.exports = new PhotoRepository()