"use strict";

class AccountPersonSearch {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      search: "required|string",
    };
  }

  get messages() {
    return {
      "search.required":
        "Debe proporcionar DNI, Nombres o Apellidos para realizar la busqueda",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages);
  }
}

module.exports = AccountPersonSearch;
