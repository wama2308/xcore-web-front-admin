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
import ListModuleSettings from "./ListModuleSettings";

const FormModuleSettings = props => {
    const initialFormState = stateInitialCateroriesModules;
    const [formModuleSetting, setFormModuleSetting] = useState(initialFormState)

    const handleChange = e => {
        const { name, value } = e.target;
        setFormModuleSetting(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setFormModuleSetting(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        setFormModuleSetting(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));

    };

    const cleanFields = () => {
        setFormModuleSetting({
            ...initialFormState
        });        
    }

    const validate = () => {
        let acum = "";
        if (formModuleSetting.xc_language_id === null) {
            setFormModuleSetting(prev => ({
                ...prev,
                xc_language_id_error: 'borderColor',
                xc_language_id_text_error: "Seleccione el lenguaje",
                xc_language_id_hide: 'show',
            }))
            acum = 1;
        }
        if (formModuleSetting.menu_title === '') {
            setFormModuleSetting(prev => ({
                ...prev,
                menu_title_error: true,
                menu_title_text_error: "Ingrese el titulo",
                menu_title_hide: 'show',
            }))
            acum = 1;
        }
        if (props.dataSettingsModules.find(data => data.xc_language_id.value === formModuleSetting.xc_language_id.value) &&
            (props.dataSettingsModules.findIndex(data => data.xc_language_id.value === formModuleSetting.xc_language_id.value) !== formModuleSetting.keySettingsModule)
        ) {
            setFormModuleSetting(prev => ({
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

    const handleDatosSettingsModules = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            let data = {
                xc_language_id: formModuleSetting.xc_language_id,
                menu_title: formModuleSetting.menu_title,
                tooltips: formModuleSetting.tooltips,
                test_description: formModuleSetting.test_description,
            };
            if (formModuleSetting.actionSettingsModule === 0) {
                props.addSettingsModuleFunction(data, () => { cleanFields() });
            } else {
                props.updateSettingsModuleFunction(formModuleSetting.keySettingsModule, data, () => { cleanFields() });
            }
        }
    }

    const updateSettingModules = (key, data) => {
        const message = {
            title: "Editar Configuracion",
            info: "¿Esta seguro que desea editar esta configuracion?"
        };
        props.confirm(message, res => {
            if (res) {
                setFormModuleSetting(prev => ({
                    ...prev,
                    xc_language_id: data.xc_language_id,
                    menu_title: data.menu_title,
                    tooltips: data.tooltips,
                    test_description: data.test_description,
                    actionSettingsModule: 1,
                    keySettingsModule: key
                }))
            }
        });
    }

    const deleteSettingModules = (key) => {
        if (formModuleSetting.keySettingsModule === key) {
            NotificationManager.warning("¡La configuracion esta en proceso de edicion, no puede ser eliminada!");
        } else {
            const message = {
                title: "Eliminar Configuracion",
                info: "¿Esta seguro que desea eliminar este configuracion?"
            };
            props.confirm(message, res => {
                if (res) {
                    props.deleteSettingsModuleFunction(key);
                }
            });
        }
    }


    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="xc_language_id">Lenguaje</Label>
                        <div className={formModuleSetting.xc_language_id_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="xc_language_id"
                                id="xc_language_id"
                                value={formModuleSetting.xc_language_id}
                                onChange={event => handleChangeSelect(
                                    event,
                                    "xc_language_id",
                                    "xc_language_id_error",
                                    "xc_language_id_text_error",
                                    "xc_language_id_hide"
                                )}
                                options={[{ label: 'Español', value: 1 }, { label: 'Ingles', value: 2 }]}
                            />
                        </div>
                        <div className={`${formModuleSetting.xc_language_id_hide} errorControl`}>
                            {formModuleSetting.xc_language_id_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_title">Titulo</Label>
                        <Input
                            invalid={formModuleSetting.menu_title_error}
                            id="menu_title"
                            name="menu_title"
                            onKeyUp={event => handlekey(
                                "menu_title_error",
                                "menu_title_text_error",
                                "menu_title_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formModuleSetting.menu_title}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${formModuleSetting.menu_title_hide} errorControl`}>
                            {formModuleSetting.menu_title_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="tooltips">Tooltips</Label>
                        <Input
                            invalid={formModuleSetting.tooltips_error}
                            id="tooltips"
                            name="tooltips"
                            onKeyUp={event => handlekey(
                                "tooltips_error",
                                "tooltips_text_error",
                                "tooltips_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formModuleSetting.tooltips}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${formModuleSetting.tooltips_hide} errorControl`}>
                            {formModuleSetting.tooltips_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_description">Descripcion</Label>
                        <Input
                            invalid={formModuleSetting.test_description_error}
                            id="test_description"
                            name="test_description"
                            onKeyUp={event => handlekey(
                                "test_description_error",
                                "test_description_text_error",
                                "test_description_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formModuleSetting.test_description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div className={`${formModuleSetting.test_description_hide} errorControl`}>
                            {formModuleSetting.test_description_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    <div className="" style={{ marginLeft: 'auto' }}>
                        <Button
                            style={{ marginRight: '5px' }}
                            color="danger"
                            className="text-white"
                            variant="contained"
                            onClick={cleanFields}
                            disabled={props.disabled}
                        >
                            Limpiar
                        </Button>
                        <Button
                            color="primary"
                            className="text-white"
                            variant="contained"
                            onClick={handleDatosSettingsModules}
                            disabled={props.disabled}
                        >
                            {formModuleSetting.actionSettingsModule === 0 ? 'Agregar' : 'Editar'}
                        </Button>
                    </div>
                </FormGroup>
                {
                    props.dataSettingsModules && props.dataSettingsModules.length > 0 && (
                        <FormGroup className="top form-group col-sm-12">
                            <ListModuleSettings
                                data={props.dataSettingsModules}
                                updateSetting={updateSettingModules}
                                deleteSetting={deleteSettingModules}
                                disabled={props.disabled}
                            />
                        </FormGroup>
                    )
                }
            </div>
        </div >
    );
}

export default FormModuleSettings;