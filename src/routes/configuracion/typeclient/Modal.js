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
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    saveTypeClientAction,
    updateTypeClientAction,
    addAreasFunction,
    deleteAreasFunction,
    addClassFunction,
    deleteClassFunction,
    addPlanFunction,
    deletePlanFunction,
    addPackageFunction,
    deletePackageFunction,
    searchProducts,
    searchProductId,
    deleteProductoIdFunction,
    setDataProductsAction,
    setSelectDataProducts,
    searchServices,
    searchServiceId,
    deleteServiceIdFunction,
    setDataServicesAction,
    setSelectDataServices,
    cleanStoreTypeClientFunction
} from "../../../actions/TypeClientActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import AreasTypeClient from "../../../components/AreasTypeClient";
import AreasTypeClientAdd from "../../../components/AreasTypeClientAdd";
import ClassesTypeClient from "../../../components/ClassesTypeClient";
import ClassesTypeClientAdd from "../../../components/ClassesTypeClientAdd";
import PlanesTypeClient from "../../../components/PlanesTypeClient";
import PlanesTypeClientAdd from "../../../components/PlanesTypeClientAdd";
import PackagesTypeClient from "../../../components/PackagesTypeClient";
import PackagesTypeClientAdd from "../../../components/PackagesTypeClientAdd";
import { number_format, formatMonto } from "../../../helpers/helpers";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import Products from "./Products";
import Services from "./Services";
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

    handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        this.setState({
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        });
    };

    handlekeyMonto(campo, campoError, campoErrorText, campohide) {
        let monto = event.target.value.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        this.setState({
            [campo]: monto,
            [campoError]: false,
            [campoErrorText]: "",
            [campohide]: "hide",
        });
    };

    handleChangeSwitch = (name, error, textError, hide, option) => event => {
        this.setState({
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',
        });
        if (name === "restart_season") {
            this.setState({
                restart_season_time: null,
                restart_season_time_error: "",
                restart_season_time_text_error: "",
                restart_season_time_hide: "hide",
                restart_season_amount: "",
                restart_season_amount_error: false,
                restart_season_amount_text_error: "",
                restart_season_amount_hide: "hide",
            });
        }
        if (name === "general") {
            this.setState({
                type_comparison: "",
                type_comparison_error: false,
                type_comparison_text_error: '',
                type_comparison_hide: 'hide',
                time_cycle: null,
                time_cycle_error: "",
                time_cycle_text_error: '',
                time_cycle_hide: 'hide',
                time_amount: "",
                time_amount_error: false,
                time_amount_text_error: '',
                time_amount_hide: 'hide',
                percentage: null,
                percentage_error: "",
                percentage_text_error: '',
                percentage_hide: 'hide',
                percentage_amount: "",
                percentage_amount_error: false,
                percentage_amount_text_error: '',
                percentage_amount_hide: 'hide',
                collapseAreas: false,
                collapseClass: false,
                collapsePlanes: false,
                collapsePackages: false,
                collapseServices: false,
            });
            this.props.cleanStoreTypeClientFunction();
        }
    };

    eventoBlur = name => event => {
        if (event.target.value === '' || event.target.value === '0.0') {
            this.setState({
                [name]: '0.00'
            });
        }
    }

    eventoFocus = name => event => {
        if (event.target.value === '0.00') {
            this.setState({
                [name]: ''
            });
        }
    }

    validate = () => {
        let acum = "";
        let acumProducts = "";
        let acumServices = "";
        if (this.state.name === '') {
            this.setState({
                nameError: true,
                nameTextError: 'Ingrese el nombre',
                nameHide: 'show'
            });
            acum = 1;
        }
        if (!this.state.description) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Ingrese la descripcion',
                descriptionHide: 'show',
            });
            acum = 1;
        }
        if (this.state.description.length < 16) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionHide: 'show',
            });
            acum = 1;
        }
        if (this.state.stars === "") {
            this.setState({
                starsError: true,
                starsTextError: 'Ingrese las estrellas',
                starsHide: 'show',
            });
            acum = 1;
        }
        if (this.state.restart_season && this.state.restart_season_time === null) {
            this.setState({
                restart_season_time_error: "borderColor",
                restart_season_time_text_error: 'Seleccione el tipo de tiempo de reinicio',
                restart_season_time_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.restart_season && this.state.restart_season_amount === "") {
            this.setState({
                restart_season_amount_error: true,
                restart_season_amount_text_error: 'Ingrese el tiempo de reinicio',
                restart_season_amount_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.general && this.state.type_comparison === "") {
            this.setState({
                type_comparison_error: true,
                type_comparison_text_error: 'Ingrese el tipo de comparacion',
                type_comparison_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.general && this.state.time_cycle === null) {
            this.setState({
                time_cycle_error: "borderColor",
                time_cycle_text_error: 'Seleccione el tipo de tiempo',
                time_cycle_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.general && this.state.time_amount === "") {
            this.setState({
                time_amount_error: true,
                time_amount_text_error: 'Ingrese el tiempo',
                time_amount_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.general && this.state.percentage === null) {
            this.setState({
                percentage_error: "borderColor",
                percentage_text_error: 'Seleccione el tipo de monto',
                percentage_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.general && this.state.percentage_amount === "") {
            this.setState({
                percentage_amount_error: true,
                percentage_amount_text_error: 'Ingrese el monto',
                percentage_amount_hide: 'show',
            });
            acum = 1;
        }
        // if (!this.state.general && this.props.typeClients.products.length > 0) {
        //     this.props.typeClients.products.map((data, i) => {
        //         if (data.type_comparison === '') {
        //             document.getElementById(`div_type_comparison_${i}`).className = "borderColor";
        //             acumProducts = 1;
        //         }
        //         if (data.time_cycle === null) {
        //             document.getElementById(`div_time_cycle_${i}`).className = "borderColor";
        //             acumProducts = 1;
        //         }
        //         if (data.time_amount === '') {
        //             document.getElementById(`div_time_amount_${i}`).className = "borderColor";
        //             acumProducts = 1;
        //         }
        //         if (data.percentage === null) {
        //             document.getElementById(`div_percentage_${i}`).className = "borderColor";
        //             acumProducts = 1;
        //         }
        //         if (data.percentage_amount === '') {
        //             document.getElementById(`div_percentage_amount_${i}`).className = "borderColor";
        //             acumProducts = 1;
        //         }
        //     });

        // }
        if (!this.state.general && this.props.typeClients.services.length > 0) {
            this.props.typeClients.services.map((data, i) => {
                if (data.type_comparison === '') {
                    document.getElementById(`div_type_comparison_service_${i}`).className = "borderColor";
                    acumServices = 1;
                }
                if (data.time_cycle === null) {
                    document.getElementById(`div_time_cycle_service_${i}`).className = "borderColor";
                    acumServices = 1;
                }
                if (data.time_amount === '') {
                    document.getElementById(`div_time_amount_service_${i}`).className = "borderColor";
                    acumServices = 1;
                }
                if (data.percentage === null) {
                    document.getElementById(`div_percentage_service_${i}`).className = "borderColor";
                    acumServices = 1;
                }
                if (data.percentage_amount === '') {
                    document.getElementById(`div_percentage_amount_service_${i}`).className = "borderColor";
                    acumServices = 1;
                }
            });

        }
        // if (acumProducts > 0) {
        //     NotificationManager.warning("Campos requeridos en la seccion de productos");
        //     return false;
        // }
        if (acumServices > 0) {
            NotificationManager.warning("Campos requeridos en la seccion de servicios");
            return false;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveTypeClient = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let areas = [];
            let clases = [];
            let planes = [];
            let packages = [];
            let servicios = [];
            let productos = [];

            if (this.props.typeClients.arrayAreas.length > 0) {
                this.props.typeClients.arrayAreas.map((data, i) => {
                    areas.push({
                        _id: data._id,
                        type_comparison: data.type_comparison,
                        time_cycle: data.time_cycle ? data.time_cycle.value : "",
                        time_amount: data.time_amount,
                        percentage: data.percentage ? data.percentage.value : "",
                        percentage_amount: data.percentage_amount ? formatMonto(data.percentage_amount) : "",
                    });
                });
            }

            if (this.props.typeClients.arrayClasses.length > 0) {
                this.props.typeClients.arrayClasses.map((data, i) => {
                    clases.push({
                        _id: data._id,
                        type_comparison: data.type_comparison,
                        time_cycle: data.time_cycle ? data.time_cycle.value : "",
                        time_amount: data.time_amount,
                        percentage: data.percentage ? data.percentage.value : "",
                        percentage_amount: data.percentage_amount ? formatMonto(data.percentage_amount) : "",
                    });
                });
            }

            if (this.props.typeClients.arrayPlanes.length > 0) {
                this.props.typeClients.arrayPlanes.map((data, i) => {
                    planes.push({
                        _id: data._id,
                        type_comparison: data.type_comparison,
                        time_cycle: data.time_cycle ? data.time_cycle.value : "",
                        time_amount: data.time_amount,
                        percentage: data.percentage ? data.percentage.value : "",
                        percentage_amount: data.percentage_amount ? formatMonto(data.percentage_amount) : "",
                    });
                });
            }

            if (this.props.typeClients.arrayPackages.length > 0) {
                this.props.typeClients.arrayPackages.map((data, i) => {
                    packages.push({
                        _id: data._id,
                        type_comparison: data.type_comparison,
                        time_cycle: data.time_cycle ? data.time_cycle.value : "",
                        time_amount: data.time_amount,
                        percentage: data.percentage ? data.percentage.value : "",
                        percentage_amount: data.percentage_amount ? formatMonto(data.percentage_amount) : "",
                    });
                });
            }

            // if (this.props.typeClients.products.length > 0) {
            //     this.props.typeClients.products.map((data, i) => {
            //         productos.push({
            //             _id: data._id,
            //             type_comparison: data.type_comparison,
            //             time_cycle: data.time_cycle ? data.time_cycle.value : "",
            //             time_amount: data.time_amount,
            //             percentage: data.percentage ? data.percentage.value : "",
            //             percentage_amount: data.percentage_amount ? formatMonto(data.percentage_amount) : "",
            //         });
            //     });
            // }

            if (this.props.typeClients.services.length > 0) {
                this.props.typeClients.services.map((data, i) => {
                    servicios.push({
                        _id: data.services_id ? data.services_id : data._id,
                        type_comparison: data.type_comparison,
                        time_cycle: data.time_cycle ? data.time_cycle.value : "",
                        time_amount: data.time_amount,
                        percentage: data.percentage ? data.percentage.value : "",
                        percentage_amount: data.percentage_amount ? formatMonto(data.percentage_amount) : "",
                    });
                });
            }
            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveTypeClientAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        stars: this.state.stars,
                        general: this.state.general,
                        type_comparison: this.state.type_comparison,
                        time_cycle: this.state.general ? this.state.time_cycle.value : "",
                        time_amount: this.state.time_amount,
                        percentage: this.state.general ? this.state.percentage.value : "",
                        percentage_amount: this.state.general ? formatMonto(this.state.percentage_amount) : "",
                        restart_season: this.state.restart_season,
                        restart_season_time: this.state.restart_season ? this.state.restart_season_time.value : "",
                        restart_season_amount: this.state.restart_season_amount,
                        areas: areas,
                        package: packages,
                        service: servicios,
                        class: clases,
                        plan: planes,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateTypeClientAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        stars: this.state.stars,
                        general: this.state.general,
                        type_comparison: this.state.type_comparison,
                        time_cycle: this.state.general ? this.state.time_cycle.value : "",
                        time_amount: this.state.time_amount,
                        percentage: this.state.general ? this.state.percentage.value : "",
                        percentage_amount: this.state.general ? formatMonto(this.state.percentage_amount) : "",
                        restart_season: this.state.restart_season,
                        restart_season_time: this.state.restart_season ? this.state.restart_season_time.value : "",
                        restart_season_amount: this.state.restart_season_amount,
                        areas: areas,
                        package: packages,
                        service: servicios,
                        class: clases,
                        plan: planes,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
        }
    }

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

    cargarData(data) {
        //console.log(data)
        let restart_season_time = {};
        data.restart_season_time ? restart_season_time = { label: 'Mensual', value: true } :
            restart_season_time = { label: 'Diario', value: false }

        let time_cycle = {};
        data.time_cycle ? time_cycle = { label: 'Mensual', value: true } :
            time_cycle = { label: 'Diario', value: false }

        let percentage = {};
        data.percentage ? percentage = { label: 'Porcentaje', value: true } :
            percentage = { label: 'Monto', value: false }

        this.setState({
            name: data.name,
            description: data.description,
            stars: data.stars,
            restart_season: data.restart_season,
            restart_season_time: data.restart_season ? restart_season_time : data.restart_season_time,
            restart_season_amount: data.restart_season ? data.restart_season_amount : '',
            general: data.general,
            time_cycle: data.general ? time_cycle : null,
            time_amount: data.time_amount,
            percentage: data.general ? percentage : null,
            percentage_amount: number_format(data.percentage_amount, 2),
            type_comparison: data.type_comparison,
            collapseAreas: data.areas.length > 0 ? true : false,
            collapseClass: data.classes.length > 0 ? true : false,
            collapsePlanes: data.plans.length > 0 ? true : false,
            collapsePackages: data.packages.length > 0 ? true : false,
            collapseServices: data.services.length > 0 ? true : false,
            loading: 'hide',
            actionReducer: 1,
        });
    }

    formatMonto(data) {
        return parseFloat(data.replace(",", ""))
    }

    cleanSelectAreas = () => {
        this.setState({
            arrayAreas: null,
            arrayAreasError: '',
            arrayAreasTextError: '',
            arrayAreasHide: 'hide',
        });
    }

    cleanSelectClass = () => {
        this.setState({
            arrayClass: null,
            arrayClassError: '',
            arrayClassTextError: '',
            arrayClassHide: 'hide',
        });
    }

    cleanSelectPlan = () => {
        this.setState({
            arrayPlanes: null,
            arrayPlanesError: '',
            arrayPlanesTextError: '',
            arrayPlanesHide: 'hide',
        });
    }

    cleanTextErrorProducts = () => {
        this.setState({
            tableProductsTextError: "",
        });
    }

    cleanTextErrorServices = () => {
        this.setState({
            tableServicesTextError: "",
        });
    }

    cleanSelectPackage = () => {
        this.setState({
            arrayPackages: null,
            arrayPackagesError: '',
            arrayPackagesTextError: '',
            arrayPackagesHide: 'hide',
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
            if (props.typeClients.typeClientId && this.state.actionReducer === 0) {
                this.cargarData(props.typeClients.typeClientId);
            }
        }
    }

    render() {

        return (
            <Dialog
                fullWidth={true}
                maxWidth="lg"
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
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="stars">Estrellas</Label>
                                            <Input
                                                invalid={this.state.starsError}
                                                id="stars"
                                                name="stars"
                                                onKeyUp={event => this.handlekey(
                                                    "starsError",
                                                    "starsTextError",
                                                    "starsHide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.stars}
                                                type="number"
                                                min="0"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.starsHide} errorControl`}>
                                                {this.state.starsTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup check className="top form-group col-sm-6">
                                        <Label for="restart_season">¿Reiniciar?</Label>
                                        <Switch
                                            checked={this.state.restart_season ? this.state.restart_season : false}
                                            onChange={this.handleChangeSwitch("restart_season")}
                                            value={this.state.restart_season}
                                            color="primary"
                                            disabled={this.props.disabled}
                                        />
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="restart_season_time">Tiempo de Reinicio</Label>
                                            <div className={this.state.restart_season_time_error}>
                                                <Select
                                                    isClearable
                                                    isSearchable
                                                    isDisabled={this.props.option !== 2 ? !this.state.restart_season : this.props.disabled}
                                                    name="restart_season_time"
                                                    id="restart_season_time"
                                                    value={this.state.restart_season_time}
                                                    onChange={event => this.handleChangeSelect(
                                                        event,
                                                        "restart_season_time",
                                                        "restart_season_time_error",
                                                        "restart_season_time_text_error",
                                                        "restart_season_time_hide"
                                                    )}
                                                    options={this.state.options_time}
                                                />
                                            </div>
                                            <div className={`${this.state.restart_season_time_hide} errorControl`}>
                                                {this.state.restart_season_time_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="restart_season_amount">Cantidad</Label>
                                            <Input
                                                invalid={this.state.restart_season_amount_error}
                                                id="restart_season_amount"
                                                name="restart_season_amount"
                                                onKeyUp={event => this.handlekey(
                                                    "restart_season_amount_error",
                                                    "restart_season_amount_text_error",
                                                    "restart_season_amount_hide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.restart_season_amount}
                                                type="number"
                                                min="0"
                                                disabled={this.props.option !== 2 ? !this.state.restart_season : this.props.disabled}
                                            />
                                            <div className={`${this.state.restart_season_amount_hide} errorControl`}>
                                                {this.state.restart_season_amount_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup check className="top form-group col-sm-6">
                                        <Label for="general">¿General?</Label>
                                        <Switch
                                            checked={this.state.general ? this.state.general : false}
                                            onChange={this.handleChangeSwitch("general")}
                                            value={this.state.general}
                                            color="primary"
                                            disabled={this.props.disabled}
                                        />
                                    </FormGroup>
                                </div>
                                <hr />
                                {
                                    this.state.general && (
                                        <div className="row">
                                            <FormGroup className="top form-group col-sm-6">
                                                <div>
                                                    <Label for="type_comparison">Tipo de Comparacion</Label>
                                                    <Input
                                                        invalid={this.state.type_comparison_error}
                                                        id="type_comparison"
                                                        name="type_comparison"
                                                        onKeyUp={event => this.handlekey(
                                                            "type_comparison_error",
                                                            "type_comparison_text_error",
                                                            "type_comparison_hide",
                                                            1
                                                        )}
                                                        onChange={this.handleChange}
                                                        value={this.state.type_comparison}
                                                        type="number"
                                                        min="0"
                                                        disabled={this.props.disabled}
                                                    />
                                                    <div className={`${this.state.type_comparison_hide} errorControl`}>
                                                        {this.state.type_comparison_text_error}
                                                    </div>
                                                </div>
                                            </FormGroup>
                                            <FormGroup className="top form-group col-sm-6">
                                                <div>
                                                    <Label for="time_cycle">Tiempo</Label>
                                                    <div className={this.state.time_cycle_error}>
                                                        <Select
                                                            isClearable
                                                            isSearchable
                                                            isDisabled={this.props.disabled}
                                                            name="time_cycle"
                                                            id="time_cycle"
                                                            value={this.state.time_cycle}
                                                            onChange={event => this.handleChangeSelect(
                                                                event,
                                                                "time_cycle",
                                                                "time_cycle_error",
                                                                "time_cycle_text_error",
                                                                "time_cycle_hide"
                                                            )}
                                                            options={this.state.options_time}
                                                        />
                                                    </div>
                                                    <div className={`${this.state.time_cycle_hide} errorControl`}>
                                                        {this.state.time_cycle_text_error}
                                                    </div>
                                                </div>
                                            </FormGroup>
                                            <FormGroup className="top form-group col-sm-6">
                                                <div>
                                                    <Label for="time_amount">Cantidad</Label>
                                                    <Input
                                                        invalid={this.state.time_amount_error}
                                                        id="time_amount"
                                                        name="time_amount"
                                                        onKeyUp={event => this.handlekey(
                                                            "time_amount_error",
                                                            "time_amount_text_error",
                                                            "time_amount_hide",
                                                            1
                                                        )}
                                                        onChange={this.handleChange}
                                                        value={this.state.time_amount}
                                                        type="number"
                                                        min="0"
                                                        disabled={this.props.disabled}
                                                    />
                                                    <div className={`${this.state.time_amount_hide} errorControl`}>
                                                        {this.state.time_amount_text_error}
                                                    </div>
                                                </div>
                                            </FormGroup>
                                            <FormGroup className="top form-group col-sm-6">
                                                <div>
                                                    <Label for="percentage">Tipo de Monto</Label>
                                                    <div className={this.state.percentage_error}>
                                                        <Select
                                                            isClearable
                                                            isSearchable
                                                            isDisabled={this.props.disabled}
                                                            name="percentage"
                                                            id="percentage"
                                                            value={this.state.percentage}
                                                            onChange={event => this.handleChangeSelect(
                                                                event,
                                                                "percentage",
                                                                "percentage_error",
                                                                "percentage_text_error",
                                                                "percentage_hide"
                                                            )}
                                                            options={this.state.options_amounts}
                                                        />
                                                    </div>
                                                    <div className={`${this.state.percentage_hide} errorControl`}>
                                                        {this.state.percentage_text_error}
                                                    </div>
                                                </div>
                                            </FormGroup>
                                            <FormGroup className="top form-group col-sm-6">
                                                <div>
                                                    <Label for="percentage_amount">Monto</Label>
                                                    <Input
                                                        invalid={this.state.percentage_amount_error}
                                                        id="percentage_amount"
                                                        name="percentage_amount"
                                                        onKeyUp={event => this.handlekeyMonto(
                                                            "percentage_amount",
                                                            "percentage_amount_error",
                                                            "percentage_amount_text_error",
                                                            "percentage_amount_hide",
                                                            1
                                                        )}
                                                        onChange={this.handleChange}
                                                        value={this.state.percentage_amount}
                                                        type="text"
                                                        onBlur={this.eventoBlur("percentage_amount")}
                                                        onFocus={this.eventoFocus("percentage_amount")}
                                                        disabled={this.props.disabled}
                                                    />
                                                    <div className={`${this.state.percentage_amount_hide} errorControl`}>
                                                        {this.state.percentage_amount_text_error}
                                                    </div>
                                                </div>
                                            </FormGroup>
                                        </div>
                                    )
                                }

                                {
                                    !this.state.general && (
                                        <div>
                                            <div className="row">
                                                <FormGroup className="top form-group col-sm-4">
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                collapseAreas: !this.state.collapseAreas
                                                            })
                                                        }
                                                        disabled={this.props.disabled}
                                                    >
                                                        Areas
                                                </Button>
                                                </FormGroup>
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Collapse isOpen={this.state.collapseAreas}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className='row'>
                                                                    <FormGroup className="top form-group col-sm-6">
                                                                        <div>
                                                                            <Label for="arrayAreas">Areas</Label>
                                                                            <div className={this.state.arrayAreasError}>
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    isSearchable={true}
                                                                                    isDisabled={this.props.option !== 2 ?
                                                                                        this.state.aplicateAllAreas : this.props.disabled}
                                                                                    name="arrayAreas"
                                                                                    id="arrayAreas"
                                                                                    value={this.state.arrayAreas}
                                                                                    onChange={event => this.handleChangeSelect(
                                                                                        event,
                                                                                        "arrayAreas",
                                                                                        "arrayAreasError",
                                                                                        "arrayAreasTextError",
                                                                                        "arrayAreasHide"
                                                                                    )}
                                                                                    options={this.props.typeClients.dataAreas}
                                                                                />
                                                                            </div>
                                                                            <div className={`${this.state.arrayAreasHide} errorControl`}>
                                                                                {this.state.arrayAreasTextError}
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                    {
                                                                        this.state.arrayAreas && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <AreasTypeClient
                                                                                    data={this.state.arrayAreas.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addAreasFunction={this.props.addAreasFunction}
                                                                                    arrayAll={this.props.typeClients.arrayAreas}
                                                                                    cleanSelectAreas={this.cleanSelectAreas}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.typeClients.arrayAreas.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <AreasTypeClientAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.typeClients.arrayAreas}
                                                                                    deleteAreasFunction={this.props.deleteAreasFunction}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <FormGroup className="top form-group col-sm-4">
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                collapseClass: !this.state.collapseClass
                                                            })
                                                        }
                                                        disabled={this.props.disabled}
                                                    >
                                                        Clases
                                                    </Button>
                                                </FormGroup>
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Collapse isOpen={this.state.collapseClass}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className='row'>
                                                                    <FormGroup className="top form-group col-sm-6">
                                                                        <div>
                                                                            <Label for="arrayClass">Clases</Label>
                                                                            <div className={this.state.arrayClassError}>
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    isSearchable={true}
                                                                                    isDisabled={this.props.disabled}
                                                                                    name="arrayClass"
                                                                                    id="arrayClass"
                                                                                    value={this.state.arrayClass}
                                                                                    onChange={event => this.handleChangeSelect(
                                                                                        event,
                                                                                        "arrayClass",
                                                                                        "arrayClassError",
                                                                                        "arrayClassTextError",
                                                                                        "arrayClassHide"
                                                                                    )}
                                                                                    options={this.props.typeClients.dataClass}
                                                                                />
                                                                            </div>
                                                                            <div className={`${this.state.arrayClassHide} errorControl`}>
                                                                                {this.state.arrayClassTextError}
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                    {
                                                                        this.state.arrayClass && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <ClassesTypeClient
                                                                                    data={this.state.arrayClass.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addClassFunction={this.props.addClassFunction}
                                                                                    arrayAll={this.props.typeClients.arrayClasses}
                                                                                    cleanSelectClass={this.cleanSelectClass}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.typeClients.arrayClasses.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <ClassesTypeClientAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.typeClients.arrayClasses}
                                                                                    deleteClassFunction={this.props.deleteClassFunction}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <FormGroup className="top form-group col-sm-4">
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                collapsePlanes: !this.state.collapsePlanes
                                                            })
                                                        }
                                                        disabled={this.props.disabled}
                                                    >
                                                        Planes
                                                    </Button>
                                                </FormGroup>
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Collapse isOpen={this.state.collapsePlanes}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className="row">
                                                                    <FormGroup className="top form-group col-sm-6">
                                                                        <div>
                                                                            <Label for="arrayPlanes">Planes</Label>
                                                                            <div className={this.state.arrayPlanesError}>
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    isSearchable={true}
                                                                                    isDisabled={this.props.disabled}
                                                                                    name="arrayPlanes"
                                                                                    id="arrayPlanes"
                                                                                    value={this.state.arrayPlanes}
                                                                                    onChange={event => this.handleChangeSelect(
                                                                                        event,
                                                                                        "arrayPlanes",
                                                                                        "arrayPlanesError",
                                                                                        "arrayPlanesTextError",
                                                                                        "arrayPlanesHide"
                                                                                    )}
                                                                                    options={this.props.typeClients.dataPlan}
                                                                                />
                                                                            </div>
                                                                            <div className={`${this.state.arrayPlanesHide} errorControl`}>
                                                                                {this.state.arrayPlanesTextError}
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                    {
                                                                        this.state.arrayPlanes && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <PlanesTypeClient
                                                                                    data={this.state.arrayPlanes.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addPlanFunction={this.props.addPlanFunction}
                                                                                    arrayAll={this.props.typeClients.arrayPlanes}
                                                                                    cleanSelectPlan={this.cleanSelectPlan}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.typeClients.arrayPlanes.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <PlanesTypeClientAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.typeClients.arrayPlanes}
                                                                                    deletePlanFunction={this.props.deletePlanFunction}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <FormGroup className="top form-group col-sm-4">
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                collapsePackages: !this.state.collapsePackages
                                                            })
                                                        }
                                                        disabled={this.props.disabled}
                                                    >
                                                        Paquetes
                                                    </Button>
                                                </FormGroup>
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Collapse isOpen={this.state.collapsePackages}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className="row">
                                                                    <FormGroup className="top form-group col-sm-6">
                                                                        <div>
                                                                            <Label for="arrayPackages">Paquetes</Label>
                                                                            <div className={this.state.arrayPackagesError}>
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    isSearchable={true}
                                                                                    isDisabled={this.props.disabled}
                                                                                    name="arrayPackages"
                                                                                    id="arrayPackages"
                                                                                    value={this.state.arrayPackages}
                                                                                    onChange={event => this.handleChangeSelect(
                                                                                        event,
                                                                                        "arrayPackages",
                                                                                        "arrayPackagesError",
                                                                                        "arrayPackagesTextError",
                                                                                        "arrayPackagesHide"
                                                                                    )}
                                                                                    options={this.props.typeClients.dataPackages}
                                                                                />
                                                                            </div>
                                                                            <div className={`${this.state.arrayPackagesHide} errorControl`}>
                                                                                {this.state.arrayPackagesTextError}
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                    {
                                                                        this.state.arrayPackages && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <PackagesTypeClient
                                                                                    data={this.state.arrayPackages.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addPackageFunction={this.props.addPackageFunction}
                                                                                    arrayAll={this.props.typeClients.arrayPackages}
                                                                                    cleanSelectPackage={this.cleanSelectPackage}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.typeClients.arrayPackages.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <PackagesTypeClientAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.typeClients.arrayPackages}
                                                                                    deletePackageFunction={this.props.deletePackageFunction}
                                                                                    disabled={this.props.disabled}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div>
                                            {/* <hr />
                                            <div className="row">
                                                <FormGroup className="top form-group col-sm-4">
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                collapseProducts: !this.state.collapseProducts
                                                            })
                                                        }
                                                        disabled={this.props.disabled}
                                                    >
                                                        Productos
                                                    </Button>
                                                </FormGroup>
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Collapse isOpen={this.state.collapseProducts}>
                                                        <Card>
                                                            <CardBody>
                                                                <Products
                                                                    dataAll={this.props.dataAllProducts}
                                                                    search={this.props.searchProducts}
                                                                    searchId={this.props.searchProductId}
                                                                    dataSelect={this.props.typeClients.products}
                                                                    deleteProductoIdFunction={this.props.deleteProductoIdFunction}
                                                                    confirm={this.props.confirm}
                                                                    tableProductsTextError={this.state.tableProductsTextError}
                                                                    cleanTextErrorProducts={this.cleanTextErrorProducts}
                                                                    setDataProductsAction={this.props.setDataProductsAction}
                                                                    setSelectDataProducts={this.props.setSelectDataProducts}
                                                                    disabled={this.props.disabled}
                                                                />
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div> */}
                                            <hr />
                                            <div className="row">
                                                <FormGroup className="top form-group col-sm-4">
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                collapseServices: !this.state.collapseServices
                                                            })
                                                        }
                                                        disabled={this.props.disabled}
                                                    >
                                                        Servicios
                                                    </Button>
                                                </FormGroup>
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Collapse isOpen={this.state.collapseServices}>
                                                        <Card>
                                                            <CardBody>
                                                                <Services
                                                                    dataAll={this.props.dataAllServices}
                                                                    search={this.props.searchServices}
                                                                    searchId={this.props.searchServiceId}
                                                                    dataSelect={this.props.typeClients.services}
                                                                    deleteServiceIdFunction={this.props.deleteServiceIdFunction}
                                                                    confirm={this.props.confirm}
                                                                    tableServicesTextError={this.state.tableServicesTextError}
                                                                    cleanTextErrorServices={this.cleanTextErrorServices}
                                                                    setDataServicesAction={this.props.setDataServicesAction}
                                                                    setSelectDataServices={this.props.setSelectDataServices}
                                                                    disabled={this.props.disabled}
                                                                />
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div>
                                        </div>
                                    )
                                }
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
                                    onClick={this.handleSaveTypeClient}
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
    typeClients: state.typeClients.toJS(),
    dataAllProducts: state.typeClients.get('dataAllProducts'),
    dataAllServices: state.typeClients.get('dataAllServices'),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveTypeClientAction: (data, callback) => dispatch(saveTypeClientAction(data, callback)),
    updateTypeClientAction: (data, callback) => dispatch(updateTypeClientAction(data, callback)),
    addAreasFunction: (data, dataAll, objectData) => dispatch(addAreasFunction(data, dataAll, objectData)),
    deleteAreasFunction: (id) => dispatch(deleteAreasFunction(id)),
    addClassFunction: (data, dataAll, objectData) => dispatch(addClassFunction(data, dataAll, objectData)),
    deleteClassFunction: (id) => dispatch(deleteClassFunction(id)),
    addPlanFunction: (data, dataAll, objectData) => dispatch(addPlanFunction(data, dataAll, objectData)),
    deletePlanFunction: (id) => dispatch(deletePlanFunction(id)),
    addPackageFunction: (data, dataAll, objectData) => dispatch(addPackageFunction(data, dataAll, objectData)),
    deletePackageFunction: (id) => dispatch(deletePackageFunction(id)),
    searchProducts: (data) => dispatch(searchProducts(data)),
    searchProductId: (data, dataAll) => dispatch(searchProductId(data, dataAll)),
    deleteProductoIdFunction: (key) => dispatch(deleteProductoIdFunction(key)),
    setDataProductsAction: (id, value, type) => dispatch(setDataProductsAction(id, value, type)),
    setSelectDataProducts: (id, data, type) => dispatch(setSelectDataProducts(id, data, type)),
    searchServices: (data) => dispatch(searchServices(data)),
    searchServiceId: (data, dataAll) => dispatch(searchServiceId(data, dataAll)),
    deleteServiceIdFunction: (key) => dispatch(deleteServiceIdFunction(key)),
    setDataServicesAction: (id, value, type) => dispatch(setDataServicesAction(id, value, type)),
    setSelectDataServices: (id, data, type) => dispatch(setSelectDataServices(id, data, type)),
    cleanStoreTypeClientFunction: () => dispatch(cleanStoreTypeClientFunction()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);