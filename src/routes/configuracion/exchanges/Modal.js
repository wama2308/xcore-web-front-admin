import React, { useState, useEffect, Fragment } from "react";
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
import "../../../assets/css/style.css";
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

import { getServerErrors } from "./../../../factorys/validations";
import {
  storeSettingBillAction,
  loadSettingBillIdAction,
  updateSettingBillAction,
} from "../../../actions/ExchangesActions";

import { number_format, formatMonto } from "./../../../helpers/helpers";

const type_setting_bills = [
  { label: "Impresora fiscal", value: "printer_fiscal" },
  { label: "Impresora ticket", value: "printer_ticket" },
  { label: "Factura electrónica", value: "electronic_bill" },
  { label: "Recibo", value: "receipt" },
];

const Modal = (props) => {
  const isEditOrView = props.option === 2 || props.option === 3;

  const {
    data,
    modal,
    valorCloseModal,
    modalHeader,
    showHide,
    buttonFooter,
    storeSettingBillAction,
    disabled,
    option,
    dataGeneral,
    selectClient,
  } = props;

  const [form, setForm] = useState({
    name: "",
    acronym: "",
    currency_symbol: "",
    rate: "",
  });
  const [loading, setLoading] = useState("hide");
  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});

  if (isEditOrView && props.data && props.data._id) {
    useEffect(() => {
      getForeignExchange(props.data._id);
    }, []);
  }

  const getForeignExchange = (_id) => {
    setLoading("show");
    loadSettingBillIdAction(_id)
      .then((response) => {
        setLoading("hide");
        const { foreignExchange } = response.data;
        const _form = {};
        for (const key in foreignExchange) {
          if (foreignExchange.hasOwnProperty(key)) {
            const element = foreignExchange[key];
            if (key === "rate") {
              _form[key] = number_format(element, 2);
            } else {
              _form[key] = element;
            }
          }
        }
        setForm({ ..._form });
      })
      .catch((error) => {
        setLoading("hide");
      });
  };

  const handleChange = (event) => {
    let value =
      event.target.type !== "checkbox"
        ? event.target.value
        : event.target.checked;
    const name = event.target.name;

    if (name === "rate") {
      value = value
        .replace(/\D/g, "")
        .replace(/([0-9])([0-9]{2})$/, "$1.$2")
        .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    }

    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const eventoBlurRate = (event) => {
    if (form.rate === "" || form.rate === "0.0") {
      setForm({
        ...form,
        rate: "0.00",
      });
    }
  };

  const eventoFocusRate = (event) => {
    if (form.rate === "0.00") {
      setForm({
        ...form,
        rate: "",
      });
    }
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
    dataForm.rate = formatMonto(form.rate);
    if (option === 1) {
      storeSettingBillAction(dataForm)
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
            serverErrors = getServerErrors(data);
          }
          setLoadingForm(false);
          setErrors(serverErrors);
        });
    }
    if (option === 3) {
      dataForm._id = props.data._id;
      updateSettingBillAction(dataForm)
        .then((response) => {
          const { person } = response.data;
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
            serverErrors = getServerErrors(data);
          }
          setLoadingForm(false);
          setErrors(serverErrors);
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
                    <Label for="name">Nombre</Label>
                    <Input
                      label="Nombre"
                      invalid={errors["name"] ? true : false}
                      id="name"
                      name="name"
                      onChange={handleChange}
                      value={form.name}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["name"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="acronym">Acrónimo</Label>
                    <Input
                      label="Acrónimo"
                      invalid={errors["acronym"] ? true : false}
                      id="acronym"
                      name="acronym"
                      onChange={handleChange}
                      value={form.acronym}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["acronym"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="currency_symbol">Símbolo de moneda</Label>
                    <Input
                      label="Símbolo de moneda"
                      invalid={errors["currency_symbol"] ? true : false}
                      id="currency_symbol"
                      name="currency_symbol"
                      onChange={handleChange}
                      value={form.currency_symbol}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["currency_symbol"]}</FormFeedback>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="rate">Tasa a utilizar</Label>
                    <Input
                      label="Tasa a utilizar"
                      invalid={errors["rate"] ? true : false}
                      id="rate"
                      name="rate"
                      onChange={handleChange}
                      onBlur={eventoBlurRate}
                      onFocus={eventoFocusRate}
                      value={form.rate}
                      type="text"
                      disabled={disabled}
                    />
                    <FormFeedback>{errors["rate"]}</FormFeedback>
                  </div>
                </FormGroup>
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
  storeSettingBillAction: (data) => dispatch(storeSettingBillAction(data)),
  loadSettingBillIdAction: (_id) => dispatch(loadSettingBillIdAction(_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
