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
import IconButton from "@material-ui/core/IconButton";
import { Edit, Delete } from "@material-ui/icons";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import "../../../assets/css/style.css";
import { estadoInicial } from './estadoInicial';
import { connect } from "react-redux";
import { addContactosFunction, deleteContactosFunction, editContactosFunction } from "../../../actions/SucursalActions"

class ListContactos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...estadoInicial
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
            this.props.limpiarValidaciones();
            let data = {
                _id: "",
                name: this.state.nombreContacto,
                surname: this.state.apellidoContacto,
                email: this.state.emailContacto,
                phone: this.state.telefonoContacto,
            };
            if (this.state.actionContacto === 0) {
                this.props.addContactosFunction(data, () => { this.limpiarCampos() });
            } else {
                this.props.editContactosFunction(this.state.keyContacto, data, () => { this.limpiarCampos() });
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

    editContacto(key, data) {
        const message = {
            title: "Editar Contacto",
            info: "¿Esta seguro que desea editar este contacto?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.setState({
                    _id: data._id,
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

    deleteContacto(data, key) {
        const message = {
            title: "Eliminar Contacto",
            info: "¿Esta seguro que desea eliminar este contacto?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteContactosFunction(data, key);
            }
        });
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
                                >
                                    Limpiar
                                </Button>
                                <Button
                                    color="primary"
                                    className="text-white"
                                    variant="contained"
                                    onClick={this.handleSaveContacto}
                                >
                                    {
                                        this.state.actionContacto === 0 ? 'Agregar' : 'Editar'
                                    }
                                </Button>
                            </div>
                        }
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12">
                        <div className={`${this.props.listContactosHide} errorControlDiv`}>
                            {this.props.listContactosTextError}
                        </div>
                        <RctCollapsibleCard heading="Lista de Contactos" fullBlock>
                            <Table aria-label="a dense table">
                                <TableHead className="">
                                    <TableRow hover>
                                        <TableCell style={{ width: '10%' }} align="center">Nro</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Nombres</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Apellidos</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Email</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Telefono</TableCell>
                                        {
                                            !this.props.disabled &&
                                            <TableCell style={{ width: '10%' }} align="center">Acciones</TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <Fragment>
                                        {this.props.sucursal.contactos.length > 0 && this.props.sucursal.contactos.map((data, key) => (
                                            <TableRow hover key={key}>
                                                <TableCell style={{ width: '10%' }} align="center">{key + 1}</TableCell>
                                                <TableCell style={{ width: '20%' }} align="center">{data.name}</TableCell>
                                                <TableCell style={{ width: '20%' }} align="center">{data.surname}</TableCell>
                                                <TableCell style={{ width: '20%' }} align="center">{data.email}</TableCell>
                                                <TableCell style={{ width: '20%' }} align="center">{data.phone}</TableCell>
                                                {
                                                    !this.props.disabled &&
                                                    <TableCell style={{ width: '10%', minWidth: '130px' }} align="center">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Editar Contacto"
                                                                className="iconButtons"
                                                                onClick={() => { this.editContacto(key, data); }}
                                                            >
                                                                <Edit className="iconTable" />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete"
                                                                title="Borrar Contacto"
                                                                className="iconButtons"
                                                                onClick={() => { this.deleteContacto(data, key); }}
                                                            >
                                                                <Delete className="iconTable" />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                }
                                            </TableRow>
                                        ))}
                                    </Fragment>
                                </TableBody>
                            </Table>
                        </RctCollapsibleCard>
                    </FormGroup>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    sucursal: state.sucursal.toJS(),
    aplication: state.general,
});
const mapDispatchToProps = dispatch => ({
    addContactosFunction: (data, callback) => dispatch(addContactosFunction(data, callback)),
    editContactosFunction: (key, data, callback) => dispatch(editContactosFunction(key, data, callback)),
    deleteContactosFunction: (data, key) => dispatch(deleteContactosFunction(data, key)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListContactos);