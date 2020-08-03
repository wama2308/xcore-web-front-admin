import React from "react";
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveScreenAction, updateScreenAction } from "../../../actions/ScreensActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import MaskedInput from 'react-maskedinput'
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...stateInitial
        };
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekey(campoError, campoErrorText, hide, type) {
        this.setState({
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        });
    };

    closeModal = (option) => {
        if (option === 0) {
            const message = {
                title: "Cerrar Ventana",
                info: "¿Esta seguro que desea cerrar la ventana?"
            };
            this.props.confirm(message, res => {
                if (res) {
                    this.setState({
                        ...stateInitial
                    });
                    this.props.valorCloseModal();
                }
            });
        } else {
            this.setState({
                ...stateInitial
            });
            this.props.valorCloseModal();
        }
    };

    ValidateIPaddress(ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }
        return (false)
    }

    validarMac(valor) {
        let regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (regex.test(valor)) {
            return true;
        } else {
            return false;
        }
    }

    validate = () => {
        let acum = "";
        if (this.state.name === '') {
            this.setState({
                nameError: true,
                nameTextError: 'Ingrese el nombre',
                nameHide: 'show'
            });
            acum = 1;
        }
        if (this.state.serial === '') {
            this.setState({
                serialError: true,
                serialTextError: 'Ingrese el serial',
                serialHide: 'show'
            });
            acum = 1;
        }
        if (this.state.brand === '') {
            this.setState({
                brandError: true,
                brandTextError: 'Ingrese la marca',
                brandHide: 'show'
            });
            acum = 1;
        }
        if (this.state.model === '') {
            this.setState({
                modelError: true,
                modelTextError: 'Ingrese el modelo',
                modelHide: 'show'
            });
            acum = 1;
        }
        if (this.state.ip === '') {
            this.setState({
                ipError: "borderColor",
                ipTextError: 'Ingrese el la ip',
                ipHide: 'show'
            });
            acum = 1;
        }
        if (!this.ValidateIPaddress(this.state.ip)) {
            this.setState({
                ipError: "borderColor",
                ipTextError: 'IP invalida',
                ipHide: 'show'
            });
            acum = 1;
        }
        if (this.state.mac === '') {
            this.setState({
                macError: "borderColor",
                macTextError: 'Ingrese la MAC',
                macHide: 'show'
            });
            acum = 1;
        }
        if (!this.validarMac(this.state.mac)) {
            this.setState({
                macError: "borderColor",
                macTextError: 'MAC invalida',
                macHide: 'show'
            });
            acum = 1;
        }
        if (!this.state.description) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Ingrese la descripcion',
                descriptionHide: 'show',
            });
        }
        if (this.state.description.length < 16) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionHide: 'show',
            });
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveScreen = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveScreenAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        serial: this.state.serial,
                        brand: this.state.brand,
                        model: this.state.model,
                        ip: this.state.ip,
                        mac: this.state.mac,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateScreenAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        serial: this.state.serial,
                        brand: this.state.brand,
                        model: this.state.model,
                        ip: this.state.ip,
                        mac: this.state.mac,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
        }
    }

    cargarData(data) {
        console.log(data)
        this.setState({
            name: data.name,
            description: data.description,
            serial: data.serial,
            brand: data.brand,
            model: data.model,
            ip: data.ip,
            mac: data.mac,
            loading: 'hide',
            actionReducer: 1,
        });
    }

    componentDidMount() {
        if (this.props.option === 1) {
            this.setState({
                loading: "hide",
            });
        }
    }

    componentWillReceiveProps = props => {
        if (props.option === 2 || props.option === 3) {
            if (props.screens.screenId && this.state.actionReducer === 0) {
                this.cargarData(props.screens.screenId);
            }
        }
    }

    render() {

        return (
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={this.props.modal}
                onClose={() => { this.closeModal(0); }}
                aria-labelledby="responsive-dialog-title"
                scroll="paper"
            >
                {this.state.loading === "hide" ? (
                    <div>
                        <DialogTitle id="form-dialog-title">
                            <div style={{ display: 'flex' }}>
                                <div>
                                    {this.props.modalHeader}
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <IconButton aria-label="Delete"
                                        className="iconButtons"
                                        onClick={() => { this.closeModal(0); }}
                                    >
                                        <Close className="iconTable" />
                                    </IconButton>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Form>
                                <div className="row">
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="name">Nombre</Label>
                                            <Input
                                                invalid={this.state.nameError}
                                                id="name"
                                                name="name"
                                                onKeyUp={event => this.handlekey(
                                                    "nameError",
                                                    "nameTextError",
                                                    "nameHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.name}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.nameHide} errorControl`}>
                                                {this.state.nameTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="serial">Serial</Label>
                                            <Input
                                                invalid={this.state.serialError}
                                                id="serial"
                                                name="serial"
                                                onKeyUp={event => this.handlekey(
                                                    "serialError",
                                                    "serialTextError",
                                                    "serialHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.serial}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.serialHide} errorControl`}>
                                                {this.state.serialTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="brand">Marca</Label>
                                            <Input
                                                invalid={this.state.brandError}
                                                id="brand"
                                                name="brand"
                                                onKeyUp={event => this.handlekey(
                                                    "brandError",
                                                    "brandTextError",
                                                    "brandHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.brand}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.brandHide} errorControl`}>
                                                {this.state.brandTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="model">Modelo</Label>
                                            <Input
                                                invalid={this.state.modelError}
                                                id="model"
                                                name="model"
                                                onKeyUp={event => this.handlekey(
                                                    "modelError",
                                                    "modelTextError",
                                                    "modelHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.model}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.modelHide} errorControl`}>
                                                {this.state.modelTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="ip">IP</Label>
                                            <div className={this.state.ipError}>
                                                <MaskedInput
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        padding: "0.375rem 0.75rem",
                                                        fontSize: "1rem",
                                                        lineHeight: 1.5,
                                                        color: "#464D69",
                                                        backgroundColor: "#fff",
                                                        backgroundClip: "padding-box",
                                                        border: "1px solid #EBEDF2",
                                                        borderRadius: "0.25rem"
                                                    }}
                                                    value={this.state.ip}
                                                    mask="111.111.111.111"
                                                    name="ip"
                                                    id="ip"
                                                    onChange={this.handleChange}
                                                    onKeyUp={event => this.handlekey(
                                                        "ipError",
                                                        "ipTextError",
                                                        "ipHide",
                                                        0
                                                    )}
                                                    disabled={this.props.disabled}
                                                />
                                            </div>
                                            <div className={`${this.state.ipHide} errorControl`}>
                                                {this.state.ipTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="mac">MAC</Label>
                                            <div className={this.state.macError}>
                                                <MaskedInput
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        padding: "0.375rem 0.75rem",
                                                        fontSize: "1rem",
                                                        lineHeight: 1.5,
                                                        color: "#464D69",
                                                        backgroundColor: "#fff",
                                                        backgroundClip: "padding-box",
                                                        border: "1px solid #EBEDF2",
                                                        borderRadius: "0.25rem"
                                                    }}
                                                    value={this.state.mac}
                                                    mask="**:**:**:**:**:**"
                                                    name="mac"
                                                    id="mac"
                                                    onChange={this.handleChange}
                                                    onKeyUp={event => this.handlekey(
                                                        "macError",
                                                        "macTextError",
                                                        "macHide",
                                                        0
                                                    )}
                                                    disabled={this.props.disabled}
                                                />
                                            </div>
                                            <div className={`${this.state.macHide} errorControl`}>
                                                {this.state.macTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="description">Descripcion</Label>
                                            <Input
                                                invalid={this.state.descriptionError}
                                                id="description"
                                                name="description"
                                                onKeyUp={event => this.handlekey(
                                                    "descriptionError",
                                                    "descriptionTextError",
                                                    "descriptionHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.description}
                                                type="textarea"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.descriptionHide} errorControl`}>
                                                {this.state.descriptionTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                            </Form>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => { this.closeModal(0); }} color="danger" className="text-white">
                                Cancel
                            </Button>
                            {
                                !this.props.showHide &&
                                <Button
                                    color="primary"
                                    className="text-white"
                                    variant="contained"
                                    onClick={this.handleSaveScreen}
                                >
                                    {this.props.buttonFooter}
                                </Button>
                            }

                        </DialogActions>
                    </div>
                ) : (
                        <div style={{ height: "55vh" }}>
                            <CircularProgress
                                style={{
                                    position: "fixed",
                                    height: 40,
                                    top: "45%",
                                    right: "50%",
                                    zIndex: 2
                                }}
                            />
                        </div>
                    )}
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    screens: state.screens.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveScreenAction: (data, callback) => dispatch(saveScreenAction(data, callback)),
    updateScreenAction: (data, callback) => dispatch(updateScreenAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);