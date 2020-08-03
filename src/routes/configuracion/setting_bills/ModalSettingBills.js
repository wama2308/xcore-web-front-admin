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
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import FormFormats from "./FormFormats";
import FormDevices from "./FormDevices";
import ListFormat from "./ListFormat";
import ListDevices from "./ListDevices";
import { stateInitial } from './StateInitial';
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import {
    storeSettingBillAction,
    updateSettingBillAction,
    addFormatFunction,
    deleteFormatFunction,
    addDevicesFunction,
    deleteDeviceFunction,
    cleanTypeDeviceStoreFunction,
} from "../../../actions/SettingBillsActions";
import { NotificationManager } from 'react-notifications';
import { arraysFormatAction, arraysDevicesAction } from "../../../helpers/helpers";

const ModalSettingBills = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const cargarData = (data) => {
        setModal(prev => ({
            ...prev,
            name: data.name,
            type: modal.optionsType.find(typeData => typeData.value === data.type),
            collapseFormat: props.settingBills.arrayFormat.length > 0 ? true : false,
            collapseDevices: props.settingBills.arrayDevices.length > 0 ? true : false,
            loading: 'hide',
            actionReducer: 1,
        }));
    }

    const handleChange = e => {
        let { name, value } = e.target;
        if (name === 'macDevices') {
            var macs = value.split('');
            var colons = [2, 5, 8, 11, 14];
            for (var col in colons) {
                if (colons[col] <= macs.length) {
                    if (macs[colons[col]] !== ":") {
                        macs.splice(colons[col], 0, ":");
                    }
                }
            }
            value = macs.join('').substring(0, 17)
        }
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
        props.cleanTypeDeviceStoreFunction();
        setModal(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
            nameDevices: "",
            nameDevicesError: false,
            nameDevicesTextError: '',
            nameDevicesHide: 'hide',
            ipDevices: "",
            ipDevicesError: '',
            ipDevicesTextError: '',
            ipDevicesHide: 'hide',
            macDevices: "",
            macDevicesError: false,
            macDevicesTextError: '',
            macDevicesHide: 'hide',
            serialPrintDevices: "",
            serialPrintDevicesError: false,
            serialPrintDevicesTextError: '',
            serialPrintDevicesHide: 'hide',
        }));
    };

    const handleChangeSelectSimple = (value) => {
        setModal(prev => ({
            ...prev,
            typeFormat: value,
            typeFormatError: false,
            typeFormatTextError: "",
            typeFormatHide: "hide",
        }));
    };

    const handleEditorChange = (formato) => {
        setModal(prev => ({
            ...prev,
            formatTemplate: formato,
            formatTemplateError: "",
            formatTemplateTextError: "",
            formatTemplateHide: "hide",
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

    const validate = () => {
        let acum = "";
        if (modal.name === '') {
            setModal(prev => ({
                ...prev,
                nameError: true,
                nameTextError: "Ingrese el nombre de la configuracion",
                nameHide: 'show',
            }))
            acum = 1;
        }
        if (modal.type === null) {
            setModal(prev => ({
                ...prev,
                typeError: 'borderColor',
                typeTextError: 'Seleccione el tipo de dispositivo',
                typeHide: 'show',
            }))
            acum = 1;
        }
        if (!props.settingBills.arrayFormat || props.settingBills.arrayFormat.length === 0) {
            NotificationManager.warning("¡Debe ingresar al menos un formato!");
            acum = 1;
        }
        if ((modal.type !== null && (modal.type.value === 'fiscal' || modal.type.value === 'ticket')) &&
            (!props.settingBills.arrayDevices || props.settingBills.arrayDevices.length === 0)
        ) {
            NotificationManager.warning("¡Debe ingresar al menos un dispositivo!");
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    const handleSaveSettingBills = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));
            if (props.option === 1) {
                props.storeSettingBillAction(
                    {
                        name: modal.name,
                        type: modal.type.value,
                        format: arraysFormatAction(props.settingBills.arrayFormat),
                        devices: arraysDevicesAction(props.settingBills.arrayDevices),
                    },
                    () => {
                        closeModal(1);
                    }
                );
            }
            if (props.option === 3) {
                props.updateSettingBillAction(
                    {
                        _id: props.data._id,
                        name: modal.name,
                        type: modal.type.value,
                        format: arraysFormatAction(props.settingBills.arrayFormat),
                        devices: arraysDevicesAction(props.settingBills.arrayDevices),
                    },
                    () => {
                        closeModal(1);
                    }
                );
            }
        }
    }

    const addFormat = () => {
        let acum = 0;
        if (modal.typeFormat === '0') {
            setModal(prev => ({
                ...prev,
                typeFormatError: true,
                typeFormatTextError: "¡Seleccione el tipo de formato!",
                typeFormatHide: 'show',
            }))
            acum = 1;
        }
        if (modal.formatTemplate === "") {
            setModal(prev => ({
                ...prev,
                formatTemplateError: 'borderColor',
                formatTemplateTextError: "¡Ingrese el formato!",
                formatTemplateHide: 'show',
            }))
            acum = 1;
        }
        if (acum === 0) {
            props.addFormatFunction(
                {
                    typeFormato: modal.typeFormat,
                    formatTemplate: modal.formatTemplate,
                },
                props.settingBills.arrayFormat ? props.settingBills.arrayFormat : [],
                () => { cleanFormFormat() },
                modal.actionFormat,
                modal.indexArrayFormat,
            );
        }
    }

    const cleanFormFormat = () => {
        setModal(prev => ({
            ...prev,
            typeFormat: '0',
            formatTemplate: '',
            typeFormat: '0',
            typeFormatError: false,
            typeFormatTextError: '',
            typeFormatHide: 'hide',
            formatTemplate: "",
            formatTemplateError: '',
            formatTemplateTextError: '',
            formatTemplateHide: 'hide',
            actionFormat: 'Agregar',
        }))
    }

    const addDevices = () => {
        let acum = 0;
        if (modal.nameDevices === '') {
            setModal(prev => ({
                ...prev,
                nameDevicesError: true,
                nameDevicesTextError: "¡Ingrese el dispositivo!",
                nameDevicesHide: 'show',
            }))
            acum = 1;
        }
        if (modal.ipDevices === "") {
            setModal(prev => ({
                ...prev,
                ipDevicesError: 'borderColor',
                ipDevicesTextError: "¡Ingrese la direccion IP del dispositivo!",
                ipDevicesHide: 'show',
            }))
            acum = 1;
        }
        if (!validateIpAddress(modal.ipDevices.replace(/[_]/gi, ''))) {
            setModal(prev => ({
                ...prev,
                ipDevicesError: 'borderColor',
                ipDevicesTextError: "¡Formato de Ip invalido!",
                ipDevicesHide: 'show',
            }))
            acum = 1;
        }
        if (modal.macDevices === "") {
            setModal(prev => ({
                ...prev,
                macDevicesError: true,
                macDevicesTextError: "¡Ingrese la direccion MAC del dispositivo!",
                macDevicesHide: 'show',
            }))
            acum = 1;
        }
        if (!validarMac(modal.macDevices)) {
            setModal(prev => ({
                ...prev,
                macDevicesError: true,
                macDevicesTextError: "¡Formato de MAC invalido!",
                macDevicesHide: 'show',
            }))
            acum = 1;
        }
        if (modal.serialPrintDevices === "") {
            setModal(prev => ({
                ...prev,
                serialPrintDevicesError: true,
                serialPrintDevicesTextError: "¡Ingrese el serial del dispositivo!",
                serialPrintDevicesHide: 'show',
            }))
            acum = 1;
        }
        if (acum === 0) {
            props.addDevicesFunction(
                {
                    nombre: modal.nameDevices,
                    ip: modal.ipDevices.replace(/[_]/gi, ''),
                    mac: modal.macDevices,
                    serial: modal.serialPrintDevices,
                },
                props.settingBills.arrayDevices ? props.settingBills.arrayDevices : [],
                () => { cleanFormDevices() },
                modal.actionDevices,
                modal.indexArrayDevice,
            );
        }
    }

    const cleanFormDevices = () => {
        setModal(prev => ({
            ...prev,
            nameDevices: "",
            nameDevicesError: false,
            nameDevicesTextError: '',
            nameDevicesHide: 'hide',
            ipDevices: "",
            ipDevicesError: '',
            ipDevicesTextError: '',
            ipDevicesHide: 'hide',
            macDevices: "",
            macDevicesError: false,
            macDevicesTextError: '',
            macDevicesHide: 'hide',
            serialPrintDevices: "",
            serialPrintDevicesError: false,
            serialPrintDevicesTextError: '',
            serialPrintDevicesHide: 'hide',
            actionDevices: 'Agregar',
        }))
    }

    const validateIpAddress = (ipaddress) => {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true
        } else {
            return false
        }
    }

    const validarMac = (valor) => {
        let regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (regex.test(valor)) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (props.option === 1) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        }
        else if (props.option === 2 || props.option === 3) {
            if (props.settingBills.dataId && Object.keys(props.settingBills.dataId).length > 0 && modal.actionReducer === 0) {
                cargarData(props.settingBills.dataId);
            }
        }
    }, [props])
    //console.log("settingBills ", props.settingBills)
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
                                        <Label for="type">Tipo</Label>
                                        <div className={modal.typeError}>
                                            <Select
                                                isClearable
                                                isSearchable
                                                isDisabled={props.disabled}
                                                name="type"
                                                id="type"
                                                value={modal.type}
                                                onChange={event => handleChangeSelect(
                                                    event,
                                                    "type",
                                                    "typeError",
                                                    "typeTextError",
                                                    "typeHide"
                                                )}
                                                options={modal.optionsType}
                                            />
                                        </div>
                                        <div className={`${modal.typeHide} errorControl`}>
                                            {modal.typeTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                            </div>
                            <hr />
                            <div className="row">
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() => setModal(prev => ({ ...prev, collapseFormat: !modal.collapseFormat }))}
                                        disabled={props.disabled}
                                    >
                                        Formatos
                                    </Button>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={modal.collapseFormat}>
                                        <Card>
                                            <CardBody>
                                                <FormFormats
                                                    modal={modal}
                                                    setModal={setModal}
                                                    handleChangeSelect={handleChangeSelect}
                                                    handleChangeSelectSimple={handleChangeSelectSimple}
                                                    handleEditorChange={handleEditorChange}
                                                    addFormat={addFormat}
                                                    cleanFormFormat={cleanFormFormat}
                                                    disabled={props.disabled}
                                                />
                                                {
                                                    props.settingBills.arrayFormat && props.settingBills.arrayFormat.length > 0 && (
                                                        <ListFormat
                                                            data={props.settingBills.arrayFormat}
                                                            setModal={setModal}
                                                            confirm={props.confirm}
                                                            deleteFormatFunction={props.deleteFormatFunction}
                                                            disabled={props.disabled}
                                                        />
                                                    )
                                                }

                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </FormGroup>
                            </div>
                            {
                                (modal.type && (modal.type.value === 'ticket' || modal.type.value === 'fiscal')) && (
                                    <div>
                                        <hr />
                                        <div className="row">
                                            <FormGroup className="top form-group col-sm-4">
                                                <Button
                                                    color="primary"
                                                    onClick={() => setModal(prev => ({ ...prev, collapseDevices: !modal.collapseDevices }))}
                                                    disabled={props.disabled}
                                                >
                                                    Dispositivos
                                        </Button>
                                            </FormGroup>
                                            <FormGroup className="top form-group col-sm-12">
                                                <Collapse isOpen={modal.collapseDevices}>
                                                    <Card>
                                                        <CardBody>
                                                            <FormDevices
                                                                modal={modal}
                                                                setModal={setModal}
                                                                handlekey={handlekey}
                                                                handleChange={handleChange}
                                                                addDevices={addDevices}
                                                                cleanFormDevices={cleanFormDevices}
                                                            />
                                                            {
                                                                props.settingBills.arrayDevices && props.settingBills.arrayDevices.length > 0 && (
                                                                    <ListDevices
                                                                        data={props.settingBills.arrayDevices}
                                                                        setModal={setModal}
                                                                        confirm={props.confirm}
                                                                        deleteDeviceFunction={props.deleteDeviceFunction}
                                                                    />
                                                                )
                                                            }

                                                        </CardBody>
                                                    </Card>
                                                </Collapse>
                                            </FormGroup>
                                        </div>
                                    </div>
                                )
                            }
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
                                onClick={handleSaveSettingBills}
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
    settingBills: state.settingBills.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    storeSettingBillAction: (data, callback) => dispatch(storeSettingBillAction(data, callback)),
    updateSettingBillAction: (data, callback) => dispatch(updateSettingBillAction(data, callback)),
    deleteFormatFunction: (index) => dispatch(deleteFormatFunction(index)),
    addFormatFunction: (data, dataAll, callback, option, index) => dispatch(addFormatFunction(data, dataAll, callback, option, index)),
    addDevicesFunction: (data, dataAll, callback, option, index) => dispatch(addDevicesFunction(data, dataAll, callback, option, index)),
    deleteDeviceFunction: (index) => dispatch(deleteDeviceFunction(index)),
    cleanTypeDeviceStoreFunction: () => dispatch(cleanTypeDeviceStoreFunction()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalSettingBills);