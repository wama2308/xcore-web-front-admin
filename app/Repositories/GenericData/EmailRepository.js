const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const exception = use('App/Utils/ExceptionsHelper')

class EmailRepository {

  async findOneEmail(person_id, email_id, enabled = true) {
    const person = await Person.findOrFail(person_id)
    const email = await person.emails()
      .where('_id', email_id)
      .where('enabled', enabled)
      .first()

    if (!email) {
      throw new exception(
        'Email no encontrado',
      )
    }

    return email
  }

  async findOneEmailEnterprise(enterprise_id, email_id, enabled = true) {
    const enterprise = await Enterprise.findOrFail(enterprise_id)
    const email = await enterprise.emails()
      .where('_id', email_id)
      .where('enabled', enabled)
      .first()

    if (!email) {
      throw new exception(
        'Email no encontrado',
      )
    }

    return email
  }

  async findOneEmailWithoutStatus(person_id, email_id) {
    const person = await Person.findOrFail(person_id)
    const email = await person.emails()
      .where('_id', email_id)
      .first()

    if (!email) {
      throw new exception(
        'Email no encontrado',
      )
    }

    return email
  }

  async findOneEmailEnterpriseWithoutStatus(enterprise_id, email_id) {
    const enterprise = await Enterprise.findOrFail(enterprise_id)
    const email = await enterprise.emails()
      .where('_id', email_id)
      .first()

    if (!email) {
      throw new exception(
        'Email no encontrado',
      )
    }

    return email
  }
}

module.exports = new EmailRepository()