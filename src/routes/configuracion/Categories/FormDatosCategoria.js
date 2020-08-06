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
import { array_icons_menu } from './IconsArray';

const FormDatosCategoria = props => {
   
    

    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="name">Nombre</Label>
                        <Input
                            invalid={props.formDatosCategoria.name_error}
                            id="name"
                            name="name"
                            onKeyUp={event => props.handlekey(
                                "name_error",
                                "name_text_error",
                                "name_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.name}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.name_hide} errorControl`}>
                            {props.formDatosCategoria.name_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_icon">Icono Menu</Label>
                        <div className={props.formDatosCategoria.menu_icon_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="menu_icon"
                                id="menu_icon"
                                value={props.formDatosCategoria.menu_icon}
                                onChange={event => props.handleChangeSelect(
                                    event,
                                    "menu_icon",
                                    "menu_icon_error",
                                    "menu_icon_text_error",
                                    "menu_icon_hide"
                                )}
                                options={array_icons_menu}
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.menu_icon_hide} errorControl`}>
                            {props.formDatosCategoria.menu_icon_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_icon">Tipo</Label>
                        <div className={props.formDatosCategoria.type_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="type"
                                id="type"
                                value={props.formDatosCategoria.type}
                                onChange={event => props.handleChangeSelect(
                                    event,
                                    "type",
                                    "type_error",
                                    "type_text_error",
                                    "type_hide"
                                )}
                                options={props.formDatosCategoria.array_type_category}
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.type_hide} errorControl`}>
                            {props.formDatosCategoria.type_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="gerente">¿Nuevo item?</Label>
                    <div className={props.formDatosCategoria.new_item_error}>
                        <Switch
                            checked={props.formDatosCategoria.new_item ? props.formDatosCategoria.new_item : false}
                            onChange={props.handleChangeSwitch(
                                "new_item",
                                "new_item_error",
                                "new_item_text_error",
                                "new_item_hide",
                            )}
                            value={props.formDatosCategoria.new_item}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${props.formDatosCategoria.new_item_hide} errorControl`}>
                        {props.formDatosCategoria.new_item_text_error}
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="gerente">¿Abierto?</Label>
                    <div className={props.formDatosCategoria.open_error}>
                        <Switch
                            checked={props.formDatosCategoria.open ? props.formDatosCategoria.open : false}
                            onChange={props.handleChangeSwitch(
                                "open",
                                "open_error",
                                "open_text_error",
                                "open_hide",
                            )}
                            value={props.formDatosCategoria.open}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${props.formDatosCategoria.open_hide} errorControl`}>
                        {props.formDatosCategoria.open_text_error}
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="position">Posicion</Label>
                        <Input
                            invalid={props.formDatosCategoria.position_error}
                            id="position"
                            name="position"
                            onKeyUp={event => props.handlekey(
                                "position_error",
                                "position_text_error",
                                "position_hide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.position}
                            type="number"
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.position_hide} errorControl`}>
                            {props.formDatosCategoria.position_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="individual_amount">Monto</Label>
                        <Input
                            invalid={props.formDatosCategoria.individual_amount_error}
                            id="individual_amount"
                            name="individual_amount"
                            onKeyUp={() => props.handlekeyMonto(
                                "individual_amount",
                                "individual_amount_error",
                                "individual_amount_text_error",
                                "individual_amount_hide"
                            )}
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.individual_amount}
                            type="text"
                            onBlur={props.eventoBlur}
                            onFocus={props.eventoFocus}
                            disabled={props.disabled}
                        />
                        <div className={`${props.formDatosCategoria.individual_amount_hide} errorControl`}>
                            {props.formDatosCategoria.individual_amount_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="test">¿Prueba?</Label>
                    <div className={props.formDatosCategoria.test_error}>
                        <Switch
                            checked={props.formDatosCategoria.test ? props.formDatosCategoria.test : false}
                            onChange={props.handleChangeSwitch(
                                "test",
                                "test_error",
                                "test_text_error",
                                "test_hide",
                            )}
                            value={props.formDatosCategoria.test}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${props.formDatosCategoria.test_hide} errorControl`}>
                        {props.formDatosCategoria.test_text_error}
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_end_date">Fecha de Expiracion</Label>
                        <div className={props.formDatosCategoria.test_end_date_error}>
                            <DatePicker
                                selected={props.formDatosCategoria.test_end_date}
                                onChange={props.handleChangeExpirationDate}
                                dateFormat="dd-MM-yyyy"
                                isClearable={props.option === 2 ? !props.disabled
                                    : props.formDatosCategoria.test}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                className="form-control"
                                disabled={props.option !== 2 ? !props.formDatosCategoria.test : props.disabled}
                                locale="es"
                            />
                        </div>
                        <div className={`${props.formDatosCategoria.test_end_date_hide} errorControl`}>
                            {props.formDatosCategoria.test_end_date_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="description">Descripcion</Label>
                        <Input
                            invalid={props.formDatosCategoria.description_error}
                            id="description"
                            name="description"
                            onKeyUp={() =>
                                props.handlekey(
                                    "description_error",
                                    "description_text_error",
                                    "description_hide",
                                    1
                                )
                            }
                            onChange={props.handleChange}
                            value={props.formDatosCategoria.description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div
                            className={`${props.formDatosCategoria.description_hide} errorControl`}
                        >
                            {props.formDatosCategoria.description_text_error}
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
                            onClick={props.handleDatosCategory}
                            disabled={props.disabled}
                        >
                            Siguiente
                        </Button>
                    </div>
                </FormGroup>
            </div>
        </div >
    );
}

export default FormDatosCategoria;