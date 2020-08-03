"use strict";

const TypeIdentity = use("App/Models/Country/TypeIdentity");
const CivilState = use("App/Models/GeneralConfiguration/CivilState");
const Sex = use("App/Models/GeneralConfiguration/Sex");
const Finger = use("App/Models/GeneralConfiguration/Finger");
const Business = use("App/Models/Business");
const BranchOffice = use("App/Models/BranchOffice");
const Person = use("App/Models/Person");
const personRespository = use("App/Repositories/PersonRepository");
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class PersonController {
  async index({ request, response }) {
    let people = await personRespository.datatable(request);

    return response.status(200).json(people);
  }

  async indexDisabled({ request, response }) {
    let people = await personRespository.datatable(request, false);

    return response.status(200).json(people);
  }

  async search({ params, request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    const branchOffice = await BranchOffice.findOrFail(branch_office_id);
    let search = request.input("search");
    const query = Person.query();
    const gt = search.split(" ");
    let expresion = "";
    gt.map((datos) => {
      expresion += `^(?=.*${datos})`;
    });
    search = new RegExp(expresion, "ims");
    query.where(function () {
      this.where({
        $or: [
          { dni: { $regex: search } },
          { names: { $regex: search } },
          { surnames: { $regex: search } },
        ],
      });
    });

    let person = await query
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .limit(10)
      .fetch();

    if (person) {
      person = person.toJSON();

      if (person.length > 0) {
        return response.status(200).json({
          message: "Ok",
          person,
        });
      } else {
        return response.status(404).json({
          ...new MessageFrontEnd('Cliente no encotrado, registre al cliente.', 'Alerta')
        });
      }
    }
  }

  async show({ params, request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    let person;

    try {
      person = await personRespository.findOnePerson(
        branch_office_id,
        params._id
      );
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      });
    }

    person = person.toJSON();

    if (person.biometrics.length > 0) {
      let biometrics = [];
      for (let obj of person.biometrics) {
        biometrics.push({
          ...obj,
          finger: {
            label: obj.finger.name,
            value: obj.finger._id,
          },
        });
      }
      person.biometrics = biometrics;
    }

    person = {
      ...person,
      sex: {
        label: person.sex.name,
        value: person.sex._id,
      },
      civilState: {
        label: person.civilState.name,
        value: person.civilState._id,
      },
      typeIdentity: {
        label: person.typeIdentity.name,
        value: person.typeIdentity._id,
      },
    };

    return response.status(200).json({
      message: "Ok",
      person,
    });
  }

  async store({ request, response, auth }) {
    const data = request.only(["names", "surnames", "dni", "birthday"]);

    const idsRules = request.only([
      "type_identity_id",
      "civil_state_id",
      "sex_id",
    ]);

    let dataArray = request.only([
      "phone",
      "email",
      "photo",
      "address",
      "biometric",
    ]);

    const typeIdentity = await TypeIdentity.findOrFail(
      idsRules.type_identity_id
    );
    const civilState = await CivilState.findOrFail(idsRules.civil_state_id);
    const sex = await Sex.findOrFail(idsRules.sex_id);
    const business = await Business.findOrFail(request.header("business_id"));
    const branch_office = await BranchOffice.findOrFail(
      request.header("branch_office_id")
    );

    let array_aux = [];

    if (dataArray.biometric && dataArray.biometric.length > 0) {
      let finger;
      for (let obj of dataArray.biometric) {
        finger = await Finger.findOrFail(obj.finger_id);
        array_aux.push({
          hand: obj.hand,
          finger_id: finger._id,
          finge_print: obj.finge_print,
        });
      }
      dataArray.biometric = array_aux;
    }

    if (dataArray.email && dataArray.email.length > 0) {
      array_aux = [];
      for (let obj of dataArray.email) {
        array_aux.push({
          type: obj.type,
          email: obj.email,
        });
      }
      dataArray.email = array_aux;
    }

    if (dataArray.phone && dataArray.phone.length > 0) {
      array_aux = [];
      for (let obj of dataArray.phone) {
        if (obj.emergency) {
          array_aux.push({
            type: obj.type,
            emergency: obj.emergency,
            number: obj.phone,
          });
        } else {
          array_aux.push({
            type: obj.type,
            emergency: obj.emergency,
            names: obj.names,
            surnames: obj.surnames,
            number: obj.phone,
          });
        }
      }
      dataArray.phone = array_aux;
    }

    if (dataArray.address && dataArray.address.length > 0) {
      for (let obj of dataArray.address) {
        array_aux.push({
          type: obj.type,
          work: obj.work,
          address: obj.address,
        });
      }
      dataArray.address = array_aux;
    }

    if (dataArray.photo && dataArray.photo.length > 0) {
      for (let obj of dataArray.photo) {
        array_aux.push({
          photo: obj.photo,
        });
      }
      dataArray.photo = array_aux;
    }

    let search = `${typeIdentity.name}${data.dni} ${typeIdentity.name}-${data.dni} ${typeIdentity.name} - ${data.dni} ${typeIdentity.name} ${data.dni} ${civilState.name} ${sex.name} ${data.names} ${data.surname}`;

    let person = await branch_office.persons().create({
      ...data,
      search,
      created_by: auth.user._id,
    });

    await person.business().associate(business);
    await person.sex().associate(sex);
    await person.civilState().associate(civilState);
    await person.typeIdentity().associate(typeIdentity);

    if (dataArray.email && dataArray.email.length > 0) {
      await person.emails().createMany(dataArray.email);
    }

    if (dataArray.phone && dataArray.phone.length > 0) {
      await person.phones().createMany(dataArray.phone);
    }

    if (dataArray.address && dataArray.address.length > 0) {
      await person.addresses().createMany(dataArray.address);
    }

    if (dataArray.photo && dataArray.photo.length > 0) {
      await person.photos().createMany(dataArray.photo);
    }

    if (dataArray.biometric && dataArray.biometric.length > 0) {
      await person.biometrics().createMany(dataArray.biometric);
    }

    return response.status(201).json({
      person,
      ...new MessageFrontEnd('Cliente creado con exito')
    });
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    try {
      await personRespository.findOnePerson(branch_office_id, params._id);
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      });
    }

    const data = request.only(["names", "surnames", "dni", "birthday"]);

    const idsRules = request.only([
      "type_identity_id",
      "civil_state_id",
      "sex_id",
    ]);

    const typeIdentity = await TypeIdentity.findOrFail(
      idsRules.type_identity_id
    );
    const civilState = await CivilState.findOrFail(idsRules.civil_state_id);
    const sex = await Sex.findOrFail(idsRules.sex_id);

    let search = `${typeIdentity.name}${data.dni} ${typeIdentity.name}-${data.dni} ${typeIdentity.name} - ${data.dni} ${typeIdentity.name} ${data.dni} ${civilState.name} ${sex.name} ${data.names} ${data.surname}`;
    let person = await Person.findOrFail(params._id);
    person.merge({
      ...data,
      search,
      updated_by: auth.user._id,
    });

    await person.sex().associate(sex);
    await person.civilState().associate(civilState);
    await person.typeIdentity().associate(typeIdentity);

    return response.status(200).json({
      person,
      ...new MessageFrontEnd('Cliente editado con exito')
    });
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    try {
      await personRespository.findOnePersonWithoutStatus(
        branch_office_id,
        params._id
      );
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      });
    }

    const person = await Person.findOrFail(params._id);
    let message = person.enabled
      ? "Eliminado con exito"
      : "Habilidato con exito";

    person.enabled = !person.enabled;
    person.updated_by = auth.user._id;

    await person.save();

    return response.status(200).json({
      person,
      ...new MessageFrontEnd(message)
    });
  }
}

module.exports = PersonController;
