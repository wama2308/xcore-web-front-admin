import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addNewProductFunction, editProductPurchaseFunction } from "../../../actions/PurchasesActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitialProducts';
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { number_format, formatMonto } from "../../../helpers/helpers";

const ModalProduct = props => {
    const arrayTaxSelect = props.dataGeneral.countryConfiguration.tax.filter(option => option.default === true);
    const arrayCategorySelect = props.dataGeneral.dataCategoryProducts;
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
        if (modal.productCodeBar === '') {
            setModal(prev => ({
                ...prev,
                productCodeBarError: true,
                productCodeBarTextError: "¡Ingrese el codigo!",
                productCodeBarHide: 'show',
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

    const arraysProductDetails = (data) => {
        let productDetails = [];
        data.map((details, i) => {
            productDetails.push(details._id);
        });
        return productDetails;
    }

    const handleProductAction = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            let arrayProductoDetalleId = [];
            if (props.option === 3 || props.option === 4) {
                arrayProductoDetalleId = arraysProductDetails(modal.dataProduct.details);
            }
            if (props.option === 2) {
                arrayProductoDetalleId = props.data.product_detail_id;
            }
            const message = {
                title: "Sobreescribir Informacion",
                info: "¿Desea sobreescribir la informacion de este producto?"
            };
            let data = {
                product_id: (props.option === 3 || props.option === 4 || props.option === 2) ? modal.productId : "0",
                name: modal.productName,
                codeBar: modal.productCodeBar,
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
                tax: !modal.productExempt.value ? parseFloat(modal.productTax.label) : 0,
                product_detail_id: arrayProductoDetalleId,
            }
            if (props.option === 1) {
                props.addNewProductFunction(
                    { ...data, product_detail_type: 'save' },
                    props.purchase.products,
                    () => { questionsModalProduct() }
                )
            }
            if (props.option === 2) {
                if (modal.dataProduct &&
                    modal.productId !== '0' &&
                    props.dataGeneral.countryConfiguration.branch_office.product_detail_type === 'ask'
                ) {
                    props.confirm(message, res => {
                        if (res) {
                            props.editProductPurchaseFunction(
                                modal.keyProduct,
                                { ...data, product_detail_type: 'overwrite' },
                                modal.dataProduct,
                                () => { closeModal(1) }
                            )
                        } else {
                            props.editProductPurchaseFunction(
                                modal.keyProduct,
                                { ...data, product_detail_type: 'save' },
                                modal.dataProduct,
                                () => { closeModal(1) }
                            )
                        }
                    });
                }
                if (modal.dataProduct &&
                    modal.productId !== '0' &&
                    props.dataGeneral.countryConfiguration.branch_office.product_detail_type !== 'ask'
                ) {
                    props.editProductPurchaseFunction(
                        modal.keyProduct,
                        { ...data, product_detail_type: props.dataGeneral.countryConfiguration.branch_office.product_detail_type },
                        modal.dataProduct,
                        () => { closeModal(1) }
                    )
                }
                if (modal.dataProduct && modal.productId === '0') {
                    props.editProductPurchaseFunction(
                        modal.keyProduct,
                        { ...data, product_detail_type: 'save' },
                        modal.dataProduct,
                        () => { closeModal(1) }
                    )
                }
            }
            if (props.option === 3 || props.option === 4) {
                if (props.dataGeneral.countryConfiguration.branch_office.product_detail_type === 'ask') {
                    props.confirm(message, res => {
                        if (res) {
                            props.addNewProductFunction(
                                { ...data, product_detail_type: 'overwrite' },
                                props.purchase.products,
                                () => { closeModal(1) }
                            )
                        } else {
                            props.addNewProductFunction(
                                { ...data, product_detail_type: 'save' },
                                props.purchase.products,
                                () => { closeModal(1) }
                            )
                        }
                    });
                } else {
                    props.addNewProductFunction(
                        { ...data, product_detail_type: props.dataGeneral.countryConfiguration.branch_office.product_detail_type },
                        props.purchase.products,
                        () => { closeModal(1) }
                    )
                }
            }
        }
    }

    const questionsModalProduct = () => {
        const message = {
            title: "Registrar Otro Producto",
            info: "¿Desea registrar otro producto?"
        };
        props.confirm(message, res => {
            if (res) {
                setModal({
                    ...initialFormState
                });
            } else {
                setModal({
                    ...initialFormState
                });
                props.valorCloseModalProduct(false);
            }
        });
    }

    const closeModal = (option) => {
        if (option === 0) {
            const message = {
                title: "Cerrar Ventana",
                info: "¿Esta seguro que desea cerrar la ventana?"
            };
            props.confirm(message, res => {
                if (res) {
                    setModal({
                        ...initialFormState
                    });
                    props.valorCloseModalProduct(false);
                }
            });
        } else {
            setModal({
                ...initialFormState
            });
            props.valorCloseModalProduct(false);
        }
    };    

    useEffect(() => {
        if (props.option === 1) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        }
        if (props.option === 2 && props.data) {
            setModal(prev => ({
                ...prev,
                productName: props.data.name,
                productCodeBar: props.data.codeBar,
                arrayCategoryproduct: arrayCategorySelect.find(category => category.value === props.data.product_category_id),
                productQuantity: number_format(props.data.quantity, 2),
                productUnitPrice: number_format(props.data.unit_price, 2),
                productProfitPercentage: number_format(props.data.profit_percentage, 2),
                productProfitAmount: number_format(props.data.profit_amount, 2),
                productExempt: modal.arrayOptionExempt.find(exempt => exempt.value === props.data.exempt),
                productTax: !props.data.exempt ? arrayTaxSelect.find(tax => tax.value === props.data.tax_id) : null,
                productDescription: props.data.descripcion,
                dataProduct: props.data,
                keyProduct: props.keyProduct,
                productId: props.data.product_id,
                loading: "hide",
            }))
        }
        if (props.option === 3 && props.data) {
            setModal(prev => ({
                ...prev,
                productName: props.data.name,
                productCodeBar: props.data.name,
                arrayCategoryproduct: arrayCategorySelect.find(category => category.value === props.data.product_category_id),
                productDescription: props.data.descripcion,
                dataProduct: props.data,
                keyProduct: props.keyProduct,
                productId: props.data._id,
                loading: "hide",
            }))
        }
        if (props.option === 4 && props.data) {
            console.log(props.data)
            setModal(prev => ({
                ...prev,
                productName: props.data.name,
                productCodeBar: props.data.name,
                arrayCategoryproduct: arrayCategorySelect.find(category => category.value === props.data.product_category_id),
                productUnitPrice: number_format(props.data.dataProductDetails.unit_price, 2),
                productProfitPercentage: number_format(props.data.dataProductDetails.profit_percentage, 2),
                productProfitAmount: number_format(props.data.dataProductDetails.sale_price, 2),
                productExempt: props.data.dataProductDetails.tax !== 0 ?
                    modal.arrayOptionExempt.find(exempt => exempt.value === false) :
                    modal.arrayOptionExempt.find(exempt => exempt.value === true),
                productTax: props.data.dataProductDetails.tax !== 0 ?
                    arrayTaxSelect.find(tax => tax.label === props.data.dataProductDetails.tax) :
                    null,
                productDescription: props.data.descripcion,
                dataProduct: props.data,
                keyProduct: props.keyProduct,
                productId: props.data._id,
                loading: "hide",
            }))
        }

    }, [props])
    
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={props.modal}
            onClose={() => { closeModal(0); }}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
            {modal.loading === "hide" ? (
                <div>
                    <DialogTitle id="form-dialog-title">
                        <div style={{ display: 'flex' }}>
                            <div>
                                {props.modalHeader}
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <IconButton aria-label="Delete"
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
                                        disabled={props.option === 4 ? true : props.disabled}
                                    />
                                    <div className={`${modal.productNameHide} errorControl`}>
                                        {modal.productNameTextError}
                                    </div>
                                </div>
                            </FormGroup>
                            <FormGroup className="top form-group col-sm-6">
                                <div>
                                    <Label for="productCodeBar">Codigo</Label>
                                    <Input
                                        invalid={modal.productCodeBarError}
                                        id="productCodeBar"
                                        name="productCodeBar"
                                        onKeyUp={event => handlekey(
                                            "productCodeBarError",
                                            "productCodeBarTextError",
                                            "productCodeBarHide",
                                            1
                                        )}
                                        onChange={handleChange}
                                        value={modal.productCodeBar}
                                        type="text"
                                        disabled={props.option === 4 ? true : props.disabled}
                                    />
                                    <div className={`${modal.productCodeBarHide} errorControl`}>
                                        {modal.productCodeBarTextError}
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
                                            isDisabled={props.option === 4 ? true : props.disabled}
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
                                            options={arrayCategorySelect}
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
                                        disabled={props.option === 4 ? true : props.disabled}
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
                                            disabled={props.option === 4 ? true : props.disabled}
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
                                        disabled={props.option === 4 ? true : modal.percentageAmountGain}
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
                                        disabled={props.option === 4 ? true : !modal.percentageAmountGain}
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
                                            isDisabled={props.option === 4 ? true : props.disabled}
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
                                                    isDisabled={props.option === 4 ? true : props.disabled}
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
                                                    options={arrayTaxSelect}
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
                                        disabled={props.option === 4 ? true : props.disabled}
                                    />
                                    <div className={`${modal.productDescriptionHide} errorControl`}>
                                        {modal.productDescriptionTextError}
                                    </div>
                                </div>
                            </FormGroup>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={{ marginRight: '5px' }}
                            color="danger"
                            className="text-white"
                            variant="contained"
                            onClick={() => { closeModal(0); }}
                            disabled={props.disabled}
                        >
                            Cancelar
                        </Button>
                        {
                            !props.showHide &&
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                onClick={handleProductAction}
                                disabled={props.disabled}
                            >
                                {props.buttonFooter}
                            </Button>
                        }

                    </DialogActions>
                </div>
            ) : (
                    <div style={{ height: "55vh" }}>
                        <CircularProgress
                            style={{
                                position: "fixed",
                                height: 40,
                                top: "45%",
                                right: "50%",
                                zIndex: 2
                            }}
                        />
                    </div>
                )
            }
            <style jsx=''>
                {
                    `.rct-title {
                            margin-left: -15%;              
                        }`
                }
            </style>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    purchase: state.purchase.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    addNewProductFunction: (data, dataAll, callback) => dispatch(addNewProductFunction(data, dataAll, callback)),
    editProductPurchaseFunction: (key, data, dataProduct, callback) => dispatch(editProductPurchaseFunction(key, data, dataProduct, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalProduct);