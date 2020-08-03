const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const exception = use('App/Utils/ExceptionsHelper')

class PhoneRepository {

  async findOnePhone(person_id, Phone_id, enabled = true) {
    const person = await Person.findOrFail(person_id)
    const Phone = await person.phones()
      .where('_id', Phone_id)
      .where('enabled', enabled)
      .first()

    if (!Phone) {
      throw new exception(
        'Telefono no encontrado',
      )
    }

    return Phone
  }

  async findOnePhoneEnterprise(enterprise_id, Phone_id, enabled = true) {
    const enterprise = await Enterprise.findOrFail(enterprise_id)
    const Phone = await enterprise.phones()
      .where('_id', Phone_id)
      .where('enabled', enabled)
      .first()

    if (!Phone) {
      throw new exception(
        'Telefono no encontrado',
      )
    }

    return Phone
  }

  async findOnePhoneWithoutStatus(person_id, Phone_id) {
    const person = await Person.findOrFail(person_id)
    const Phone = await person.phones()
      .where('_id', Phone_id)
      .first()

    if (!Phone) {
      throw new exception(
        'Telefono no encontrado',
      )
    }

    return Phone
  }

  async findOnePhoneEnterpriseWithoutStatus(enterprise_id, Phone_id) {
    const enterprise = await Enterprise.findOrFail(enterprise_id)
    const Phone = await enterprise.phones()
      .where('_id', Phone_id)
      .first()

    if (!Phone) {
      throw new exception(
        'Telefono no encontrado',
      )
    }

    return Phone
  }
}

module.exports = new PhoneRepository()