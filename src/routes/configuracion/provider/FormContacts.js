import React, { Component, Fragment } from 'react';
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
import "../../../assets/css/style.css";
import { stateInitial } from './StateInitial';
import ListContacts from "./ListContacts";

class FormContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...stateInitial
        };
    }

    componentDidMount() {
        //console.log("componentDidMount ")
    }

    componentWillReceiveProps = props => {
        //console.log("componentWillReceiveProps ", props)
    }
    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekey(campoError, campoErrorText, hide) {
        this.setState({
            [campoError]: false,
            [campoErrorText]: "",
            [hide]: "hide",
        });
    };

    validarEmail(email) {
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email) ? true : false;
    }

    validate = () => {
        let acum = "";
        if (!this.state.nombreContacto) {
            this.setState({
                nombreContactoError: true,
                nombreContactoTextError: 'Ingrese el nombre del contacto',
                nombreContactoHide: 'show'
            });
            acum = 1;
        }
        if (!this.state.apellidoContacto) {
            this.setState({
                apellidoContactoError: true,
                apellidoContactoTextError: 'Ingrese el apellido del contacto',
                apellidoContactoHide: 'show'
            });
            acum = 1;
        }
        if (!this.state.emailContacto) {
            this.setState({
                emailContactoError: true,
                emailContactoTextError: 'Ingrese el email del contacto',
                emailContactoHide: 'show'
            });
            acum = 1;
        }
        if (this.state.emailContacto && !this.validarEmail(this.state.emailContacto)) {
            this.setState({
                emailContactoError: true,
                emailContactoTextError: 'Email invalido',
                emailContactoHide: 'show'
            });
            acum = 1;
        }
        if (!this.state.telefonoContacto) {
            this.setState({
                telefonoContactoError: true,
                telefonoContactoTextError: 'Ingrese el telefono',
                telefonoContactoHide: 'show'
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    }

    handleSaveContacto = event => {
        event.preventDefault();
        const isValid = this.validate();

        if (isValid) {
            //this.props.limpiarValidaciones();
            let data = {
                name: this.state.nombreContacto,
                surname: this.state.apellidoContacto,
                email: this.state.emailContacto,
                phone: this.state.telefonoContacto,
            };
            if (this.state.actionContacto === 0) {
                this.props.addContactosProviderFunction(data, () => { this.limpiarCampos() });
            } else {
                this.props.editContactosProviderFunction(this.state.keyContacto, data, () => { this.limpiarCampos() });
            }
        }
    }

    limpiarCampos() {
        this.setState({
            nombreContacto: '',
            apellidoContacto: '',
            emailContacto: '',
            telefonoContacto: '',
            actionContacto: 0,
            keyContacto: -1
        });
    }

    editContacto = (key, data) => {
        const message = {
            title: "Editar Contacto",
            info: "¿Esta seguro que desea editar este contacto?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.setState({
                    nombreContacto: data.name,
                    apellidoContacto: data.surname,
                    emailContacto: data.email,
                    telefonoContacto: data.phone,
                    actionContacto: 1,
                    keyContacto: key
                });
            }
        });
    }

    deleteContacto = (key) => {
        if (this.state.keyContacto === key) {
            NotificationManager.warning("¡El contacto esta en proceso de edicion, no puede ser eliminado!");
        } else {
            const message = {
                title: "Eliminar Contacto",
                info: "¿Esta seguro que desea eliminar este contacto?"
            };
            this.props.confirm(message, res => {
                if (res) {
                    this.props.deleteContactosProviderFunction(key);
                }
            });
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <FormGroup className="top form-group col-sm-6">
                        <div>
                            <Label for="nombre">Nombre</Label>
                            <Input
                                invalid={this.state.nombreContactoError}
                                label="Nombre"
                                id="nombreContacto"
                                name="nombreContacto"
                                onKeyUp={event => this.handlekey("nombreContactoError", "nombreContactoTextError", "nombreContactoHide")}
                                onChange={this.handleChange}
                                value={this.state.nombreContacto}
                                type="text"
                                disabled={this.props.disabled}
                            />
                            <div className={`${this.state.nombreContactoHide} errorControl`}>
                                {this.state.nombreContactoTextError}
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-6">
                        <div>
                            <Label for="apellido">Apellido</Label>
                            <Input
                                invalid={this.state.apellidoContactoError}
                                label="Apellido"
                                id="apellidoContacto"
                                name="apellidoContacto"
                                onKeyUp={event => this.handlekey("apellidoContactoError", "apellidoContactoTextError", "apellidoContactoHide")}
                                onChange={this.handleChange}
                                value={this.state.apellidoContacto}
                                type="text"
                                disabled={this.props.disabled}
                            />
                            <div className={`${this.state.apellidoContactoHide} errorControl`}>
                                {this.state.apellidoContactoTextError}
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-6">
                        <div>
                            <Label for="email">Email</Label>
                            <Input
                                invalid={this.state.emailContactoError}
                                label="Email"
                                id="emailContacto"
                                name="emailContacto"
                                onKeyUp={event => this.handlekey("emailContactoError", "emailContactoTextError", "emailContactoHide")}
                                onChange={this.handleChange}
                                value={this.state.emailContacto}
                                type="text"
                                disabled={this.props.disabled}
                            />
                            <div className={`${this.state.emailContactoHide} errorControl`}>
                                {this.state.emailContactoTextError}
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-6">
                        <div>
                            <Label for="apellido">Telefono</Label>
                            <Input
                                invalid={this.state.telefonoContactoError}
                                label="Telefono"
                                id="telefonoContacto"
                                name="telefonoContacto"
                                onKeyUp={event => this.handlekey("telefonoContactoError", "telefonoContactoTextError", "telefonoContactoHide")}
                                onChange={this.handleChange}
                                value={this.state.telefonoContacto}
                                type="number"
                                disabled={this.props.disabled}
                            />
                            <div className={`${this.state.telefonoContactoHide} errorControl`}>
                                {this.state.telefonoContactoTextError}
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12">
                        {
                            !this.props.disabled &&
                            <div className="" style={{ marginLeft: 'auto' }}>
                                <Button
                                    style={{ marginRight: '5px' }}
                                    color="danger"
                                    className="text-white"
                                    variant="contained"
                                    onClick={() => { this.limpiarCampos(); }}
                                    disabled={this.props.disabled}
                                >
                                    Limpiar
                                </Button>
                                <Button
                                    color="primary"
                                    className="text-white"
                                    variant="contained"
                                    onClick={this.handleSaveContacto}
                                    disabled={this.props.disabled}
                                >
                                    {
                                        this.state.actionContacto === 0 ? 'Agregar' : 'Editar'
                                    }
                                </Button>
                            </div>
                        }
                    </FormGroup>
                    {
                        this.props.contactsProvider && this.props.contactsProvider.length > 0 && (
                            <FormGroup className="top form-group col-sm-12">
                                <ListContacts
                                    data={this.props.contactsProvider}
                                    deleteContacto={this.deleteContacto}
                                    editContacto={this.editContacto}
                                    disabled={this.props.disabled}
                                />
                            </FormGroup>
                        )
                    }
                </div>
            </div >
        );
    }
}

export default FormContacts;