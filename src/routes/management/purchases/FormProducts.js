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
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { number_format, formatMonto } from "../../../helpers/helpers";
import { NotificationManager } from 'react-notifications';

const FormProducts = props => {
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

    const handleChangeSwitch = (name) => event => {
        setModal(prev => ({
            ...prev,
            [name]: event.target.checked,
        }));
        if (event.target.checked === false) {
            setModal(prev => ({
                ...prev,
                productProfitAmount: '0.00',
                productProfitPercentage: '',
            }));
        } else {
            setModal(prev => ({
                ...prev,
                productProfitPercentage: '',
                productProfitAmount: '0.00',
            }));
        }
    }

    const handlekeyMonto = (campo, campoError, campoErrorText, campohide) => {
        let monto = event.target.value.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");

        let price = formatMonto(modal.productUnitPrice);
        let priceGain = 0;

        if (campo === 'productProfitPercentage') {
            let percentage = formatMonto(monto);
            priceGain = (price + (price * (percentage / 100)))
            setModal(prev => ({
                ...prev,
                productProfitAmount: number_format(priceGain, 2)
            }))
        }
        if (campo === 'productProfitAmount') {
            let amountGain = formatMonto(monto);
            priceGain = (((amountGain - price) / price) * 100);
            setModal(prev => ({
                ...prev,
                productProfitPercentage: priceGain,
            }))
        }
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
        if (modal.productName === '') {
            setModal(prev => ({
                ...prev,
                productNameError: true,
                productNameTextError: "¡Ingrese el producto!",
                productNameHide: 'show',
            }))
            acum = 1;
        }
        if (modal.arrayCategoryproduct === null) {
            setModal(prev => ({
                ...prev,
                arrayCategoryproductError: 'borderColor',
                arrayCategoryproductTextError: "¡Seleccione la categoria!",
                arrayCategoryproductHide: 'show',
            }))
            acum = 1;
        }
        if (modal.arrayCategoryproduct === null) {
            setModal(prev => ({
                ...prev,
                arrayCategoryproductError: 'borderColor',
                arrayCategoryproductTextError: "¡Seleccione la categoria!",
                arrayCategoryproductHide: 'show',
            }))
            acum = 1;
        }
        if (modal.productQuantity === '' || modal.productQuantity === '0') {
            setModal(prev => ({
                ...prev,
                productQuantityError: true,
                productQuantityTextError: "¡Ingrese la cantidad!",
                productQuantityHide: 'show',
            }))
            acum = 1;
        }
        if (modal.productUnitPrice === '' || modal.productUnitPrice === '0.00') {
            setModal(prev => ({
                ...prev,
                productUnitPriceError: true,
                productUnitPriceTextError: "¡Ingrese el precio!",
                productUnitPriceHide: 'show',
            }))
            acum = 1;
        }
        if (modal.productProfitPercentage === '' || modal.productProfitPercentage === '0.00' || modal.productProfitPercentage === '0') {
            setModal(prev => ({
                ...prev,
                productProfitPercentageError: true,
                productProfitPercentageTextError: "¡Ingrese el porcentaje de ganancia!",
                productProfitPercentageHide: 'show',
            }))
            acum = 1;
        }
        if (modal.productExempt === null) {
            setModal(prev => ({
                ...prev,
                productExemptError: 'borderColor',
                productExemptTextError: "¡Seleccione si es exento o no!",
                productExemptHide: 'show',
            }))
            acum = 1;
        }
        if (modal.productExempt && !modal.productExempt.value && modal.productTax === null) {
            setModal(prev => ({
                ...prev,
                productTaxError: 'borderColor',
                productTaxTextError: "¡Seleccione el impuesto!",
                productTaxHide: 'show',
            }))
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario para agregar un producto!");
            return false;
        }
        return true;
    }

    const handleProductAction = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            let data = {
                product_id: "0",
                name: modal.productName,
                product_category_id: modal.arrayCategoryproduct.value,
                categoria: modal.arrayCategoryproduct.label,
                descripcion: modal.productDescription,
                quantity: parseFloat(modal.productQuantity),
                profit_percentage: modal.productProfitPercentage,
                profit_amount: modal.productProfitAmount,
                unit_price: formatMonto(modal.productUnitPrice),
                sale_price: formatMonto(modal.productProfitAmount),
                exempt: modal.productExempt.value,
                tax_id: !modal.productExempt.value ? modal.productTax.value : 0,
                tax: !modal.productExempt.value ? parseFloat(modal.productTax.label) : 0
            }
            if (modal.actionProduct === 0) {
                props.addNewProductFunction(data, () => { cleanCampos() })
            } else {
                props.editProductPurchaseFunction(modal.keyProduct, data, modal.dataProduct, () => { cleanCampos() })
            }
        }
    }

    const cleanCampos = () => {
        setModal(prev => ({
            ...prev,
            productName: '',
            productNameError: false,
            productNameTextError: '',
            productNameHide: 'hide',
            arrayCategoryproduct: null,
            arrayCategoryproductError: '',
            arrayCategoryproductTextError: '',
            arrayCategoryproductHide: 'hide',
            productDescription: '',
            productDescriptionError: false,
            productDescriptionTextError: '',
            productDescriptionHide: 'hide',
            productQuantity: '',
            productQuantityError: false,
            productQuantityTextError: '',
            productQuantityHide: 'hide',
            productUnitPrice: '0.00',
            productUnitPriceError: false,
            productUnitPriceTextError: '',
            productUnitPriceHide: 'hide',
            productProfitAmount: '0.00',
            productProfitAmountError: false,
            productProfitAmountTextError: '',
            productProfitAmountHide: 'hide',
            productProfitPercentage: '',
            productProfitPercentageError: false,
            productProfitPercentageTextError: '',
            productProfitPercentageHide: 'hide',
            productExempt: null,
            productExemptError: '',
            productExemptTextError: '',
            productExemptHide: 'hide',
            productTax: null,
            productTaxError: '',
            productTaxTextError: '',
            productTaxHide: 'hide',
            percentageAmountGain: false,
            keyProduct: -1,
            productId: 0,
            actionProduct: 0,
            dataProduct: {},
        }))
    }

    const editProducto = (key, data) => {
        const message = {
            title: "Editar Producto",
            info: "¿Esta seguro que desea editar este producto?"
        };
        props.confirm(message, res => {
            if (res) {
                setModal(prev => ({
                    ...prev,
                    productName: data.name,
                    arrayCategoryproduct: props.categoryProducts.find(category => category.value === data.product_category_id),
                    productQuantity: number_format(data.quantity, 2),
                    productUnitPrice: number_format(data.unit_price, 2),
                    productProfitPercentage: number_format(data.profit_percentage, 2),
                    productProfitAmount: number_format(data.profit_amount, 2),
                    productExempt: modal.arrayOptionExempt.find(exempt => exempt.value === data.exempt),
                    productTax: !data.exempt ? props.tax.find(tax => tax.value === data.tax_id) : null,
                    productDescription: data.descripcion,
                    dataProduct: data,
                    keyProduct: key,
                    productId: data.product_id,
                    actionProduct: 1,
                }))
            }
        });
    }

    const deleteProducto = (key, data) => {
        if (modal.keyProduct === key) {
            NotificationManager.warning("¡El producto esta en proceso de edicion, no puede ser eliminado!");
        } else {
            const message = {
                title: "Eliminar Producto",
                info: "¿Esta seguro que desea eliminar este producto?"
            };
            props.confirm(message, res => {
                if (res) {
                    props.deleteProdutcPurchaseFunction(key, data);
                }
            });
        }
    }

    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productName">Nombre</Label>
                        <Input
                            invalid={modal.productNameError}
                            id="productName"
                            name="productName"
                            onKeyUp={event => handlekey(
                                "productNameError",
                                "productNameTextError",
                                "productNameHide",
                                1
                            )}
                            onChange={handleChange}
                            value={modal.productName}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${modal.productNameHide} errorControl`}>
                            {modal.productNameTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="arrayCategoryproduct">Categoria</Label>
                        <div className={modal.arrayCategoryproductError}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="arrayCategoryproduct"
                                id="arrayCategoryproduct"
                                value={modal.arrayCategoryproduct}
                                onChange={event => handleChangeSelect(
                                    event,
                                    "arrayCategoryproduct",
                                    "arrayCategoryproductError",
                                    "arrayCategoryproductTextError",
                                    "arrayCategoryproductHide"
                                )}
                                options={props.categoryProducts}
                            />
                        </div>
                        <div className={`${modal.arrayCategoryproductHide} errorControl`}>
                            {modal.arrayCategoryproductTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productQuantity">Cantidad</Label>
                        <Input
                            invalid={modal.productQuantityError}
                            id="productQuantity"
                            name="productQuantity"
                            onKeyUp={event => handlekey(
                                "productQuantityError",
                                "productQuantityTextError",
                                "productQuantityHide",
                                1
                            )}
                            onChange={handleChange}
                            value={modal.productQuantity}
                            type="number"
                            disabled={props.disabled}
                        />
                        <div className={`${modal.productQuantityHide} errorControl`}>
                            {modal.productQuantityTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productUnitPrice">Precio</Label>
                        <Input
                            invalid={modal.productUnitPriceError}
                            id="productUnitPrice"
                            name="productUnitPrice"
                            onKeyUp={() => handlekeyMonto(
                                "productUnitPrice",
                                "productUnitPriceError",
                                "productUnitPriceTextError",
                                "productUnitPriceHide"
                            )}
                            onChange={handleChange}
                            onBlur={eventoBlur("productUnitPrice")}
                            onFocus={eventoFocus("productUnitPrice")}
                            value={modal.productUnitPrice}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${modal.productUnitPriceHide} errorControl`}>
                            {modal.productUnitPriceTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item className="">Porcentaje de ganancia</Grid>
                        <Grid item>
                            <Switch
                                checked={modal.percentageAmountGain ? modal.percentageAmountGain : false}
                                onChange={handleChangeSwitch("percentageAmountGain")}
                                value={modal.percentageAmountGain}
                                color="primary"
                                disabled={false}
                            />
                        </Grid>
                        <Grid item className="">Monto de ganancia</Grid>
                    </Grid>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productProfitPercentage">Porcentaje</Label>
                        <Input
                            invalid={modal.productProfitPercentageError}
                            id="productProfitPercentage"
                            name="productProfitPercentage"
                            onKeyUp={() => handlekeyMonto(
                                "productProfitPercentage",
                                "productProfitPercentageError",
                                "productProfitPercentageTextError",
                                "productProfitPercentageHide"
                            )}
                            onChange={handleChange}
                            onBlur={eventoBlur("productProfitPercentage")}
                            onFocus={eventoFocus("productProfitPercentage")}
                            value={modal.productProfitPercentage}
                            type="text"
                            disabled={props.option !== 2 ? modal.percentageAmountGain : props.disabled}
                        />
                        <div className={`${modal.productProfitPercentageHide} errorControl`}>
                            {modal.productProfitPercentageTextError}
                        </div>
                    </div>
                </FormGroup>

                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productProfitAmount">Monto</Label>
                        <Input
                            invalid={modal.productProfitAmountError}
                            id="productProfitAmount"
                            name="productProfitAmount"
                            onKeyUp={() => handlekeyMonto(
                                "productProfitAmount",
                                "productProfitAmountError",
                                "productProfitAmountTextError",
                                "productProfitAmountHide"
                            )}
                            onChange={handleChange}
                            onBlur={eventoBlur("productProfitAmount")}
                            onFocus={eventoFocus("productProfitAmount")}
                            value={modal.productProfitAmount}
                            type="text"
                            disabled={props.option !== 2 ? !modal.percentageAmountGain : props.disabled}
                        />
                        <div className={`${modal.productProfitAmountHide} errorControl`}>
                            {modal.productProfitAmountTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productExempt">Exento</Label>
                        <div className={modal.productExemptError}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="productExempt"
                                id="productExempt"
                                value={modal.productExempt}
                                onChange={event => handleChangeSelect(
                                    event,
                                    "productExempt",
                                    "productExemptError",
                                    "productExemptTextError",
                                    "productExemptHide"
                                )}
                                options={modal.arrayOptionExempt}
                            />
                        </div>
                        <div className={`${modal.productExemptHide} errorControl`}>
                            {modal.productExemptTextError}
                        </div>
                    </div>
                </FormGroup>
                {
                    modal.productExempt && !modal.productExempt.value && (
                        <FormGroup className="top form-group col-sm-6">
                            <div>
                                <Label for="productTax">Impuesto %</Label>
                                <div className={modal.productTaxError}>
                                    <Select
                                        isSearchable
                                        isClearable
                                        isDisabled={props.disabled}
                                        name="productTax"
                                        id="productTax"
                                        value={modal.productTax}
                                        onChange={event => handleChangeSelect(
                                            event,
                                            "productTax",
                                            "productTaxError",
                                            "productTaxTextError",
                                            "productTaxHide"
                                        )}
                                        options={props.tax}
                                    />
                                </div>
                                <div className={`${modal.productTaxHide} errorControl`}>
                                    {modal.productTaxTextError}
                                </div>
                            </div>
                        </FormGroup>
                    )
                }
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="productDescription">Descripcion</Label>
                        <Input
                            invalid={modal.productDescriptionError}
                            id="productDescription"
                            name="productDescription"
                            onKeyUp={event => handlekey(
                                "productDescriptionError",
                                "productDescriptionTextError",
                                "productDescriptionHide",
                                1
                            )}
                            onChange={handleChange}
                            value={modal.productDescription}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div className={`${modal.productDescriptionHide} errorControl`}>
                            {modal.productDescriptionTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    {
                        !props.disabled &&
                        <div className="" style={{ marginLeft: 'auto' }}>
                            <Button
                                style={{ marginRight: '5px' }}
                                color="danger"
                                className="text-white"
                                variant="contained"
                                onClick={cleanCampos}
                                disabled={props.disabled}
                            >
                                Limpiar
                            </Button>
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                onClick={handleProductAction}
                                disabled={props.disabled}
                            >
                                {
                                    modal.actionProduct === 0 ? 'Agregar' : 'Editar'
                                }
                            </Button>
                        </div>
                    }
                </FormGroup>                
            </div>
        </div>
    )
}

export default FormProducts