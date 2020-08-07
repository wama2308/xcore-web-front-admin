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
import ListSettingsCategory from "./ListSettingsCategory";

const FormSettingsCategory = props => {
    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="xc_language_id">Lenguaje</Label>
                        <div className={props.formDatosCategoria.xc_language_id_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="xc_language_id"
                                id="xc_language_id"
                                value={props.formDatosCategoria.xc_language_id}
                                onChange={event => props.handleChangeSelect(
                                    event,
                                    "xc_language_id",
                                    "xc_language_id_error",
                                    "xc_language_id_text_error",
                                    "xc_language_id_hide"
                                )}
                                options={props.dataLanguajes}
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.xc_language_id_hide} errorControl`}>
                            {props.formDatosCategoria.xc_language_id_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_title">Titulo</Label>
                        <Input
                            invalid={props.formDatosCategoria.menu_title_error}
                            id="menu_title"
                            name="menu_title"
                            onKeyUp={event => props.handlekey(
                                "menu_title_error",
                                "menu_title_text_error",
                                "menu_title_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.menu_title}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.menu_title_hide} errorControl`}>
                            {props.formDatosCategoria.menu_title_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="tooltips">Tooltips</Label>
                        <Input
                            invalid={props.formDatosCategoria.tooltips_error}
                            id="tooltips"
                            name="tooltips"
                            onKeyUp={event => props.handlekey(
                                "tooltips_error",
                                "tooltips_text_error",
                                "tooltips_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.tooltips}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.tooltips_hide} errorControl`}>
                            {props.formDatosCategoria.tooltips_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_description">Descripcion</Label>
                        <Input
                            invalid={props.formDatosCategoria.test_description_error}
                            id="test_description"
                            name="test_description"
                            onKeyUp={event => props.handlekey(
                                "test_description_error",
                                "test_description_text_error",
                                "test_description_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.test_description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.test_description_hide} errorControl`}>
                            {props.formDatosCategoria.test_description_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    <div className="" style={{ marginLeft: 'auto' }}>                        
                        <Button
                            color="primary"
                            className="text-white"
                            variant="contained"
                            onClick={props.handleDatosSettingsCategory}
                            disabled={props.disabled}
                        >
                            {props.formDatosCategoria.actionSettingsCategory === 0 ? 'Agregar Configuracion' : 'Editar Configuracion'}
                        </Button>
                    </div>
                </FormGroup>
                {
                    props.dataSettings && props.dataSettings.length > 0 && (
                        <FormGroup className="top form-group col-sm-12">
                            <ListSettingsCategory
                                data={props.dataSettings}
                                updateSetting={props.updateSetting}
                                deleteSetting={props.deleteSetting}
                                disabled={props.disabled}
                            />
                        </FormGroup>
                    )
                }
            </div>
        </div >
    );
}

export default FormSettingsCategory;