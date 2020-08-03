import React, { Component, Fragment } from 'react';
import {
    Button,
    Input,
    FormGroup,
    Label,
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
import { stateInitial } from './StateInitial';
import { connect } from "react-redux";
import { addShelfsFunction, editShelfsFunction, deleteShelfsFunction } from "../../../actions/StoreActions"

class Shelfs extends React.Component {
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

    validate = () => {
        let acum = "";
        if (this.state.shelf === '') {
            this.setState({
                shelfError: true,
                shelfTextError: 'Ingrese el nombre del estante',
                shelfHide: 'show'
            });
            acum = 1;
        }
        if (this.state.descriptionShelf === '') {
            this.setState({
                descriptionShelfError: true,
                descriptionShelfTextError: 'Ingrese la descripcion del estante',
                descriptionShelfHide: 'show'
            });
            acum = 1;
        }
        if (this.state.descriptionShelf.length < 16) {
            this.setState({
                descriptionShelfError: true,
                descriptionShelfTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionShelfHide: 'show',
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    }

    handleSaveShelfs = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let data = {
                _id: this.state._id,
                name: this.state.shelf,
                description: this.state.descriptionShelf,
            };
            if (this.state.actionShelfs === 0) {
                this.props.addShelfsFunction(
                    data,
                    () => { this.limpiarCampos() },
                    this.props.option === 3 ? this.props.dataAlmacen._id : '',
                );
            } else {
                this.props.editShelfsFunction(
                    this.state.keyShelfs,
                    data,
                    this.props.option === 3 ? this.props.dataAlmacen._id : '',
                    () => { this.limpiarCampos() }
                );
            }
        }
    }

    limpiarCampos() {
        this.setState({
            shelf: '',
            descriptionShelf: '',
            actionShelfs: 0,
            keyShelfs: -1
        });
    }

    editShelf(key, data) {
        const message = {
            title: "Editar Estante",
            info: "¿Esta seguro que desea editar este estante?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.setState({
                    _id: data._id,
                    shelf: data.name,
                    descriptionShelf: data.description,
                    actionShelfs: 1,
                    keyShelfs: key
                });
            }
        });
    }

    deleteShelf(data, key) {
        const message = {
            title: "Eliminar Estante",
            info: "¿Esta seguro que desea eliminar este estante?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteShelfsFunction(
                    data,
                    key,
                    this.props.option === 3 ? this.props.dataAlmacen._id : '',
                );
            }
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <FormGroup className="top form-group col-sm-6">
                        <div>
                            <Label for="shelf">Nombre</Label>
                            <Input
                                invalid={this.state.shelfError}
                                id="shelf"
                                name="shelf"
                                onKeyUp={event => this.handlekey(
                                    "shelfError",
                                    "shelfTextError",
                                    "shelfHide"
                                )}
                                onChange={this.handleChange}
                                value={this.state.shelf}
                                type="text"
                                disabled={this.props.disabled}
                            />
                            <div className={`${this.state.shelfHide} errorControl`}>
                                {this.state.shelfTextError}
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-6">
                        <div>
                            <Label for="descriptionShelf">Descripcion</Label>
                            <Input
                                invalid={this.state.descriptionShelfError}
                                id="descriptionShelf"
                                name="descriptionShelf"
                                onKeyUp={event => this.handlekey(
                                    "descriptionShelfError",
                                    "descriptionShelfTextError",
                                    "descriptionShelfHide"
                                )}
                                onChange={this.handleChange}
                                value={this.state.descriptionShelf}
                                type="textarea"
                                disabled={this.props.disabled}
                            />
                            <div className={`${this.state.descriptionShelfHide} errorControl`}>
                                {this.state.descriptionShelfTextError}
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
                                    onClick={this.handleSaveShelfs}
                                >
                                    {
                                        this.state.actionShelfs === 0 ? 'Agregar' : 'Editar'
                                    }
                                </Button>
                            </div>
                        }
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12">
                        <div className={`${this.props.listContactosHide} errorControlDiv`}>
                            {this.props.listContactosTextError}
                        </div>
                        <RctCollapsibleCard heading="Lista de Estantes" fullBlock>
                            <Table aria-label="a dense table">
                                <TableHead className="">
                                    <TableRow hover>
                                        <TableCell style={{ width: '20%' }} align="center">Nro</TableCell>
                                        <TableCell style={{ width: '30%' }} align="center">Nombres</TableCell>
                                        <TableCell style={{ width: '30%' }} align="center">Descripcion</TableCell>
                                        {
                                            !this.props.disabled &&
                                            <TableCell style={{ width: '20%' }} align="center">Acciones</TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <Fragment>
                                        {this.props.store.shelfs.length > 0 && this.props.store.shelfs.map((data, key) => (
                                            <TableRow hover key={key}>
                                                <TableCell style={{ width: '20%' }} align="center">{key + 1}</TableCell>
                                                <TableCell style={{ width: '30%' }} align="center">{data.name}</TableCell>
                                                <TableCell style={{ width: '30%' }} align="center">{data.description}</TableCell>
                                                {
                                                    !this.props.disabled &&
                                                    <TableCell style={{ width: '20%', minWidth: '130px' }} align="center">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Editar Estante"
                                                                className="iconButtons"
                                                                onClick={() => { this.editShelf(key, data); }}
                                                            >
                                                                <Edit className="iconTable" />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete"
                                                                title="Eliminar Estante"
                                                                className="iconButtons"
                                                                onClick={() => { this.deleteShelf(data, key); }}
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
    store: state.store.toJS(),
    aplication: state.general,
});
const mapDispatchToProps = dispatch => ({
    addShelfsFunction: (data, callback, almacenId) => dispatch(addShelfsFunction(data, callback, almacenId)),
    editShelfsFunction: (key, data, almacenId, callback) => dispatch(editShelfsFunction(key, data, almacenId, callback)),
    deleteShelfsFunction: (data, key, almacenId) => dispatch(deleteShelfsFunction(data, key, almacenId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Shelfs);