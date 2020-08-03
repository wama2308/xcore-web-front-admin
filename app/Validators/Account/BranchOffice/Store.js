'use strict'

class BranchOfficeStore {
  get validateAll () {
    return true
  }
  
  get rules () {
    return {
      name: 'required|string|min:2|max:100',
      logo: 'accepted|string',
      address: 'required|string|min:2|max:100',
      center: 'required|boolean',
      code: 'required|string',
      location: 'required|array',
      type_id: 'required|string|objectId',
      country_id: 'required|string|objectId',
      province_id: 'required|string|objectId',
      district_id: 'required|string|objectId',
      photos: 'accepted|array|max:3',
      social_network: 'accepted|object',
      'social_network.instagram': 'accepted|string',
      'social_network.facebook': 'accepted|string',
      'social_network.twitter': 'accepted|string',
      'social_network.web': 'accepted|string',
      contacts: 'required|array',
      'contacts.*.name': 'required|string',
      'contacts.*.surname': 'required|string',
      'contacts.*.email': 'required|string|email',
      'contacts.*.phone': 'required|string'
    }
  }

  get messages () {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.string': 'Debe proporcionar un dato alfanumerico',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'logo.required': 'Debe proporcionar un logo',
      'logo.string': 'Debe proporcionar un dato alfanumerico',

      'address.required': 'Debe proporcionar una dirección',
      'address.string': 'Debe proporcionar un dato alfanumerico',
      'address.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'address.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'center.required': 'Debe proporcionar si es una central o no',
      'center.boolean': 'Debe proporcionar un dato booleano',

      'code.required': 'Debe proporcionar un código',
      'code.string': 'Debe proporcionar un dato alfanumerico',

      'location.required': 'Debe proporcionar la localización',
      'location.array': 'Debe poporcionar un arreglo',

      'type_id.required': 'Debe proporcionar el tipo de sucursal',
      'type_id.string': 'Debe proporcionar un dato alfanumerico',
      'type_id.objectId': 'Debe proporcionar un Objeto valido',

      'country_id.required': 'Debe proporcionar un país',
      'country_id.string': 'Debe proporcionar un dato alfanumerico',
      'country_id.objectId': 'Debe proporcionar un Objeto valido',

      'province_id.required': 'Debe proporcionar una provincia',
      'province_id.string': 'Debe proporcionar un dato alfanumerico',
      'province_id.objectId': 'Debe proporcionar un Objeto valido',

      'district_id.required': 'Debe proporcionar un distrito',
      'district_id.string': 'Debe proporcionar un dato alfanumerico',
      'district_id.objectId': 'Debe proporcionar un Objeto valido',

      'photos.required': 'Debe proporcionar fotos',
      'photos.array': 'Debe poporcionar un arreglo',
      'photos.max': 'Solo debe proporcionar un maximo de tres (3) fotos',

      'social_network.instagram.string': 'Debe proporcionar un dato alfanumerico',
      'social_network.facebook.string': 'Debe proporcionar un dato alfanumerico',
      'social_network.twitter.string': 'Debe proporcionar un dato alfanumerico',
      'social_network.web.string': 'Debe proporcionar un dato alfanumerico',

      'contacts.required': 'Debe proporcionar los contactos internos.',
      'contacts.array': 'Debe poporcionar un arreglo',

      'contacts.*.name.required': 'Debe proporcionar el nombre de contacto.',
      'contacts.*.name.string': 'Debe proporcionar un dato alfanumerico',

      'contacts.*.surname.required': 'Debe proporcionar el apellido de contacto.',
      'contacts.*.surname.string': 'Debe proporcionar un dato alfanumerico',

      'contacts.*.email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'contacts.*.email.string': 'Debe proporcionar un dato alfanumerico',
      'contacts.*.email.email': 'Debe proporcionar una dirección de correo electrónico válida.',

      'contacts.*.phone.required': 'Debe proporcionar un numero de telefono.',
      'contacts.*.phone.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = BranchOfficeStore
