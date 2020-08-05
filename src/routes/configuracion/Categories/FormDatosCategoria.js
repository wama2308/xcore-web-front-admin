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
import { stateInitial } from './StateInitialCategories';
import { array_icons_menu } from './IconsArray';

const FormDatosCategoria = props => {
    const initialFormState = stateInitial;
    const [formDatosCategoria, setFormDatosCategoria] = useState(initialFormState)

    const handleChange = e => {
        const { name, value } = e.target;
        setFormDatosCategoria(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));

    };

    const handleChangeSwitch = (name, error, textError, hide, option) => event => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',
        }));
        if (name === 'test') {
            setFormDatosCategoria(prev => ({
                ...prev,
                test_end_date: new Date(),
            }));
        }
    };

    const handleChangeExpirationDate = date => {
        setFormDatosCategoria(prev => ({
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
        setFormDatosCategoria(prev => ({
            ...prev,
            [campo]: monto,
            [campoError]: false,
            [campoErrorText]: '',
            [campohide]: 'hide',
        }));
    };

    const eventoBlur = (e) => {
        if (formDatosCategoria.individual_amount === '' || formDatosCategoria.individual_amount === '0.0') {
            setFormDatosCategoria(prev => ({
                ...prev,
                individual_amount: '0'
            }));
        }
    }

    const eventoFocus = (e) => {
        if (formDatosCategoria.individual_amount === '0') {
            setFormDatosCategoria(prev => ({
                ...prev,
                individual_amount: ''
            }));
        }
    }

    const cleanFields = () => {
        setFormDatosCategoria(prev => ({
            ...initialFormState
        }));
    }

    const validate = () => {
        let acum = "";
        if (formDatosCategoria.name === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                name_error: true,
                name_text_error: "Ingrese el nombre",
                name_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.menu_icon === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                menu_icon_error: 'borderColor',
                menu_icon_text_error: "Ingrese el nombre",
                menu_icon_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.type === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                type_error: 'borderColor',
                type_text_error: "Ingrese el nombre",
                type_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.position === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                position_error: true,
                position_text_error: "Ingrese el nombre",
                position_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.individual_amount === '0' || formDatosCategoria.individual_amount === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                individual_amount_error: true,
                individual_amount_text_error: "Ingrese el nombre",
                individual_amount_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.test && formDatosCategoria.test_end_date === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                test_end_date_error: 'borderColor',
                test_end_date_text_error: "Ingrese la fecha de culminacion de la prueba",
                test_end_date_hide: 'show',
            }))
            acum = 1;
        }

        if (acum > 0) {
            return false;
        }
        return true;
    }

    const handleDatosCategory = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            console.log(1111);
            props.handleNextTabsOne();
        }
    }

    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="name">Nombre</Label>
                        <Input
                            invalid={formDatosCategoria.name_error}
                            id="name"
                            name="name"
                            onKeyUp={event => handlekey(
                                "name_error",
                                "name_text_error",
                                "name_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formDatosCategoria.name}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${formDatosCategoria.name_hide} errorControl`}>
                            {formDatosCategoria.name_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_icon">Icono Menu</Label>
                        <div className={formDatosCategoria.menu_icon_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="menu_icon"
                                id="menu_icon"
                                value={formDatosCategoria.menu_icon}
                                onChange={event => handleChangeSelect(
                                    event,
                                    "menu_icon",
                                    "menu_icon_error",
                                    "menu_icon_text_error",
                                    "menu_icon_hide"
                                )}
                                options={array_icons_menu}
                            />
                        </div>
                        <div className={`${formDatosCategoria.menu_icon_hide} errorControl`}>
                            {formDatosCategoria.menu_icon_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_icon">Tipo</Label>
                        <div className={formDatosCategoria.type_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="type"
                                id="type"
                                value={formDatosCategoria.type}
                                onChange={event => handleChangeSelect(
                                    event,
                                    "type",
                                    "type_error",
                                    "type_text_error",
                                    "type_hide"
                                )}
                                options={formDatosCategoria.array_type_category}
                            />
                        </div>
                        <div className={`${formDatosCategoria.type_hide} errorControl`}>
                            {formDatosCategoria.type_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="gerente">¿Nuevo item?</Label>
                    <div className={formDatosCategoria.new_item_error}>
                        <Switch
                            checked={formDatosCategoria.new_item ? formDatosCategoria.new_item : false}
                            onChange={handleChangeSwitch(
                                "new_item",
                                "new_item_error",
                                "new_item_text_error",
                                "new_item_hide",
                            )}
                            value={formDatosCategoria.new_item}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${formDatosCategoria.new_item_hide} errorControl`}>
                        {formDatosCategoria.new_item_text_error}
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="gerente">¿Abierto?</Label>
                    <div className={formDatosCategoria.open_error}>
                        <Switch
                            checked={formDatosCategoria.open ? formDatosCategoria.open : false}
                            onChange={handleChangeSwitch(
                                "open",
                                "open_error",
                                "open_text_error",
                                "open_hide",
                            )}
                            value={formDatosCategoria.open}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${formDatosCategoria.open_hide} errorControl`}>
                        {formDatosCategoria.open_text_error}
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="position">Posicion</Label>
                        <Input
                            invalid={formDatosCategoria.position_error}
                            id="position"
                            name="position"
                            onKeyUp={event => handlekey(
                                "position_error",
                                "position_text_error",
                                "position_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formDatosCategoria.position}
                            type="number"
                            disabled={props.disabled}
                        />
                        <div className={`${formDatosCategoria.position_hide} errorControl`}>
                            {formDatosCategoria.position_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="individual_amount">Monto</Label>
                        <Input
                            invalid={formDatosCategoria.individual_amount_error}
                            id="individual_amount"
                            name="individual_amount"
                            onKeyUp={() => handlekeyMonto(
                                "individual_amount",
                                "individual_amount_error",
                                "individual_amount_text_error",
                                "individual_amount_hide"
                            )}
                            onChange={handleChange}
                            value={formDatosCategoria.individual_amount}
                            type="text"
                            onBlur={eventoBlur}
                            onFocus={eventoFocus}
                            disabled={props.disabled}
                        />
                        <div className={`${formDatosCategoria.individual_amount_hide} errorControl`}>
                            {formDatosCategoria.individual_amount_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check className="top form-group col-sm-6">
                    <Label for="test">¿Prueba?</Label>
                    <div className={formDatosCategoria.test_error}>
                        <Switch
                            checked={formDatosCategoria.test ? formDatosCategoria.test : false}
                            onChange={handleChangeSwitch(
                                "test",
                                "test_error",
                                "test_text_error",
                                "test_hide",
                            )}
                            value={formDatosCategoria.test}
                            color="primary"
                            disabled={props.disabled}
                        />
                    </div>
                    <div className={`${formDatosCategoria.test_hide} errorControl`}>
                        {formDatosCategoria.test_text_error}
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_end_date">Fecha de Expiracion</Label>
                        <div className={formDatosCategoria.test_end_date_error}>
                            <DatePicker
                                selected={formDatosCategoria.test_end_date}
                                onChange={handleChangeExpirationDate}
                                dateFormat="dd-MM-yyyy"
                                isClearable={props.option === 2 ? !props.disabled
                                    : formDatosCategoria.test}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                className="form-control"
                                disabled={props.option !== 2 ? !formDatosCategoria.test : props.disabled}
                                locale="es"
                            />
                        </div>
                        <div className={`${formDatosCategoria.test_end_date_hide} errorControl`}>
                            {formDatosCategoria.test_end_date_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="description">Descripcion</Label>
                        <Input
                            invalid={formDatosCategoria.description_error}
                            id="description"
                            name="description"
                            onKeyUp={() =>
                                handlekey(
                                    "description_error",
                                    "description_text_error",
                                    "description_hide",
                                    1
                                )
                            }
                            onChange={handleChange}
                            value={formDatosCategoria.description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div
                            className={`${formDatosCategoria.description_hide} errorControl`}
                        >
                            {formDatosCategoria.description_text_error}
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
                            onClick={handleDatosCategory}
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