const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const exception = use('App/Utils/ExceptionsHelper')

class AddressRepository {

  async findOneAddress(person_id, address_id, enabled = true) {
    const person = await Person.findOrFail(person_id)
    const address = await person.addresses()
      .where('_id', address_id)
      .where('enabled', enabled)
      .first()

    if (!address) {
      throw new exception(
        'Dirección no encontrada',
      )
    }

    return address
  }

  async findOneAddressEnterprise(enterprise_id, address_id, enabled = true) {
    const enterprise = await Enterprise.findOrFail(enterprise_id)
    const address = await enterprise.addresses()
      .where('_id', address_id)
      .where('enabled', enabled)
      .first()

    if (!address) {
      throw new exception(
        'Dirección no encontrada',
      )
    }

    return address
  }

  async findOneAddressWithoutStatus(person_id, address_id) {
    const person = await Person.findOrFail(person_id)
    const address = await person.addresses()
      .where('_id', address_id)
      .first()

    if (!address) {
      throw new exception(
        'Dirección no encontrada',
      )
    }

    return address
  }

  async findOneAddressEnterpriseWithoutStatus(enterprise_id, address_id) {
    const enterprise = await Enterprise.findOrFail(enterprise_id)
    const address = await enterprise.addresses()
      .where('_id', address_id)
      .first()

    if (!address) {
      throw new exception(
        'Dirección no encontrada',
      )
    }

    return address
  }
  
}

module.exports = new AddressRepository()