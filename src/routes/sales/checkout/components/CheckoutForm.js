import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import "../../../../assets/css/style.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import {
  Col,
  Input,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import {
  number_format,
  formatMonto,
} from "./../../../../helpers/helpers";
import { stateInitial } from './StateInitial';
import ListPaymentSale from "./ListPaymentSale";
import PartialPayments from "./PartialPayments";
//Actions
import {
  onSetForeignExchange,
  onSetLocalCurrency,
  setValueInCurrency,
} from "./../../../../actions/EcommerceActions";

import {
  addWayToPaySale,
  deletePaymentFunction,
  setAmountTotal,
  setAmountPartial,
} from "./../../../../actions/WayToPayActions";

import { openConfirmDialog } from "../../../../actions/aplicantionActions"
import Chip from '@material-ui/core/Chip';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const CheckoutForm = (props) => {
  const {
    cart,
    client,
    dataGeneral,
    wayToPays,
    foreignExchange,
    onSetForeignExchange,
    onSetLocalCurrency,
    setValueInCurrency,
    form_currency,
    loading,
    loadingForm,
    disabled,
    errors,
    onSubmit,
    getTotalPrice,
  } = props;

  const [valueTabs, setValueTabs] = useState(0);
  const initialFormState = stateInitial;
  const [datosForm, setDatosForm] = useState(initialFormState)

  const handleChange = e => {
    const { name, value } = e.target;
    setDatosForm(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === "montoLocal") {
      props.setAmountTotal(e.target.value, 'change');
    }
    if (name === "montoPartial") {
      props.setAmountPartial(e.target.value, 'change');
    }
    if (name === "montoDivisa" && datosForm.formaPagoDivisa !== null) {
      console.log(value)
      console.log(datosForm.formaPagoDivisa)
      setDatosForm(prev => ({
        ...prev,
        montoConversionDivisa: number_format((parseFloat(value) * datosForm.formaPagoDivisa.info.rate), 2)
      }))
    }
  };

  const handlekey = (campo, campoError, campoErrorText, hide) => {
    let monto = event.target.value.replace(/\D/g, "")
      .replace(/([0-9])([0-9]{2})$/, '$1.$2')
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    setDatosForm(prev => ({
      ...prev,
      [campo]: monto,
      [campoError]: false,
      [campoErrorText]: "",
      [hide]: "hide",
    }));
    if (campo === 'montoPartial') {
      setDatosForm(prev => ({
        ...prev,
        montoLocalError: false,
        montoLocalErrorText: "",
        montoLocalErrorHide: "hide",
      }));
    }
  };

  const eventoBlur = name => event => {
    if (event.target.value === '' || event.target.value === '0.0') {
      setDatosForm(prev => ({
        ...prev,
        [name]: "0.00",
      }));
      if (name === "montoLocal") {
        props.setAmountTotal(event.target.value, 'blur');
      }
      if (name === "montoPartial") {
        props.setAmountPartial(event.target.value, 'blur');
      }
    }
  }

  const eventoFocus = name => event => {
    if (event.target.value === '0.00') {
      setDatosForm(prev => ({
        ...prev,
        [name]: "",
      }));
      if (name === "montoLocal") {
        props.setAmountTotal(event.target.value, 'focus');
      }
      if (name === "montoPartial") {
        props.setAmountPartial(event.target.value, 'focus');
      }
    }
  }

  const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
    setDatosForm(prev => ({
      ...prev,
      [select]: value,
      [selectError]: "",
      [selectErrorText]: "",
      [selecthide]: "hide",
    }));
  };


  const validate = () => {
    let acum = "";
    let pagoLocal = datosForm.formaPagoLocal === null ?
      props.form_currency.local_currency.find(data => data.default === true) :
      datosForm.formaPagoLocal;

    if (props.wayToPaySale.amount === '0.00' || props.wayToPaySale.amount === '') {
      setDatosForm(prev => ({
        ...prev,
        montoLocalError: true,
        montoLocalErrorText: "Ingrese el monto",
        montoLocalErrorHide: 'show',
      }))
      acum = 1;
    }
    if (datosForm.formaPagoLocal === null) {
      setDatosForm(prev => ({
        ...prev,
        formaPagoLocalError: 'borderColor',
        formaPagoLocalTextError: "Seleccione la forma de pago",
        formaPagoLocalHide: 'show',
      }))
      acum = 1;
    }
    if ((formatMonto(props.wayToPaySale.amount) + props.wayToPaySale.amountPaidOut) > props.wayToPaySale.amountTotal) {
      setDatosForm(prev => ({
        ...prev,
        montoLocalError: true,
        montoLocalErrorText: "El monto a pagar no puede ser mayor al monto total",
        montoLocalErrorHide: 'show',
      }))
      acum = 1;
    }
    if (datosForm.formaPagoLocal !== null) {
      let findMonedaLocal = props.wayToPaySale.arrayWayToPaySale.find(pago => pago.paymentMethodLocal !== null &&
        pago.paymentMethodLocal.value === pagoLocal.value)
      if (findMonedaLocal) {
        setDatosForm(prev => ({
          ...prev,
          formaPagoLocalError: 'borderColor',
          formaPagoLocalTextError: "Forma de pago ya registrada",
          formaPagoLocalHide: 'show',
        }))
        acum = 1;
      }
    }
    // PARA LOS PAGOS PARCIALES
    if (props.wayToPaySale.payPartial && (props.wayToPaySale.amountPartial === '0.00' || props.wayToPaySale.amountPartial === '')) {
      setDatosForm(prev => ({
        ...prev,
        montoPartialError: true,
        montoPartialErrorText: "¡Debe ingresar el monto parcial!",
        montoPartialErrorHide: 'show',
      }))
      acum = 1;
    }
    if (props.wayToPaySale.payPartial &&
      (formatMonto(props.wayToPaySale.amountPartial) > (props.wayToPaySale.amountTotal - props.wayToPaySale.amountFijo))
    ) {
      setDatosForm(prev => ({
        ...prev,
        montoPartialError: true,
        montoPartialErrorText: "¡El monto parcial no puede ser mayor al maximo parcial!",
        montoPartialErrorHide: 'show',
      }))
      acum = 1;
    }
    if (props.wayToPaySale.payPartial &&
      ((formatMonto(props.wayToPaySale.amount) + props.wayToPaySale.amountPaidOut) > props.wayToPaySale.amountTotalPartial)
    ) {
      setDatosForm(prev => ({
        ...prev,
        montoLocalError: true,
        montoLocalErrorText: "El monto a pagar no puede ser mayor al monto total",
        montoLocalErrorHide: 'show',
      }))
      acum = 1;
    }
    if (acum > 0) {
      return false;
    }
    return true;
  }

  const handleAddPayment = event => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      props.addWayToPaySale(
        {
          paymentMethodLocal: datosForm.formaPagoLocal,
          paymentMethodForeign: null,
          amount: formatMonto(props.wayToPaySale.amount),
          amountForeign: 0
        },
        () => {
          setDatosForm(prev => ({
            ...prev,
            formaPagoLocal: null,
            formaPagoLocalError: '',
            formaPagoLocalTextError: "",
            formaPagoLocalHide: 'hide',
            montoLocal: '0.00',
            montoLocalError: false,
            montoLocalErrorText: "",
            montoLocalErrorHide: 'hide',
          }));
        },
        props.wayToPaySale
      );
    }
  }

  const validateForeign = () => {
    let acum = "";
    let pagoDivisa = datosForm.formaPagoDivisa;
    if (datosForm.montoDivisa === '0.00' || datosForm.montoDivisa === '') {
      setDatosForm(prev => ({
        ...prev,
        montoDivisaError: true,
        montoDivisaErrorText: "Ingrese el monto",
        montoDivisaErrorHide: 'show',
      }))
      acum = 1;
    }
    if (datosForm.formaPagoDivisa === null) {
      setDatosForm(prev => ({
        ...prev,
        formaPagoDivisaError: 'borderColor',
        formaPagoDivisaTextError: "Seleccione la forma de pago",
        formaPagoDivisaHide: 'show',
      }))
      acum = 1;
    }
    if (datosForm.montoDivisa !== '0.00' && datosForm.formaPagoDivisa !== null) {
      let acumAmount = formatMonto(datosForm.montoDivisa) * datosForm.formaPagoDivisa.info.rate;
      if ((acumAmount + props.wayToPaySale.amountPaidOut) > props.wayToPaySale.amountTotal) {
        setDatosForm(prev => ({
          ...prev,
          montoDivisaError: true,
          montoDivisaErrorText: "El monto a pagar no puede ser mayor al monto total",
          montoDivisaErrorHide: 'show',
        }))
        acum = 1;
      }
    }
    if (pagoDivisa !== null) {
      let findMonedaDivisa = props.wayToPaySale.arrayWayToPaySale.find(pago => pago.paymentMethodForeign !== null &&
        pago.paymentMethodForeign.value === pagoDivisa.value);
      if (findMonedaDivisa) {
        setDatosForm(prev => ({
          ...prev,
          formaPagoDivisaError: 'borderColor',
          formaPagoDivisaTextError: "Forma de pago ya registrada",
          formaPagoDivisaHide: 'show',
        }))
        acum = 1;
      }
    }
    // PARA LOS PAGOS PARCIALES
    if (props.wayToPaySale.payPartial && (props.wayToPaySale.amountPartial === '0.00' || props.wayToPaySale.amountPartial === '')) {
      setDatosForm(prev => ({
        ...prev,
        montoPartialError: true,
        montoPartialErrorText: "¡Debe ingresar el monto parcial!",
        montoPartialErrorHide: 'show',
      }))
      acum = 1;
    }
    if (props.wayToPaySale.payPartial &&
      (formatMonto(props.wayToPaySale.amountPartial) > (props.wayToPaySale.amountTotal - props.wayToPaySale.amountFijo))
    ) {
      setDatosForm(prev => ({
        ...prev,
        montoPartialError: true,
        montoPartialErrorText: "¡El monto parcial no puede ser mayor al maximo parcial!",
        montoPartialErrorHide: 'show',
      }))
      acum = 1;
    }
    if (props.wayToPaySale.payPartial && datosForm.montoDivisa !== '0.00' && datosForm.formaPagoDivisa !== null) {
      let acumAmount = formatMonto(datosForm.montoDivisa) * datosForm.formaPagoDivisa.info.rate;
      if ((acumAmount + props.wayToPaySale.amountPaidOut) > props.wayToPaySale.amountTotalPartial) {
        setDatosForm(prev => ({
          ...prev,
          montoDivisaError: true,
          montoDivisaErrorText: "El monto a pagar no puede ser mayor al monto total",
          montoDivisaErrorHide: 'show',
        }))
        acum = 1;
      }
    }
    if (acum > 0) {
      return false;
    }
    return true;
  }

  const handleAddPaymentForeign = event => {
    event.preventDefault();
    const isValid = validateForeign();
    if (isValid) {
      let amountLocal = formatMonto(datosForm.montoDivisa) * datosForm.formaPagoDivisa.info.rate;

      props.addWayToPaySale(
        {
          paymentMethodLocal: null,
          paymentMethodForeign: datosForm.formaPagoDivisa,
          amount: amountLocal,
          amountForeign: formatMonto(datosForm.montoDivisa)
        },
        () => {
          setDatosForm(prev => ({
            ...prev,
            formaPagoDivisa: null,
            formaPagoDivisaError: '',
            formaPagoDivisaTextError: '',
            formaPagoDivisaHide: 'hide',
            montoDivisa: '0.00',
            montoConversionDivisa: '0.00',
            montoDivisaError: false,
            montoDivisaErrorText: '',
            montoDivisaErrorHide: 'hide'
          }));
        },
        props.wayToPaySale
      );
    }
  }

  const onSetValueTabs = () => {
    const newValue = valueTabs === 0 ? 1 : 0;
    setValueTabs(newValue);
  };

  useEffect(() => {
    //console.log("useEffect checkout form ", props.wayToPaySale)
    if (props.form_currency.local_currency.length > 0 && datosForm.actionProps === 0) {
      let formaPagoDefault = props.form_currency.local_currency.find(data => data.default === true);
      let findMonedaLocal = props.wayToPaySale.arrayWayToPaySale.find(pago => pago.paymentMethodLocal !== null &&
        pago.paymentMethodLocal.value === formaPagoDefault.value);

      setDatosForm(prev => ({
        ...prev,
        formaPagoLocal: findMonedaLocal ? null : formaPagoDefault,
        montoLocal: !props.wayToPaySale.payPartial ? getTotalPrice().totalPrice : "0.00",
        actionProps: 1,
      }));

      if (!props.wayToPaySale.payPartial) {
        props.getAmountTotal(getTotalPrice().totalPrice)
      }
    }

  }, [props]);

  //console.log("checkout props ", props.wayToPaySale)
  return (
    <div className="checkout-form-wrap p-4">
      <Form onSubmit={onSubmit}>
        <div className="">
          <AppBar position="static" color="default">
            <Tabs
              value={valueTabs}
              onChange={onSetValueTabs}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Moneda local" />
              <Tab label="Divisas" />
            </Tabs>
          </AppBar>
          {valueTabs === 0 && (
            <TabContainer>
              {form_currency["local_currency"] &&
                Array.isArray(form_currency["local_currency"]) && (
                  <div>
                    {
                      props.wayToPaySale.payPartial && (
                        <PartialPayments
                          data={props.wayToPaySale}
                          currency_symbol={props.currency_symbol}
                          handleChange={handleChange}
                          handlekey={handlekey}
                          eventoBlur={eventoBlur}
                          eventoFocus={eventoFocus}
                          datosForm={datosForm}
                          setDatosForm={setDatosForm}
                        />
                      )
                    }
                    <FormGroup row>
                      <Label sm={3} for='formaPagoLocal'>
                        <IntlMessages id="components.wayToPay" />
                      </Label>
                      <div className={`col-sm-9`}>
                        <Select
                          className={`${datosForm.formaPagoLocalError}`}
                          isClearable
                          isSearchable
                          name="formaPagoLocal"
                          id="formaPagoLocal"
                          value={datosForm.formaPagoLocal}
                          onChange={event => handleChangeSelect(
                            event,
                            "formaPagoLocal",
                            "formaPagoLocalError",
                            "formaPagoLocalTextError",
                            "formaPagoLocalHide"
                          )}
                          options={form_currency.local_currency}
                        />
                        <div className={`${datosForm.formaPagoLocalHide} errorControlRowSelect`}>
                          {datosForm.formaPagoLocalTextError}
                        </div>
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={3} for='montoLocal'>
                        <IntlMessages id="components.montoWayToPay" />
                      </Label>
                      <div className={` col-sm-9`}>
                        <Input
                          invalid={datosForm.montoLocalError}
                          id="montoLocal"
                          name="montoLocal"
                          onKeyUp={event => handlekey(
                            "montoLocal",
                            "montoLocalError",
                            "montoLocalErrorText",
                            "montoLocalErrorHide"
                          )}
                          value={props.wayToPaySale.amount}
                          onChange={event => handleChange(event)}
                          onBlur={eventoBlur("montoLocal")}
                          onFocus={eventoFocus("montoLocal")}
                          type="text"
                        />
                        <div className={`${datosForm.montoLocalErrorHide} errorControlRowInput`}>
                          {datosForm.montoLocalErrorText}
                        </div>
                      </div>
                    </FormGroup>
                    <FormGroup check row>
                      <Col sm={{ offset: 10 }}>
                        <Button color="primary"
                          className="text-white"
                          variant="contained"
                          onClick={handleAddPayment}
                          disabled={cart.length > 0 ? false : true}
                        >
                          Agregar
                        </Button>
                      </Col>
                    </FormGroup>
                    <ListPaymentSale
                      data={props.wayToPaySale.arrayWayToPaySale}
                      currency_symbol={props.currency_symbol}
                      confirm={props.openConfirmDialog}
                      deletePaymentFunction={props.deletePaymentFunction}
                    />
                  </div>
                )}
            </TabContainer>
          )}
          {valueTabs === 1 && (
            <TabContainer>
              {form_currency["local_currency"] &&
                Array.isArray(form_currency["local_currency"]) && (
                  <div>
                    {
                      props.wayToPaySale.payPartial && (
                        <PartialPayments
                          data={props.wayToPaySale}
                          currency_symbol={props.currency_symbol}
                          handleChange={handleChange}
                          handlekey={handlekey}
                          eventoBlur={eventoBlur}
                          eventoFocus={eventoFocus}
                          datosForm={datosForm}
                          setDatosForm={setDatosForm}
                        />
                      )
                    }
                    <FormGroup row>
                      <Label sm={3} for='formaPagoDivisa'>
                        <IntlMessages id="components.wayToPay" />
                      </Label>
                      <div className={`col-sm-9`}>
                        <Select
                          className={`${datosForm.formaPagoDivisaError}`}
                          isClearable
                          isSearchable
                          name="formaPagoDivisa"
                          id="formaPagoDivisa"
                          value={datosForm.formaPagoDivisa}
                          onChange={event => handleChangeSelect(
                            event,
                            "formaPagoDivisa",
                            "formaPagoDivisaError",
                            "formaPagoDivisaTextError",
                            "formaPagoDivisaHide"
                          )}
                          options={form_currency.foreign_currency}
                        />
                        <div className={`${datosForm.formaPagoDivisaHide} errorControlRowSelect`}>
                          {datosForm.formaPagoDivisaTextError}
                        </div>
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={3} for='montoDivisa'>
                        <IntlMessages id="components.montoWayToPay" />
                      </Label>
                      <div className={` col-sm-9`}>
                        <Input
                          invalid={datosForm.montoDivisaError}
                          id="montoDivisa"
                          name="montoDivisa"
                          onKeyUp={event => handlekey(
                            "montoDivisa",
                            "montoDivisaError",
                            "montoDivisaErrorText",
                            "montoDivisaErrorHide"
                          )}
                          value={datosForm.montoDivisa}
                          onChange={event => handleChange(event)}
                          onBlur={eventoBlur("montoDivisa")}
                          onFocus={eventoFocus("montoDivisa")}
                          type="text"
                        />
                        <div className={`${datosForm.montoDivisaErrorHide} errorControlRowInput`}>
                          {datosForm.montoDivisaErrorText}
                        </div>
                      </div>
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {
                        datosForm.formaPagoDivisa !== null && (
                          <div >
                            <Chip
                              size="medium"
                              label={`${datosForm.formaPagoDivisa.label} a ${props.currency_symbol}: ${number_format(datosForm.montoConversionDivisa, 2)}`}
                              clickable
                              color="default"
                            />
                          </div>
                        )
                      }
                      <div >
                        <Button color="primary"
                          className="text-white"
                          variant="contained"
                          onClick={handleAddPaymentForeign}
                          disabled={cart.length > 0 ? false : true}
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                    <ListPaymentSale
                      data={props.wayToPaySale.arrayWayToPaySale}
                      currency_symbol={props.currency_symbol}
                      confirm={props.openConfirmDialog}
                      deletePaymentFunction={props.deletePaymentFunction}
                    />
                  </div>
                )}
            </TabContainer>
          )}
        </div>
      </Form>
      <hr />
      <Tooltip title="Regresar al carro" placement="top">
        <Fragment>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/app/sales/cart"
            className="text-white"
          >
            Atras
          </Button>
        </Fragment>
      </Tooltip>
    </div >
  );
};

const mapStateToProps = ({ ecommerce, general, wayToPaySale }) => {
  const { cart, client, foreignExchange, form_currency } = ecommerce;
  const { dataGeneral } = general;
  const { countryConfiguration } = dataGeneral;
  const { currency_symbol } = countryConfiguration;
  const { wayToPays } = countryConfiguration;
  return {
    cart,
    client,
    dataGeneral,
    wayToPays,
    foreignExchange,
    form_currency,
    wayToPaySale,
    currency_symbol
  };
};

export default connect(mapStateToProps, {
  onSetForeignExchange,
  onSetLocalCurrency,
  setValueInCurrency,
  addWayToPaySale,
  openConfirmDialog,
  deletePaymentFunction,
  setAmountTotal,
  setAmountPartial,
})(CheckoutForm);
