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
import "../../../assets/css/geo.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'react-tagsinput/react-tagsinput.css';
import {
    saveClassAction,
    updateClassAction,
    addPenaltyFunction,
    deletePenaltyFunction,
    addScreenFunction,
    deleteScreenFunction,
}
    from "../../../actions/LessonsActions"
import { loadScheduleSelectFunction } from "../../../actions/aplicantionActions";
import { saveScheduleAction } from "../../../actions/ScheduleActions";
import { connect } from "react-redux";
import { stateInitial } from './stateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import Penalizaciones from "../../../components/Penalizaciones";
import PenalizacionesAdd from "../../../components/PenalizacionesAdd";
import Screens from "../../../components/Screens";
import ScreensAdd from "../../../components/ScreensAdd";
import { number_format, formatMonto } from "../../../helpers/helpers";
import ScheduleComponent from "../../../components/IS7Schedule";
import Descuento from "../area/Descuento";
import AddDiscounts from "../discounts/AddDiscounts";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';

class ModalLessons extends React.Component {
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
            if (props.lessons.classId && this.state.actionReducer === 0) {
                this.cargarData(props.lessons.classId);
            }
        }
        if (props.dataGeneral.newSchedule) {
            this.setState({
                arraySchedule: Object.keys(props.dataGeneral.newSchedule).length > 0 ? props.dataGeneral.newSchedule : null
            });
        }
        if (props.dataGeneral.newDiscount) {
            this.setState({
                arrayDescuentos: Object.keys(props.dataGeneral.newDiscount).length > 0 ? props.dataGeneral.newDiscount : null
            });
        }
    }

    cargarData(data) {
        let cycle = {};
        data.cycle ? cycle = { label: 'Mensual', value: true } : cycle = { label: 'Diario', value: false }

        this.setState({
            name: data.name,
            description: data.description,
            amount: number_format(data.amount, 2),
            arrayImpuesto: data.tax,
            corporateGroup: data.corporate_group,
            quotas: data.quotas,
            acumulativeClass: data.cumulative_class,
            giftedClass: data.gifted_class,
            arrayExpirationCycle: cycle,
            expirationTime: data.expiration_time,
            multipleAssistance: data.multiple_assistance,
            numberClass: data.number_class,
            nameIcono: data.name_icon,
            icono: data.icon,
            reserve: data.reserve,
            reserveWeb: data.type_reserve.web,
            reserveApp: data.type_reserve.movil,
            reserveSede: data.type_reserve.branch,
            inscription: data.inscription,
            amountInscription: number_format(data.amount_inscription, 2),
            partialPayments: data.partial_payment,
            dayPartialPayments: data.number_days,
            arraySchedule: data.schedule,
            selectionsSchedule: data.schedule.info.items,
            loading: 'hide',
            actionReducer: 1,
            collapsePenalizaciones: data.penalties.length > 0 ? true : false,
            collapseMonitores: data.screens.length > 0 ? true : false,
            collapseDescuento: data.discount ? true : false,
            horario: true,
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
        if (name === "reserve") {
            this.setState({
                reserveWeb: false,
                reserveApp: false,
                reserveSede: false,
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

    cleanSelectPenalty = () => {
        this.setState({
            arrayPenalty: null,
            arrayPenaltyError: '',
            arrayPenaltyTextError: '',
            arrayPenaltyHide: 'hide',
        });
    }

    cleanSelectScreen = () => {
        this.setState({
            arrayScreens: null,
            arrayScreensError: '',
            arrayScreensTextError: '',
            arrayScreensHide: 'hide',
        });
    }

    fileHandlerIcono = (data) => {
        if ((data.size) / 1024 > 2048) {
            this.setState({
                iconoError: 'borderColor',
                iconoTextError: 'Tamaño de la imagen no permitido',
                iconoHide: 'show'
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
                    icono: reader.result
                });
            };
            this.setState({
                iconoError: '',
                iconoTextError: '',
                iconoHide: 'hide'
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
        if (!this.state.arrayExpirationCycle) {
            this.setState({
                arrayExpirationCycleError: "borderColor",
                arrayExpirationCycleTextError: 'Seleccione el ciclo de expiracion',
                arrayExpirationCycleHide: 'show',
            });
            acum = 1;
        }
        if (this.state.expirationTime === '' || this.state.expirationTime === '0') {
            this.setState({
                expirationTimeError: true,
                expirationTimeTextError: 'Ingrese el tiempo de expiracion del ciclo',
                expirationTimeHide: 'show',
            });
            acum = 1;
        }
        if (this.state.quotas === '' || this.state.quotas === '0') {
            this.setState({
                quotasError: true,
                quotasTextError: 'Ingrese el numero de alumnos permitidos',
                quotasHide: 'show',
            });
            acum = 1;
        }
        if (this.state.acumulativeClass === '') {
            this.setState({
                acumulativeClassError: true,
                acumulativeClassTextError: 'Ingrese el numero de clases maximas acumuladas',
                acumulativeClassHide: 'show',
            });
            acum = 1;
        }
        if (this.state.giftedClass === '') {
            this.setState({
                giftedClassError: true,
                giftedClassTextError: 'Ingrese el numero de clases a regalar',
                giftedClassHide: 'show',
            });
            acum = 1;
        }
        if (this.state.numberClass === '' || this.state.numberClass === '0') {
            this.setState({
                numberClassError: true,
                numberClassTextError: 'Ingrese el numero de clases a dictar',
                numberClassHide: 'show',
            });
            acum = 1;
        }
        if (!this.state.nameIcono) {
            this.setState({
                nameIconoError: true,
                nameIconoTextError: 'Ingrese el nombre del icono',
                nameIconoHide: 'show',
            });
            acum = 1;
        }
        if (!this.state.icono) {
            this.setState({
                iconoError: 'borderColor',
                iconoTextError: 'Seleccione un icono',
                iconoHide: 'show',
            });
            acum = 1;
        }
        if (this.state.reserve && (!this.state.reserveWeb && !this.state.reserveApp && !this.state.reserveSede)) {
            this.setState({
                optionsReserveError: 'borderColor',
                optionsReserveTextError: 'Seleccione al menos una opcion de reserva',
                optionsReserveHide: 'show',
            });
            acum = 1;
        }
        if (this.state.inscription && ((this.state.amountInscription === '0.00') || (this.state.amountInscription === '0.0'))) {
            this.setState({
                amountInscriptionError: true,
                amountInscriptionTextError: 'Ingrese el monto de la inscripcion',
                amountInscriptionHide: 'show',
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
        if (!this.state.arraySchedule) {
            this.setState({
                horario: true,
                scheduleTextError: "¡Debe seleccionar un horario!",
            });
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    }

    handleSaveClass = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let penalizaciones = [];
            let screens = [];
            if (this.props.lessons.arrayPenalty.length > 0) {
                this.props.lessons.arrayPenalty.map((data, i) => {
                    penalizaciones.push(data._id);
                });
            }
            if (this.props.lessons.arrayScreens.length > 0) {
                this.props.lessons.arrayScreens.map((data, i) => {
                    screens.push(data._id);
                });
            }
            let type_reserve = {
                web: this.state.reserveWeb,
                movil: this.state.reserveApp,
                branch: this.state.reserveSede
            };

            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveClassAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        reserve: this.state.reserve,
                        type_reserve: type_reserve,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        schedule_id: this.state.arraySchedule.value,
                        discount_id: this.state.arrayDescuentos ? this.state.arrayDescuentos.value : null,
                        screens: screens,
                        penalty: this.props.lessons.arrayPenalty.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        quotas: this.state.quotas,
                        cumulative_class: this.state.acumulativeClass,
                        gifted_class: this.state.giftedClass,
                        icon: this.state.icono,
                        name_icon: this.state.nameIcono,
                        expiration_cycle: this.state.arrayExpirationCycle.value,
                        expiration_time: this.state.expirationTime,
                        inscription: this.state.inscription,
                        amount_inscription: formatMonto(this.state.amountInscription),
                        corporate_group: this.state.corporateGroup,
                        multiple_assistance: this.state.multipleAssistance,
                        number_class: this.state.numberClass,
                        partial_payment: this.state.partialPayments,
                        number_days: this.state.dayPartialPayments
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateClassAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        reserve: this.state.reserve,
                        type_reserve: type_reserve,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        schedule_id: this.state.arraySchedule.value,
                        discount_id: this.state.arrayDescuentos ? this.state.arrayDescuentos.value : null,
                        screens: screens,
                        penalty: this.props.lessons.arrayPenalty.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        quotas: this.state.quotas,
                        cumulative_class: this.state.acumulativeClass,
                        gifted_class: this.state.giftedClass,
                        icon: this.state.icono,
                        name_icon: this.state.nameIcono,
                        expiration_cycle: this.state.arrayExpirationCycle.value,
                        expiration_time: this.state.expirationTime,
                        inscription: this.state.inscription,
                        amount_inscription: formatMonto(this.state.amountInscription),
                        corporate_group: this.state.corporateGroup,
                        multiple_assistance: this.state.multipleAssistance,
                        number_class: this.state.numberClass,
                        partial_payment: this.state.partialPayments,
                        number_days: this.state.dayPartialPayments
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
        }
    }

    handleChangeSelectSchedule = arraySchedule => {
        if (arraySchedule) {
            this.props.loadScheduleSelectFunction(arraySchedule);
            this.setState({
                arraySchedule: arraySchedule,
                selectionsSchedule: arraySchedule.info.items,
                arrayScheduleError: "",
                arrayScheduleTextError: "",
                arrayScheduleHide: "hide",
                scheduleTextError: '',
            });
        } else {
            this.setState({
                arraySchedule: null,
                selectionsSchedule: [],
            });
        }
    };

    handleChangeRegisterSchedule = name => event => {
        this.setState({
            [name]: event.target.checked,
            arraySchedule: null,
            nameSchedule: '',
            nameScheduleError: false,
            nameScheduleTextError: '',
            nameScheduleHide: 'hide',
            selectionsSchedule: [],
        });
    };

    handleChangeSchedule = (items, item) => {
        this.setState({
            selectionsSchedule: items,
            scheduleTextError: ''
        });
    }

    validateSchedule = () => {
        let acum = "";
        if (this.state.nameSchedule === '') {
            this.setState({
                nameScheduleError: true,
                nameScheduleTextError: 'Ingrese el nombre del horario',
                nameScheduleHide: 'show'
            });
            acum = 1;
        }
        if (this.state.selectionsSchedule === null || this.state.selectionsSchedule.length === 0) {
            this.setState({
                scheduleTextError: "¡Debe seleccionar un horario!",
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    };

    handleSaveSchedule = event => {
        event.preventDefault();
        const isValid = this.validateSchedule();
        if (isValid) {
            this.props.saveScheduleAction(
                {
                    name: this.state.nameSchedule,
                    items: this.state.selectionsSchedule,
                },
                () => {
                    this.setState({
                        nameSchedule: '',
                        registerSchedule: false,
                    });
                }
            );
        }
    }

    cleanSchedule() {
        this.setState({
            nameSchedule: '',
            arraySchedule: null,
            selectionsSchedule: [],
            registerSchedule: false,
        });
    }

    handleChangeDescuentos = arrayDescuentos => {
        this.setState({
            arrayDescuentos: arrayDescuentos,
            arrayDescuentosError: "",
            arrayDescuentosTextError: "",
            arrayDescuentosHide: "hide"
        });
    };

    handleChangeRegisterDiscount = name => event => {
        this.setState({
            [name]: event.target.checked,
            arrayDescuentos: null,
        });
    };

    cleanNewDiscount = () => {
        this.setState({
            registerDiscount: false,
        });
    }

    render() {
        // console.log(this.state.lat)
        // console.log(this.state.lng)
        // console.log(this.state.initialLocation)
        //console.log(this.props.sucursal)    
        //console.log("selectionsSchedule ", this.state.selectionsSchedule)
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
                    this.state.loading === "hide" ? (
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
                                                        options={this.props.countryConfiguration.tax.filter(
                                                            option => option.default === true
                                                        )}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayImpuestoHide} errorControl`}>
                                                    {this.state.arrayImpuestoTextError}
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
                                                <Label for="quotas">Numero Maximo de Alumnos Permitidos</Label>
                                                <Input
                                                    invalid={this.state.quotasError}
                                                    id="quotas"
                                                    name="quotas"
                                                    onKeyUp={event => this.handlekey(
                                                        "quotasError",
                                                        "quotasTextError",
                                                        "quotasHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.quotas}
                                                    type="number"
                                                    min="0"
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.quotasHide} errorControl`}>
                                                    {this.state.quotasTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="name">Clases Maximas Acumuladas por Cliente</Label>
                                                <Input
                                                    invalid={this.state.acumulativeClassError}
                                                    id="acumulativeClass"
                                                    name="acumulativeClass"
                                                    onKeyUp={event => this.handlekey(
                                                        "acumulativeClassError",
                                                        "acumulativeClassTextError",
                                                        "acumulativeClassHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.acumulativeClass}
                                                    type="number"
                                                    min="0"
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.acumulativeClassHide} errorControl`}>
                                                    {this.state.acumulativeClassTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="giftedClass">Numero de Clases a Regalar</Label>
                                                <Input
                                                    invalid={this.state.giftedClassError}
                                                    id="giftedClass"
                                                    name="giftedClass"
                                                    onKeyUp={event => this.handlekey(
                                                        "giftedClassError",
                                                        "giftedClassTextError",
                                                        "giftedClassHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.giftedClass}
                                                    type="number"
                                                    min="0"
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.giftedClassHide} errorControl`}>
                                                    {this.state.giftedClassTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="arrayExpirationCycle">Ciclo de Expiracion</Label>
                                                <div className={this.state.arrayExpirationCycleError}>
                                                    <Select
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={this.props.disabled}
                                                        name="arrayExpirationCycle"
                                                        id="arrayExpirationCycle"
                                                        value={this.state.arrayExpirationCycle}
                                                        onChange={event => this.handleChangeSelect(
                                                            event,
                                                            "arrayExpirationCycle",
                                                            "arrayExpirationCycleError",
                                                            "arrayExpirationCycleTextError",
                                                            "arrayExpirationCycleHide"
                                                        )}
                                                        options={this.state.arrayCycleOptions}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayExpirationCycleHide} errorControl`}>
                                                    {this.state.arrayExpirationCycleTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="expirationTime">Tiempo de Expiracion</Label>
                                                <Input
                                                    invalid={this.state.expirationTimeError}
                                                    id="expirationTime"
                                                    name="expirationTime"
                                                    onKeyUp={event => this.handlekey(
                                                        "expirationTimeError",
                                                        "expirationTimeTextError",
                                                        "expirationTimeHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.expirationTime}
                                                    type="number"
                                                    min="0"
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.expirationTimeHide} errorControl`}>
                                                    {this.state.expirationTimeTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="gerente">¿Multiple Asistencia?</Label>
                                            <Switch
                                                checked={this.state.multipleAssistance ? this.state.multipleAssistance : false}
                                                onChange={this.handleChangeSwitch("multipleAssistance")}
                                                value={this.state.multipleAssistance}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="numberClass">Cantidad de Clases a Dictar</Label>
                                                <Input
                                                    invalid={this.state.numberClassError}
                                                    id="numberClass"
                                                    name="numberClass"
                                                    onKeyUp={event => this.handlekey(
                                                        "numberClassError",
                                                        "numberClassTextError",
                                                        "numberClassHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.numberClass}
                                                    type="number"
                                                    min="0"
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.numberClassHide} errorControl`}>
                                                    {this.state.numberClassTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="nameIcono">Nombre del Icono</Label>
                                                <Input
                                                    invalid={this.state.nameIconoError}
                                                    id="nameIcono"
                                                    name="nameIcono"
                                                    onKeyUp={event => this.handlekey(
                                                        "nameIconoError",
                                                        "nameIconoTextError",
                                                        "nameIconoHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.nameIcono}
                                                    type="text"
                                                    disabled={this.props.disabled}
                                                />
                                                <div className={`${this.state.nameIconoHide} errorControl`}>
                                                    {this.state.nameIconoTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="central">Icono</Label>
                                                <div style={{ height: '39px' }} className={this.state.iconoError}>
                                                    <Label
                                                        color="primary"
                                                        className="btn"
                                                        variant="contained"
                                                        style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                    >
                                                        <span style={{ fontWeight: '500' }}>Cargar Icono</span>
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
                                                <div className={`${this.state.iconoHide} errorControl`}>
                                                    {this.state.iconoTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <Label for="central">
                                                <div>
                                                    {this.state.icono && (
                                                        <img
                                                            style={{ width: 300, height: 180 }}
                                                            className="image"
                                                            src={this.state.icono}
                                                        />
                                                    )}
                                                </div>
                                            </Label>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="gerente">¿Reservable?</Label>
                                            <Switch
                                                checked={this.state.reserve ? this.state.reserve : false}
                                                onChange={this.handleChangeSwitch(
                                                    "reserve",
                                                    "optionsReserveError",
                                                    "optionsReserveTextError",
                                                    "optionsReserveHide",
                                                    2,
                                                )}
                                                value={this.state.reserve}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <Label for="reservable">Opciones</Label>
                                            <div style={{ display: 'flex', width: '100%' }}
                                                className={this.state.optionsReserveError}
                                            >
                                                <div>
                                                    <Switch
                                                        checked={this.state.reserveWeb ? this.state.reserveWeb : false}
                                                        onChange={this.handleChangeSwitch(
                                                            "reserveWeb",
                                                            "optionsReserveError",
                                                            "optionsReserveTextError",
                                                            "optionsReserveHide",
                                                            2,
                                                        )}
                                                        value={this.state.reserveWeb}
                                                        color="primary"
                                                        disabled={
                                                            this.props.option === 2 ? this.props.disabled
                                                                : !this.state.reserve
                                                        }
                                                    />
                                                    <Label>Web</Label>
                                                </div>
                                                <div>
                                                    <Switch
                                                        checked={this.state.reserveApp ? this.state.reserveApp : false}
                                                        onChange={this.handleChangeSwitch(
                                                            "reserveApp",
                                                            "optionsReserveError",
                                                            "optionsReserveTextError",
                                                            "optionsReserveHide",
                                                            2,
                                                        )}
                                                        value={this.state.reserveApp}
                                                        color="primary"
                                                        disabled={
                                                            this.props.option === 2 ? this.props.disabled
                                                                : !this.state.reserve
                                                        }
                                                    />
                                                    <Label>App</Label>
                                                </div>
                                                <div>
                                                    <Switch
                                                        checked={this.state.reserveSede ? this.state.reserveSede : false}
                                                        onChange={this.handleChangeSwitch(
                                                            "reserveSede",
                                                            "optionsReserveError",
                                                            "optionsReserveTextError",
                                                            "optionsReserveHide",
                                                            2,
                                                        )}
                                                        value={this.state.reserveSede}
                                                        color="primary"
                                                        disabled={
                                                            this.props.option === 2 ? this.props.disabled
                                                                : !this.state.reserve
                                                        }
                                                    />
                                                    <Label>Sede</Label>
                                                </div>
                                            </div>
                                            <div className={`${this.state.optionsReserveHide} errorControl`}>
                                                {this.state.optionsReserveTextError}
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="inscription">¿Requiere monto para la inscripcion?</Label>
                                            <Switch
                                                checked={this.state.inscription ? this.state.inscription : false}
                                                onChange={this.handleChangeSwitch(
                                                    "inscription",
                                                    "amountInscriptionError",
                                                    "amountInscriptionTextError",
                                                    "amountInscriptionHide",
                                                    1
                                                )}
                                                value={this.state.inscription}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="amountInscription">Monto de la Inscripcion</Label>
                                                <Input
                                                    invalid={this.state.amountInscriptionError}
                                                    id="amountInscription"
                                                    name="amountInscription"
                                                    onKeyUp={event => this.handlekeyMonto(
                                                        "amountInscription",
                                                        "amountInscriptionError",
                                                        "amountInscriptionTextError",
                                                        "amountInscriptionHide"
                                                    )}
                                                    onChange={this.handleChange}
                                                    value={this.state.amountInscription}
                                                    onBlur={this.eventoBlur("amountInscription")}
                                                    onFocus={this.eventoFocus("amountInscription")}
                                                    disabled={this.props.option === 2 ? this.props.disabled
                                                        : !this.state.inscription}
                                                />
                                                <div className={`${this.state.amountInscriptionHide} errorControl`}>
                                                    {this.state.amountInscriptionTextError}
                                                </div>
                                            </div>
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
                                                                            options={this.props.dataPenalties}
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
                                                                            arrayPenalty={this.props.lessons.arrayPenalty}
                                                                            deletePenaltyFunction={this.props.deletePenaltyFunction}
                                                                            cleanSelectPenalty={this.cleanSelectPenalty}
                                                                            disabled={this.props.disabled}
                                                                        />
                                                                    </FormGroup>
                                                                )
                                                            }
                                                            {
                                                                this.props.lessons.arrayPenalty.length > 0 && (
                                                                    <FormGroup className="top form-group col-sm-12">
                                                                        <PenalizacionesAdd
                                                                            confirm={this.props.confirm}
                                                                            arrayPenalty={this.props.lessons.arrayPenalty}
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
                                                        horario: !this.state.horario
                                                    })
                                                }
                                                disabled={this.props.disabled}
                                            >
                                                Horario
                                        </Button>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-12">
                                            <Collapse isOpen={this.state.horario}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="row">
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <div>
                                                                    <Label for="arraySchedule">Horarios</Label>
                                                                    <div className={this.state.arrayScheduleError}>
                                                                        <Select
                                                                            isSearchable
                                                                            isClearable
                                                                            isDisabled={this.props.option !== 2 ?
                                                                                this.state.registerSchedule :
                                                                                this.props.disabled
                                                                            }
                                                                            name="arraySchedule"
                                                                            id="arraySchedule"
                                                                            value={this.state.arraySchedule}
                                                                            onChange={this.handleChangeSelectSchedule}
                                                                            options={this.props.dataGeneral.dataSchedule}
                                                                        />
                                                                    </div>
                                                                    <div className={`${this.state.arrayScheduleHide} errorControl`}>
                                                                        {this.state.arrayScheduleTextError}
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <Label for="registerSchedule">¿Nuevo Horario?</Label>
                                                                <Switch
                                                                    checked={
                                                                        this.state.registerSchedule ?
                                                                            this.state.registerSchedule : false
                                                                    }
                                                                    onChange={this.handleChangeRegisterSchedule("registerSchedule")}
                                                                    value={this.state.registerSchedule}
                                                                    color="primary"
                                                                    disabled={this.props.disabled}
                                                                />
                                                            </FormGroup>
                                                            {
                                                                this.state.registerSchedule && (
                                                                    <FormGroup className="top form-group col-sm-6">
                                                                        <div>
                                                                            <Label for="icono">Nombre del Horario</Label>
                                                                            <Input
                                                                                invalid={this.state.nameScheduleError}
                                                                                id="nameSchedule"
                                                                                name="nameSchedule"
                                                                                onKeyUp={event => this.handlekey(
                                                                                    "nameScheduleError",
                                                                                    "nameScheduleTextError",
                                                                                    "nameScheduleHide"
                                                                                )}
                                                                                onChange={this.handleChange}
                                                                                value={this.state.nameSchedule}
                                                                                type="text"
                                                                                disabled={this.props.disabled}
                                                                            />
                                                                            <div className={`${this.state.nameScheduleHide} errorControl`}>
                                                                                {this.state.nameScheduleTextError}
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="row">
                                                            <FormGroup className="top form-group col-sm-12">
                                                                <div style={{ width: '100%' }} className={`errorControl`}>
                                                                    {this.state.scheduleTextError}
                                                                </div>
                                                                <ScheduleComponent
                                                                    selections={this.state.selectionsSchedule}
                                                                    intervalsMinute={this.state.intervalsMinute}
                                                                    hoursStart={this.state.hoursStart}
                                                                    hoursEnd={this.state.hoursEnd}
                                                                    handleChange={this.handleChangeSchedule}
                                                                    disabled={!this.state.registerSchedule ? true : false}
                                                                />
                                                            </FormGroup>
                                                            <FormGroup className="top form-group col-sm-12">
                                                                <div className="" style={{ marginLeft: 'auto' }}>
                                                                    <Button
                                                                        style={{ marginRight: '5px' }}
                                                                        color="danger"
                                                                        className="text-white"
                                                                        variant="contained"
                                                                        onClick={() => { this.cleanSchedule(); }}
                                                                    >
                                                                        Limpiar
                                                                    </Button>
                                                                    {
                                                                        this.state.registerSchedule && (
                                                                            <Button
                                                                                color="primary"
                                                                                className="text-white"
                                                                                variant="contained"
                                                                                onClick={this.handleSaveSchedule}
                                                                            >
                                                                                Guardar
                                                                            </Button>
                                                                        )
                                                                    }
                                                                </div>
                                                            </FormGroup>
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
                                                        collapseMonitores: !this.state.collapseMonitores
                                                    })
                                                }
                                                disabled={this.props.disabled}
                                            >
                                                Monitores
                                        </Button>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-12">
                                            <Collapse isOpen={this.state.collapseMonitores}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="row">
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <div>
                                                                    <Label for="arrayScreens">Monitores</Label>
                                                                    <div className={this.state.arrayScreensError}>
                                                                        <Select
                                                                            isClearable
                                                                            isSearchable
                                                                            isDisabled={this.props.disabled}
                                                                            name="arrayScreens"
                                                                            id="arrayScreens"
                                                                            value={this.state.arrayScreens}
                                                                            onChange={event => this.handleChangeSelect(
                                                                                event,
                                                                                "arrayScreens",
                                                                                "arrayScreensError",
                                                                                "arrayScreensTextError",
                                                                                "arrayScreensHide"
                                                                            )}
                                                                            options={this.props.dataGeneral.dataScreen}
                                                                        />
                                                                    </div>
                                                                    <div className={`${this.state.arrayScreensHide} errorControl`}>
                                                                        {this.state.arrayScreensTextError}
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                            {
                                                                this.state.arrayScreens && (
                                                                    <FormGroup className="top form-group col-sm-12">
                                                                        <Screens
                                                                            data={this.state.arrayScreens.info}
                                                                            confirm={this.props.confirm}
                                                                            addScreenFunction={this.props.addScreenFunction}
                                                                            arrayScreens={this.props.lessons.arrayScreens}
                                                                            cleanSelectScreen={this.cleanSelectScreen}
                                                                            disabled={this.props.disabled}
                                                                        />
                                                                    </FormGroup>
                                                                )
                                                            }
                                                            {
                                                                this.props.lessons.arrayScreens.length > 0 && (
                                                                    <FormGroup className="top form-group col-sm-12">
                                                                        <ScreensAdd
                                                                            confirm={this.props.confirm}
                                                                            dataAdd={this.props.lessons.arrayScreens}
                                                                            deleteScreenFunction={this.props.deleteScreenFunction}
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
                                                        collapseDescuento: !this.state.collapseDescuento
                                                    })
                                                }
                                                disabled={this.props.disabled}
                                            >
                                                Descuento
                                        </Button>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-12">
                                            <Collapse isOpen={this.state.collapseDescuento}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="row">
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <div>
                                                                    <Label for="arrayDescuentos">Descuentos</Label>
                                                                    <div className={this.state.arrayDescuentosError}>
                                                                        <Select
                                                                            isClearable={true}
                                                                            isSearchable={true}
                                                                            isDisabled={this.props.option !== 2 ?
                                                                                this.state.registerDiscount :
                                                                                this.props.disabled
                                                                            }
                                                                            name="arrayDescuentos"
                                                                            id="arrayDescuentos"
                                                                            value={this.state.arrayDescuentos}
                                                                            onChange={this.handleChangeDescuentos}
                                                                            options={this.props.dataGeneral.dataDiscount}
                                                                        />
                                                                    </div>
                                                                    <div className={`${this.state.arrayDescuentosHide} errorControl`}>
                                                                        {this.state.arrayDescuentosTextError}
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <Label for="registerDiscount">¿Nuevo Descuento?</Label>
                                                                <Switch
                                                                    checked={
                                                                        this.state.registerDiscount ?
                                                                            this.state.registerDiscount : false
                                                                    }
                                                                    onChange={this.handleChangeRegisterDiscount("registerDiscount")}
                                                                    value={this.state.registerDiscount}
                                                                    color="primary"
                                                                    disabled={this.props.disabled}
                                                                />
                                                            </FormGroup>
                                                        </div>
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
                                        onClick={this.handleSaveClass}
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
                <style jsx=''>
                    {/* {`
                    .schedule {
                        max-height: 300px;
                        overflow-y: auto;
                    }
                    .schedule .title {
                        background-color: #6a9af4;
                        color: #fff;
                        border-color: #6a9af4!important;
                        font-size: 14px;
                    }`} */}
                </style>
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    lessons: state.lessons.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveClassAction: (data, callback) => dispatch(saveClassAction(data, callback)),
    updateClassAction: (data, callback) => dispatch(updateClassAction(data, callback)),
    addPenaltyFunction: (data, dataAll) => dispatch(addPenaltyFunction(data, dataAll)),
    deletePenaltyFunction: (id) => dispatch(deletePenaltyFunction(id)),
    addScreenFunction: (data, dataAll) => dispatch(addScreenFunction(data, dataAll)),
    deleteScreenFunction: (id) => dispatch(deleteScreenFunction(id)),
    loadScheduleSelectFunction: (data) => dispatch(loadScheduleSelectFunction(data)),
    saveScheduleAction: (data, callback) => dispatch(saveScheduleAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalLessons);