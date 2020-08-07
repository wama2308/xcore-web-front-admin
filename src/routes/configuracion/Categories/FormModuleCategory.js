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
import FormModuleSettings from './FormModuleSettings';
//import ListSettingsCategory from "./ListSettingsCategory";

const FormModuleCategory = props => {
    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="name_module">Nombre</Label>
                        <Input
                            invalid={props.formDatosCategoria.name_module_error}
                            id="name_module"
                            name="name_module"
                            onKeyUp={event => props.handlekey(
                                "name_module_error",
                                "name_module_text_error",
                                "name_module_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.name_module}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.name_module_hide} errorControl`}>
                            {props.formDatosCategoria.name_module_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="path">Ruta</Label>
                        <div className={props.formDatosCategoria.menu_icon_error}>
                            <Input
                                invalid={props.formDatosCategoria.path_error}
                                id="path"
                                name="path"
                                onKeyUp={event => props.handlekey(
                                    "path_error",
                                    "path_text_error",
                                    "path_hide",
                                    1
                                )}
                                onChange={props.handleChange}
                                value={props.formDatosCategoria.path}
                                type="text"
                                disabled={props.disabled}
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.path_hide} errorControl`}>
                            {props.formDatosCategoria.path_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="new_item_module">¿Nuevo item?</Label>
                    <Switch
                        checked={props.formDatosCategoria.new_item_module ? props.formDatosCategoria.new_item_module : false}
                        onChange={props.handleChangeSwitch("new_item_module")}
                        value={props.formDatosCategoria.new_item_module}
                        color="primary"
                        disabled={props.disabled} />

                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="open_module">¿Abierto?</Label>
                    <Switch
                        checked={props.formDatosCategoria.open_module ? props.formDatosCategoria.open_module : false}
                        onChange={props.handleChangeSwitch("open_module")}
                        value={props.formDatosCategoria.open_module}
                        color="primary"
                        disabled={props.disabled}
                    />
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="position_module">Posicion</Label>
                        <Input
                            invalid={props.formDatosCategoria.position_module_error}
                            id="position_module"
                            name="position_module"
                            onKeyUp={event => props.handlekey(
                                "position_module_error",
                                "position_module_text_error",
                                "position_module_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.position_module}
                            type="number"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.position_module_hide} errorControl`}>
                            {props.formDatosCategoria.position_module_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="individual_module_amount">Monto</Label>
                        <Input
                            invalid={props.formDatosCategoria.individual_module_amount_error}
                            id="individual_module_amount"
                            name="individual_module_amount"
                            onKeyUp={() => props.handlekeyMonto(
                                "individual_module_amount",
                                "individual_module_amount_error",
                                "individual_module_amount_text_error",
                                "individual_module_amount_hide"
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.individual_module_amount}
                            type="text"
                            onBlur={props.eventoBlur}
                            onFocus={props.eventoFocus}
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.individual_module_amount_hide} errorControl`}>
                            {props.formDatosCategoria.individual_module_amount_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="test_module">¿Prueba?</Label>
                    <Switch
                        checked={props.formDatosCategoria.test_module ? props.formDatosCategoria.test_module : false}
                        onChange={props.handleChangeSwitch("test_module")}
                        value={props.formDatosCategoria.test_module}
                        color="primary"
                        disabled={props.disabled}
                    />
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_module_end_date">Fecha de Expiracion</Label>
                        <div className={props.formDatosCategoria.test_module_end_date_error}>
                            <DatePicker
                                selected={props.formDatosCategoria.test_module_end_date}
                                onChange={props.handleChangeExpirationDate}
                                dateFormat="dd-MM-yyyy"
                                isClearable={props.option === 2 ? !props.disabled
                                    : props.formDatosCategoria.test_module}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                className="form-control"
                                disabled={props.option !== 2 ? !props.formDatosCategoria.test_module : props.disabled}
                                locale="es"
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.test_module_end_date_hide} errorControl`}>
                            {props.formDatosCategoria.test_module_end_date_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="description_module">Descripcion</Label>
                        <Input
                            invalid={props.formDatosCategoria.description_module_error}
                            id="description_module"
                            name="description_module"
                            onKeyUp={() => props.handlekey(
                                "description_module_error",
                                "description_module_text_error",
                                "description_module_hide",
                                1
                            )
                            }
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.description_module}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.description_module_hide} errorControl`}>
                            {props.formDatosCategoria.description_module_text_error}
                        </div>
                    </div>
                </FormGroup>
            </div>
            <hr />
            <div className="row">

                <FormGroup className="top form-group col-sm-4">
                    <Button
                        color="primary"
                        onClick={props.collapseFunction}
                        disabled={props.disabled}
                    >
                        Configuracion
                    </Button>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    <Collapse isOpen={props.formDatosCategoria.CollapseSettings}>
                        <Card>
                            <CardBody>
                                <FormModuleSettings
                                    handleChange={props.handleChange}
                                    handlekey={props.handlekey}
                                    handleChangeSelect={props.handleChangeSelect}
                                    handleDatosModulesSettings={props.handleDatosModulesSettings}
                                    updateModuleSetting={props.updateModuleSetting}
                                    deleteModuleSetting={props.deleteModuleSetting}
                                    dataSettingsModules={props.dataSettingsModules}
                                    formDatosCategoria={props.formDatosCategoria}
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