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
import { stateInitialCateroriesSettings } from './StateInitialCategoriesSettings';

const FormSettingsCategory = props => {
    const initialFormState = stateInitialCateroriesSettings;
    const [formSettingsCategoria, setFormSettingsCategoria] = useState(initialFormState)

    const handleChange = e => {
        const { name, value } = e.target;
        setFormSettingsCategoria(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setFormSettingsCategoria(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        setFormSettingsCategoria(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));

    };

    const cleanFields = () => {
        setFormSettingsCategoria(prev => ({
            ...initialFormState
        }));
    }

    const validate = () => {
        let acum = "";
        if (formSettingsCategoria.xc_language_id === null) {
            setFormSettingsCategoria(prev => ({
                ...prev,
                xc_language_id_error: 'borderColor',
                xc_language_id_text_error: "Seleccione el lenguae",
                xc_language_id_hide: 'show',
            }))
            acum = 1;
        }
        if (formSettingsCategoria.menu_title === '') {
            setFormSettingsCategoria(prev => ({
                ...prev,
                menu_title_error: true,
                menu_title_text_error: "Ingrese el titulo",
                menu_title_hide: 'show',
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
            console.log(111111111111111111111111111);
        }
    }

    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="xc_language_id">Lenguaje</Label>
                        <div className={formSettingsCategoria.xc_language_id_error}>
                            <Select
                                isSearchable
                                isClearable
                                isDisabled={props.disabled}
                                name="xc_language_id"
                                id="xc_language_id"
                                value={formSettingsCategoria.xc_language_id}
                                onChange={event => handleChangeSelect(
                                    event,
                                    "xc_language_id",
                                    "xc_language_id_error",
                                    "xc_language_id_text_error",
                                    "xc_language_id_hide"
                                )}
                                options={[]}
                            />
                        </div>
                        <div className={`${formSettingsCategoria.xc_language_id_hide} errorControl`}>
                            {formSettingsCategoria.xc_language_id_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="menu_title">Titulo</Label>
                        <Input
                            invalid={formSettingsCategoria.menu_title_error}
                            id="menu_title"
                            name="menu_title"
                            onKeyUp={event => handlekey(
                                "menu_title_error",
                                "menu_title_text_error",
                                "menu_title_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formSettingsCategoria.menu_title}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${formSettingsCategoria.menu_title_hide} errorControl`}>
                            {formSettingsCategoria.menu_title_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="tooltips">Tooltips</Label>
                        <Input
                            invalid={formSettingsCategoria.tooltips_error}
                            id="tooltips"
                            name="tooltips"
                            onKeyUp={event => handlekey(
                                "tooltips_error",
                                "tooltips_text_error",
                                "tooltips_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formSettingsCategoria.tooltips}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${formSettingsCategoria.tooltips_hide} errorControl`}>
                            {formSettingsCategoria.tooltips_text_error}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="test_description">Descripcion</Label>
                        <Input
                            invalid={formSettingsCategoria.test_description_error}
                            id="test_description"
                            name="test_description"
                            onKeyUp={event => handlekey(
                                "test_description_error",
                                "test_description_text_error",
                                "test_description_hide",
                                1
                            )}
                            onChange={handleChange}
                            value={formSettingsCategoria.test_description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div className={`${formSettingsCategoria.test_description_hide} errorControl`}>
                            {formSettingsCategoria.test_description_text_error}
                        </div>
                    </div>
                </FormGroup>


                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="description">Descripcion</Label>
                        <Input
                            invalid={formSettingsCategoria.description_error}
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
                            value={formSettingsCategoria.description}
                            type="textarea"
                            disabled={props.disabled}
                        />
                        <div
                            className={`${formSettingsCategoria.description_hide} errorControl`}
                        >
                            {formSettingsCategoria.description_text_error}
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
                            onClick={handleDatosSettingsCategory}
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

export default FormSettingsCategory;