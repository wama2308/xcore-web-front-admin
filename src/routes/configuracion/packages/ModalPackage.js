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
    Alert,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    savePackagesAction,
    updatePackagesAction,
    addPenaltyFunction,
    deletePenaltyFunction,
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
    addAreasFunction,
    deleteAreasFunction,
    cleanStoreDiscountPackagesFunction,
    addDiscountSelectProduct,
    addDiscountSelectService,
    //changeDiscountSelectPackages ,
} from "../../../actions/PackagesActions"
import { addDiscountSelect } from "../../../actions/aplicantionActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Penalizaciones from "../../../components/Penalizaciones";
import PenalizacionesAdd from "../../../components/PenalizacionesAdd";
import { number_format, formatMonto } from "../../../helpers/helpers";
import Products from "./Products";
import Services from "./Services";
import Classes from "../../../components/Classes";
import ClassesAdd from "../../../components/ClassesAdd";
import Planes from "../../../components/Planes";
import PlanesAdd from "../../../components/PlanesAdd";
import Areas from "../../../components/Areas";
import AreasAdd from "../../../components/AreasAdd";
import AddDiscounts from "../discounts/AddDiscounts";
import Descuento from "../area/Descuento";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)
import { NotificationManager } from 'react-notifications';

class ModalPackage extends React.Component {
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
        if (select === "arrayDescuentos" && value) {
            this.props.addDiscountSelect(value);
        }
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

    handleChangeExpirationDate = date => {
        this.setState({
            expirationDate: date,
            expirationDateError: "",
            expirationDateTextError: '',
            expirationDateHide: 'hide',
        });
    }

    handleChangeSwitch = (name, error, textError, hide, option) => event => {
        this.setState({
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',
        });
        if (name === "partialPayments") {
            this.setState({
                dayPartialPayments: "",
            });
        }
        if (name === "discountGeneral") {
            this.setState({
                discountIndividual: false,
                arrayDescuentos: null,
                arrayDescuentosError: "",
                arrayDescuentosTextError: "",
                arrayDescuentosHide: "hide",
                arrayAreas: null,
                arrayClass: null,
                arrayPlanes: null,
            });
            this.props.cleanStoreDiscountPackagesFunction();
        }
        if (name === "discountIndividual") {
            this.setState({
                discountGeneral: false,
                arrayDescuentos: null,
                arrayAreas: null,
                arrayClass: null,
                arrayPlanes: null,
            });
            this.props.cleanStoreDiscountPackagesFunction();
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

    cleanSelectPenalty = () => {
        this.setState({
            arrayPenalty: null,
            arrayPenaltyError: '',
            arrayPenaltyTextError: '',
            arrayPenaltyHide: 'hide',
        });
    }

    fileHandlerIcono = (data) => {
        if ((data.size) / 1024 > 2048) {
            this.setState({
                imagenError: 'borderColor',
                imagenTextError: 'Tamaño de la imagen no permitido',
                imagenHide: 'show'
            });
        } else {
            const file = data;
            if (!file) {
                return;
            }
            let reader = new FileReader();

            reader.readAsDataURL(data);

            reader.onloadend = () => {
                this.setState({
                    imagen: reader.result
                });
            };
            this.setState({
                imagenError: '',
                imagenTextError: '',
                imagenHide: 'hide'
            });
        }
    };

    validate = () => {
        let acum = "";
        if (!this.state.name) {
            this.setState({
                nameError: true,
                nameTextError: 'Ingrese el nombre',
                nameHide: 'show',
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
        if ((this.state.amount === '0.00') || (this.state.amount === '0.0')) {
            this.setState({
                amountError: true,
                amountTextError: "Ingrese el monto",
                amountHide: "show",
            });
            acum = 1;
        }
        if (!this.state.arrayImpuesto) {
            this.setState({
                arrayImpuestoError: "borderColor",
                arrayImpuestoTextError: 'Seleccione el impuesto',
                arrayImpuestoHide: 'show',
            });
            acum = 1;
        }
        if (!this.state.expirationDate) {
            this.setState({
                expirationDateError: "borderColor",
                expirationDateTextError: 'Ingrese la fecha de expiracion',
                expirationDateHide: 'show',
            });
            acum = 1;
        }
        if (!this.state.imagen) {
            this.setState({
                imagenError: 'borderColor',
                imagenTextError: 'Seleccione la imagen',
                imagenHide: 'show',
            });
            acum = 1;
        }
        if (this.state.partialPayments && (!this.state.dayPartialPayments || this.state.dayPartialPayments === '0')) {
            this.setState({
                dayPartialPaymentsError: true,
                dayPartialPaymentsTextError: 'Ingrese la cantidad de dias para el pago parcial',
                dayPartialPaymentsHide: 'show',
            });
            acum = 1;
        }
        if (this.state.discountGeneral && !this.state.arrayDescuentos) {
            this.setState({
                arrayDescuentosError: 'borderColor',
                arrayDescuentosTextError: 'Seleccione el descuento',
                arrayDescuentosHide: 'show',
            });
            acum = 1;
        }
        if (this.state.discountIndividual && this.props.packages.products.length > 0) {
            const findSelectNull = this.props.packages.products.find(data => data.valueSelect === null);
            if (findSelectNull) {
                this.setState({
                    tableProductsTextError: 'Debe seleccionar un descuento para cada producto',
                });
                acum = 1;
            }
        }
        if (this.state.discountIndividual && this.props.packages.services.length > 0) {
            const findSelectNull = this.props.packages.services.find(data => data.valueSelect === null);
            if (findSelectNull) {
                this.setState({
                    tableServicesTextError: 'Debe seleccionar un descuento para cada servicio',
                });
                acum = 1;
            }
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    }

    handleSavePackage = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let areas = [];
            let clases = [];
            let planes = [];
            let servicios = [];
            let productos = [];
            let penalizaciones = [];

            if (this.props.packages.arrayAreas.length > 0) {
                this.props.packages.arrayAreas.map((data, i) => {
                    areas.push({ areas_id: data._id, discount_id: data.discount_id });
                });
            }
            if (this.props.packages.arrayClasses.length > 0) {
                this.props.packages.arrayClasses.map((data, i) => {
                    clases.push({ class_id: data._id, discount_id: data.discount_id });
                });
            }
            if (this.props.packages.arrayPlanes.length > 0) {
                this.props.packages.arrayPlanes.map((data, i) => {
                    planes.push({ plans_id: data._id, discount_id: data.discount_id });
                });
            }
            if (this.props.packages.products.length > 0) {
                this.props.packages.products.map((data, i) => {
                    productos.push({ products_id: data.products_id, discount_id: data.discount_id });
                });
            }
            if (this.props.packages.services.length > 0) {
                this.props.packages.services.map((data, i) => {
                    servicios.push({ services_id: data.services_id, discount_id: data.discount_id });
                });
            }
            if (this.props.packages.penalties.length > 0) {
                this.props.packages.penalties.map((data, i) => {
                    penalizaciones.push(data._id);
                });
            }

            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.savePackagesAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        image: this.state.imagen,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        class: clases,
                        plans: planes,
                        areas: areas,
                        services: servicios,
                        products: productos,
                        penalty: this.props.packages.penalties.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        discount_general: this.state.discountGeneral,
                        discount_id: this.state.discountGeneral ? this.state.arrayDescuentos.value : null,
                        discount_individual: this.state.discountIndividual,
                        expiration_date: this.state.expirationDate,
                        corporate_group: this.state.corporateGroup,
                        partial_payment: this.state.partialPayments,
                        number_days: this.state.dayPartialPayments,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updatePackagesAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        image: this.state.imagen,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        class: clases,
                        plans: planes,
                        areas: areas,
                        services: servicios,
                        products: productos,
                        penalty: this.props.packages.penalties.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        discount_general: this.state.discountGeneral,
                        discount_id: this.state.discountGeneral ? this.state.arrayDescuentos.value : null,
                        discount_individual: this.state.discountIndividual,
                        expiration_date: this.state.expirationDate,
                        corporate_group: this.state.corporateGroup,
                        partial_payment: this.state.partialPayments,
                        number_days: this.state.dayPartialPayments,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
        }
    }

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

    cleanSelectAreas = () => {
        this.setState({
            arrayAreas: null,
            arrayAreasError: '',
            arrayAreasTextError: '',
            arrayAreasHide: 'hide',
        });
    }

    cleanNewDiscount = () => {
        this.setState({
            registerDiscount: false,
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

    handleChangeRegisterDiscount = name => event => {
        this.setState({
            [name]: event.target.checked,
            arrayDescuentos: null,
        });
    };

    cargarData(data) {
        let expirationDateSplit = data.expiration_date.split('-');
        let expirationDate = new Date(expirationDateSplit[0], expirationDateSplit[1] - 1, expirationDateSplit[2].substring(0, 2));

        this.setState({
            name: data.name,
            description: data.description,
            amount: number_format(data.amount, 2),
            arrayImpuesto: data.tax,
            expirationDate: expirationDate,
            corporateGroup: data.corporate_group,
            imagen: data.image,
            discountGeneral: data.discount_general,
            arrayDescuentos: data.discount,
            discountIndividual: data.discount_individual,
            partialPayments: data.partial_payment,
            dayPartialPayments: data.partial_payment ? data.number_days : '',
            collapseAreas: data.areas.length > 0 ? true : false,
            collapseClass: data.class.length > 0 ? true : false,
            collapsePlanes: data.plans.length > 0 ? true : false,
            collapseProducts: data.products.length > 0 ? true : false,
            collapseServices: data.services.length > 0 ? true : false,
            collapsePenalizaciones: data.penalties.length > 0 ? true : false,
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
            if (props.packages.packageId && this.state.actionReducer === 0) {
                this.cargarData(props.packages.packageId);
            }
        }
        if (props.dataGeneral.newDiscount) {
            this.setState({
                arrayDescuentos: Object.keys(props.dataGeneral.newDiscount).length > 0 ? props.dataGeneral.newDiscount : null
            });
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
                {
                    (this.state.loading === "hide" && this.props.packages.actionDataExtra === 1) ? (
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
                                                <Label for="description">Descripcion</Label>
                                                <Input
                                                    invalid={this.state.descriptionError}
                                                    id="description"
                                                    name="description"
                                                    onKeyUp={event => this.handlekey(
                                                        "descriptionError",
                                                        "descriptionTextError",
                                                        "descriptionHide"
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
                                                <Label for="amount">Monto</Label>
                                                <Input
                                                    invalid={this.state.amountError}
                                                    id="amount"
                                                    name="amount"
                                                    onKeyUp={event => this.handlekeyMonto(
                                                        "amount",
                                                        "amountError",
                                                        "amountTextError",
                                                        "amountHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.amount}
                                                    type="text"
                                                    onBlur={this.eventoBlur("amount")}
                                                    onFocus={this.eventoFocus("amount")}
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.amountHide} errorControl`}>
                                                    {this.state.amountTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="arrayImpuesto">Impuesto (%)</Label>
                                                <div className={this.state.arrayImpuestoError}>
                                                    <Select
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={this.props.disabled}
                                                        name="arrayImpuesto"
                                                        id="arrayImpuesto"
                                                        value={this.state.arrayImpuesto}
                                                        onChange={event => this.handleChangeSelect(
                                                            event,
                                                            "arrayImpuesto",
                                                            "arrayImpuestoError",
                                                            "arrayImpuestoTextError",
                                                            "arrayImpuestoHide"
                                                        )}
                                                        options={this.props.dataGeneral.countryConfiguration.tax.filter(
                                                            option => option.default === true
                                                        )}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayImpuestoHide} errorControl`}>
                                                    {this.state.arrayImpuestoTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="expirationDate">Fecha de Expiracion</Label>
                                                <div className={this.state.expirationDateError}>
                                                    <DatePicker
                                                        selected={this.state.expirationDate}
                                                        onChange={this.handleChangeExpirationDate}
                                                        dateFormat="dd-MM-yyyy"
                                                        isClearable
                                                        showYearDropdown
                                                        dateFormatCalendar="MMMM"
                                                        className="form-control"
                                                        disabled={this.props.disabled}
                                                        locale="es"
                                                    />
                                                </div>
                                                <div className={`${this.state.expirationDateHide} errorControl`}>
                                                    {this.state.expirationDateTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="gerente">¿Pertenece a un grupo corporativo?</Label>
                                            <Switch
                                                checked={this.state.corporateGroup ? this.state.corporateGroup : false}
                                                onChange={this.handleChangeSwitch("corporateGroup")}
                                                value={this.state.corporateGroup}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="central">Imagen</Label>
                                                <div style={{ height: '39px' }} className={this.state.imagenError}>
                                                    <Label
                                                        color="primary"
                                                        className="btn"
                                                        variant="contained"
                                                        style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                    >
                                                        <span style={{ fontWeight: '500' }}>Cargar Imagen</span>
                                                        <Input
                                                            style={{ display: 'none' }}
                                                            className="top"
                                                            type="file"
                                                            name="icono"
                                                            accept="image/*"
                                                            onChange={event =>
                                                                this.fileHandlerIcono(event.currentTarget.files[0]
                                                                )
                                                            }
                                                            disabled={this.props.disabled}
                                                        />
                                                    </Label>
                                                </div>
                                                <div className={`${this.state.imagenHide} errorControl`}>
                                                    {this.state.imagenTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <Label for="central">
                                                <div>
                                                    {this.state.imagen && (
                                                        <img
                                                            style={{ width: 300, height: 180 }}
                                                            className="image"
                                                            src={this.state.imagen}
                                                        />
                                                    )}
                                                </div>
                                            </Label>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="partialPayments">¿Pagos Parciales?</Label>
                                            <Switch
                                                checked={this.state.partialPayments ? this.state.partialPayments : false}
                                                onChange={this.handleChangeSwitch(
                                                    "partialPayments",
                                                    "dayPartialPaymentsError",
                                                    "dayPartialPaymentsTextError",
                                                    "dayPartialPaymentsHide",
                                                    1
                                                )}
                                                value={this.state.partialPayments}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="dayPartialPayments">Dias para el pago parcial</Label>
                                                <Input
                                                    invalid={this.state.dayPartialPaymentsError}
                                                    id="dayPartialPayments"
                                                    name="dayPartialPayments"
                                                    type="number"
                                                    min="0"
                                                    onKeyUp={event => this.handlekey(
                                                        "dayPartialPaymentsError",
                                                        "dayPartialPaymentsTextError",
                                                        "dayPartialPaymentsHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.dayPartialPayments}
                                                    disabled={this.props.option === 2 ? this.props.disabled
                                                        : !this.state.partialPayments}
                                                />
                                                <div className={`${this.state.dayPartialPaymentsHide} errorControl`}>
                                                    {this.state.dayPartialPaymentsTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="discountGeneral">¿Descuento General?</Label>
                                            <Switch
                                                checked={this.state.discountGeneral ? this.state.discountGeneral : false}
                                                onChange={this.handleChangeSwitch("discountGeneral")}
                                                value={this.state.discountGeneral}
                                                color="primary"
                                                disabled={this.props.option !== 2 ? this.state.discountIndividual : this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="arrayDescuentos">Descuentos</Label>
                                                <div className={this.state.arrayDescuentosError}>
                                                    <Select
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={this.props.option !== 2 ? !this.state.discountGeneral : this.props.disabled}
                                                        name="arrayDescuentos"
                                                        id="arrayDescuentos"
                                                        value={this.state.arrayDescuentos}
                                                        onChange={event => this.handleChangeSelect(
                                                            event,
                                                            "arrayDescuentos",
                                                            "arrayDescuentosError",
                                                            "arrayDescuentosTextError",
                                                            "arrayDescuentosHide"
                                                        )}
                                                        options={this.props.dataGeneral.dataDiscount}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayDescuentosHide} errorControl`}>
                                                    {this.state.arrayDescuentosTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="registerDiscount">¿Nuevo Descuento?</Label>
                                            <Switch
                                                checked={this.state.registerDiscount ? this.state.registerDiscount : false}
                                                onChange={this.handleChangeRegisterDiscount("registerDiscount")}
                                                value={this.state.registerDiscount}
                                                color="primary"
                                                disabled={this.props.option !== 2 ? !this.state.discountGeneral : this.props.disabled}
                                            />
                                        </FormGroup>
                                        {
                                            this.state.registerDiscount && (
                                                <FormGroup className="top form-group col-sm-12">
                                                    <AddDiscounts
                                                        cleanNewDiscount={this.cleanNewDiscount}
                                                    />
                                                </FormGroup>
                                            )
                                        }
                                        {
                                            this.state.arrayDescuentos && (
                                                <FormGroup className="top form-group col-sm-12">
                                                    <Descuento
                                                        dataDescuento={this.state.arrayDescuentos.info}
                                                    />
                                                </FormGroup>
                                            )
                                        }
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="discountIndividual">¿Descuento Individual?</Label>
                                            <Switch
                                                checked={this.state.discountIndividual ? this.state.discountIndividual : false}
                                                onChange={this.handleChangeSwitch("discountIndividual")}
                                                value={this.state.discountIndividual}
                                                color="primary"
                                                disabled={this.props.option !== 2 ? this.state.discountGeneral : this.props.disabled}
                                            />
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup className="top form-group col-sm-4">
                                            <Button
                                                color="primary"
                                                onClick={() =>
                                                    this.setState({
                                                        collapsePenalizaciones: !this.state.collapsePenalizaciones
                                                    })
                                                }
                                                disabled={this.props.disabled}
                                            >
                                                Penalizaciones
                                        </Button>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-12">
                                            <Collapse isOpen={this.state.collapsePenalizaciones}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="row">
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <div>
                                                                    <Label for="arrayPenalty">Penalizaciones</Label>
                                                                    <div className={this.state.arrayPenaltyError}>
                                                                        <Select
                                                                            isSearchable
                                                                            isClearable
                                                                            isDisabled={this.props.disabled}
                                                                            name="arrayPenalty"
                                                                            id="arrayPenalty"
                                                                            value={this.state.arrayPenalty}
                                                                            onChange={event => this.handleChangeSelect(
                                                                                event,
                                                                                "arrayPenalty",
                                                                                "arrayPenaltyError",
                                                                                "arrayPenaltyTextError",
                                                                                "arrayPenaltyHide"
                                                                            )}
                                                                            options={this.props.dataGeneral.dataPenalties}
                                                                        />
                                                                    </div>
                                                                    <div className={`${this.state.arrayPenaltyHide} errorControl`}>
                                                                        {this.state.arrayPenaltyTextError}
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                            {
                                                                this.state.arrayPenalty && (
                                                                    <FormGroup className="top form-group col-sm-12">
                                                                        <Penalizaciones
                                                                            dataPenalty={this.state.arrayPenalty.info}
                                                                            confirm={this.props.confirm}
                                                                            addPenaltyFunction={this.props.addPenaltyFunction}
                                                                            arrayPenalty={this.props.packages.penalties}
                                                                            deletePenaltyFunction={this.props.deletePenaltyFunction}
                                                                            cleanSelectPenalty={this.cleanSelectPenalty}
                                                                            disabled={this.props.disabled}
                                                                        />
                                                                    </FormGroup>
                                                                )
                                                            }
                                                            {
                                                                this.props.packages.penalties.length > 0 && (
                                                                    <FormGroup className="top form-group col-sm-12">
                                                                        <PenalizacionesAdd
                                                                            confirm={this.props.confirm}
                                                                            arrayPenalty={this.props.packages.penalties}
                                                                            deletePenaltyFunction={this.props.deletePenaltyFunction}
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
                                                        {
                                                            this.state.discountGeneral && !this.state.arrayDescuentos && (
                                                                <Alert color="secondary">
                                                                    ¡Debe seleccionar un descuento general!
                                                                </Alert>
                                                            )
                                                        }
                                                        {
                                                            ((!this.state.discountGeneral) ||
                                                                (this.state.discountGeneral && this.state.arrayDescuentos)) && (
                                                                <div className='row'>
                                                                    <FormGroup className="top form-group col-sm-6">
                                                                        <div>
                                                                            <Label for="arrayAreas">Areas</Label>
                                                                            <div className={this.state.arrayAreasError}>
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    isSearchable={true}
                                                                                    isDisabled={this.props.disabled}
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
                                                                                    options={this.props.packages.dataAreas}
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
                                                                                <Areas
                                                                                    data={this.state.arrayAreas.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addAreasFunction={this.props.addAreasFunction}
                                                                                    arrayAll={this.props.packages.arrayAreas}
                                                                                    cleanSelectAreas={this.cleanSelectAreas}
                                                                                    disabled={this.props.disabled}
                                                                                    discountGeneral={this.state.discountGeneral}
                                                                                    discountIndividual={this.state.discountIndividual}
                                                                                    discountValue={this.state.arrayDescuentos}
                                                                                    dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.packages.arrayAreas.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <AreasAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.packages.arrayAreas}
                                                                                    deleteAreasFunction={this.props.deleteAreasFunction}
                                                                                    disabled={this.props.disabled}
                                                                                    discountGeneral={this.state.discountGeneral}
                                                                                    discountIndividual={this.state.discountIndividual}
                                                                                    tableAreasTextError={this.state.tableAreasTextError}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        }
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
                                                        {
                                                            this.state.discountGeneral && !this.state.arrayDescuentos && (
                                                                <Alert color="secondary">
                                                                    ¡Debe seleccionar un descuento general!
                                                                </Alert>
                                                            )
                                                        }
                                                        {
                                                            ((!this.state.discountGeneral) ||
                                                                (this.state.discountGeneral && this.state.arrayDescuentos)) && (
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
                                                                                    options={this.props.packages.dataClass}
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
                                                                                <Classes
                                                                                    data={this.state.arrayClass.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addClassFunction={this.props.addClassFunction}
                                                                                    arrayAll={this.props.packages.arrayClasses}
                                                                                    cleanSelectClass={this.cleanSelectClass}
                                                                                    disabled={this.props.disabled}
                                                                                    discountGeneral={this.state.discountGeneral}
                                                                                    discountIndividual={this.state.discountIndividual}
                                                                                    discountValue={this.state.arrayDescuentos}
                                                                                    dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.packages.arrayClasses.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <ClassesAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.packages.arrayClasses}
                                                                                    deleteClassFunction={this.props.deleteClassFunction}
                                                                                    disabled={this.props.disabled}
                                                                                    discountGeneral={this.state.discountGeneral}
                                                                                    discountIndividual={this.state.discountIndividual}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        }
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
                                                        {
                                                            this.state.discountGeneral && !this.state.arrayDescuentos && (
                                                                <Alert color="secondary">
                                                                    ¡Debe seleccionar un descuento general!
                                                                </Alert>
                                                            )
                                                        }
                                                        {
                                                            ((!this.state.discountGeneral) ||
                                                                (this.state.discountGeneral && this.state.arrayDescuentos)) && (
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
                                                                                    options={this.props.packages.dataPlan}
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
                                                                                <Planes
                                                                                    data={this.state.arrayPlanes.info}
                                                                                    confirm={this.props.confirm}
                                                                                    addPlanFunction={this.props.addPlanFunction}
                                                                                    arrayAll={this.props.packages.arrayPlanes}
                                                                                    cleanSelectPlan={this.cleanSelectPlan}
                                                                                    disabled={this.props.disabled}
                                                                                    discountGeneral={this.state.discountGeneral}
                                                                                    discountIndividual={this.state.discountIndividual}
                                                                                    discountValue={this.state.arrayDescuentos}
                                                                                    dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.props.packages.arrayPlanes.length > 0 && (
                                                                            <FormGroup className="top form-group col-sm-12">
                                                                                <PlanesAdd
                                                                                    confirm={this.props.confirm}
                                                                                    arrayAdd={this.props.packages.arrayPlanes}
                                                                                    deletePlanFunction={this.props.deletePlanFunction}
                                                                                    disabled={this.props.disabled}
                                                                                    discountGeneral={this.state.discountGeneral}
                                                                                    discountIndividual={this.state.discountIndividual}
                                                                                />
                                                                            </FormGroup>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        }
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
                                                        {
                                                            this.state.discountGeneral && !this.state.arrayDescuentos && (
                                                                <Alert color="secondary">
                                                                    ¡Debe seleccionar un descuento general!
                                                                </Alert>
                                                            )
                                                        }
                                                        {
                                                            ((!this.state.discountGeneral) ||
                                                                (this.state.discountGeneral && this.state.arrayDescuentos)) && (
                                                                <Products
                                                                    dataAll={this.props.dataAllProducts}
                                                                    search={this.props.searchProducts}
                                                                    searchId={this.props.searchProductId}
                                                                    dataSelect={this.props.packages.products}
                                                                    deleteProductoIdFunction={this.props.deleteProductoIdFunction}
                                                                    confirm={this.props.confirm}
                                                                    tableProductsTextError={this.state.tableProductsTextError}
                                                                    limpiarValidacionesProducts={this.limpiarValidacionesProducts}
                                                                    disabled={this.props.disabled}
                                                                    discountGeneral={this.state.discountGeneral}
                                                                    discountIndividual={this.state.discountIndividual}
                                                                    discountValue={this.state.arrayDescuentos}
                                                                    dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                    addDiscountSelectProduct={this.props.addDiscountSelectProduct}
                                                                    cleanTextErrorProducts={this.cleanTextErrorProducts}
                                                                />
                                                            )
                                                        }
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
                                                        {
                                                            this.state.discountGeneral && !this.state.arrayDescuentos && (
                                                                <Alert color="secondary">
                                                                    ¡Debe seleccionar un descuento general!
                                                                </Alert>
                                                            )
                                                        }
                                                        {
                                                            ((!this.state.discountGeneral) ||
                                                                (this.state.discountGeneral && this.state.arrayDescuentos)) && (
                                                                <Services
                                                                    dataAll={this.props.dataAllServices}
                                                                    search={this.props.searchServices}
                                                                    searchId={this.props.searchServiceId}
                                                                    dataSelect={this.props.packages.services}
                                                                    deleteServiceIdFunction={this.props.deleteServiceIdFunction}
                                                                    confirm={this.props.confirm}
                                                                    tableServicesTextError={this.state.tableServicesTextError}
                                                                    limpiarValidacionesServices={this.limpiarValidacionesServices}
                                                                    disabled={this.props.disabled}
                                                                    discountGeneral={this.state.discountGeneral}
                                                                    discountIndividual={this.state.discountIndividual}
                                                                    discountValue={this.state.arrayDescuentos}
                                                                    dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                    addDiscountSelectService={this.props.addDiscountSelectService}
                                                                    cleanTextErrorServices={this.cleanTextErrorServices}
                                                                />
                                                            )
                                                        }
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
                                        onClick={this.handleSavePackage}
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
    packages: state.packages.toJS(),
    dataAllProducts: state.packages.get('dataAllProducts'),
    dataAllServices: state.packages.get('dataAllServices'),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    savePackagesAction: (data, callback) => dispatch(savePackagesAction(data, callback)),
    updatePackagesAction: (data, callback) => dispatch(updatePackagesAction(data, callback)),
    addPenaltyFunction: (data, dataAll) => dispatch(addPenaltyFunction(data, dataAll)),
    deletePenaltyFunction: (id) => dispatch(deletePenaltyFunction(id)),
    searchProducts: (data) => dispatch(searchProducts(data)),
    searchProductId: (data, dataAll) => dispatch(searchProductId(data, dataAll)),
    deleteProductoIdFunction: (key) => dispatch(deleteProductoIdFunction(key)),
    searchServices: (data) => dispatch(searchServices(data)),
    searchServiceId: (data, dataAll) => dispatch(searchServiceId(data, dataAll)),
    deleteServiceIdFunction: (key) => dispatch(deleteServiceIdFunction(key)),
    addClassFunction: (data, dataAll, dataDiscount, option) => dispatch(addClassFunction(data, dataAll, dataDiscount, option)),
    deleteClassFunction: (id) => dispatch(deleteClassFunction(id)),
    addPlanFunction: (data, dataAll, dataDiscount, option) => dispatch(addPlanFunction(data, dataAll, dataDiscount, option)),
    deletePlanFunction: (id) => dispatch(deletePlanFunction(id)),
    addAreasFunction: (data, dataAll, dataDiscount, option) => dispatch(addAreasFunction(data, dataAll, dataDiscount, option)),
    deleteAreasFunction: (id) => dispatch(deleteAreasFunction(id)),
    cleanStoreDiscountPackagesFunction: () => dispatch(cleanStoreDiscountPackagesFunction()),
    addDiscountSelect: (data) => dispatch(addDiscountSelect(data)),
    addDiscountSelectProduct: (data, id) => dispatch(addDiscountSelectProduct(data, id)),
    addDiscountSelectService: (data, id) => dispatch(addDiscountSelectService(data, id)),
    //changeDiscountSelectPackages: (data) => dispatch(changeDiscountSelectPackages(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalPackage);