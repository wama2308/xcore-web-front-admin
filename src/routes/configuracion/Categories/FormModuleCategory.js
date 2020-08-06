import React, { Component, useState } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    FormFeedback,
    FormText,
    Card,
    CardBody,
    Collapse,
} from "reactstrap";
import { NotificationManager } from 'react-notifications';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assets/css/style.css";
import { stateInitialCateroriesModules } from './StateInitialCategoriesModules';
import FormModuleSettings from './FormModuleSettings';
//import ListSettingsCategory from "./ListSettingsCategory";

const FormModuleCategory = props => {
    const initialFormState = stateInitialCateroriesModules;
    const [formModuleCategory, setFormModuleCategory] = useState(initialFormState)

    const handleChange = e => {
        const { name, value } = e.target;
        setFormModuleCategory(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setFormModuleCategory(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        setFormModuleCategory(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));

    };

    const handleChangeSwitch = (name, error, textError, hide, option) => event => {
        setFormModuleCategory(prev => ({
            ...prev,
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',
        }));
        if (name === 'test') {
            setFormModuleCategory(prev => ({
                ...prev,
                test_end_date: new Date(),
            }));
        }
    };

    const handleChangeExpirationDate = date => {
        setFormModuleCategory(prev => ({
            ...prev,
            test_end_date: date,
            test_end_date_error: "",
            test_end_date_text_error: '',
            test_end_date_hide: 'hide',
        }));
    }

    const handlekeyMonto = (campo, campoError, campoErrorText, campohide) => {
        let monto = event.target.value.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        setFormModuleCategory(prev => ({
            ...prev,
            [campo]: monto,
            [campoError]: false,
            [campoErrorText]: '',
            [campohide]: 'hide',
        }));
    };

    const eventoBlur = (e) => {
        if (formModuleCategory.individual_amount === '' || formModuleCategory.individual_amount === '0.0') {
            setFormModuleCategory(prev => ({
                ...prev,
                individual_amount: '0'
            }));
        }
    }

    const eventoFocus = (e) => {
        if (formModuleCategory.individual_amount === '0') {
            setFormModuleCategory(prev => ({
                ...prev,
                individual_amount: ''
            }));
        }
    }

    const cleanFields = () => {
        setFormModuleCategory({
            ...initialFormState
        });
        props.clenaSettingsModuleFunction();
    }

    const validate = () => {
        let acum = "";
        if (formModuleCategory.xc_language_id === null) {
            setFormModuleCategory(prev => ({
                ...prev,
                xc_language_id_error: 'borderColor',
                xc_language_id_text_error: "Seleccione el lenguaje",
                xc_language_id_hide: 'show',
            }))
            acum = 1;
        }
        if (formModuleCategory.menu_title === '') {
            setFormModuleCategory(prev => ({
                ...prev,
                menu_title_error: true,
                menu_title_text_error: "Ingrese el titulo",
                menu_title_hide: 'show',
            }))
            acum = 1;
        }
        if (props.dataSettings.find(data => data.xc_language_id.value === formModuleCategory.xc_language_id.value) &&
            (props.dataSettings.findIndex(data => data.xc_language_id.value === formModuleCategory.xc_language_id.value) !== formModuleCategory.keySettingsCategory)
        ) {
            setFormModuleCategory(prev => ({
                ...prev,
                xc_language_id_error: 'borderColor',
                xc_language_id_text_error: "Este lenguaje ya esta registrado",
                xc_language_id_hide: 'show',
            }))
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    }

    const handleDatosSettingsCategory = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            let data = {
                xc_language_id: formModuleCategory.xc_language_id,
                menu_title: formModuleCategory.menu_title,
                tooltips: formModuleCategory.tooltips,
                test_description: formModuleCategory.test_description,
            };
            if (formModuleCategory.actionSettingsCategory === 0) {
                props.addSettingsCategoryFunction(data, () => { cleanFields() });
            } else {
                props.updateSettingsCategoryFunction(formModuleCategory.keySettingsCategory, data, () => { cleanFields() });
            }
        }
    }

    const updateSetting = (key, data) => {
        const message = {
            title: "Editar Configuracion",
            info: "¿Esta seguro que desea editar esta configuracion?"
        };
        props.confirm(message, res => {
            if (res) {
                setFormModuleCategory(prev => ({
                    ...prev,
                    xc_language_id: data.xc_language_id,
                    menu_title: data.menu_title,
                    tooltips: data.tooltips,
                    test_description: data.test_description,
                    actionSettingsCategory: 1,
                    keySettingsCategory: key
                }))
            }
        });
    }

    const deleteSetting = (key) => {
        if (formModuleCategory.keySettingsCategory === key) {
            NotificationManager.warning("¡La configuracion esta en proceso de edicion, no puede ser eliminada!");
        } else {
            const message = {
                title: "Eliminar Configuracion",
                info: "¿Esta seguro que desea eliminar este configuracion?"
            };
            props.confirm(message, res => {
                if (res) {
                    props.deleteSettingsCategoryFunction(key);
                }
            });
        }
    }


    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="name">Nombre</Label>
                        <Input
                            invalid={formModuleCategory.name_error}
                            id="name"
                            name="name"
                            onKeyUp={event => handlekey(
                                "name_error",
                                "name_text_error",
                                "name_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formModuleCategory.name}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${formModuleCategory.name_hide} errorControl`}>
                            {formModuleCategory.name_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="path">Ruta</Label>
                        <div className={formModuleCategory.menu_icon_error}>
                            <Input
                                invalid={formModuleCategory.path_error}
                                id="path"
                                name="path"
                                onKeyUp={event => handlekey(
                                    "path_error",
                                    "path_text_error",
                                    "path_hide",
                                    1
                                )}
                                onChange={handleChange}
                                value={formModuleCategory.path}
                                type="text"
                                disabled={props.disabled}
                            />
                        </div>
                        <div className={`${formModuleCategory.path_hide} errorControl`}>
                            {formModuleCategory.path_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="gerente">¿Nuevo item?</Label>
                    <div className={formModuleCategory.new_item_error}>
                        <Switch
                            checked={formModuleCategory.new_item ? formModuleCategory.new_item : false}
                            onChange={handleChangeSwitch(
                                "new_item",
                                "new_item_error",
                                "new_item_text_error",
                                "new_item_hide",
                            )}
                            value={formModuleCategory.new_item}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${formModuleCategory.new_item_hide} errorControl`}>
                        {formModuleCategory.new_item_text_error}
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="gerente">¿Abierto?</Label>
                    <div className={formModuleCategory.open_error}>
                        <Switch
                            checked={formModuleCategory.open ? formModuleCategory.open : false}
                            onChange={handleChangeSwitch(
                                "open",
                                "open_error",
                                "open_text_error",
                                "open_hide",
                            )}
                            value={formModuleCategory.open}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${formModuleCategory.open_hide} errorControl`}>
                        {formModuleCategory.open_text_error}
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="position">Posicion</Label>
                        <Input
                            invalid={formModuleCategory.position_error}
                            id="position"
                            name="position"
                            onKeyUp={event => handlekey(
                                "position_error",
                                "position_text_error",
                                "position_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formModuleCategory.position}
                            type="number"
                            disabled={props.disabled}
                        />
                        <div className={`${formModuleCategory.position_hide} errorControl`}>
                            {formModuleCategory.position_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="individual_amount">Monto</Label>
                        <Input
                            invalid={formModuleCategory.individual_amount_error}
                            id="individual_amount"
                            name="individual_amount"
                            onKeyUp={() => handlekeyMonto(
                                "individual_amount",
                                "individual_amount_error",
                                "individual_amount_text_error",
                                "individual_amount_hide"
                            )}
                            onChange={handleChange}
                            value={formModuleCategory.individual_amount}
                            type="text"
                            onBlur={eventoBlur}
                            onFocus={eventoFocus}
                            disabled={props.disabled}
                        />
                        <div className={`${formModuleCategory.individual_amount_hide} errorControl`}>
                            {formModuleCategory.individual_amount_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="test">¿Prueba?</Label>
                    <div className={formModuleCategory.test_error}>
                        <Switch
                            checked={formModuleCategory.test ? formModuleCategory.test : false}
                            onChange={handleChangeSwitch(
                                "test",
                                "test_error",
                                "test_text_error",
                                "test_hide",
                            )}
                            value={formModuleCategory.test}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${formModuleCategory.test_hide} errorControl`}>
                        {formModuleCategory.test_text_error}
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_end_date">Fecha de Expiracion</Label>
                        <div className={formModuleCategory.test_end_date_error}>
                            <DatePicker
                                selected={formModuleCategory.test_end_date}
                                onChange={handleChangeExpirationDate}
                                dateFormat="dd-MM-yyyy"
                                isClearable={props.option === 2 ? !props.disabled
                                    : formModuleCategory.test}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                className="form-control"
                                disabled={props.option !== 2 ? !formModuleCategory.test : props.disabled}
                                locale="es"
                            />
                        </div>
                        <div className={`${formModuleCategory.test_end_date_hide} errorControl`}>
                            {formModuleCategory.test_end_date_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="description">Descripcion</Label>
                        <Input
                            invalid={formModuleCategory.description_error}
                            id="description"
                            name="description"
                            onKeyUp={() => handlekey(
                                "description_error",
                                "description_text_error",
                                "description_hide",
                                1
                            )
                            }
                            onChange={handleChange}
                            value={formModuleCategory.description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div
                            className={`${formModuleCategory.description_hide} errorControl`}
                        >
                            {formModuleCategory.description_text_error}
                        </div>
                    </div>
                </FormGroup>
            </div>
            <hr />
            <div className="row">
                <FormGroup className="top form-group col-sm-4">
                    <Button
                        color="primary"
                        onClick={() => setFormModuleCategory(prev => ({ ...prev, CollapseSettings: !formModuleCategory.CollapseSettings }))}
                        disabled={props.disabled}
                    >
                        Configuracion
                    </Button>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    <Collapse isOpen={formModuleCategory.CollapseSettings}>
                        <Card>
                            <CardBody>
                                <FormModuleSettings
                                    addSettingsModuleFunction={props.addSettingsModuleFunction}
                                    updateSettingsModuleFunction={props.updateSettingsModuleFunction}
                                    deleteSettingsModuleFunction={props.deleteSettingsModuleFunction}                                    
                                    dataSettingsModules={props.dataSettingsModules}
                                    confirm={props.confirm}
                                />
                            </CardBody>
                        </Card>
                    </Collapse>
                </FormGroup>
            </div>
            <div className="row">
                <FormGroup className="top form-group col-sm-12">
                    <div className="" style={{ marginLeft: 'auto' }}>
                        <Button
                            style={{ marginRight: '5px' }}
                            color="danger"
                            className="text-white"
                            variant="contained"
                            onClick={props.cleanFields}
                            disabled={props.disabled}
                        >
                            Limpiar
                        </Button>
                        <Button
                            color="primary"
                            className="text-white"
                            variant="contained"
                            // onClick={props.handleDatosCategory}
                            disabled={props.disabled}
                        >
                            Agregar
                        </Button>
                    </div>
                </FormGroup>
            </div>
        </div >
    );
}

export default FormModuleCategory;