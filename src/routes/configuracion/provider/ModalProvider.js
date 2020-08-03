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
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    saveProviderAction,
    updateProviderAction,
    addContactosProviderFunction,
    editContactosProviderFunction,
    deleteContactosProviderFunction
} from "../../../actions/ProviderActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';
import FormContacts from "./FormContacts";


const ModalProvider = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const cargarData = (data) => {
        console.log("cargar data ", data)
        let optionCountry = props.dataGeneral.dataPaises.filter(countryData => countryData.value === data.country.value);
        let optionProvince = optionCountry[0].province.filter(provinceData => provinceData.value === data.province.value);       

        setModal(prev => ({
            ...prev,
            name: data.name,
            arrayTypeIdentity: props.dataGeneral.countryConfiguration.typeIdentities.find(typeIdentity => typeIdentity.label === data.type_identity),
            dni: data.ruc,
            web: data.web !== null ? data.web : '',
            arrayCountry: data.country,
            arrayProvinceOption: optionCountry[0].province,
            arrayProvince: data.province,
            arrayDistricOption: optionProvince[0].district,
            arrayDistric: data.district,
            arrayProvinceOption: optionCountry[0].province,
            collapseContacs: props.provider.contactsProvider.length > 0 ? true : false,
            loading: 'hide',            
            actionReducer: 1,
        }));
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

    const handleChangeSelectCountry = (value, select, selectError, selectErrorText, selecthide) => {
        setModal(prev => ({
            ...prev,
            arrayCountry: value,
            arrayCountryError: "",
            arrayCountryTextError: "",
            arrayCountryHide: "hide",
            arrayProvinceOption: value !== null ? value.province : [],
            arrayProvince: null,
            arrayDistricOption: value !== null ? value.province.district : [],
            arrayDistric: null,
        }));

    };

    const handleChangeSelectProvince = (value, select, selectError, selectErrorText, selecthide) => {
        setModal(prev => ({
            ...prev,
            arrayProvince: value,
            arrayProvinceError: "",
            arrayProvinceTextError: "",
            arrayProvinceHide: "hide",
            arrayDistricOption: value !== null ? value.district : [],
            arrayDistric: null,
        }));

    };

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

    const handleSaveProveedor = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));
            let dataSend = {
                _id: props.data ? props.data._id : 0,
                name: modal.name,
                type_identity: modal.arrayTypeIdentity.label,
                ruc: modal.dni,
                country_id: modal.arrayCountry.value,
                province_id: modal.arrayProvince.value,
                district_id: modal.arrayDistric.value,                
                web: modal.web,
                contacts: props.provider.contactsProvider,
            }
            if (props.option === 1) {
                props.saveProviderAction(dataSend, () => { closeModal(1); });
            }
            if (props.option === 3) {
                props.updateProviderAction(dataSend, () => { closeModal(1); });
            }
        }
    }

    useEffect(() => {
        if (props.option === 1) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        } else if (props.option === 2 || props.option === 3) {
            if (Object.keys(props.provider.providerId).length > 0 && modal.actionReducer === 0) {
                cargarData(props.provider.providerId);
            }
        }
    }, [props.provider])
    console.log(props.provider)
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
                        <Form>
                            <div className="row">
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="name">Nombre</Label>
                                        <Input
                                            invalid={modal.nameError}
                                            id="name"
                                            name="name"
                                            onKeyUp={event => handlekey(
                                                "nameError",
                                                "nameTextError",
                                                "nameHide",
                                                1
                                            )}
                                            onChange={handleChange}
                                            value={modal.name}
                                            type="text"
                                            disabled={props.disabled}
                                        />
                                        <div className={`${modal.nameHide} errorControl`}>
                                            {modal.nameTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="dni">DNI</Label>
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <div style={{ width: '25%' }}>
                                                <Select
                                                    isDisabled={props.disabled}
                                                    name="arrayTypeIdentity"
                                                    id="arrayTypeIdentity"
                                                    value={modal.arrayTypeIdentity === null ?
                                                        props.dataGeneral.countryConfiguration.typeIdentities[0] :
                                                        modal.arrayTypeIdentity
                                                    }
                                                    onChange={event => handleChangeSelect(
                                                        event,
                                                        "arrayTypeIdentity",
                                                    )}
                                                    options={props.dataGeneral.countryConfiguration.typeIdentities}
                                                />
                                            </div>
                                            <Input
                                                invalid={modal.dniError}
                                                id="dni"
                                                name="dni"
                                                onKeyUp={event => handlekey(
                                                    "dniError",
                                                    "dniTextError",
                                                    "dniHide",
                                                    1
                                                )}
                                                onChange={handleChange}
                                                value={modal.dni}
                                                type="text"
                                                disabled={props.disabled}
                                            />

                                        </div>
                                        <div className={`${modal.dniHide} errorControl`}>
                                            {modal.dniTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="arrayCountry">Pais</Label>
                                        <div className={modal.arrayCountryError}>
                                            <Select
                                                isSearchable
                                                isClearable
                                                isDisabled={props.disabled}
                                                name="arrayCountry"
                                                id="arrayCountry"
                                                value={modal.arrayCountry}
                                                onChange={event => handleChangeSelectCountry(
                                                    event,
                                                    "arrayCountry",
                                                    "arrayCountryError",
                                                    "arrayCountryTextError",
                                                    "arrayCountryHide"
                                                )}
                                                options={props.dataGeneral.dataPaises}
                                            />
                                        </div>
                                        <div className={`${modal.arrayCountryHide} errorControl`}>
                                            {modal.arrayCountryTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="arrayProvince">Provincia</Label>
                                        <div className={modal.arrayProvinceError}>
                                            <Select
                                                isSearchable
                                                isClearable
                                                isDisabled={props.disabled}
                                                name="arrayProvince"
                                                id="arrayProvince"
                                                value={modal.arrayProvince}
                                                onChange={event => handleChangeSelectProvince(
                                                    event,
                                                    "arrayProvince",
                                                    "arrayProvinceError",
                                                    "arrayProvinceTextError",
                                                    "arrayProvinceHide"
                                                )}
                                                options={modal.arrayProvinceOption}
                                            />
                                        </div>
                                        <div className={`${modal.arrayProvinceHide} errorControl`}>
                                            {modal.arrayProvinceTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="arrayDistric">Distrito</Label>
                                        <div className={modal.arrayDistricError}>
                                            <Select
                                                isSearchable
                                                isClearable
                                                isDisabled={props.disabled}
                                                name="arrayDistric"
                                                id="arrayDistric"
                                                value={modal.arrayDistric}
                                                onChange={event => handleChangeSelect(
                                                    event,
                                                    "arrayDistric",
                                                    "arrayDistricError",
                                                    "arrayDistricTextError",
                                                    "arrayDistricHide"
                                                )}
                                                options={modal.arrayDistricOption}
                                            />
                                        </div>
                                        <div className={`${modal.arrayDistricHide} errorControl`}>
                                            {modal.arrayDistricTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="web">Web</Label>
                                        <Input
                                            invalid={modal.webError}
                                            id="web"
                                            name="web"
                                            onKeyUp={event => handlekey(
                                                "webError",
                                                "webTextError",
                                                "webHide",
                                                1
                                            )}
                                            onChange={handleChange}
                                            value={modal.web}
                                            type="text"
                                            disabled={props.disabled}
                                        />
                                        <div className={`${modal.webHide} errorControl`}>
                                            {modal.webTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                            </div>
                            <hr />
                            <div className="row">
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() => setModal(prev => ({ ...prev, collapseContacs: !modal.collapseContacs }))}
                                        disabled={props.disabled}
                                    >
                                        Contactos
                                    </Button>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={modal.collapseContacs}>
                                        <Card>
                                            <CardBody>
                                                <FormContacts
                                                    addContactosProviderFunction={props.addContactosProviderFunction}
                                                    editContactosProviderFunction={props.editContactosProviderFunction}
                                                    deleteContactosProviderFunction={props.deleteContactosProviderFunction}
                                                    contactsProvider={props.provider.contactsProvider}
                                                    confirm={props.confirm}
                                                    disabled={props.disabled}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Collapse>
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
                                onClick={handleSaveProveedor}
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
    provider: state.provider.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveProviderAction: (data, callback) => dispatch(saveProviderAction(data, callback)),
    updateProviderAction: (data, callback) => dispatch(updateProviderAction(data, callback)),
    addContactosProviderFunction: (data, callback) => dispatch(addContactosProviderFunction(data, callback)),
    editContactosProviderFunction: (key, data, callback) => dispatch(editContactosProviderFunction(key, data, callback)),
    deleteContactosProviderFunction: (key) => dispatch(deleteContactosProviderFunction(key)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalProvider);