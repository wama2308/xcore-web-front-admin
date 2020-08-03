"use strict";

class AccountPersonStore {
  get validateAll() {
    return true;
  }

  get rules() {
    const request = this.ctx.request;
    let rules = {
      names: "required|string|min:2|max:100",
      surnames: "required|string|min:2|max:100",
      dni: "required|number",
      birthday: "required|date",
      type_identity_id: "required|string|objectId",
      civil_state_id: "required|string|objectId",
      sex_id: "required|string|objectId",
      phone: "required|array",
      "phone.*.type": "required|boolean",
      "phone.*.emergency": "required|boolean",
      "phone.*.number": "required|string",
      "phone.*.names": "accepted|string|max:100",
      "phone.*.surnames": "accepted|string|max:100",
      email: "required|array",
      "email.*.type": "required|boolean",
      "email.*.email": "required|string|email",
      address: "required|array",
      "address.*.type": "required|boolean",
      "address.*.work": "required|boolean",
      "address.*.address": "required|string|min:15|max:600",
      photo: "accepted|array",
      biometric: "accepted|array",
    };

    const phone = request.input("phone");

    if (phone && Array.isArray(phone)) {
      for (const key in phone) {
        if (phone.hasOwnProperty(key)) {
          const element = phone[key];
          if (element.emergency === true) {
            rules[`phone.${key}.names`] = "required|string|max:100";
            rules[`phone.${key}.surnames`] = "required|string|max:100";
          }
        }
      }
    }

    if (request.input("photo").length > 0) {
      rules = {
        ...rules,
        "photo.*.photo": "required|string",
      };
    }

    if (request.input("biometric").length > 0) {
      rules = {
        ...rules,
        biometric: "min:4",
        "biometric.*.hand": "required|boolean",
        "biometric.*.finger_id": "required|string|objectId",
        "biometric.*.finge_print": "required|string",
      };
    }

    return rules;
  }

  get messages() {
    return {
      "names.required": "Debe proporcionar un nombre",
      "names.string": "Debe proporcionar un dato alfanumerico",
      "names.min":
        "Debe proporcionar un nombre con al menos dos (2) caracteres",
      "names.max":
        "Debe proporcionar un nombre con un máximo de cien (100) caracteres",

      "surnames.required": "Debe proporcionar un apellido",
      "surnames.string": "Debe proporcionar un dato alfanumerico",
      "surnames.min":
        "Debe proporcionar un nombre con al menos dos (2) caracteres",
      "surnames.max":
        "Debe proporcionar un nombre con un máximo de cien (100) caracteres",

      "dni.required": "Debe proporcionar un dni",
      "dni.number": "Debe proporcionar un dato numerico",

      "birthday.required": "Debe proporcionar la fecha de nacimiento",
      "birthday.date": "Debe proporcionar una fecha valida",

      "type_identity_id.required": "Seleccione el tipo de identidad",
      "type_identity_id.string": "Debe proporcionar un dato alfanumerico",
      "type_identity_id.objectId": "Debe proporcionar un Objeto valido",

      "civil_state_id.required": "Seleccione el estado civil",
      "civil_state_id.string": "Debe proporcionar un dato alfanumerico",
      "civil_state_id.objectId": "Debe proporcionar un Objeto valido",

      "sex_id.required": "Seleccione el sexo de la persona",
      "sex_id.string": "Debe proporcionar un dato alfanumerico",
      "sex_id.objectId": "Debe proporcionar un Objeto valido",

      "phone.required": "Debe proporcionar al menos un telefono",
      "phone.array": "Debe poporcionar un arreglo",

      "phone.*.type.required": "Seleccione si es el principal o secundario",
      "phone.*.type.boolean": "Debe proporcionar un dato booleano",
      "phone.*.emergency.required": "Seleccione si para emergencias o personal",
      "phone.*.emergency.boolean": "Debe proporcionar un dato booleano",
      "phone.*.number.required": "Debe proporcionar un numero",
      "phone.*.number.string": "Debe proporcionar un dato alfanumerico",

      "phone.*.names.required": "Debe proporcionar el nombre del contacto",
      "phone.*.surnames.required": "Debe proporcionar el apellido del contacto",
      "phone.*.names.string": "Debe proporcionar un dato alfanumerico",
      "phone.*.surnames.string": "Debe proporcionar un dato alfanumerico",

      "email.required": "Debe proporcionar al menos un email",
      "email.array": "Debe poporcionar un arreglo",

      "email.*.type.required": "Seleccione si es el principal o secundario",
      "email.*.type.boolean": "Debe proporcionar un dato booleano",
      "email.*.email.required":
        "Debe proporcionar una dirección de correo electrónico.",
      "email.*.email.string": "Debe proporcionar un dato alfanumerico",
      "email.*.email.email":
        "Debe proporcionar una dirección de correo electrónico válida.",

      "photo.array": "Debe poporcionar un arreglo",
      "photo.*.photo.string": "Debe proporcionar un dato alfanumerico",

      "address.required": "Debe proporcionar al menos una dirección",
      "address.array": "Debe poporcionar un arreglo",

      "address.*.type.required": "Seleccione si es la principal o secundaria",
      "address.*.type.boolean": "Debe proporcionar un dato booleano",
      "address.*.address.required": "Debe proporcionar una dirección.",
      "address.*.address.string": "Debe proporcionar un dato alfanumerico",
      "address.*.address.min":
        "Debe proporcionar una dirección con al menos quince (15) caracteres",
      "address.*.address.max":
        "Debe proporcionar una dirección con un máximo de seiscientos (600) caracteres",

      "biometric.array": "Debe poporcionar un arreglo",
      "biometric.min": "Debe proporcionar al menos cuatro huellas",

      "biometric.*.hand.required": "Seleccione si es la derecha o izquierda",
      "biometric.*.hand.boolean": "Debe proporcionar un dato booleano",
      "biometric.*.finger_id.required": "Seleccione el dedo que se coloca",
      "biometric.*.finger_id.string": "Debe proporcionar un dato alfanumerico",
      "biometric.*.finger_id.objectId": "Debe proporcionar un Objeto valido",
      "biometric.*.finge_print.required": "Debe proporcionar una huella",
      "biometric.*.finge_print.string":
        "Debe proporcionar un dato alfanumerico",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages);
  }
}

module.exports = AccountPersonStore;
