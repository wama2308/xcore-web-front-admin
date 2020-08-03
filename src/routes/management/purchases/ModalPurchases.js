import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    Collapse,
    InputGroup,
    InputGroupText,
    InputGroupAddon
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    savePurchasesAction,
    updatePurchasesAction,
    deleteProdutcPurchaseFunction,
    searchProducturchaseFunction,
} from "../../../actions/PurchasesActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormProducts from "./FormProducts";
import SearchProduct from "./SearchProduct";
import PaymentPurchase from "./PaymentPurchase";
import ModalProduct from "./ModalProduct";
import ListProducts from "./ListProducts";
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

const ModalPurchases = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const cargarData = (data) => {
        console.log("cargar data ", data)
        // let optionCountry = props.dataGeneral.dataPaises.filter(countryData => countryData.value === data.country.value);
        // let optionProvince = optionCountry[0].province.filter(provinceData => provinceData.value === data.province.value);       

        // setModal(prev => ({
        //     ...prev,
        //     name: data.name,
        //     arrayTypeIdentity: props.dataGeneral.countryConfiguration.typeIdentities.find(typeIdentity => typeIdentity.label === data.type_identity),
        //     dni: data.ruc,
        //     web: data.web !== null ? data.web : '',
        //     arrayCountry: data.country,
        //     arrayProvinceOption: optionCountry[0].province,
        //     arrayProvince: data.province,
        //     arrayDistricOption: optionProvince[0].district,
        //     arrayDistric: data.district,
        //     arrayProvinceOption: optionCountry[0].province,
        //     collapseContacs: props.provider.contactsProvider.length > 0 ? true : false,
        //     loading: 'hide',            
        //     actionReducer: 1,
        // }));
    }

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

    const handleChangeExpirationDate = date => {
        setModal(prev => ({
            ...prev,
            dataPurchase: date,
            dataPurchaseError: "",
            dataPurchaseTextError: "",
            dataPurchaseHide: "hide",
        }));
    }

    const handleChangeSwitch = (name) => event => {
        setModal(prev => ({
            ...prev,
            [name]: event.target.checked,
        }));
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
                    props.valorCloseModal(false);
                }
            });
        } else {
            setModal({
                ...initialFormState
            });
            props.valorCloseModal(false);
        }
    };

    const validateURL = (value) => {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }

    const validate = () => {
        let acum = "";
        if (modal.name === '') {
            setModal(prev => ({
                ...prev,
                nameError: true,
                nameTextError: "Ingrese el proveedor",
                nameHide: 'show',
            }))
            acum = 1;
        }
        if (modal.dni === '') {
            setModal(prev => ({
                ...prev,
                dniError: true,
                dniTextError: "Ingrese el DNI",
                dniHide: 'show',
            }))
            acum = 1;
        }
        if (modal.arrayCountry === null) {
            setModal(prev => ({
                ...prev,
                arrayCountryError: 'borderColor',
                arrayCountryTextError: "Seleccione el pais",
                arrayCountryHide: 'show',
            }))
            acum = 1;
        }
        if (modal.arrayProvince === null) {
            setModal(prev => ({
                ...prev,
                arrayProvinceError: 'borderColor',
                arrayProvinceTextError: "Seleccione la provincia",
                arrayProvinceHide: 'show',
            }))
            acum = 1;
        }
        if (modal.arrayDistric === null) {
            setModal(prev => ({
                ...prev,
                arrayDistricError: 'borderColor',
                arrayDistricTextError: "Seleccione el distrito",
                arrayDistricHide: 'show',
            }))
            acum = 1;
        }
        if (modal.web !== '' && !validateURL(modal.web)) {
            setModal(prev => ({
                ...prev,
                webError: true,
                webTextError: "Ingrese una url valida",
                webHide: 'show',
            }))
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    const handleSavePurchase = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));

            let dataSend = {
                _id: props.data ? props.data._id : 0,
                // name: modal.name,
                // type_identity: modal.arrayTypeIdentity.label,
                // ruc: modal.dni,
                // country_id: modal.arrayCountry.value,
                // province_id: modal.arrayProvince.value,
                // district_id: modal.arrayDistric.value,                
                // web: modal.web,
                // contacts: props.provider.contactsProvider,
            }
            if (props.option === 1) {
                //props.saveProviderAction(dataSend, () => { closeModal(1); });
            }
            if (props.option === 3) {
                //props.updateProviderAction(dataSend, () => { closeModal(1); });
            }
        }
    }

    const openModal = (option, optionProduct, data, key) => {
        if (option === 1) {
            setModal(prev => ({
                ...prev,
                option: option,
                modal: true,
                modalHeader: 'Registrar Producto',
                buttonFooter: 'Agregar',
                disabled: false,
                showHide: false,
                dataProduct: data,
                keyProduct: key
            }));
        }
        if (option === 2) {
            setModal(prev => ({
                ...prev,
                option: option,
                modal: true,
                modalHeader: 'Editar Producto',
                buttonFooter: 'Editar',
                disabled: false,
                showHide: false,
                dataProduct: data,
                keyProduct: key
            }));
        }
        if (option === 3) {
            setModal(prev => ({
                ...prev,
                option: option,
                modal: true,
                modalHeader: 'Agregar Nuevo Detalle Producto',
                buttonFooter: 'Agregar',
                disabled: false,
                showHide: false,
                dataProduct: data,
                keyProduct: key
            }));
        }
        if (option === 4) {
            setModal(prev => ({
                ...prev,
                option: option,
                modal: true,
                modalHeader: 'Agregar Detalle Producto',
                buttonFooter: 'Agregar',
                disabled: false,
                showHide: false,
                dataProduct: data,
                keyProduct: key
            }));
        }
    }

    const valorCloseModalProduct = valor => {
        setModal(prev => ({ ...prev, modal: false }))
    }

    const fileHandlerImagen = (data) => {
        if ((data.size) / 1024 > 2048) {
            setModal(prev => (
                {
                    ...prev,
                    imagenError: 'borderColor',
                    imagenTextError: 'Tamaño de la imagen no permitido',
                    imagenHide: 'show'
                }
            ))
        } else {
            const file = data;
            if (!file) {
                return;
            }
            let reader = new FileReader();

            reader.readAsDataURL(data);

            reader.onloadend = () => {
                setModal(prev => (
                    {
                        ...prev,
                        imagen: reader.result
                    }
                ))
            };
            setModal(prev => (
                {
                    ...prev,
                    imagenError: '',
                    imagenTextError: '',
                    imagenHide: 'hide'
                }
            ))
        }
    };

    useEffect(() => {
        if (props.option === 1) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        } else if (props.option === 2 || props.option === 3) {
            if (Object.keys(props.purchase.purchaseId).length > 0 && modal.actionReducer === 0) {
                cargarData(props.purchase.purchaseId);
            }
        }
    }, [props.purchase])
    console.log("purchase ", props.purchase)
    //console.log("dataGeneral ", props.dataGeneral)
    return (
        <div>
            {
                modal.modal &&
                <ModalProduct
                    option={modal.option}
                    modal={modal.modal}
                    modalHeader={modal.modalHeader}
                    buttonFooter={modal.buttonFooter}
                    disabled={modal.disabled}
                    showHide={modal.showHide}
                    data={modal.dataProduct}
                    keyProduct={modal.keyProduct}
                    valorCloseModalProduct={valorCloseModalProduct}
                    confirm={props.confirm}
                />
            }
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
                            <Form>
                                <div className="row">
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="purchaseTypeDocument">Tipo de documento</Label>
                                            <div className={modal.purchaseTypeDocumentError}>
                                                <Select
                                                    isSearchable
                                                    isClearable
                                                    isDisabled={props.disabled}
                                                    name="purchaseTypeDocument"
                                                    id="purchaseTypeDocument"
                                                    value={modal.purchaseTypeDocument}
                                                    onChange={event => handleChangeSelect(
                                                        event,
                                                        "purchaseTypeDocument",
                                                        "purchaseTypeDocumentError",
                                                        "purchaseTypeDocumentTextError",
                                                        "purchaseTypeDocumentHide"
                                                    )}
                                                    options={props.dataGeneral.dataPurchaseTypeDocument}
                                                />
                                            </div>
                                            <div className={`${modal.purchaseTypeDocumentHide} errorControl`}>
                                                {modal.purchaseTypeDocumentTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="nroControl">Numero de control</Label>
                                            <Input
                                                invalid={modal.nroControlError}
                                                id="nroControl"
                                                name="nroControl"
                                                onKeyUp={event => handlekey(
                                                    "nroControlError",
                                                    "nroControlTextError",
                                                    "nroControlHide",
                                                    1
                                                )}
                                                onChange={handleChange}
                                                value={modal.nroControl}
                                                type="text"
                                                disabled={props.disabled}
                                            />
                                            <div className={`${modal.nroControlHide} errorControl`}>
                                                {modal.nroControlTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="dataPurchase">Fecha de compra</Label>
                                            <div className={modal.dataPurchaseError}>
                                                <DatePicker
                                                    selected={modal.dataPurchase}
                                                    onChange={handleChangeExpirationDate}
                                                    dateFormat="dd-MM-yyyy"
                                                    isClearable
                                                    showYearDropdown
                                                    dateFormatCalendar="MMMM"
                                                    className="form-control"
                                                    disabled={props.disabled}
                                                    locale="es"
                                                />
                                            </div>
                                            <div className={`${modal.dataPurchaseHide} errorControl`}>
                                                {modal.dataPurchaseTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="arrayProvider">Proveedor</Label>
                                            <div className={modal.arrayProviderError}>
                                                <Select
                                                    isSearchable
                                                    isClearable
                                                    isDisabled={props.disabled}
                                                    name="arrayProvider"
                                                    id="arrayProvider"
                                                    value={modal.arrayProvider}
                                                    onChange={event => handleChangeSelect(
                                                        event,
                                                        "arrayProvider",
                                                        "arrayProviderError",
                                                        "arrayProviderTextError",
                                                        "arrayProviderHide"
                                                    )}
                                                    options={props.purchase.selectProviderData}
                                                />
                                            </div>
                                            <div className={`${modal.arrayProviderHide} errorControl`}>
                                                {modal.arrayProviderTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="imagen">Imagen</Label>
                                            <div style={{ height: '39px' }} className={modal.imagenError}>
                                                <Label
                                                    color="primary"
                                                    className="btn"
                                                    variant="contained"
                                                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                >
                                                    <span style={{ fontWeight: '500' }}>Cargar Imagen</span>
                                                    <Input
                                                        style={{ display: 'none' }}
                                                        className="top"
                                                        type="file"
                                                        name="icono"
                                                        accept="image/*"
                                                        onChange={event => fileHandlerImagen(event.currentTarget.files[0])}
                                                        disabled={props.disabled}
                                                    />
                                                </Label>
                                            </div>
                                            <div className={`${modal.imagenHide} errorControl`}>
                                                {modal.imagenTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <Label for="divImagen">
                                            <div>
                                                {modal.imagen && (
                                                    <img
                                                        style={{ width: 300, height: 180 }}
                                                        className="image"
                                                        src={modal.imagen}
                                                    />
                                                )}
                                            </div>
                                        </Label>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup className="top form-group col-sm-4">
                                        <Button
                                            color="primary"
                                            onClick={() => setModal(prev => ({ ...prev, collapseProducts: !modal.collapseProducts }))}
                                            disabled={props.disabled}
                                        >
                                            Productos
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-12">
                                        <Collapse isOpen={modal.collapseProducts}>
                                            <Card>
                                                <CardBody>
                                                    {/* <FormGroup className="top form-group col-sm-3">
                                                    <Grid component="label" container alignItems="center" spacing={1}>
                                                        <Grid item className="">Buscar Producto</Grid>
                                                        <Grid item>
                                                            <Switch
                                                                checked={modal.optionProduct ? modal.optionProduct : false}
                                                                onChange={handleChangeSwitch("optionProduct")}
                                                                value={modal.optionProduct}
                                                                color="primary"
                                                                disabled={false}
                                                            />
                                                        </Grid>
                                                        <Grid item className="">Nuevo Producto</Grid>
                                                    </Grid>
                                                </FormGroup> */}
                                                    <div className="container-button" >
                                                        <Button
                                                            color="primary"
                                                            onClick={() => { openModal(1, 'nuevo', null, -1); }}
                                                            disabled={props.disabled}
                                                        >
                                                            Registrar
                                                    </Button>
                                                    </div>
                                                    <SearchProduct
                                                        searchProducturchaseFunction={props.searchProducturchaseFunction}
                                                        products={props.purchase.dataProducts}
                                                        option={props.option}
                                                        disabled={props.disabled}
                                                        loadingSearchProduct={props.purchase.loadingSearchProduct}
                                                        paginationProducts={props.purchase.paginationProducts}
                                                        currency_symbol={props.dataGeneral.countryConfiguration.currency_symbol}
                                                        openModal={openModal}
                                                    />
                                                    {
                                                        props.purchase.products && props.purchase.products.length > 0 && (
                                                            <FormGroup className="top form-group col-sm-12">
                                                                <ListProducts
                                                                    data={props.purchase.products}
                                                                    disabled={props.disabled}
                                                                    openModal={openModal}
                                                                    deleteProdutcPurchaseFunction={props.deleteProdutcPurchaseFunction}
                                                                    confirm={props.confirm}
                                                                />
                                                            </FormGroup>
                                                        )
                                                    }
                                                    {/* {
                                                    modal.optionProduct ?
                                                        <FormProducts
                                                            tax={props.dataGeneral.countryConfiguration.tax.filter(
                                                                option => option.default === true
                                                            )}
                                                            categoryProducts={props.dataGeneral.dataCategoryProducts}
                                                            option={props.option}
                                                            addNewProductFunction={props.addNewProductFunction}
                                                            deleteProdutcPurchaseFunction={props.deleteProdutcPurchaseFunction}
                                                            editProductPurchaseFunction={props.editProductPurchaseFunction}
                                                            data={props.purchase.products}
                                                            confirm={props.confirm}
                                                            disabled={props.disabled}
                                                        />
                                                        :
                                                        <SearchProduct
                                                            searchProducturchaseFunction={props.searchProducturchaseFunction}
                                                            products={props.purchase.dataProducts}
                                                            option={props.option}
                                                            disabled={props.disabled}
                                                            loadingSearchProduct={props.purchase.loadingSearchProduct}
                                                            paginationProducts={props.purchase.paginationProducts}
                                                            currency_symbol={props.dataGeneral.countryConfiguration.currency_symbol}
                                                        />
                                                } */}

                                                </CardBody>
                                            </Card>
                                        </Collapse>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup className="top form-group col-sm-4">
                                        <Button
                                            color="primary"
                                            onClick={() => setModal(prev => ({ ...prev, collapsePayment: !modal.collapsePayment }))}
                                            disabled={props.disabled}
                                        >
                                            Pago
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-12">
                                        <Collapse isOpen={modal.collapsePayment}>
                                            <Card>
                                                <CardBody>
                                                    <PaymentPurchase
                                                        confirm={props.confirm}
                                                    />
                                                </CardBody>
                                            </Card>
                                        </Collapse>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className='row' style={{ justifyContent: 'flex-end' }}>
                                    <FormGroup className="top form-group col-sm-6">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ width: '85px' }}>Subtotal</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                readOnly={true}
                                                id="subTotalPurchase"
                                                name="subTotalPurchase"
                                                value={props.purchase.subTotalPurchase}
                                                type="text"
                                                disabled={props.disabled}
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>{props.dataGeneral.countryConfiguration.currency_symbol}</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </div>
                                <div className='row' style={{ justifyContent: 'flex-end' }}>
                                    <FormGroup className="top form-group col-sm-6">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ width: '85px' }}>Impuesto</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                readOnly={true}
                                                id="taxPurchase"
                                                name="taxPurchase"
                                                value={props.purchase.taxPurchase}
                                                type="text"
                                                disabled={props.disabled}
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>{props.dataGeneral.countryConfiguration.currency_symbol}</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </div>
                                <div className='row' style={{ justifyContent: 'flex-end' }}>
                                    <FormGroup className="top form-group col-sm-6">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ width: '85px' }}>Total</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                readOnly={true}
                                                id="totalPurchase"
                                                name="totalPurchase"
                                                value={props.purchase.totalPurchase}
                                                type="text"
                                                disabled={props.disabled}
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>{props.dataGeneral.countryConfiguration.currency_symbol}</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </div>
                            </Form>
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
                            {
                                !props.showHide &&
                                <Button
                                    color="primary"
                                    className="text-white"
                                    variant="contained"
                                    onClick={handleSavePurchase}
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
            </Dialog >
        </div>
    );
}

const mapStateToProps = state => ({
    purchase: state.purchase.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    savePurchasesAction: (data, callback) => dispatch(savePurchasesAction(data, callback)),
    updatePurchasesAction: (data, callback) => dispatch(updatePurchasesAction(data, callback)),
    deleteProdutcPurchaseFunction: (key, data) => dispatch(deleteProdutcPurchaseFunction(key, data)),
    searchProducturchaseFunction: (search) => dispatch(searchProducturchaseFunction(search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalPurchases);