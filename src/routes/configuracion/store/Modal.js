import React from "react";
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    Collapse,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveStoreAction, updateStoreAction } from "../../../actions/StoreActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Geosuggest from "react-geosuggest";
import MapComponent from "../sucursal/Map";
import Switch from '@material-ui/core/Switch';
import Shelfs from "./Shelfs";
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

    handleChangeSwitch = (name) => event => {
        this.setState({
            [name]: event.target.checked,
        });
    };

    onSuggestSelect = suggest => {
        if (!suggest || this.props.disabled) {
            return;
        }
        this.setState({
            lat: suggest.location.lat,
            lng: suggest.location.lng,
            isMarkerShown: false
        });
        let i = 6;

        let mapzoom = setInterval(() => {
            if (this.state.zoom === 15) {
                clearInterval(mapzoom);
            } else {
                i = i + 1;
                this.setState({ zoom: i });
            }
        }, 200);
    };

    handleClickmap = event => {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            isMarkerShown: true
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
                    this.props.valorCloseModal(false);
                }
            });
        } else {
            this.setState({
                ...stateInitial
            });
            this.props.valorCloseModal(false);
        }
    };

    validate = () => {
        let acum = "";
        if (this.state.almacen === '') {
            this.setState({
                almacenError: true,
                almacenTextError: 'Ingrese el nombre del almacen',
                almacenHide: 'show'
            });
            acum = 1;
        }
        if (this.state.almacen.length < 3) {
            this.setState({
                almacenError: true,
                almacenTextError: 'El nombre debe tener mas de tres caracteres',
                almacenHide: 'show'
            });
            acum = 1;
        }
        if (this.state.descriptionAlmacen === '') {
            this.setState({
                descriptionAlmacenError: true,
                descriptionAlmacenTextError: 'Ingrese la descripcion del almacen',
                descriptionAlmacenHide: 'show'
            });
            acum = 1;
        }
        if (this.state.descriptionAlmacen.length < 16) {
            this.setState({
                descriptionAlmacenError: true,
                descriptionAlmacenTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionAlmacenHide: 'show',
            });
            acum = 1;
        }
        if (this.state.addressAlmacen === '') {
            this.setState({
                addressAlmacenError: true,
                addressAlmacenTextError: 'Ingrese la direccion del almacen',
                addressAlmacenHide: 'show'
            });
            acum = 1;
        }
        if (this.state.addressAlmacen === '') {
            this.setState({
                addressAlmacenError: true,
                addressAlmacenTextError: 'Ingrese la direccion del almacen',
                addressAlmacenHide: 'show'
            });
            acum = 1;
        }
        if (this.state.addressAlmacen.length < 16) {
            this.setState({
                addressAlmacenError: true,
                addressAlmacenTextError: 'La direccion debe contener al menos 15 caracteres',
                addressAlmacenHide: 'show'
            });
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveStore = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            if (this.props.option === 1) {
                if (this.props.store.shelfs.length === 0) {
                    const message = {
                        title: "Almacen sin estantes",
                        info: "¿Esta seguro que desea guardar el almacen sin estantes?"
                    };
                    this.props.confirm(message, res => {
                        if (res) {
                            this.setState({ loading: "show" });
                            this.props.saveStoreAction(
                                {
                                    name: this.state.almacen,
                                    description: this.state.descriptionAlmacen,
                                    internal: !this.state.internal,
                                    address: this.state.addressAlmacen,
                                    location: [this.state.lng, this.state.lat],
                                    shelfs: this.props.store.shelfs,
                                },
                                () => {
                                    this.closeModal(1);
                                }
                            );
                        }
                    });
                } else {
                    this.setState({ loading: "show" });
                    this.props.saveStoreAction(
                        {
                            name: this.state.almacen,
                            description: this.state.descriptionAlmacen,
                            internal: !this.state.internal,
                            address: this.state.addressAlmacen,
                            location: [this.state.lng, this.state.lat],
                            shelfs: this.props.store.shelfs,
                        },
                        () => {
                            this.closeModal(1);
                        }
                    );
                }
            }
            if (this.props.option === 3) {
                if (this.props.store.shelfs.length === 0) {
                    const message = {
                        title: "Almacen sin estantes",
                        info: "¿Esta seguro que desea guardar el almacen sin estantes?"
                    };
                    this.props.confirm(message, res => {
                        if (res) {
                            this.setState({ loading: "show" });
                            this.props.updateStoreAction(
                                {
                                    id: this.props.data._id,
                                    name: this.state.almacen,
                                    description: this.state.descriptionAlmacen,
                                    internal: !this.state.internal,
                                    address: this.state.addressAlmacen,
                                    location: [this.state.lng, this.state.lat],
                                    shelfs: this.props.store.shelfs,
                                },
                                () => {
                                    this.closeModal(1);
                                }
                            );
                        }
                    });
                } else {
                    this.setState({ loading: "show" });
                    this.props.updateStoreAction(
                        {
                            id: this.props.data._id,
                            name: this.state.almacen,
                            description: this.state.descriptionAlmacen,
                            internal: !this.state.internal,
                            address: this.state.addressAlmacen,
                            location: [this.state.lng, this.state.lat],
                            shelfs: this.props.store.shelfs,
                        },
                        () => {
                            this.closeModal(1);
                        }
                    );
                }
            }
        }
    }

    cargarData(data) {
        console.log(data)
        this.setState({
            almacen: data.name,
            descriptionAlmacen: data.description,
            addressAlmacen: data.address,
            internal: !data.internal,
            lat: data.location[1],
            lng: data.location[0],
            initialLocation: {
                lat: data.location[1],
                lng: data.location[0]
            },
            isMarkerShown: true,
            zoom: 14,
            collapseShelfs: data.shelfs.length > 0 ? true : false,
            loading: 'hide',
            actionReducer: 1,
        });
    }

    componentDidMount() {
        if (this.props.option === 1) {
            this.setState({
                loading: "hide",
            });
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    initialLocation: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
            });
        }
    }

    componentWillReceiveProps = props => {
        if (props.option === 2 || props.option === 3) {
            if (props.store.storeId && this.state.actionReducer === 0) {
                this.cargarData(props.store.storeId);
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
                                            <Label for="almacen">Nombre</Label>
                                            <Input
                                                invalid={this.state.almacenError}
                                                id="almacen"
                                                name="almacen"
                                                onKeyUp={event => this.handlekey(
                                                    "almacenError",
                                                    "almacenTextError",
                                                    "almacenHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.almacen}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.almacenHide} errorControl`}>
                                                {this.state.almacenTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="descriptionAlmacen">Descripcion</Label>
                                            <Input
                                                invalid={this.state.descriptionAlmacenError}
                                                id="descriptionAlmacen"
                                                name="descriptionAlmacen"
                                                onKeyUp={event => this.handlekey(
                                                    "descriptionAlmacenError",
                                                    "descriptionAlmacenTextError",
                                                    "descriptionAlmacenHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.descriptionAlmacen}
                                                type="textarea"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.descriptionAlmacenHide} errorControl`}>
                                                {this.state.descriptionAlmacenTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="addressAlmacen">Direccion</Label>
                                            <Input
                                                invalid={this.state.addressAlmacenError}
                                                id="addressAlmacen"
                                                name="addressAlmacen"
                                                onKeyUp={event => this.handlekey(
                                                    "addressAlmacenError",
                                                    "addressAlmacenTextError",
                                                    "addressAlmacenHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.addressAlmacen}
                                                type="textarea"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.addressAlmacenHide} errorControl`}>
                                                {this.state.addressAlmacenTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup className="top form-group col-sm-4">
                                        <Button
                                            color="primary"
                                            onClick={() =>
                                                this.setState({
                                                    collapseShelfs: !this.state.collapseShelfs
                                                })
                                            }
                                            disabled={this.props.disabled}
                                        >
                                            Estantes
                                        </Button>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-12">
                                        <Collapse isOpen={this.state.collapseShelfs}>
                                            <Card>
                                                <CardBody>
                                                    <Shelfs
                                                        confirm={this.props.confirm}
                                                        // listContactosTextError={this.state.listContactosTextError}
                                                        // listContactosHide={this.state.listContactosHide}
                                                        // limpiarValidaciones={this.limpiarValidaciones}
                                                        disabled={this.props.disabled}
                                                        dataAlmacen={this.props.data}
                                                        option={this.props.option}
                                                    />
                                                </CardBody>
                                            </Card>
                                        </Collapse>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup check className="top form-group col-sm-6">
                                        <Label for="internal">¿Esta fuera de la sucursal?</Label>
                                        <Switch
                                            checked={this.state.internal ? this.state.internal : false}
                                            onChange={this.handleChangeSwitch("internal")}
                                            value={this.state.internal}
                                            color="primary"
                                            disabled={this.props.disabled}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="row">
                                    {
                                        this.state.internal &&
                                        <div className="form-group col-lg-12 Widht">
                                            <Card>
                                                {this.state.lat && (
                                                    <CardBody>
                                                        <div>
                                                            {!this.props.disabled && (
                                                                <Geosuggest
                                                                    placeholder="Buscar en el mapa"
                                                                    onSuggestSelect={this.onSuggestSelect}
                                                                    location={new google.maps.LatLng(this.state.lat, this.state.lng)}
                                                                    radius="20"
                                                                />
                                                            )}
                                                        </div>
                                                        <MapComponent
                                                            lat={this.state.lat}
                                                            lng={this.state.lng}
                                                            isMarkerShown={this.state.isMarkerShown}
                                                            initialLocation={this.state.initialLocation}
                                                            handleClickmap={this.handleClickmap}
                                                            zoom={this.state.zoom}
                                                        />
                                                        <br />
                                                        {
                                                            !this.props.disabled &&
                                                            <Button
                                                                color="primary"
                                                                onClick={this.refrescarMapa}
                                                            >
                                                                Refrescar
                                                        </Button>
                                                        }
                                                    </CardBody>
                                                )}
                                            </Card>
                                        </div>
                                    }
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
                                    onClick={this.handleSaveStore}
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
    store: state.store.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveStoreAction: (data, callback) => dispatch(saveStoreAction(data, callback)),
    updateStoreAction: (data, callback) => dispatch(updateStoreAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);