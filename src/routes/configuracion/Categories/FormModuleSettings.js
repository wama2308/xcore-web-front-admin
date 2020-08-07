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
import ListModuleSettings from "./ListModuleSettings";

const FormModuleSettings = props => {
    


    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="xc_language_id_module">Lenguaje</Label>
                        <div className={props.formDatosCategoria.xc_language_id_module_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="xc_language_id_module"
                                id="xc_language_id_module"
                                value={props.formDatosCategoria.xc_language_id_module}
                                onChange={event => props.handleChangeSelect(
                                    event,
                                    "xc_language_id_module",
                                    "xc_language_id_module_error",
                                    "xc_language_id_module_text_error",
                                    "xc_language_id_module_hide"
                                )}
                                options={[{ label: 'Español', value: 1 }, { label: 'Ingles', value: 2 }]}
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.xc_language_id_module_hide} errorControl`}>
                            {props.formDatosCategoria.xc_language_id_module_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_title_module">Titulo</Label>
                        <Input
                            invalid={props.formDatosCategoria.menu_title_module_error}
                            id="menu_title_module"
                            name="menu_title_module"
                            onKeyUp={event => props.handlekey(
                                "menu_title_module_error",
                                "menu_title_module_text_error",
                                "menu_title_module_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.menu_title_module}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.menu_title_module_hide} errorControl`}>
                            {props.formDatosCategoria.menu_title_module_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="tooltips_module">Tooltips</Label>
                        <Input
                            invalid={props.formDatosCategoria.tooltips_module_error}
                            id="tooltips_module"
                            name="tooltips_module"
                            onKeyUp={event => props.handlekey(
                                "tooltips_module_error",
                                "tooltips_module_text_error",
                                "tooltips_module_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.tooltips_module}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.tooltips_module_hide} errorControl`}>
                            {props.formDatosCategoria.tooltips_module_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_module_description">Descripcion</Label>
                        <Input
                            invalid={props.formDatosCategoria.test_module_description_error}
                            id="test_module_description"
                            name="test_module_description"
                            onKeyUp={event => props.handlekey(
                                "test_module_description_error",
                                "test_module_description_text_error",
                                "test_module_description_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.test_module_description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.test_module_description_hide} errorControl`}>
                            {props.formDatosCategoria.test_module_description_text_error}
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
                            onClick={props.cleanFields}
                            disabled={props.disabled}
                        >
                            Limpiar
                        </Button>
                        <Button
                            color="primary"
                            className="text-white"
                            variant="contained"
                            onClick={props.handleDatosModulesSettings}
                            disabled={props.disabled}
                        >
                            {props.formDatosCategoria.actionSettingsModule === 0 ? 'Agregar' : 'Editar'}
                        </Button>
                    </div>
                </FormGroup>
                {
                    props.dataSettingsModules && props.dataSettingsModules.length > 0 && (
                        <FormGroup className="top form-group col-sm-12">
                            <ListModuleSettings
                                data={props.dataSettingsModules}
                                updateModuleSetting={props.updateModuleSetting}
                                deleteModuleSetting={props.deleteModuleSetting}
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