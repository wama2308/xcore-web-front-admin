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

const PaymentLocalPurchase = props => {
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
        if((props.purchase.paidUp + formatMonto(modal.amountLocal)) > formatMonto(props.purchase.totalPurchase)){
            setModal(prev => ({
                ...prev,
                amountLocalError: true,
                amountLocalTextError: "¡El monto a ingresar no puede ser mayor al total!",
                amountLocalHide: 'show',
            }))
        }
        if(props.purchase.wayToPay.find(data => data._id === modal.paymentTypeLocal)){
            setModal(prev => ({
                ...prev,
                paymentTypeLocalError: true,
                paymentTypeLocalTextError: "¡Forma de pago ya registrada!",
                paymentTypeLocalHide: 'show',
            }))
            acum = 1;
        }
        if (modal.paymentTypeLocal === '0') {
            setModal(prev => ({
                ...prev,
                paymentTypeLocalError: true,
                paymentTypeLocalTextError: "¡Seleccione la forma de pago!",
                paymentTypeLocalHide: 'show',
            }))
            acum = 1;
        }
        if (modal.amountLocal === '' || modal.amountLocal === '0.00') {
            setModal(prev => ({
                ...prev,
                amountLocalError: true,
                amountLocalTextError: "¡Ingrese el monto!",
                amountLocalHide: 'show',
            }))
            acum = 1;
        }
        if (acum > 0) {
            //NotificationManager.warning("¡Verifique los campos del formulario para agregar pagos!");
            return false;
        }
        return true;
    }

    const handlePaymentLocalAction = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            let typePay = props.wayToPayLocal.find(data => data.value === modal.paymentTypeLocal)
            let data = {
                _id: modal.paymentTypeLocal,
                name: typePay.label,
                amount: formatMonto(modal.amountLocal),
                local: true,
                rate: 0,
                currencySymbolExchange: '',
            }
            props.addWayToPayFunction(data, () => { cleanCampos() })
        }
    }

    const cleanCampos = () => {
        setModal(prev => ({
            ...prev,
            paymentTypeLocal: '0',
            paymentTypeLocalError: false,
            paymentTypeLocalTextError: '',
            paymentTypeLocalHide: 'hide',
            amountLocal: '0.00',
            amountLocalError: false,
            amountLocalTextError: '',
            amountLocalHide: 'hide',
        }))
    }

    return (
        <div className="row">
            <FormGroup className="top form-group col-sm-6">
                <div>
                    <Label for="paymentTypeLocal">Forma de Pago</Label>
                    <Input
                        invalid={modal.paymentTypeLocalError}
                        type="select"
                        name="paymentTypeLocal"
                        id="paymentTypeLocal"
                        value={modal.paymentTypeLocal}
                        onChange={event => handleChangeSelectSimple(
                            event.target.value,
                            "paymentTypeLocal",
                            "paymentTypeLocalError",
                            "paymentTypeLocalTextError",
                            "paymentTypeLocalHide"
                        )}
                        disabled={props.disabled}
                    >
                        <option value='0' >Seleccione...</option>
                        {
                            props.wayToPayLocal.map((data, i) => {
                                return (
                                    <option key={i} value={data.value} >{data.label}</option>
                                )
                            })
                        }
                    </Input>
                    <div className={`${modal.paymentTypeLocalHide} errorControl`}>
                        {modal.paymentTypeLocalTextError}
                    </div>
                </div>
            </FormGroup>
            <FormGroup className="top form-group col-sm-6">
                <div>
                    <Label for="amountLocal">Monto</Label>
                    <Input
                        invalid={modal.amountLocalError}
                        id="amountLocal"
                        name="amountLocal"
                        onKeyUp={() => handlekeyMonto(
                            "amountLocal",
                            "amountLocalError",
                            "amountLocalTextError",
                            "amountLocalHide"
                        )}
                        onChange={handleChange}
                        onBlur={eventoBlur("amountLocal")}
                        onFocus={eventoFocus("amountLocal")}
                        value={modal.amountLocal}
                        type="text"
                        disabled={props.disabled}
                    />
                    <div className={`${modal.amountLocalHide} errorControl`}>
                        {modal.amountLocalTextError}
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
                            onClick={handlePaymentLocalAction}
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

export default PaymentLocalPurchase