const Person = use('App/Models/Person')
const exception = use('App/Utils/ExceptionsHelper')

class BiometricRepository {

  async findOneBiometric(person_id, biometric_id, enabled = true) {
    const person = await Person.findOrFail(person_id)
    const biometric = await person.biometrics()
      .where('_id', biometric_id)
      .where('enabled', enabled)
      .first()

    if (!biometric) {
      throw new exception(
        'Dato biometrico no encontrado',
      )
    }

    return biometric
  }

  async findOneBiometricWithoutStatus(person_id, biometric_id) {
    const person = await Person.findOrFail(person_id)
    const biometric = await person.biometrics()
      .where('_id', biometric_id)
      .first()

    if (!biometric) {
      throw new exception(
        'Dato biometrico no encontrado',
      )
    }

    return biometric
  }
}

module.exports = new BiometricRepository()