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
    Alert
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    saveDiscountsAction,
    updateDiscountsAction,
    searchProducts,
    searchProductId,
    deleteProductoIdFunction,
    searchServices,
    searchServiceId,
    deleteServiceIdFunction,
    addClassFunction,
    deleteClassFunction,
    addPlanFunction,
    deletePlanFunction,
    addPackagesFunction,
    deletePackageFunction,
    addAreasFunction,
    deleteAreasFunction,
    cleanStoreArrayAreasFunction,
    cleanStoreArrayClassFunction,
    cleanStoreArrayPlanesFunction,
    cleanStoreArrayPackagesFunction,
    cleanStoreArrayProductsFunction,
    cleanStoreArrayServicesFunction,
} from "../../../actions/DiscountsActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import Products from "./Products";
import Services from "./Services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)
import Classes from "../../../components/Classes";
import ClassesAdd from "../../../components/ClassesAdd";
import Planes from "../../../components/Planes";
import PlanesAdd from "../../../components/PlanesAdd";
import Packages from "../../../components/Packages";
import PackagesAdd from "../../../components/PackagesAdd";
import Areas from "../../../components/Areas";
import AreasAdd from "../../../components/AreasAdd";
import { number_format, formatMonto } from "../../../helpers/helpers";
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

    componentDidMount() {
        if (this.props.option === 1) {
            this.setState({
                loading: "hide",
            });
        }
    }

    componentWillReceiveProps = props => {
        if (props.option === 2 || props.option === 3) {
            if (props.discounts.discountId && this.state.actionReducer === 0) {
                this.cargarData(props.discounts.discountId);
            }
        }
    }

    cargarData(data) {
        console.log(data)
        let startDateSplit = data.start_date.split('-');
        let startDate = new Date(startDateSplit[0], startDateSplit[1] - 1, startDateSplit[2].substring(0, 2));
        let endDateSplit = data.final_date.split('-');
        let endDate = new Date(endDateSplit[0], endDateSplit[1] - 1, endDateSplit[2].substring(0, 2));
        let type = data.type.trim() === "percentage" ? { label: 'Porcentaje', value: 'percentage' } : { label: 'Monto', value: 'amount' };

        this.setState({
            name: data.name,
            arrayType: type,
            valueDiscount: number_format(data.value, 2),
            startDate: startDate,
            endDate: endDate,
            aplicateAllAreas: data.all_areas,
            aplicateAllClass: data.all_class,
            aplicateAllPlanes: data.all_plans,
            aplicateAllPackages: data.all_packages,
            aplicateAllProducts: data.all_products,
            aplicateAllServices: data.all_services,
            collapseAreas: true,
            collapseClass: true,
            collapsePlanes: true,
            collapsePackages: true,
            collapseProducts: true,
            collapseServices: true,
            loading: 'hide',
            actionReducer: 1,
        });
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

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekey(campoError, campoErrorText, hide, type) {
        this.setState({
            [campoError]: false,
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

    handleChangeSwitch = (name, error, textError, hide, option) => event => {
        this.setState({
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',
            arrayAreas: null,
            arrayClass: null,
            arrayPlanes: null,
            arrayPackages: null,
        });
        if (name === "aplicateAllAreas" && event.target.checked) {
            this.props.cleanStoreArrayAreasFunction();
        }
        if (name === "aplicateAllClass" && event.target.checked) {
            this.props.cleanStoreArrayClassFunction();
        }
        if (name === "aplicateAllPlanes" && event.target.checked) {
            this.props.cleanStoreArrayPlanesFunction();
        }
        if (name === "aplicateAllPackages" && event.target.checked) {
            this.props.cleanStoreArrayPackagesFunction();
        }
        if (name === "aplicateAllProducts" && event.target.checked) {
            this.props.cleanStoreArrayProductsFunction();
        }
        if (name === "aplicateAllServices" && event.target.checked) {
            this.props.cleanStoreArrayServicesFunction();
        }
    };

    limpiarValidacionesProducts = () => {
        this.setState({
            tableProductsTextError: '',
        });
    }

    limpiarValidacionesServices = () => {
        this.setState({
            tableServicesTextError: '',
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

    cleanSelectPackages = () => {
        this.setState({
            arrayPackages: null,
            arrayPackagesError: '',
            arrayPackagesTextError: '',
            arrayPackagesHide: 'hide',
        });
    }

    cleanSelectAreas = () => {
        this.setState({
            arrayAreas: null,
            arrayAreasError: '',
            arrayAreasTextError: '',
            arrayAreasHide: 'hide',
        });
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
        if (this.state.arrayType === null) {
            this.setState({
                arrayTypeError: "borderColor",
                arrayTypeTextError: 'Seleccione el tipo',
                arrayTypeHide: 'show',
            });
            acum = 1;
        }
        if ((this.state.valueDiscount === '0.00') || (this.state.valueDiscount === '0.0')) {
            this.setState({
                valueDiscountError: true,
                valueDiscountTextError: "Ingrese el monto",
                valueDiscountHide: "show",
            });
            acum = 1;
        }
        if (!this.state.startDate) {
            this.setState({
                startDateError: "borderColor",
                startDateTextError: 'Ingrese la fecha de inicio',
                startDateHide: 'show',
            });
            acum = 1;
        }
        if (!this.state.endDate) {
            this.setState({
                endDateError: "borderColor",
                endDateTextError: 'Ingrese la fecha de finalizacion',
                endDateHide: 'show',
            });
            acum = 1;
        }
        if (this.state.endDate < this.state.startDate) {
            this.setState({
                endDateError: "borderColor",
                endDateTextError: 'La fecha de finalizacion no se puede ser menor a la de inicio',
                endDateHide: 'show',
            });
            acum = 1;
        }

        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveDiscount = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let areas = [];
            let clases = [];
            let planes = [];
            let paquetes = [];
            let servicios = [];
            let productos = [];
            if (this.props.discounts.arrayAreas.length > 0) {
                this.props.discounts.arrayAreas.map((data, i) => {
                    areas.push({ areas_id: data._id });
                });
            }
            if (this.props.discounts.arrayClasses.length > 0) {
                this.props.discounts.arrayClasses.map((data, i) => {
                    clases.push({ class_id: data._id });
                });
            }
            if (this.props.discounts.arrayPlanes.length > 0) {
                this.props.discounts.arrayPlanes.map((data, i) => {
                    planes.push({ plans_id: data._id });
                });
            }
            if (this.props.discounts.arrayPackages.length > 0) {
                this.props.discounts.arrayPackages.map((data, i) => {
                    paquetes.push({ packages_id: data._id });
                });
            }
            if (this.props.discounts.products.length > 0) {
                this.props.discounts.products.map((data, i) => {
                    productos.push({ products_id: data.products_id });
                });
            }
            if (this.props.discounts.services.length > 0) {
                this.props.discounts.services.map((data, i) => {
                    servicios.push({ services_id: data.services_id });
                });
            }

            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveDiscountsAction(
                    {
                        name: this.state.name,
                        type: this.state.arrayType.value,
                        value: formatMonto(this.state.valueDiscount),
                        start_date: this.state.startDate,
                        final_date: this.state.endDate,
                        all_areas: this.state.aplicateAllAreas,
                        areas: areas,
                        all_class: this.state.aplicateAllClass,
                        class: clases,
                        all_plans: this.state.aplicateAllPlanes,
                        plans: planes,
                        all_packages: this.state.aplicateAllPackages,
                        packages: paquetes,
                        all_products: this.state.aplicateAllProducts,
                        products: productos,
                        all_services: this.state.aplicateAllServices,
                        services: servicios,
                    },
                    () => {
                        this.closeModal(1);
                    },
                    false
                );
            }
            if (this.props.option === 3) {
                this.props.updateDiscountsAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        type: this.state.arrayType.value,
                        value: formatMonto(this.state.valueDiscount),
                        start_date: this.state.startDate,
                        final_date: this.state.endDate,
                        all_areas: this.state.aplicateAllAreas,
                        areas: areas,
                        all_class: this.state.aplicateAllClass,
                        class: clases,
                        all_plans: this.state.aplicateAllPlanes,
                        plans: planes,
                        all_packages: this.state.aplicateAllPackages,
                        packages: paquetes,
                        all_products: this.state.aplicateAllProducts,
                        products: productos,
                        all_services: this.state.aplicateAllServices,
                        services: servicios,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
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
                                                    "nameHide"
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
                                            <Label for="arrayType">Tipo</Label>
                                            <div className={this.state.arrayTypeError}>
                                                <Select
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    isDisabled={this.props.disabled}
                                                    name="arrayType"
                                                    id="arrayType"
                                                    value={this.state.arrayType}
                                                    onChange={event => this.handleChangeSelect(
                                                        event,
                                                        "arrayType",
                                                        "arrayTypeError",
                                                        "arrayTypeTextError",
                                                        "arrayTypeHide"
                                                    )}
                                                    options={
                                                        [{ label: 'Porcentaje', value: 'percentage ' },
                                                        { label: 'Monto', value: 'amount ' }]
                                                    }
                                                />
                                            </div>
                                            <div className={`${this.state.arrayTypeHide} errorControl`}>
                                                {this.state.arrayTypeTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="valueDiscount">Monto</Label>
                                            <Input
                                                invalid={this.state.valueDiscountError}
                                                id="valueDiscount"
                                                name="valueDiscount"
                                                onKeyUp={event => this.handlekeyMonto(
                                                    "valueDiscount",
                                                    "valueDiscountError",
                                                    "valueDiscountTextError",
                                                    "valueDiscountHide"
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.valueDiscount}
                                                type="text"
                                                onBlur={this.eventoBlur("valueDiscount")}
                                                onFocus={this.eventoFocus("valueDiscount")}
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.valueDiscountHide} errorControl`}>
                                                {this.state.valueDiscountTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="startDate">Fecha de Inicio</Label>
                                            <div className={this.state.startDateError}>
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={event => this.handleChangeSelect(
                                                        event,
                                                        "startDate",
                                                        "startDateError",
                                                        "startDateTextError",
                                                        "startDateHide"
                                                    )}
                                                    dateFormat="dd-MM-yyyy"
                                                    isClearable
                                                    showYearDropdown
                                                    dateFormatCalendar="MMMM"
                                                    className="form-control"

                                                    disabled={this.props.disabled}
                                                    locale="es"
                                                />
                                            </div>
                                            <div className={`${this.state.startDateHide} errorControl`}>
                                                {this.state.startDateTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="endDate">Fecha de Finalizacion</Label>
                                            <div className={this.state.endDateError}>
                                                <DatePicker
                                                    selected={this.state.endDate}
                                                    onChange={event => this.handleChangeSelect(
                                                        event,
                                                        "endDate",
                                                        "endDateError",
                                                        "endDateTextError",
                                                        "endDateHide"
                                                    )}
                                                    dateFormat="dd-MM-yyyy"
                                                    isClearable
                                                    showYearDropdown
                                                    dateFormatCalendar="MMMM"
                                                    className="form-control"
                                                    disabled={this.props.disabled}
                                                    locale="es"
                                                />
                                            </div>
                                            <div className={`${this.state.endDateHide} errorControl`}>
                                                {this.state.endDateTextError}
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
                                                                        options={this.props.discounts.dataAreas}
                                                                    />
                                                                </div>
                                                                <div className={`${this.state.arrayAreasHide} errorControl`}>
                                                                    {this.state.arrayAreasTextError}
                                                                </div>
                                                            </div>
                                                        </FormGroup>
                                                        <FormGroup check className="top form-group col-sm-6">
                                                            <Label for="aplicateAllAreas">¿Aplicar a todas las areas?</Label>
                                                            <Switch
                                                                checked={this.state.aplicateAllAreas ? this.state.aplicateAllAreas : false}
                                                                onChange={this.handleChangeSwitch("aplicateAllAreas")}
                                                                value={this.state.aplicateAllAreas}
                                                                color="primary"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </FormGroup>
                                                        {
                                                            this.state.arrayAreas && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Areas
                                                                        data={this.state.arrayAreas.info}
                                                                        confirm={this.props.confirm}
                                                                        addAreasFunction={this.props.addAreasFunction}
                                                                        arrayAll={this.props.discounts.arrayAreas}
                                                                        cleanSelectAreas={this.cleanSelectAreas}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.props.discounts.arrayAreas.length > 0 && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <AreasAdd
                                                                        confirm={this.props.confirm}
                                                                        arrayAdd={this.props.discounts.arrayAreas}
                                                                        deleteAreasFunction={this.props.deleteAreasFunction}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.state.aplicateAllAreas && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Alert color="secondary">
                                                                        ¡Este descuento se aplicara a todas las Areas!
                                                                    </Alert>
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
                                                                        isDisabled={this.props.option !== 2 ?
                                                                            this.state.aplicateAllClass : this.props.disabled}
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
                                                                        options={this.props.discounts.dataClass}
                                                                    />
                                                                </div>
                                                                <div className={`${this.state.arrayClassHide} errorControl`}>
                                                                    {this.state.arrayClassTextError}
                                                                </div>
                                                            </div>
                                                        </FormGroup>
                                                        <FormGroup check className="top form-group col-sm-6">
                                                            <Label for="aplicateAllClass">¿Aplicar a todas las clases?</Label>
                                                            <Switch
                                                                checked={this.state.aplicateAllClass ? this.state.aplicateAllClass : false}
                                                                onChange={this.handleChangeSwitch("aplicateAllClass")}
                                                                value={this.state.aplicateAllClass}
                                                                color="primary"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </FormGroup>
                                                        {
                                                            this.state.arrayClass && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Classes
                                                                        data={this.state.arrayClass.info}
                                                                        confirm={this.props.confirm}
                                                                        addClassFunction={this.props.addClassFunction}
                                                                        arrayAll={this.props.discounts.arrayClasses}
                                                                        cleanSelectClass={this.cleanSelectClass}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.props.discounts.arrayClasses.length > 0 && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <ClassesAdd
                                                                        confirm={this.props.confirm}
                                                                        arrayAdd={this.props.discounts.arrayClasses}
                                                                        deleteClassFunction={this.props.deleteClassFunction}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.state.aplicateAllClass && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Alert color="secondary">
                                                                        ¡Este descuento se aplicara a todas las clases!
                                                                    </Alert>
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
                                                                        isDisabled={this.props.option !== 2 ?
                                                                            this.state.aplicateAllPlanes : this.props.disabled}
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
                                                                        options={this.props.discounts.dataPlan}
                                                                    />
                                                                </div>
                                                                <div className={`${this.state.arrayPlanesHide} errorControl`}>
                                                                    {this.state.arrayPlanesTextError}
                                                                </div>
                                                            </div>
                                                        </FormGroup>
                                                        <FormGroup check className="top form-group col-sm-6">
                                                            <Label for="aplicateAllPlanes">¿Aplicar a todas los planes?</Label>
                                                            <Switch
                                                                checked={this.state.aplicateAllPlanes ? this.state.aplicateAllPlanes : false}
                                                                onChange={this.handleChangeSwitch("aplicateAllPlanes")}
                                                                value={this.state.aplicateAllPlanes}
                                                                color="primary"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </FormGroup>
                                                        {
                                                            this.state.arrayPlanes && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Planes
                                                                        data={this.state.arrayPlanes.info}
                                                                        confirm={this.props.confirm}
                                                                        addPlanFunction={this.props.addPlanFunction}
                                                                        arrayAll={this.props.discounts.arrayPlanes}
                                                                        cleanSelectPlan={this.cleanSelectPlan}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.props.discounts.arrayPlanes.length > 0 && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <PlanesAdd
                                                                        confirm={this.props.confirm}
                                                                        arrayAdd={this.props.discounts.arrayPlanes}
                                                                        deletePlanFunction={this.props.deletePlanFunction}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.state.aplicateAllPlanes && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Alert color="secondary">
                                                                        ¡Este descuento se aplicara a todas los planes!
                                                                    </Alert>
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
                                                                        isDisabled={this.props.option !== 2 ?
                                                                            this.state.aplicateAllPackages : this.props.disabled}
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
                                                                        options={this.props.discounts.dataPackages}
                                                                    />
                                                                </div>
                                                                <div className={`${this.state.arrayPackagesHide} errorControl`}>
                                                                    {this.state.arrayPackagesTextError}
                                                                </div>
                                                            </div>
                                                        </FormGroup>
                                                        <FormGroup check className="top form-group col-sm-6">
                                                            <Label for="aplicateAllPackages">¿Aplicar a todas los paquetes?</Label>
                                                            <Switch
                                                                checked={this.state.aplicateAllPackages ? this.state.aplicateAllPackages : false}
                                                                onChange={this.handleChangeSwitch("aplicateAllPackages")}
                                                                value={this.state.aplicateAllPackages}
                                                                color="primary"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </FormGroup>
                                                        {
                                                            this.state.arrayPackages && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Packages
                                                                        data={this.state.arrayPackages.info}
                                                                        confirm={this.props.confirm}
                                                                        addPackagesFunction={this.props.addPackagesFunction}
                                                                        arrayAll={this.props.discounts.arrayPackages}
                                                                        cleanSelectPackages={this.cleanSelectPackages}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.props.discounts.arrayPackages.length > 0 && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <PackagesAdd
                                                                        confirm={this.props.confirm}
                                                                        arrayAdd={this.props.discounts.arrayPackages}
                                                                        deletePackageFunction={this.props.deletePackageFunction}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.state.aplicateAllPackages && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Alert color="secondary">
                                                                        ¡Este descuento se aplicara a todas los paquetes!
                                                                    </Alert>
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
                                                    <div className="row">
                                                        <FormGroup check className="top form-group col-sm-6">
                                                            <Label for="aplicateAllProducts">¿Aplicar a todas los productos?</Label>
                                                            <Switch
                                                                checked={this.state.aplicateAllProducts ? this.state.aplicateAllProducts : false}
                                                                onChange={this.handleChangeSwitch("aplicateAllProducts")}
                                                                value={this.state.aplicateAllProducts}
                                                                color="primary"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </FormGroup>
                                                        {
                                                            this.state.aplicateAllProducts ?
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Alert color="secondary">
                                                                        ¡Este descuento se aplicara a todas los productos!
                                                                    </Alert>
                                                                </FormGroup>
                                                                :
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Products
                                                                        dataAll={this.props.dataAllProducts}
                                                                        search={this.props.searchProducts}
                                                                        searchId={this.props.searchProductId}
                                                                        dataSelect={this.props.discounts.products}
                                                                        deleteProductoIdFunction={this.props.deleteProductoIdFunction}
                                                                        confirm={this.props.confirm}
                                                                        tableProductsTextError={this.state.tableProductsTextError}
                                                                        limpiarValidacionesProducts={this.limpiarValidacionesProducts}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
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
                                                    <div className="row">
                                                        <FormGroup check className="top form-group col-sm-6">
                                                            <Label for="aplicateAllServices">¿Aplicar a todas los servicios?</Label>
                                                            <Switch
                                                                checked={this.state.aplicateAllServices ? this.state.aplicateAllServices : false}
                                                                onChange={this.handleChangeSwitch("aplicateAllServices")}
                                                                value={this.state.aplicateAllServices}
                                                                color="primary"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </FormGroup>
                                                        {
                                                            this.state.aplicateAllServices ?
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Alert color="secondary">
                                                                        ¡Este descuento se aplicara a todas los servicios!
                                                                    </Alert>
                                                                </FormGroup>
                                                                :
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <Services
                                                                        dataAll={this.props.dataAllServices}
                                                                        search={this.props.searchServices}
                                                                        searchId={this.props.searchServiceId}
                                                                        dataSelect={this.props.discounts.services}
                                                                        deleteServiceIdFunction={this.props.deleteServiceIdFunction}
                                                                        confirm={this.props.confirm}
                                                                        tableServicesTextError={this.state.tableServicesTextError}
                                                                        limpiarValidacionesServices={this.limpiarValidacionesServices}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                        }
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Collapse>
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
                                    onClick={this.handleSaveDiscount}
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
                    )
                }
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    discounts: state.discounts.toJS(),
    dataAllProducts: state.discounts.get('dataAllProducts'),
    dataAllServices: state.discounts.get('dataAllServices'),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveDiscountsAction: (data, callback, addDiscount) => dispatch(saveDiscountsAction(data, callback, addDiscount)),
    updateDiscountsAction: (data, callback) => dispatch(updateDiscountsAction(data, callback)),
    searchProducts: (data) => dispatch(searchProducts(data)),
    searchProductId: (data, dataAll) => dispatch(searchProductId(data, dataAll)),
    deleteProductoIdFunction: (key) => dispatch(deleteProductoIdFunction(key)),
    searchServices: (data) => dispatch(searchServices(data)),
    searchServiceId: (data, dataAll) => dispatch(searchServiceId(data, dataAll)),
    deleteServiceIdFunction: (key) => dispatch(deleteServiceIdFunction(key)),
    addClassFunction: (data, dataAll) => dispatch(addClassFunction(data, dataAll)),
    deleteClassFunction: (id) => dispatch(deleteClassFunction(id)),
    addPlanFunction: (data, dataAll) => dispatch(addPlanFunction(data, dataAll)),
    deletePlanFunction: (id) => dispatch(deletePlanFunction(id)),
    addPackagesFunction: (data, dataAll) => dispatch(addPackagesFunction(data, dataAll)),
    deletePackageFunction: (id) => dispatch(deletePackageFunction(id)),
    addAreasFunction: (data, dataAll) => dispatch(addAreasFunction(data, dataAll)),
    deleteAreasFunction: (id) => dispatch(deleteAreasFunction(id)),
    cleanStoreArrayAreasFunction: () => dispatch(cleanStoreArrayAreasFunction()),
    cleanStoreArrayClassFunction: () => dispatch(cleanStoreArrayClassFunction()),
    cleanStoreArrayPlanesFunction: () => dispatch(cleanStoreArrayPlanesFunction()),
    cleanStoreArrayPackagesFunction: () => dispatch(cleanStoreArrayPackagesFunction()),
    cleanStoreArrayProductsFunction: () => dispatch(cleanStoreArrayProductsFunction()),
    cleanStoreArrayServicesFunction: () => dispatch(cleanStoreArrayServicesFunction()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);