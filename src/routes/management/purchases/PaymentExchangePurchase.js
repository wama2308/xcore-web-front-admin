import React, { Fragment, useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
} from "reactstrap";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import "../../../assets/css/style.css";
import { number_format, formatMonto } from "../../../helpers/helpers";
import { NotificationManager } from 'react-notifications';

const PaymentExchangePurchase = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const handleChange = e => {
        const { name, value } = e.target;
        setModal(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setModal(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        setModal(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));
    };

    const handleChangeSelectSimple = (value, select, selectError, selectErrorText, selecthide) => {
        setModal(prev => ({
            ...prev,
            [select]: value,
            [selectError]: false,
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));
    };

    const handlekeyMonto = (campo, campoError, campoErrorText, campohide) => {
        let monto = event.target.value.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");

        setModal(prev => ({
            ...prev,
            [campo]: monto,
            [campoError]: false,
            [campoErrorText]: "",
            [campohide]: "hide",
        }));
    };

    const eventoBlur = name => event => {
        if (event.target.value === '' || event.target.value === '0.0') {
            setModal(prev => ({
                ...prev,
                [name]: '0.00'
            }));
        }
    }

    const eventoFocus = name => event => {
        if (event.target.value === '0.00') {
            setModal(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }

    const validate = () => {
        let acum = "";        
        if(props.purchase.totalPurchase === '0.00' || props.purchase.totalPurchase === 0){
            NotificationManager.warning("¡Debe ingresar al menos un producto!");
            acum = 1;
        }
        if(props.purchase.wayToPay.find(data => data._id === modal.paymentTypeExchange)){
            setModal(prev => ({
                ...prev,
                paymentTypeExchangeError: true,
                paymentTypeExchangeTextError: "¡Forma de pago ya registrada!",
                paymentTypeExchangeHide: 'show',
            }))
            acum = 1;
        }
        if((props.purchase.paidUp + formatMonto(modal.amountExchange)) > formatMonto(props.purchase.totalPurchase)){
            setModal(prev => ({
                ...prev,
                amountExchangeError: true,
                amountExchangeTextError: "¡El monto a ingresar no puede ser mayor al total!",
                amountExchangeHide: 'show',
            }))
        }
        if (modal.paymentTypeExchange === '0') {
            setModal(prev => ({
                ...prev,
                paymentTypeExchangeError: true,
                paymentTypeExchangeTextError: "¡Seleccione la forma de pago!",
                paymentTypeExchangeHide: 'show',
            }))
            acum = 1;
        }
        if (modal.amountExchange === '' || modal.amountExchange === '0.00') {
            setModal(prev => ({
                ...prev,
                amountExchangeError: true,
                amountExchangeTextError: "¡Ingrese el monto!",
                amountExchangeHide: 'show',
            }))
            acum = 1;
        }
        if (acum > 0) {
            //NotificationManager.warning("¡Verifique los campos del formulario para agregar pagos!");
            return false;
        }
        return true;
    }

    const handlePaymentExchangeAction = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            let typePay = props.wayToPayExchange.find(data => data.value === modal.paymentTypeExchange)
            let data = {
                _id: modal.paymentTypeExchange,
                name: typePay.label,
                amount: formatMonto(modal.amountExchange),
                local: false,
                rate: typePay.info.rate,
                currencySymbolExchange: typePay.info.currency_symbol,
            }
            props.addWayToPayFunction(data, () => { cleanCampos() })
        }
    }

    const cleanCampos = () => {
        setModal(prev => ({
            ...prev,
            paymentTypeExchange: '0',
            paymentTypeExchangeError: false,
            paymentTypeExchangeTextError: '',
            paymentTypeExchangeHide: 'hide',
            amountExchange: '0.00',
            amountExchangeError: false,
            amountExchangeTextError: '',
            amountExchangeHide: 'hide',
        }))
    }

    return (
        <div className="row">
            <FormGroup className="top form-group col-sm-6">
                <div>
                    <Label for="paymentTypeExchange">Forma de Pago</Label>
                    <Input
                        invalid={modal.paymentTypeExchangeError}
                        type="select"
                        name="paymentTypeExchange"
                        id="paymentTypeExchange"
                        value={modal.paymentTypeExchange}
                        onChange={event => handleChangeSelectSimple(
                            event.target.value,
                            "paymentTypeExchange",
                            "paymentTypeExchangeError",
                            "paymentTypeExchangeTextError",
                            "paymentTypeExchangeHide"
                        )}
                        disabled={props.disabled}
                    >
                        <option value='0' >Seleccione...</option>
                        {
                            props.wayToPayExchange.map((data, i) => {
                                return (
                                    <option key={i} value={data.value} >{data.label}</option>
                                )
                            })
                        }
                    </Input>
                    <div className={`${modal.paymentTypeExchangeHide} errorControl`}>
                        {modal.paymentTypeExchangeTextError}
                    </div>
                </div>
            </FormGroup>
            <FormGroup className="top form-group col-sm-6">
                <div>
                    <Label for="amountExchange">Monto</Label>
                    <Input
                        invalid={modal.amountExchangeError}
                        id="amountExchange"
                        name="amountExchange"
                        onKeyUp={() => handlekeyMonto(
                            "amountExchange",
                            "amountExchangeError",
                            "amountExchangeTextError",
                            "amountExchangeHide"
                        )}
                        onChange={handleChange}
                        onBlur={eventoBlur("amountExchange")}
                        onFocus={eventoFocus("amountExchange")}
                        value={modal.amountExchange}
                        type="text"
                        disabled={props.disabled}
                    />
                    <div className={`${modal.amountExchangeHide} errorControl`}>
                        {modal.amountExchangeTextError}
                    </div>
                </div>
            </FormGroup>
            <FormGroup className="top form-group col-sm-12">
                {
                    !props.disabled &&
                    <div className="" style={{ marginLeft: 'auto' }}>
                        <Button
                            color="primary"
                            className="text-white"
                            variant="contained"
                            onClick={handlePaymentExchangeAction}
                            disabled={props.disabled}
                        >
                            Agregar
                            </Button>
                    </div>
                }
            </FormGroup>
            {/* <div style={{ minHeight: '250px' }}></div> */}
            {/* {
                    props.data && props.data.length > 0 && (
                        <FormGroup className="top form-group col-sm-12">
                            <ListProducts
                                data={props.data}
                                deleteProducto={deleteProducto}
                                editProducto={editProducto}
                                disabled={props.disabled}
                            />
                        </FormGroup>
                    )
                } */}
        </div>

    )
}

export default PaymentExchangePurchase