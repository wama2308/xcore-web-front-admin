import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Card,
  CardBody,
  Collapse,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import Geosuggest from "react-geosuggest";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { uuidv4 } from "./../../../../components/utils";

import { getServerErrors } from "./../../../../factorys/validations";
import {
  storeClientAction,
  loadClientIdAction,
  updateClientAction,
} from "../../../../actions/SalesActions";

import { openConfirmDialog } from "../../../../actions/aplicantionActions";

const newEmail = () => {
  return {
    uuidv4: uuidv4(),
    type: false,
    email: "",
  };
};

const newAddress = () => {
  return {
    uuidv4: uuidv4(),
    type: false,
    work: false,
    address: "",
  };
};

const newPhone = () => {
  return {
    uuidv4: uuidv4(),
    type: false,
    emergency: false,
    number: "",
    names: "",
    surnames: "",
  };
};

const newBiometric = () => {
  return {
    uuidv4: uuidv4(),
    hand: false,
    finger_id: "",
    finge_print: "",
  };
};

const Modal = (props) => {
  const isEditOrView = props.option === 2 || props.option === 3;

  const {
    data,
    modal,
    valorCloseModal,
    modalHeader,
    showHide,
    buttonFooter,
    storeClientAction,
    disabled,
    option,
    dataGeneral,
    selectClient,
  } = props;

  const [form, setForm] = useState({
    names: "",
    surnames: "",
    type_identity_id: "",
    dni: "",
    birthday: "",
    civil_state_id: "",
    sex_id: "",
    phone: [newPhone()],
    email: [newEmail()],
    address: [newAddress()],
    photo: [],
    biometric: [],
  });
  const [loading, setLoading] = useState("hide");
  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});

  if (isEditOrView && props.data && props.data._id) {
    useEffect(() => {
      getClient(props.data._id);
    }, []);
  }

  const getClient = (_id) => {
    setLoading("show");
    loadClientIdAction(_id)
      .then((response) => {
        setLoading("hide");
        let { person } = response.data;

        const { names, surnames, dni } = person;

        const phone =
          person.phones && Array.isArray(person.phones) ? person.phones : [];
        const email =
          person.emails && Array.isArray(person.emails) ? person.emails : [];
        const address =
          person.addresses && Array.isArray(person.addresses)
            ? person.addresses
            : [];
        const photo =
          person.photos && Array.isArray(person.photos) ? person.photos : [];
        const biometric =
          person.biometrics && Array.isArray(person.biometrics)
            ? person.biometrics
            : [];

        let birthdaySplit = person.birthday.split("-");
        let birthday = new Date(
          birthdaySplit[0],
          birthdaySplit[1] - 1,
          birthdaySplit[2].substring(0, 2)
        );

        const type_identity_id =
          person.typeIdentity && person.typeIdentity.value
            ? person.typeIdentity.value
            : "";
        const type_identity_id_object =
          person.typeIdentity && person.typeIdentity.value
            ? person.typeIdentity
            : "";

        const civil_state_id =
          person.civilState && person.civilState.value
            ? person.civilState.value
            : "";
        const civil_state_id_object =
          person.civilState && person.civilState.value ? person.civilState : "";

        const sex_id = person.sex && person.sex.value ? person.sex.value : "";
        const sex_id_object = person.sex && person.sex.value ? person.sex : "";

        setForm({
          ...form,
          names,
          surnames,
          dni,
          type_identity_id,
          type_identity_id_object,
          birthday,
          civil_state_id,
          civil_state_id_object,
          sex_id,
          sex_id_object,
          email,
          address,
          photo,
          biometric,
        });
      })
      .catch((error) => {
        setLoading("hide");
      });
  };

  const handleChange = (event) => {
    const value =
      event.target.type !== "checkbox"
        ? event.target.value
        : event.target.checked;
    const name = event.target.name;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleChangeDate = (date, key) => {
    setForm({
      ...form,
      [key]: date,
    });
    setErrors({
      ...errors,
      [key]: "",
    });
  };

  const handleChangeEmail = (event, _uuidv4 = null) => {
    let value = event.target.value;
    const name = event.target.name;
    const uuidv4 = _uuidv4 ? _uuidv4 : event.target.dataset.uuidv4;
    if (value === "false") {
      value = false;
    }
    if (value === "true") {
      value = true;
    }
    setForm({
      ...form,
      email: form.email.map((item, index) => {
        if (item.uuidv4 === uuidv4) {
          item[name] = value;
          setErrors({
            ...errors,
            [`email.${index}.${name}`]: "",
          });
        }
        return item;
      }),
    });
  };

  const handleChangeAddress = (event, _uuidv4 = null) => {
    let value = event.target.value;
    const name = event.target.name;
    const uuidv4 = _uuidv4 ? _uuidv4 : event.target.dataset.uuidv4;
    if (value === "false") {
      value = false;
    }
    if (value === "true") {
      value = true;
    }
    setForm({
      ...form,
      address: form.address.map((item, index) => {
        if (item.uuidv4 === uuidv4) {
          item[name] = value;
          setErrors({
            ...errors,
            [`address.${index}.${name}`]: "",
          });
        }
        return item;
      }),
    });
  };

  const handleChangePhone = (event, _uuidv4 = null) => {
    let value = event.target.value;
    const name = event.target.name;
    const uuidv4 = _uuidv4 ? _uuidv4 : event.target.dataset.uuidv4;
    if (value === "false") {
      value = false;
    }
    if (value === "true") {
      value = true;
    }
    setForm({
      ...form,
      phone: form.phone.map((item, index) => {
        if (item.uuidv4 === uuidv4) {
          item[name] = value;
          setErrors({
            ...errors,
            [`phone.${index}.${name}`]: "",
          });
        }
        return item;
      }),
    });
  };

  const handleChangeBiometric = (event, _uuidv4 = null) => {
    let value = event.target.value;
    const name = event.target.name;
    const uuidv4 = _uuidv4 ? _uuidv4 : event.target.dataset.uuidv4;
    if (value === "false") {
      value = false;
    }
    if (value === "true") {
      value = true;
    }
    setForm({
      ...form,
      biometric: form.biometric.map((item, index) => {
        if (item.uuidv4 === uuidv4) {
          item[name] = value;
          setErrors({
            ...errors,
            [`biometric.${index}.${name}`]: "",
          });
        }
        return item;
      }),
    });
  };

  const handleChangeSelectBiometric = (options, key, uuidv4) => {
    setForm({
      ...form,
      biometric: form.biometric.map((item, index) => {
        if (item.uuidv4 === uuidv4) {
          (item[`${key}_object`] = options), (item[key] = options.value);
          setErrors({
            ...errors,
            [`biometric.${index}.${key}`]: "",
          });
        }
        return item;
      }),
    });
  };

  const handleChangeSelect = (options, key) => {
    setForm({
      ...form,
      [`${key}_object`]: options,
      [key]: options.value,
    });
    setErrors({
      ...errors,
      [key]: "",
    });
  };

  const closeModal = (option) => {
    if (option === 0) {
      const message = {
        title: "Cerrar Ventana",
        info: "¿Esta seguro que desea cerrar la ventana?"
      };
      props.confirm(message, res => {
        if (res) {
          setForm({
            names: "",
            surnames: "",
            type_identity_id: "",
            dni: "",
            birthday: "",
            civil_state_id: "",
            sex_id: "",
            phone: [newPhone()],
            email: [newEmail()],
            address: [newAddress()],
            photo: [],
            biometric: [],
          });
          valorCloseModal(false);
        }
      });
    } else {
      valorCloseModal(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadingForm(true);
    let dataForm = { ...form };
    if (option === 1) {
      storeClientAction(dataForm)
        .then((response) => {
          const { person } = response.data;
          if (person && selectClient) {
            selectClient(person);
          } else if (!selectClient) {
            closeModal(1);
          }
        })
        .catch((error) => {
          const { status, data } = error.response;
          let serverErrors = {};
          if (status && status === 422) {
            const { errors } = data;
            if (errors && Array.isArray(errors)) {
              serverErrors = getServerErrors(errors);
            } else {
              serverErrors = getServerErrors(data);
            }
          }
          setLoadingForm(false);
          setErrors(serverErrors);
        });
    }
    if (option === 3) {
      dataForm._id = props.data._id;
      updateClientAction(dataForm)
        .then((response) => {
          const { person } = response.data;
          setLoadingForm(false);
          if (person && selectClient) {
            selectClient(person);
            closeModal(1);
          } else if (!selectClient) {
            closeModal(1);
          }
        })
        .catch((error) => {
          const { status, data } = error.response;
          let serverErrors = {};
          if (status && status === 422) {
            const { errors } = data;
            if (errors && Array.isArray(errors)) {
              serverErrors = getServerErrors(errors);
            } else {
              serverErrors = getServerErrors(data);
            }
          }
          setLoadingForm(false);
          setErrors(serverErrors);
        });
    }
  };

  const addEmail = () => {
    const new_email = newEmail();
    form.email.push(new_email);
    setForm({
      ...form,
    });
    setErrors({
      ...errors,
      email: "",
    });
  };

  const removeEmail = (email) => {
    if (email._id) {
      console.log(email._id);
      setForm({
        ...form,
        email: form.email.filter((item) => item._id !== email._id),
      });
    } else {
      const { uuidv4 } = email;
      setForm({
        ...form,
        email: form.email.filter((item) => item.uuidv4 !== uuidv4),
      });
    }
  };

  const addAddress = () => {
    const new_address = newAddress();
    form.address.push(new_address);
    setForm({
      ...form,
    });
    setErrors({
      ...errors,
      address: "",
    });
  };

  const removeAddress = (address) => {
    if (address._id) {
      console.log(address._id);
      setForm({
        ...form,
        address: form.address.filter((item) => item._id !== address._id),
      });
    } else {
      const { uuidv4 } = address;
      setForm({
        ...form,
        address: form.address.filter((item) => item.uuidv4 !== uuidv4),
      });
    }
  };

  const addPhone = () => {
    const new_phone = newPhone();
    form.phone.push(new_phone);
    setForm({
      ...form,
    });
    setErrors({
      ...errors,
      phone: "",
    });
  };

  const removePhone = (phone) => {
    if (phone._id) {
      console.log(phone._id);
      setForm({
        ...form,
        phone: form.phone.filter((item) => item._id !== phone._id),
      });
    } else {
      const { uuidv4 } = phone;
      setForm({
        ...form,
        phone: form.phone.filter((item) => item.uuidv4 !== uuidv4),
      });
    }
  };

  const addBiometric = () => {
    const new_biometric = newBiometric();
    form.biometric.push(new_biometric);
    setForm({
      ...form,
    });
    setErrors({
      ...errors,
      biometric: "",
    });
  };

  const removeBiometric = (biometric) => {
    if (biometric._id) {
      console.log(biometric._id);
      setForm({
        ...form,
        biometric: form.biometric.filter((item) => item._id !== biometric._id),
      });
    } else {
      const { uuidv4 } = biometric;
      setForm({
        ...form,
        biometric: form.biometric.filter((item) => item.uuidv4 !== uuidv4),
      });
    }
  };

  const { countryConfiguration } = dataGeneral;
  const { typeIdentities } = countryConfiguration;
  const { civilState, fingers, sex } = dataGeneral.dataGeneral
    ? dataGeneral.dataGeneral
    : [];

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={modal}
      onClose={() => { closeModal(0); }}
      aria-labelledby="responsive-dialog-title"
      scroll="paper"
    >
      {loading === "hide" ? (
        <div>
          <Form name="form-client" onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">
              <div style={{ display: "flex" }}>
                <div>{modalHeader}</div>
                <div style={{ marginLeft: "auto" }}>
                  <IconButton
                    aria-label="Delete"
                    className="iconButtons"
                    onClick={() => { closeModal(0); }}
                  >
                    <Close className="iconTable" />
                  </IconButton>
                </div>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <div className="row">
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="names">Nombre</Label>
                    <Input
                      label="Nombre"
                      invalid={errors["names"] ? true : false}
                      id="names"
                      name="names"
                      onChange={handleChange}
                      value={form.names}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["names"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="surnames">Apellido</Label>
                    <Input
                      label="Apellido"
                      invalid={errors["surnames"] ? true : false}
                      id="surnames"
                      name="surnames"
                      onChange={handleChange}
                      value={form.surnames}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["surnames"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div
                    className={errors["type_identity_id"] ? "is-invalid" : ""}
                  >
                    <Label for="type_identity_id">Tipo de Identidad</Label>
                    <Select
                      isSearchable="true"
                      isDisabled={disabled}
                      name="type_identity_id"
                      id="type_identity_id"
                      value={form.type_identity_id_object}
                      onChange={(option) =>
                        handleChangeSelect(option, "type_identity_id")
                      }
                      options={typeIdentities}
                    />
                    <FormFeedback>{errors["type_identity_id"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="dni">DNI</Label>
                    <Input
                      label="DNI"
                      invalid={errors["dni"] ? true : false}
                      id="dni"
                      name="dni"
                      onChange={handleChange}
                      value={form.dni}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["dni"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="startDate">Fecha de nacimiento</Label>
                    <div>
                      <DatePicker
                        selected={form.birthday}
                        value={form.birthday}
                        onChange={(date) => handleChangeDate(date, "birthday")}
                        dateFormat="dd-MM-yyyy"
                        isClearable
                        name="birthday"
                        id="birthday"
                        showYearDropdown
                        dateFormatCalendar="MMMM"
                        className="form-control"
                        disabled={disabled}
                        locale="es"
                      />
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div className={errors["civil_state_id"] ? "is-invalid" : ""}>
                    <Label for="civil_state_id">Estado civil</Label>
                    <Select
                      isSearchable="true"
                      isDisabled={disabled}
                      name="civil_state_id"
                      id="civil_state_id"
                      value={form.civil_state_id_object}
                      onChange={(option) =>
                        handleChangeSelect(option, "civil_state_id")
                      }
                      options={civilState}
                    />
                    <FormFeedback>{errors["civil_state_id"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div className={errors["sex_id"] ? "is-invalid" : ""}>
                    <Label for="sex_id">Sexo</Label>
                    <Select
                      isSearchable="true"
                      isDisabled={disabled}
                      name="sex_id"
                      id="sex_id"
                      value={form.sex_id_object}
                      onChange={(option) =>
                        handleChangeSelect(option, "sex_id")
                      }
                      options={sex}
                    />
                    <FormFeedback>{errors["sex_id"]}</FormFeedback>
                  </div>
                </FormGroup>
                {props.option && props.option !== 3 ? (
                  <div className="col-sm-12">
                    <FormGroup className="top form-group col-sm-12 FormGroupItems">
                      {form.email &&
                        Array.isArray(form.email) &&
                        form.email.map((email, index) => {
                          return (
                            <div key={index} className="mt-10">
                              <Card>
                                <CardBody>
                                  <div className="row">
                                    <FormGroup className="top form-group col-sm-8">
                                      <div>
                                        <Label for="email">Email</Label>
                                        <Input
                                          label="Email"
                                          invalid={
                                            errors[`email.${index}.email`]
                                              ? true
                                              : false
                                          }
                                          id={`email.${index}.email`}
                                          name={`email`}
                                          data-uuidv4={email.uuidv4}
                                          onChange={handleChangeEmail}
                                          value={email.email}
                                          type="text"
                                          disabled={disabled}
                                        />
                                        <FormFeedback>
                                          {errors[`email.${index}.email`]}
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                    <FormGroup
                                      check
                                      className="top form-group col-sm-4"
                                    >
                                      <Label for="type">Email Principal</Label>
                                      <Switch
                                        name="type"
                                        checked={
                                          email.type ? email.type : false
                                        }
                                        onChange={(event) => {
                                          handleChangeEmail(
                                            event,
                                            email.uuidv4
                                          );
                                        }}
                                        data-uuidv4={email.uuidv4}
                                        id={`email.${index}.type`}
                                        name={`type`}
                                        value={!email.type}
                                        color="primary"
                                        disabled={disabled}
                                      />
                                      <FormFeedback>
                                        {errors[`email.${index}.type`]}
                                      </FormFeedback>
                                    </FormGroup>
                                  </div>
                                  {form.email.length > 1 ? (
                                    <Button
                                      color="danger"
                                      onClick={() => {
                                        removeEmail(email);
                                      }}
                                    >
                                      Elimnar
                                    </Button>
                                  ) : null}
                                </CardBody>
                              </Card>
                            </div>
                          );
                        })}
                      <div style={{ marginTop: "10px" }}>
                        <Button onClick={addEmail} color="primary">
                          Agregar email
                        </Button>
                      </div>
                      <div className={errors[`email`] ? "is-invalid" : ""}>
                        <FormFeedback>{errors[`email`]}</FormFeedback>
                      </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12 FormGroupItems">
                      {form.address &&
                        Array.isArray(form.address) &&
                        form.address.map((addres, index) => {
                          return (
                            <div key={index} className="mt-10">
                              <Card>
                                <CardBody>
                                  <div className="row">
                                    <FormGroup className="top form-group col-sm-12">
                                      <div>
                                        <Label for="address">Dirección</Label>
                                        <Input
                                          label="Dirección"
                                          invalid={
                                            errors[`address.${index}.address`]
                                              ? true
                                              : false
                                          }
                                          id={`address.${index}.address`}
                                          name={`address`}
                                          data-uuidv4={addres.uuidv4}
                                          onChange={handleChangeAddress}
                                          value={addres.address}
                                          type="text"
                                          disabled={disabled}
                                        />
                                        <FormFeedback>
                                          {errors[`address.${index}.address`]}
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                    <FormGroup
                                      check
                                      className="top form-group col-sm-4"
                                    >
                                      <Label for="type">
                                        Dirección Principal
                                      </Label>
                                      <Switch
                                        name="type"
                                        checked={
                                          addres.type ? addres.type : false
                                        }
                                        onChange={(event) => {
                                          handleChangeAddress(
                                            event,
                                            addres.uuidv4
                                          );
                                        }}
                                        data-uuidv4={addres.uuidv4}
                                        id={`address.${index}.type`}
                                        name={`type`}
                                        value={!addres.type}
                                        color="primary"
                                        disabled={disabled}
                                      />
                                      <FormFeedback>
                                        {errors[`address.${index}.type`]}
                                      </FormFeedback>
                                    </FormGroup>
                                    <FormGroup
                                      check
                                      className="top form-group col-sm-4"
                                    >
                                      <Label for="work">
                                        Dirección de trabajo
                                      </Label>
                                      <Switch
                                        name="work"
                                        checked={
                                          addres.work ? addres.work : false
                                        }
                                        onChange={(event) => {
                                          handleChangeAddress(
                                            event,
                                            addres.uuidv4
                                          );
                                        }}
                                        data-uuidv4={addres.uuidv4}
                                        id={`address.${index}.work`}
                                        name={`work`}
                                        value={!addres.work}
                                        color="primary"
                                        disabled={disabled}
                                      />
                                      <FormFeedback>
                                        {errors[`address.${index}.type`]}
                                      </FormFeedback>
                                    </FormGroup>
                                  </div>
                                  {form.address.length > 1 ? (
                                    <Button
                                      color="danger"
                                      onClick={() => {
                                        removeAddress(addres);
                                      }}
                                    >
                                      Elimnar
                                    </Button>
                                  ) : null}
                                </CardBody>
                              </Card>
                            </div>
                          );
                        })}
                      <div style={{ marginTop: "10px" }}>
                        <Button onClick={addAddress} color="primary">
                          Agregar Dirección
                        </Button>
                      </div>
                      <div className={errors[`address`] ? "is-invalid" : ""}>
                        <FormFeedback>{errors[`address`]}</FormFeedback>
                      </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12 FormGroupItems">
                      {form.phone &&
                        Array.isArray(form.phone) &&
                        form.phone.map((phone, index) => {
                          return (
                            <div key={index} className="mt-10">
                              <Card>
                                <CardBody>
                                  <div className="row">
                                    <FormGroup className="top form-group col-sm-8">
                                      <div>
                                        <Label for="number">Teléfono</Label>
                                        <Input
                                          label="Teléfono"
                                          invalid={
                                            errors[`phone.${index}.number`]
                                              ? true
                                              : false
                                          }
                                          id={`phone.${index}.number`}
                                          name={`number`}
                                          data-uuidv4={phone.uuidv4}
                                          onChange={handleChangePhone}
                                          value={phone.number}
                                          type="text"
                                          disabled={disabled}
                                        />
                                        <FormFeedback>
                                          {errors[`phone.${index}.number`]}
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                    <FormGroup
                                      check
                                      className="top form-group col-sm-4"
                                    >
                                      <Label for="type">
                                        Teléfono Principal
                                      </Label>
                                      <Switch
                                        name="type"
                                        checked={
                                          phone.type ? phone.type : false
                                        }
                                        onChange={(event) => {
                                          handleChangePhone(
                                            event,
                                            phone.uuidv4
                                          );
                                        }}
                                        data-uuidv4={phone.uuidv4}
                                        id={`phone.${index}.type`}
                                        name={`type`}
                                        value={!phone.type}
                                        color="primary"
                                        disabled={disabled}
                                      />
                                      <FormFeedback>
                                        {errors[`phone.${index}.type`]}
                                      </FormFeedback>
                                    </FormGroup>
                                    <FormGroup
                                      check
                                      className="top form-group col-sm-4"
                                    >
                                      <Label for="emergency">
                                        Teléfono de emergencia
                                      </Label>
                                      <Switch
                                        name="emergency"
                                        checked={
                                          phone.emergency
                                            ? phone.emergency
                                            : false
                                        }
                                        onChange={(event) => {
                                          handleChangePhone(
                                            event,
                                            phone.uuidv4
                                          );
                                        }}
                                        data-uuidv4={phone.uuidv4}
                                        id={`phone.${index}.emergency`}
                                        name={`emergency`}
                                        value={!phone.emergency}
                                        color="primary"
                                        disabled={disabled}
                                      />
                                      <FormFeedback>
                                        {errors[`phone.${index}.emergency`]}
                                      </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-4">
                                      <div>
                                        <Label for="names">
                                          Nombres del contacto de emergencia
                                        </Label>
                                        <Input
                                          label="Teléfono"
                                          invalid={
                                            errors[`phone.${index}.names`]
                                              ? true
                                              : false
                                          }
                                          id={`phone.${index}.names`}
                                          name={`names`}
                                          data-uuidv4={phone.uuidv4}
                                          onChange={handleChangePhone}
                                          value={phone.names}
                                          type="text"
                                          disabled={disabled}
                                        />
                                        <FormFeedback>
                                          {errors[`phone.${index}.names`]}
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-4">
                                      <div>
                                        <Label for="surnames">
                                          Apellidos del contacto de emergencia
                                        </Label>
                                        <Input
                                          label="Teléfono"
                                          invalid={
                                            errors[`phone.${index}.surnames`]
                                              ? true
                                              : false
                                          }
                                          id={`phone.${index}.surnames`}
                                          name={`surnames`}
                                          data-uuidv4={phone.uuidv4}
                                          onChange={handleChangePhone}
                                          value={phone.surnames}
                                          type="text"
                                          disabled={disabled}
                                        />
                                        <FormFeedback>
                                          {errors[`phone.${index}.surnames`]}
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                  </div>
                                  {form.phone.length > 1 ? (
                                    <Button
                                      color="danger"
                                      onClick={() => {
                                        removePhone(phone);
                                      }}
                                    >
                                      Elimnar
                                    </Button>
                                  ) : null}
                                </CardBody>
                              </Card>
                            </div>
                          );
                        })}
                      <div style={{ marginTop: "10px" }}>
                        <Button onClick={addPhone} color="primary">
                          Agregar Teléfono
                        </Button>
                      </div>
                      <div className={errors[`phone`] ? "is-invalid" : ""}>
                        <FormFeedback>{errors[`phone`]}</FormFeedback>
                      </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12 FormGroupItems">
                      {form.biometric &&
                        Array.isArray(form.biometric) &&
                        form.biometric.map((biometric, index) => {
                          return (
                            <div key={index} className="mt-10">
                              <Card>
                                <CardBody>
                                  <div className="row">
                                    <FormGroup
                                      check
                                      className="top form-group col-sm-4"
                                    >
                                      <Label for="hand">Si es derecha</Label>
                                      <Switch
                                        name="hand"
                                        checked={
                                          biometric.hand
                                            ? biometric.hand
                                            : false
                                        }
                                        onChange={(event) => {
                                          handleChangeBiometric(
                                            event,
                                            biometric.uuidv4
                                          );
                                        }}
                                        data-uuidv4={biometric.uuidv4}
                                        id={`biometric.${index}.hand`}
                                        name={`hand`}
                                        value={!biometric.hand}
                                        color="primary"
                                        disabled={disabled}
                                      />
                                      <FormFeedback>
                                        {errors[`biometric.${index}.hand`]}
                                      </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-4">
                                      <div
                                        className={
                                          errors[`biometric.${index}.finger_id`]
                                            ? "is-invalid"
                                            : ""
                                        }
                                      >
                                        <Label
                                          for={`biometric.${index}.finger_id`}
                                        >
                                          Dedo de la mano
                                        </Label>
                                        <Select
                                          isSearchable="true"
                                          isDisabled={disabled}
                                          data-uuidv4={biometric.uuidv4}
                                          name="finger_id"
                                          id={`biometric.${index}.finger_id`}
                                          value={biometric.finger_id_object}
                                          onChange={(option) =>
                                            handleChangeSelectBiometric(
                                              option,
                                              "finger_id",
                                              biometric.uuidv4
                                            )
                                          }
                                          options={fingers}
                                        />
                                        <FormFeedback>
                                          {
                                            errors[
                                            `biometric.${index}.finger_id`
                                            ]
                                          }
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-4">
                                      <div>
                                        <Label for="finge_print">
                                          Huella ya escaneada
                                        </Label>
                                        <Input
                                          label="Huella ya escaneada"
                                          invalid={
                                            errors[
                                              `biometric.${index}.finge_print`
                                            ]
                                              ? true
                                              : false
                                          }
                                          id={`biometric.${index}.finge_print`}
                                          name={`finge_print`}
                                          data-uuidv4={biometric.uuidv4}
                                          onChange={(event) => {
                                            handleChangeBiometric(
                                              event,
                                              biometric.uuidv4
                                            );
                                          }}
                                          value={biometric.finge_print}
                                          type="text"
                                          disabled={disabled}
                                        />
                                        <FormFeedback>
                                          {
                                            errors[
                                            `biometric.${index}.finge_print`
                                            ]
                                          }
                                        </FormFeedback>
                                      </div>
                                    </FormGroup>
                                  </div>
                                  <Button
                                    color="danger"
                                    onClick={() => {
                                      removeBiometric(biometric);
                                    }}
                                  >
                                    Elimnar
                                  </Button>
                                </CardBody>
                              </Card>
                            </div>
                          );
                        })}
                      <div style={{ marginTop: "10px" }}>
                        <Button onClick={addBiometric} color="primary">
                          Agregar huella
                        </Button>
                      </div>
                      <div className={errors[`biometric`] ? "is-invalid" : ""}>
                        <FormFeedback>{errors[`biometric`]}</FormFeedback>
                      </div>
                    </FormGroup>
                  </div>
                ) : null}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => { closeModal(0); }}
                color="danger"
                className="text-white"
              >
                Cancel
              </Button>
              {!showHide && (
                <Button
                  color="primary"
                  className="text-white"
                  variant="contained"
                  disabled={loadingForm}
                  type="submit"
                >
                  {buttonFooter}
                </Button>
              )}
            </DialogActions>
          </Form>
        </div>
      ) : (
          <div style={{ height: "55vh" }}>
            <CircularProgress
              style={{
                position: "fixed",
                height: 40,
                top: "45%",
                right: "50%",
                zIndex: 2,
              }}
            />
          </div>
        )}
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = (dispatch) => ({
  storeClientAction: (data) => dispatch(storeClientAction(data)),
  loadClientIdAction: (_id) => dispatch(loadClientIdAction(_id)),
  confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
