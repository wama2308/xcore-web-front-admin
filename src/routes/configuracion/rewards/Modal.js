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
    saveRewardAction,
    updateRewardAction,
    addClassFunction,
    deleteClassFunction,
    addPlanFunction,
    deletePlanFunction,
    addPackageFunction,
    deletePackageFunction,
    searchProducts,
    searchProductId,
    deleteProductoIdFunction,
    addDiscountSelectProduct,
    setDataProductsQuantityRewardAction,
    searchServices,
    searchServiceId,
    deleteServiceIdFunction,
    addDiscountSelectService,
    setDataServicesQuantityRewardAction,
    cleanStoreRewardsFunction,

} from "../../../actions/RewardsActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import { number_format, formatMonto } from "../../../helpers/helpers";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import AddDiscounts from "../discounts/AddDiscounts";
import Descuento from "../area/Descuento";
import { addDiscountSelectRewards } from "../../../actions/aplicantionActions"
import ClassesRewards from "../../../components/ClassesRewards";
import ClassesRewardsAdd from "../../../components/ClassesRewardsAdd";
import PlansRewards from "../../../components/PlansRewards";
import PlansRewardsAdd from "../../../components/PlansRewardsAdd";
import PackagesRewards from "../../../components/PackagesRewards";
import PackagesRewardsAdd from "../../../components/PackagesRewardsAdd";
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

    componentDidMount() {
        if (this.props.option === 1) {
            this.setState({
                loading: "hide",
            });
        }
    }

    componentWillReceiveProps = props => {
        if (props.option === 2 || props.option === 3) {
            if (props.rewards.rewardId && this.state.actionReducer === 0) {
                this.cargarData(props.rewards.rewardId);
            }
        }
        if (props.dataGeneral.newDiscount) {
            this.setState({
                arrayDescuentos: Object.keys(props.dataGeneral.newDiscount).length > 0 ? props.dataGeneral.newDiscount : null
            });
        }
    }

    cargarData(data) {
        let type_person = this.state.type_person_options.find(typePersonData => typePersonData.value === data.type_person);
        let rule = this.state.rule_options.find(ruleData => ruleData.value === data.rule);
        this.handleChangeSelect();
        this.setState({
            name: data.name,
            description: data.description,
            type_person: type_person,
            group_or_individual: data.group_or_individual,
            disabledGroupIndividual: data.type_person === 0 ? false : true,
            rule: rule,
            amount: data.amount ? number_format(data.amount, 2) : "0.00",
            specify: data.specify ? data.specify : '',
            discount_all: data.discount_all,
            arrayDescuentos: data.discount ? data.discount : null,
            disabled_amount: data.rule === 1 ? false : true,
            disabled_specify: data.rule === 7 ? false : true,
            disabled_discount_all: data.discount_all ? false : true,
            collapseClass: data.classes.length > 0 ? true : false,
            collapsePlanes: data.plans.length > 0 ? true : false,
            collapsePackages: data.packages.length > 0 ? true : false,
            collapseProducts: data.products.length > 0 ? true : false,
            collapseServices: data.services.length > 0 ? true : false,
            loading: 'hide',
            actionReducer: 1,

        });
    }

    cleanNewDiscount = () => {
        this.setState({
            registerDiscount: false,
        });
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
        if (value) {
            if (select === "type_person" && value.value === 0) {
                this.setState({
                    disabledGroupIndividual: false
                });
            }
            if (select === "type_person" && value.value !== 0) {
                this.setState({
                    disabledGroupIndividual: true,
                    group_or_individual: false
                });
            }

            if (select === "arrayDescuentos" && value) {
                this.props.addDiscountSelectRewards(value);
            }
            if (select === "rule") {
                this.props.cleanStoreRewardsFunction();
            }
            if (select === "rule" && value.value === 1) {
                this.setState({
                    disabled_amount: false,
                    amount: '0.00',
                    amount_error: false,
                    amount_text_error: '',
                    amount_hide: 'hide',

                    discount_all: false,
                    disabled_discount_all: true,
                    arrayDescuentos: null,
                    arrayDescuentosError: '',
                    arrayDescuentosTextError: '',
                    arrayDescuentosHide: 'hide',

                    disabled_specify: true,
                    specify: '',
                    specify_error: false,
                    specify_text_error: '',
                    specify_hide: 'hide',

                    registerDiscount: false,
                });
            } else if (select === "rule" && value.value === 7) {
                this.setState({
                    disabled_amount: true,
                    amount: '0.00',
                    amount_error: false,
                    amount_text_error: '',
                    amount_hide: 'hide',

                    discount_all: false,
                    disabled_discount_all: true,
                    arrayDescuentos: null,
                    arrayDescuentosError: '',
                    arrayDescuentosTextError: '',
                    arrayDescuentosHide: 'hide',

                    registerDiscount: false,

                    disabled_specify: false,
                    specify: '',
                    specify_error: false,
                    specify_text_error: '',
                    specify_hide: 'hide',
                });
            } else if (select === "rule" && value.value === 0) {
                this.setState({
                    disabled_amount: true,
                    amount: '0.00',
                    amount_error: false,
                    amount_text_error: '',
                    amount_hide: 'hide',

                    discount_all: false,
                    disabled_discount_all: false,
                    arrayDescuentos: null,
                    arrayDescuentosError: '',
                    arrayDescuentosTextError: '',
                    arrayDescuentosHide: 'hide',

                    disabled_specify: true,
                    specify: '',
                    specify_error: false,
                    specify_text_error: '',
                    specify_hide: 'hide',

                    registerDiscount: false,
                });
            } else if (select === "rule" && (value.value !== 0 || value.value !== 1 || value.value !== 7)) {
                this.setState({
                    disabled_amount: true,
                    amount: '0.00',
                    amount_error: false,
                    amount_text_error: '',
                    amount_hide: 'hide',

                    discount_all: false,
                    disabled_discount_all: true,
                    arrayDescuentos: null,
                    arrayDescuentosError: '',
                    arrayDescuentosTextError: '',
                    arrayDescuentosHide: 'hide',

                    disabled_specify: true,
                    specify: '',
                    specify_error: false,
                    specify_text_error: '',
                    specify_hide: 'hide',

                    registerDiscount: false,
                });
            }
        }
    };

    handleChangeRegisterDiscount = name => event => {
        this.setState({
            [name]: event.target.checked,
            arrayDescuentos: null,
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
        if (name === "discount_all") {
            this.props.cleanStoreRewardsFunction();
            this.setState({
                registerDiscount: false,
                arrayDescuentos: null,
                arrayDescuentosError: '',
                arrayDescuentosTextError: '',
                arrayDescuentosHide: 'hide',
                disabled_discount: true,
            });
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

    cleanSelectPackage = () => {
        this.setState({
            arrayPackages: null,
            arrayPackagesError: '',
            arrayPackagesTextError: '',
            arrayPackagesHide: 'hide',
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

    validate = () => {
        let acum = "";
        let acumProducts = "";
        let acumServices = "";
        if (this.state.name === '') {
            this.setState({
                name_error: true,
                name_text_error: 'Ingrese el nombre',
                name_hide: 'show'
            });
            acum = 1;
        }
        if (!this.state.description) {
            this.setState({
                description_error: true,
                description_text_error: 'Ingrese la descripcion',
                description_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.description.length < 16) {
            this.setState({
                description_error: true,
                description_text_error: 'Descripcion debe tener al menos 15 caracteres',
                description_hide: 'show',
            });
            acum = 1;
        }
        if (!this.state.type_person) {
            this.setState({
                type_person_error: "borderColor",
                type_person_text_error: 'Seleccione el tipo de persona',
                type_person_hide: 'show',
            });
            acum = 1;
        }
        if (!this.state.rule) {
            this.setState({
                rule_error: "borderColor",
                rule_text_error: 'Seleccione el tipo de regla',
                rule_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 1 && this.state.amount === '0.00') {
            this.setState({
                amount_error: true,
                amount_text_error: 'Ingrese el monto',
                amount_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 7 && this.state.specify === '') {
            this.setState({
                specify_error: true,
                specify_text_error: 'Ingrese la especificacion',
                specify_hide: 'show',
            });
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 0 && this.props.rewards.arrayClasses.length === 0 &&
            this.props.rewards.arrayPlanes.length === 0 && this.props.rewards.arrayPackages.length === 0 &&
            this.props.rewards.products.length === 0 && this.props.rewards.services.length === 0) {
            NotificationManager.warning("Debe asignar el descuento a un item");
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 0 && this.props.rewards.products.length > 0) {
            this.props.rewards.products.map((data, i) => {
                if (data.discount === null) {
                    document.getElementById(`div_arrayDescuentos_${i}`).className = "borderColor";
                    acumProducts = 1;
                }
            });
        }
        if (this.state.rule && this.state.rule.value === 0 && this.props.rewards.services.length > 0) {
            this.props.rewards.services.map((data, i) => {
                if (data.discount === null) {
                    document.getElementById(`div_arrayDescuentos_${i}`).className = "borderColor";
                    acumServices = 1;
                }
            });
        }
        if (this.state.rule && this.state.rule.value === 5 && this.props.rewards.arrayClasses.length === 0) {
            NotificationManager.warning("Debe agregar la clase para la recompensa");
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 6 && this.props.rewards.arrayPlanes.length === 0) {
            NotificationManager.warning("Debe agregar el plan para la recompensa");
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 4 && this.props.rewards.arrayPackages.length === 0) {
            NotificationManager.warning("Debe agregar el paquete para la recompensa");
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 2 && this.props.rewards.products.length === 0) {
            NotificationManager.warning("Debe agregar el producto para la recompensa");
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 2 && this.props.rewards.products.length > 0) {
            this.props.rewards.products.map((data, i) => {
                if (data.quantity === "" || data.quantity === "0") {
                    document.getElementById(`div_quantity_${i}`).className = "borderColor";
                    acumProducts = 1;
                }
            });
        }
        if (this.state.rule && this.state.rule.value === 3 && this.props.rewards.services.length === 0) {
            NotificationManager.warning("Debe agregar el servicio para la recompensa");
            acum = 1;
        }
        if (this.state.rule && this.state.rule.value === 3 && this.props.rewards.services.length > 0) {
            this.props.rewards.services.map((data, i) => {
                if (data.quantity === "" || data.quantity === "0") {
                    document.getElementById(`div_quantity_${i}`).className = "borderColor";
                    acumServices = 1;
                }
            });
        }
        if (acumProducts > 0) {
            NotificationManager.warning("Campos requeridos en la seccion de productos");
            return false;
        }
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


    handleSaveReward = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let clases = [];
            let planes = [];
            let packages = [];
            let servicios = [];
            let productos = [];

            if (this.props.rewards.arrayClasses.length > 0) {
                this.props.rewards.arrayClasses.map((data, i) => {
                    clases.push({ _id: data._id, discount_id: data.discount_id, quantity: data.quantity });
                });
            }
            if (this.props.rewards.arrayPlanes.length > 0) {
                this.props.rewards.arrayPlanes.map((data, i) => {
                    planes.push({ _id: data._id, discount_id: data.discount_id, quantity: data.quantity });
                });
            }
            if (this.props.rewards.arrayPackages.length > 0) {
                this.props.rewards.arrayPackages.map((data, i) => {
                    packages.push({ _id: data._id, discount_id: data.discount_id, quantity: data.quantity });
                });
            }
            if (this.props.rewards.products.length > 0) {
                this.props.rewards.products.map((data, i) => {
                    productos.push(
                        {
                            _id: data.products_id,
                            discount_id: data.discount ? data.discount.value : null,
                            quantity: data.quantity
                        }
                    );
                });
            }
            if (this.props.rewards.services.length > 0) {
                this.props.rewards.services.map((data, i) => {
                    servicios.push(
                        {
                            _id: data.services_id,
                            discount_id: data.discount ? data.discount.value : null,
                            quantity: data.quantity
                        }
                    );
                });
            }

            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveRewardAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        type_person: this.state.type_person.value,
                        group_or_individual: this.state.group_or_individual,
                        rule: this.state.rule.value,
                        amount: formatMonto(this.state.amount),
                        specify: this.state.specify,
                        discount_all: this.state.discount_all,
                        discount_id: this.state.discount_all ? this.state.arrayDescuentos.value : null,
                        class: clases,
                        service: servicios,
                        package: packages,
                        plan: planes,
                        product: productos
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateRewardAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        type_person: this.state.type_person.value,
                        group_or_individual: this.state.group_or_individual,
                        rule: this.state.rule.value,
                        amount: formatMonto(this.state.amount),
                        specify: this.state.specify,
                        discount_all: this.state.discount_all,
                        discount_id: this.state.discount_all ? this.state.arrayDescuentos.value : null,
                        class: clases,
                        service: servicios,
                        package: packages,
                        plan: planes,
                        product: productos
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
                                                invalid={this.state.name_error}
                                                id="name"
                                                name="name"
                                                onKeyUp={event => this.handlekey(
                                                    "name_error",
                                                    "name_text_error",
                                                    "name_hide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.name}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.name_hide} errorControl`}>
                                                {this.state.name_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="description">Descripcion</Label>
                                            <Input
                                                invalid={this.state.description_error}
                                                id="description"
                                                name="description"
                                                onKeyUp={event => this.handlekey(
                                                    "description_error",
                                                    "description_text_error",
                                                    "description_hide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.description}
                                                type="textarea"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.description_hide} errorControl`}>
                                                {this.state.description_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className='row'>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="type_person">Tipo de Persona</Label>
                                            <div className={this.state.type_person_error}>
                                                <Select
                                                    isClearable
                                                    isSearchable
                                                    isDisabled={this.props.disabled}
                                                    name="type_person"
                                                    id="type_person"
                                                    value={this.state.type_person}
                                                    onChange={event => this.handleChangeSelect(
                                                        event,
                                                        "type_person",
                                                        "type_person_error",
                                                        "type_person_text_error",
                                                        "type_person_hide"
                                                    )}
                                                    options={this.state.type_person_options}
                                                />
                                            </div>
                                            <div className={`${this.state.type_person_hide} errorControl`}>
                                                {this.state.type_person_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup check className="top form-group col-sm-6">
                                        <Label for="group_or_individual">¿Pertenece a un grupo corporativo?</Label>
                                        <Switch
                                            checked={this.state.group_or_individual ? this.state.group_or_individual : false}
                                            onChange={this.handleChangeSwitch("group_or_individual")}
                                            value={this.state.group_or_individual}
                                            color="primary"
                                            disabled={
                                                this.props.option !== 2 ? this.state.disabledGroupIndividual : this.props.disabled
                                            }
                                        />
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className='row'>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="rule">Regla</Label>
                                            <div className={this.state.rule_error}>
                                                <Select
                                                    isClearable
                                                    isSearchable
                                                    isDisabled={this.props.disabled}
                                                    name="rule"
                                                    id="rule"
                                                    value={this.state.rule}
                                                    onChange={event => this.handleChangeSelect(
                                                        event,
                                                        "rule",
                                                        "rule_error",
                                                        "rule_text_error",
                                                        "rule_hide"
                                                    )}
                                                    options={this.state.rule_options}
                                                />
                                            </div>
                                            <div className={`${this.state.rule_hide} errorControl`}>
                                                {this.state.rule_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="amount">Monto</Label>
                                            <Input
                                                invalid={this.state.amount_error}
                                                id="amount"
                                                name="amount"
                                                onKeyUp={event => this.handlekeyMonto(
                                                    "amount",
                                                    "amount_error",
                                                    "amount_text_error",
                                                    "amount_hide"
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.amount}
                                                type="text"
                                                onBlur={this.eventoBlur("amount")}
                                                onFocus={this.eventoFocus("amount")}
                                                disabled={this.props.option !== 2 ? this.state.disabled_amount : this.props.disabled}
                                            />
                                            <div className={`${this.state.amount_hide} errorControl`}>
                                                {this.state.amount_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="specify">Especifique</Label>
                                            <Input
                                                invalid={this.state.specify_error}
                                                id="specify"
                                                name="specify"
                                                onKeyUp={event => this.handlekey(
                                                    "specify_error",
                                                    "specify_text_error",
                                                    "specify_hide",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.specify}
                                                type="textarea"
                                                disabled={this.props.option !== 2 ? this.state.disabled_specify : this.props.disabled}
                                            />
                                            <div className={`${this.state.specify_hide} errorControl`}>
                                                {this.state.specify_text_error}
                                            </div>
                                        </div>
                                    </FormGroup>
                                </div>
                                <hr />
                                <div className="row">
                                    <FormGroup check className="top form-group col-sm-6">
                                        <Label for="discount_all">¿Descuento General?</Label>
                                        <Switch
                                            checked={this.state.discount_all ? this.state.discount_all : false}
                                            onChange={this.handleChangeSwitch("discount_all")}
                                            value={this.state.discount_all}
                                            color="primary"
                                            disabled={this.props.option !== 2 ? this.state.disabled_discount_all : this.props.disabled}
                                        />
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="arrayDescuentos">Descuentos</Label>
                                            <div className={this.state.arrayDescuentosError}>
                                                <Select
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    isDisabled={this.props.option !== 2 ? !this.state.discount_all : this.props.disabled}
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
                                            disabled={this.props.option !== 2 ? this.state.disabled_discount_all : this.props.disabled}
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
                                {
                                    this.state.rule && (this.state.rule.value === 0 || this.state.rule.value === 5) && (
                                        <div>
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
                                                                    (this.state.rule.value === 0 && this.state.discount_all &&
                                                                        !this.state.arrayDescuentos) && (
                                                                        <Alert color="secondary">
                                                                            ¡Debe seleccionar un descuento general!
                                                                        </Alert>
                                                                    )
                                                                }
                                                                {
                                                                    (this.state.rule.value === 0 || this.state.rule.value === 5) && (
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
                                                                                            options={this.props.rewards.dataClass}
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
                                                                                        <ClassesRewards
                                                                                            data={this.state.arrayClass.info}
                                                                                            confirm={this.props.confirm}
                                                                                            addClassFunction={this.props.addClassFunction}
                                                                                            arrayAll={this.props.rewards.arrayClasses}
                                                                                            cleanSelectClass={this.cleanSelectClass}
                                                                                            disabled={this.props.disabled}
                                                                                            rule={this.state.rule.value}
                                                                                            discountGeneral={this.state.discount_all}
                                                                                            discountValue={this.state.arrayDescuentos}
                                                                                            dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                                        />
                                                                                    </FormGroup>
                                                                                )
                                                                            }
                                                                            {
                                                                                (this.state.rule &&
                                                                                    this.props.rewards.arrayClasses.length > 0) && (
                                                                                    <FormGroup className="top form-group col-sm-12">
                                                                                        <ClassesRewardsAdd
                                                                                            confirm={this.props.confirm}
                                                                                            arrayAdd={this.props.rewards.arrayClasses}
                                                                                            deleteClassFunction={this.props.deleteClassFunction}
                                                                                            disabled={this.props.disabled}
                                                                                            discountGeneral={this.state.discount_all}
                                                                                            rule={this.state.rule.value}
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
                                        </div>
                                    )
                                }
                                {
                                    this.state.rule && (this.state.rule.value === 0 || this.state.rule.value === 6) && (
                                        <div>
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
                                                                    (this.state.rule.value === 0 && this.state.discount_all &&
                                                                        !this.state.arrayDescuentos) && (
                                                                        <Alert color="secondary">
                                                                            ¡Debe seleccionar un descuento general!
                                                                        </Alert>
                                                                    )
                                                                }
                                                                {
                                                                    (this.state.rule.value === 0 || this.state.rule.value === 6) && (
                                                                        <div className='row'>
                                                                            <FormGroup className="top form-group col-sm-6">
                                                                                <div>
                                                                                    <Label for="arrayPlanes">Planes</Label>
                                                                                    <div className={this.state.arrayPlanesError}>
                                                                                        <Select
                                                                                            isClearable
                                                                                            isSearchable
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
                                                                                            options={this.props.rewards.dataPlan}
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
                                                                                        <PlansRewards
                                                                                            data={this.state.arrayPlanes.info}
                                                                                            confirm={this.props.confirm}
                                                                                            addPlanFunction={this.props.addPlanFunction}
                                                                                            arrayAll={this.props.rewards.arrayPlanes}
                                                                                            cleanSelectPlan={this.cleanSelectPlan}
                                                                                            disabled={this.props.disabled}
                                                                                            rule={this.state.rule.value}
                                                                                            discountGeneral={this.state.discount_all}
                                                                                            discountValue={this.state.arrayDescuentos}
                                                                                            dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                                        />
                                                                                    </FormGroup>
                                                                                )
                                                                            }
                                                                            {
                                                                                (this.state.rule &&
                                                                                    this.props.rewards.arrayPlanes.length > 0) && (
                                                                                    <FormGroup className="top form-group col-sm-12">
                                                                                        <PlansRewardsAdd
                                                                                            confirm={this.props.confirm}
                                                                                            arrayAdd={this.props.rewards.arrayPlanes}
                                                                                            deletePlanFunction={this.props.deletePlanFunction}
                                                                                            disabled={this.props.disabled}
                                                                                            discountGeneral={this.state.discount_all}
                                                                                            rule={this.state.rule.value}
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
                                        </div>
                                    )
                                }
                                {
                                    this.state.rule && (this.state.rule.value === 0 || this.state.rule.value === 4) && (
                                        <div>
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
                                                                {
                                                                    (this.state.rule.value === 0 && this.state.discount_all &&
                                                                        !this.state.arrayDescuentos) && (
                                                                        <Alert color="secondary">
                                                                            ¡Debe seleccionar un descuento general!
                                                                        </Alert>
                                                                    )
                                                                }
                                                                {
                                                                    (this.state.rule.value === 0 || this.state.rule.value === 4) && (
                                                                        <div className='row'>
                                                                            <FormGroup className="top form-group col-sm-6">
                                                                                <div>
                                                                                    <Label for="arrayPackages">Paquetes</Label>
                                                                                    <div className={this.state.arrayPackagesError}>
                                                                                        <Select
                                                                                            isClearable
                                                                                            isSearchable
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
                                                                                            options={this.props.rewards.dataPackages}
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
                                                                                        <PackagesRewards
                                                                                            data={this.state.arrayPackages.info}
                                                                                            confirm={this.props.confirm}
                                                                                            addPackageFunction={this.props.addPackageFunction}
                                                                                            arrayAll={this.props.rewards.arrayPackages}
                                                                                            cleanSelectPackage={this.cleanSelectPackage}
                                                                                            disabled={this.props.disabled}
                                                                                            rule={this.state.rule.value}
                                                                                            discountGeneral={this.state.discount_all}
                                                                                            discountValue={this.state.arrayDescuentos}
                                                                                            dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                                        />
                                                                                    </FormGroup>
                                                                                )
                                                                            }
                                                                            {
                                                                                (this.state.rule &&
                                                                                    this.props.rewards.arrayPackages.length > 0) && (
                                                                                    <FormGroup className="top form-group col-sm-12">
                                                                                        <PackagesRewardsAdd
                                                                                            confirm={this.props.confirm}
                                                                                            arrayAdd={this.props.rewards.arrayPackages}
                                                                                            deletePackageFunction={this.props.deletePackageFunction}
                                                                                            disabled={this.props.disabled}
                                                                                            discountGeneral={this.state.discount_all}
                                                                                            rule={this.state.rule.value}
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
                                        </div>
                                    )
                                }
                                {
                                    this.state.rule && (this.state.rule.value === 0 || this.state.rule.value === 2) && (
                                        <div>
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
                                                                    (this.state.rule.value === 0 && this.state.discount_all &&
                                                                        !this.state.arrayDescuentos) && (
                                                                        <Alert color="secondary">
                                                                            ¡Debe seleccionar un descuento general!
                                                                        </Alert>
                                                                    )
                                                                }
                                                                {
                                                                    (this.state.rule.value === 0 || this.state.rule.value === 2) && (
                                                                        <Products
                                                                            dataAll={this.props.dataAllProducts}
                                                                            search={this.props.searchProducts}
                                                                            searchId={this.props.searchProductId}
                                                                            dataSelect={this.props.rewards.products}
                                                                            deleteProductoIdFunction={this.props.deleteProductoIdFunction}
                                                                            confirm={this.props.confirm}
                                                                            tableProductsTextError={this.state.tableProductsTextError}
                                                                            disabled={this.props.disabled}
                                                                            discountGeneral={this.state.discount_all}
                                                                            discountValue={this.state.arrayDescuentos}
                                                                            dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                            addDiscountSelectProduct={this.props.addDiscountSelectProduct}
                                                                            cleanTextErrorProducts={this.cleanTextErrorProducts}
                                                                            rule={this.state.rule.value}
                                                                            setDataProductsQuantityRewardAction={this.props.setDataProductsQuantityRewardAction}
                                                                        />
                                                                    )
                                                                }
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </FormGroup>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    this.state.rule && (this.state.rule.value === 0 || this.state.rule.value === 3) && (
                                        <div>
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
                                                                    (this.state.rule.value === 0 && this.state.discount_all &&
                                                                        !this.state.arrayDescuentos) && (
                                                                        <Alert color="secondary">
                                                                            ¡Debe seleccionar un descuento general!
                                                                        </Alert>
                                                                    )
                                                                }
                                                                {
                                                                    (this.state.rule.value === 0 || this.state.rule.value === 3) && (
                                                                        <Services
                                                                            dataAll={this.props.dataAllServices}
                                                                            search={this.props.searchServices}
                                                                            searchId={this.props.searchServiceId}
                                                                            dataSelect={this.props.rewards.services}
                                                                            deleteServiceIdFunction={this.props.deleteServiceIdFunction}
                                                                            confirm={this.props.confirm}
                                                                            tableServicesTextError={this.state.tableServicesTextError}
                                                                            disabled={this.props.disabled}
                                                                            discountGeneral={this.state.discount_all}
                                                                            discountValue={this.state.arrayDescuentos}
                                                                            dataDiscount={this.props.dataGeneral.dataDiscount}
                                                                            addDiscountSelectService={this.props.addDiscountSelectService}
                                                                            cleanTextErrorServices={this.cleanTextErrorServices}
                                                                            rule={this.state.rule.value}
                                                                            setDataServicesQuantityRewardAction={this.props.setDataServicesQuantityRewardAction}
                                                                        />
                                                                    )
                                                                }
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
                                    onClick={this.handleSaveReward}
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
    rewards: state.rewards.toJS(),
    dataAllProducts: state.rewards.get('dataAllProducts'),
    dataAllServices: state.rewards.get('dataAllServices'),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveRewardAction: (data, callback) => dispatch(saveRewardAction(data, callback)),
    updateRewardAction: (data, callback) => dispatch(updateRewardAction(data, callback)),
    addDiscountSelectRewards: (data) => dispatch(addDiscountSelectRewards(data)),
    addClassFunction: (data, dataAll, dataDiscount, option) => dispatch(addClassFunction(data, dataAll, dataDiscount, option)),
    deleteClassFunction: (id) => dispatch(deleteClassFunction(id)),
    addPlanFunction: (data, dataAll, dataDiscount, option) => dispatch(addPlanFunction(data, dataAll, dataDiscount, option)),
    deletePlanFunction: (id) => dispatch(deletePlanFunction(id)),
    addPackageFunction: (data, dataAll, dataDiscount, option) => dispatch(addPackageFunction(data, dataAll, dataDiscount, option)),
    deletePackageFunction: (id) => dispatch(deletePackageFunction(id)),
    searchProducts: (data) => dispatch(searchProducts(data)),
    searchProductId: (data, dataAll) => dispatch(searchProductId(data, dataAll)),
    deleteProductoIdFunction: (key) => dispatch(deleteProductoIdFunction(key)),
    addDiscountSelectProduct: (data, id) => dispatch(addDiscountSelectProduct(data, id)),
    setDataProductsQuantityRewardAction: (id, value) => dispatch(setDataProductsQuantityRewardAction(id, value)),
    searchServices: (data) => dispatch(searchServices(data)),
    searchServiceId: (data, dataAll) => dispatch(searchServiceId(data, dataAll)),
    deleteServiceIdFunction: (key) => dispatch(deleteServiceIdFunction(key)),
    addDiscountSelectService: (data, id) => dispatch(addDiscountSelectService(data, id)),
    setDataServicesQuantityRewardAction: (id, value) => dispatch(setDataServicesQuantityRewardAction(id, value)),
    cleanStoreRewardsFunction: () => dispatch(cleanStoreRewardsFunction()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);