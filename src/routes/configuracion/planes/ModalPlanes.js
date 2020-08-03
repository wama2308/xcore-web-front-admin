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
    savePlanAction,
    updatePlanAction,
    addPenaltyFunction,
    deletePenaltyFunction,
}
    from "../../../actions/PlanesActions"
import { loadScheduleSelectFunction } from "../../../actions/aplicantionActions";
import { saveScheduleAction } from "../../../actions/ScheduleActions";
import { connect } from "react-redux";
import { estadoInicial } from './estadoInicial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import ScheduleComponent from "../../../components/IS7Schedule";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Penalizaciones from "../../../components/Penalizaciones";
import PenalizacionesAdd from "../../../components/PenalizacionesAdd";
import { number_format, formatMonto } from "../../../helpers/helpers";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import es from 'date-fns/locale/es';
import Descuento from "../area/Descuento";
import AddDiscounts from "../discounts/AddDiscounts";
import { NotificationManager } from 'react-notifications';
registerLocale('es', es)

class ModalPlanes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...estadoInicial
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
            if (props.plan.planId && this.state.actionReducer === 0) {
                this.cargarData(props.plan.planId);
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
        let typeLimit = {};
        data.cycle ? cycle = { label: 'Mensual', value: true } : cycle = { label: 'Diario', value: false }
        data.type_limit ? typeLimit = { label: 'Mensual', value: true } : typeLimit = { label: 'Diario', value: false }
        let expirationDateSplit = data.expiration_date.split('-');
        let expirationDate = new Date(expirationDateSplit[0], expirationDateSplit[1] - 1, expirationDateSplit[2].substring(0, 2));

        this.setState({
            name: data.name,
            description: data.description,
            amount: number_format(data.amount, 2),
            arrayImpuesto: data.tax,
            corporateGroup: data.corporate_group,
            arrayCycle: cycle,
            timeCycle: data.time_cycle,
            dateChange: data.date_change,
            expiration: data.expiration,
            expirationDate: expirationDate,
            additionalDay: data.additional_day,
            arrayDaysAdditional: data.additional_day_array,
            amountDayAdditional: number_format(data.amount_additional_day, 2),
            flexibility: data.flexibility,
            flexibilityDay: data.flexibility ? data.flexibility_day : '',
            locker: data.locker,
            amountLocker: number_format(data.amount_locker, 2),
            attendanceLimit: data.attendance_limit,
            typeLimit: data.attendance_limit ? typeLimit : null,
            limitAmount: data.attendance_limit ? data.limit_amount : '',
            inscription: data.inscription,
            amountInscription: number_format(data.amount_inscription, 2),
            partialPayments: data.partial_payments,
            dayPartialPayments: data.partial_payments ? data.days_partial_payments : '',
            arraySchedule: data.schedule,
            selectionsSchedule: data.schedule.info.items,
            loading: 'hide',
            actionReducer: 1,
            collapsePenalizaciones: data.penalties.length > 0 ? true : false,
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

    handleChangeExpirationDate = date => {
        this.setState({
            expirationDate: date,
            expirationDateError: "",
            expirationDateTextError: '',
            expirationDateHide: 'hide',
        });
    }

    handlekey(campoError, campoErrorText, hide, type) {
        this.setState({
            [campoError]: false,
            [campoErrorText]: "",
            [hide]: "hide",
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

    eventoBlur = (e) => {
        if (this.state.amount === '' || this.state.amount === '0.0') {
            this.setState({
                amount: '0.00'
            });
        }
    }

    eventoFocus = (e) => {
        if (this.state.amount === '0.00') {
            this.setState({
                amount: ''
            });
        }
    }

    eventoBlurAmount = (e) => {
        if (this.state.amountDayAdditional === '' || this.state.amountDayAdditional === '0.0') {
            this.setState({
                amountDayAdditional: '0.00'
            });
        }
    }

    eventoFocusAmount = (e) => {
        if (this.state.amountDayAdditional === '0.00') {
            this.setState({
                amountDayAdditional: ''
            });
        }
    }

    eventoBlurAmountLocker = (e) => {
        if (this.state.amountLocker === '' || this.state.amountLocker === '0.0') {
            this.setState({
                amountLocker: '0.00'
            });
        }
    }

    eventoFocusAmountLocker = (e) => {
        if (this.state.amountLocker === '0.00') {
            this.setState({
                amountLocker: ''
            });
        }
    }

    eventoBlurAmountInscription = (e) => {
        if (this.state.amountInscription === '' || this.state.amountInscription === '0.0') {
            this.setState({
                amountInscription: '0.00'
            });
        }
    }

    eventoFocusAmountInscription = (e) => {
        if (this.state.amountInscription === '0.00') {
            this.setState({
                amountInscription: ''
            });
        }
    }

    handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        this.setState({
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        });
    };

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

    cleanSchedule() {
        this.setState({
            nameSchedule: '',
            arraySchedule: null,
            selectionsSchedule: [],
            registerSchedule: false,
        });
    }

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

    handleChangeCorporateGroup = name => event => {
        this.setState({
            [name]: event.target.checked,

        });
    };

    handleChangeDataChange = name => event => {
        this.setState({
            [name]: event.target.checked,

        });
    };

    handleChangePenalty = name => event => {
        this.setState({
            [name]: event.target.checked,
            arrayPenalty: null,
            arrayPenaltyError: '',
            arrayPenaltyTextError: '',
            arrayPenaltyHide: 'hide',
        });
    };

    handleChangeExpiration = name => event => {
        this.setState({
            [name]: event.target.checked,
            expirationDate: new Date(),
            expirationDateError: "",
            expirationDateTextError: '',
            expirationDateHide: 'hide',
        });
    };

    handleChangeAdditionalDay = name => event => {
        this.setState({
            [name]: event.target.checked,
            amountDayAdditional: '0.00',
            amountDayAdditionalError: false,
            amountDayAdditionalTextError: '',
            amountDayAdditionalHide: 'hide',
            arrayDaysAdditional: null,
            arrayDaysAdditionalError: '',
            arrayDaysAdditionalTextError: '',
            arrayDaysAdditionalHide: 'hide',
        });
    };

    handleChangeFlexibility = name => event => {
        this.setState({
            [name]: event.target.checked,
            flexibilityDay: '',
            flexibilityDayError: false,
            flexibilityDayTextError: '',
            flexibilityDayHide: 'hide',
        });
    };

    handleChangeLocker = name => event => {
        this.setState({
            [name]: event.target.checked,
            amountLocker: '0.00',
            amountLockerError: false,
            amountLockerTextError: '',
            amountLockerHide: 'hide',
        });
    };

    handleChangeAttendanceLimit = name => event => {
        this.setState({
            [name]: event.target.checked,
            limitAmount: '',
            limitAamountError: false,
            limitAamountTextArea: '',
            limitAamountHide: '',
            typeLimit: null,
            typeLimitError: '',
            typeLimitTextError: '',
            typeLimitHide: 'hide',
        });
    };

    handleChangeInscription = name => event => {
        this.setState({
            [name]: event.target.checked,
            amountInscription: '0.00',
            amountInscriptionError: false,
            amountInscriptionTextError: '',
            amountInscriptionHide: 'hide',
        });
    };

    handleChangePartialPayments = name => event => {
        this.setState({
            [name]: event.target.checked,
            dayPartialPayments: '',
            dayPartialPaymentsError: false,
            dayPartialPaymentsTextError: '',
            dayPartialPaymentsHide: 'hide',
        });
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
        if (!this.state.arrayCycle) {
            this.setState({
                arrayCycleError: "borderColor",
                arrayCycleTextError: 'Seleccione el ciclo',
                arrayCycleHide: 'show',
            });
            acum = 1;
        }
        if (!this.state.timeCycle) {
            this.setState({
                timeCycleError: true,
                timeCycleTextError: 'Ingrese el tiempo del ciclo',
                timeCycleHide: 'show',
            });
            acum = 1;
        }
        if (this.state.penalty && !this.state.arrayPenalty) {
            this.setState({
                arrayPenaltyError: "borderColor",
                arrayPenaltyTextError: 'Seleccione las penalizaciones',
                arrayPenaltyHide: 'show',
            });
            acum = 1;
        }
        if (this.state.expiration && !this.state.expirationDate) {
            this.setState({
                expirationDateError: "borderColor",
                expirationDateTextError: 'Ingrese la fecha de expiracion',
                expirationDateHide: 'show',
            });
            acum = 1;
        }
        if (this.state.flexibility && (!this.state.flexibilityDay || this.state.flexibilityDay === '0')) {
            this.setState({
                flexibilityDayError: true,
                flexibilityDayTextError: 'Ingrese los dias de la flexibilidad del pago',
                flexibilityDayHide: 'show',
            });
            acum = 1;
        }
        if (this.state.additionalDay && ((this.state.amountDayAdditional === '0.00') || (this.state.amountDayAdditional === '0.0'))) {
            this.setState({
                amountDayAdditionalError: true,
                amountDayAdditionalTextError: 'Ingrese el monto del dia adicional',
                amountDayAdditionalHide: 'show',
            });
            acum = 1;
        }
        if (this.state.additionalDay && !this.state.arrayDaysAdditional) {
            this.setState({
                arrayDaysAdditionalError: 'borderColor',
                arrayDaysAdditionalTextError: 'Seleccione los dias',
                arrayDaysAdditionalHide: 'show',
            });
            acum = 1;
        }
        if (this.state.locker && ((this.state.amountLocker === '0.00') || (this.state.amountLocker === '0.0'))) {
            this.setState({
                amountLockerError: true,
                amountLockerTextError: 'Ingrese el monto del locker',
                amountLockerHide: 'show',
            });
            acum = 1;
        }
        if (this.state.attendanceLimit && !this.state.typeLimit) {
            this.setState({
                typeLimitError: "borderColor",
                typeLimitTextError: 'Seleccione el tipo de limite',
                typeLimitHide: 'show',
            });
            acum = 1;
        }
        if (this.state.attendanceLimit && (!this.state.limitAmount || this.state.limitAmount === '0')) {
            this.setState({
                limitAamountError: true,
                limitAamountTextArea: 'Ingrese la cantidad maxima de entradas',
                limitAamountHide: 'show',
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

    handleSavePlan = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let penalizaciones = [];
            let diasAdicionales = [];
            if (this.props.plan.arrayPenalty.length > 0) {
                this.props.plan.arrayPenalty.map((data, i) => {
                    penalizaciones.push(data._id);
                });
            }
            if (this.state.arrayDaysAdditional) {
                this.state.arrayDaysAdditional.map((data, i) => {
                    diasAdicionales.push(data.value);
                });
            }
            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.savePlanAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        schedule_id: this.state.arraySchedule.value,
                        discount_id: this.state.arrayDescuentos ? this.state.arrayDescuentos.value : null,
                        corporate_group: this.state.corporateGroup,
                        penalty: this.props.plan.arrayPenalty.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        cycle: this.state.arrayCycle.value,
                        time_cycle: this.state.timeCycle,
                        date_change: this.state.dateChange,
                        expiration: this.state.expiration,
                        expiration_date: this.state.expirationDate,
                        additional_day: this.state.additionalDay,
                        amount_additional_day: formatMonto(this.state.amountDayAdditional),
                        additional_day_array: diasAdicionales,
                        flexibility: this.state.flexibility,
                        flexibility_day: this.state.flexibilityDay,
                        locker: this.state.locker,
                        amount_locker: formatMonto(this.state.amountLocker),
                        attendance_limit: this.state.attendanceLimit,
                        type_limit: this.state.attendanceLimit ? this.state.typeLimit.value : null,
                        limit_amount: this.state.limitAmount,
                        inscription: this.state.inscription,
                        amount_inscription: formatMonto(this.state.amountInscription),
                        partial_payments: this.state.partialPayments,
                        days_partial_payments: this.state.dayPartialPayments
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updatePlanAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        schedule_id: this.state.arraySchedule.value,
                        discount_id: this.state.arrayDescuentos ? this.state.arrayDescuentos.value : null,
                        corporate_group: this.state.corporateGroup,
                        penalty: this.props.plan.arrayPenalty.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        cycle: this.state.arrayCycle.value,
                        time_cycle: this.state.timeCycle,
                        date_change: this.state.dateChange,
                        expiration: this.state.expiration,
                        expiration_date: this.state.expirationDate,
                        additional_day: this.state.additionalDay,
                        amount_additional_day: formatMonto(this.state.amountDayAdditional),
                        additional_day_array: diasAdicionales,
                        flexibility: this.state.flexibility,
                        flexibility_day: this.state.flexibilityDay,
                        locker: this.state.locker,
                        amount_locker: formatMonto(this.state.amountLocker),
                        attendance_limit: this.state.attendanceLimit,
                        type_limit: this.state.attendanceLimit ? this.state.typeLimit.value : null,
                        limit_amount: this.state.limitAmount,
                        inscription: this.state.inscription,
                        amount_inscription: formatMonto(this.state.amountInscription),
                        partial_payments: this.state.partialPayments,
                        days_partial_payments: this.state.dayPartialPayments
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
                        ...estadoInicial
                    });
                    this.props.valorCloseModal();
                }
            });
        } else {
            this.setState({
                ...estadoInicial
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
                                <Form onSubmit={this.handleSavePlan.bind(this)}>
                                    <div className="row">
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="name">Nombre</Label>
                                                <Input
                                                    invalid={this.state.nameError}
                                                    id="name"
                                                    name="name"
                                                    onKeyUp={event => this.handlekey("nameError", "nameTextError", "nameHide")}
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
                                                    onKeyUp={event => this.handlekey("descriptionError", "descriptionTextError", "descriptionHide")}
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
                                                    onKeyUp={event => this.handlekeyMonto("amount", "amountError", "amountTextError", "amountHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.amount}
                                                    type="text"
                                                    onBlur={this.eventoBlur}
                                                    onFocus={this.eventoFocus}
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
                                                        onChange={event => this.handleChangeSelect(event, "arrayImpuesto", "arrayImpuestoError", "arrayImpuestoTextError", "arrayImpuestoHide")}
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
                                                onChange={this.handleChangeCorporateGroup("corporateGroup")}
                                                value={this.state.corporateGroup}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="arrayCycle">Ciclo</Label>
                                                <div className={this.state.arrayCycleError}>
                                                    <Select
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={this.props.disabled}
                                                        name="arrayCycle"
                                                        id="arrayCycle"
                                                        value={this.state.arrayCycle}
                                                        onChange={event => this.handleChangeSelect(event, "arrayCycle", "arrayCycleError", "arrayCycleTextError", "arrayCycleHide")}
                                                        options={this.state.arrayCycleOptions}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayCycleHide} errorControl`}>
                                                    {this.state.arrayCycleTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="timeCycle">Tiempo del Ciclo</Label>
                                                <Input
                                                    invalid={this.state.timeCycleError}
                                                    id="timeCycle"
                                                    name="timeCycle"
                                                    onKeyUp={event => this.handlekey("timeCycleError", "timeCycleTextError", "timeCycleHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.timeCycle}
                                                    type="number"
                                                    disabled={this.props.disabled}
                                                    min="0"
                                                />
                                                <div className={`${this.state.timeCycleHide} errorControl`}>
                                                    {this.state.timeCycleTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="gerente">¿Fecha Cambiante?</Label>
                                            <Switch
                                                checked={this.state.dateChange ? this.state.dateChange : false}
                                                onChange={this.handleChangeDataChange("dateChange")}
                                                value={this.state.dateChange}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="penalty">¿Expiracion?</Label>
                                            <Switch
                                                checked={this.state.expiration ? this.state.expiration : false}
                                                onChange={this.handleChangeExpiration("expiration")}
                                                value={this.state.expiration}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="expirationDate">Fecha de Expiracion</Label>
                                                <div className={this.state.expirationDateError}>
                                                    <DatePicker
                                                        selected={this.state.expirationDate}
                                                        onChange={this.handleChangeExpirationDate}
                                                        dateFormat="dd-MM-yyyy"
                                                        isClearable={this.props.option === 2 ? !this.props.disabled
                                                            : this.state.expiration}
                                                        showYearDropdown
                                                        dateFormatCalendar="MMMM"
                                                        className="form-control"
                                                        disabled={this.props.option === 2 ? this.props.disabled
                                                            : !this.state.expiration}
                                                        locale="es"
                                                    />
                                                </div>
                                                <div className={`${this.state.expirationDateHide} errorControl`}>
                                                    {this.state.expirationDateTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="penalty">¿Dia Adicional?</Label>
                                            <Switch
                                                checked={this.state.additionalDay ? this.state.additionalDay : false}
                                                onChange={this.handleChangeAdditionalDay("additionalDay")}
                                                value={this.state.additionalDay}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="arrayDaysAdditional">Dias</Label>
                                                <div className={this.state.arrayDaysAdditionalError}>
                                                    <Select
                                                        isMulti
                                                        isSearchable
                                                        isClearable
                                                        isDisabled={
                                                            this.props.option === 2 ? this.props.disabled
                                                                : !this.state.additionalDay
                                                        }
                                                        name="arrayDaysAdditional"
                                                        id="arrayDaysAdditional"
                                                        value={this.state.arrayDaysAdditional}
                                                        onChange={event => this.handleChangeSelect(event, "arrayDaysAdditional", "arrayDaysAdditionalError", "arrayDaysAdditionalTextError", "arrayDaysAdditionalHide")}
                                                        options={this.state.optionDays}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayDaysAdditionalHide} errorControl`}>
                                                    {this.state.arrayDaysAdditionalTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="amountDayAdditional">Monto Dia Adicional</Label>
                                                <Input
                                                    invalid={this.state.amountDayAdditionalError}
                                                    id="amountDayAdditional"
                                                    name="amountDayAdditional"
                                                    onKeyUp={event => this.handlekeyMonto("amountDayAdditional", "amountDayAdditionalError", "amountDayAdditionalTextError", "amountDayAdditionalHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.amountDayAdditional}
                                                    type="text"
                                                    onBlur={this.eventoBlurAmount}
                                                    onFocus={this.eventoFocusAmount}
                                                    disabled={this.props.option === 2 ? this.props.disabled
                                                        : !this.state.additionalDay}
                                                />
                                                <div className={`${this.state.amountDayAdditionalHide} errorControl`}>
                                                    {this.state.amountDayAdditionalTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="penalty">¿Flexibilidad en el Pago?</Label>
                                            <Switch
                                                checked={this.state.flexibility ? this.state.flexibility : false}
                                                onChange={this.handleChangeFlexibility("flexibility")}
                                                value={this.state.flexibility}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="flexibilityDay">Dias de Flexibilidad</Label>
                                                <Input
                                                    invalid={this.state.flexibilityDayError}
                                                    id="flexibilityDay"
                                                    name="flexibilityDay"
                                                    onKeyUp={event => this.handlekey("flexibilityDayError", "flexibilityDayTextError", "flexibilityDayHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.flexibilityDay}
                                                    type="number"
                                                    min="0"
                                                    disabled={this.props.option === 2 ? this.props.disabled
                                                        : !this.state.flexibility}
                                                />
                                                <div className={`${this.state.flexibilityDayHide} errorControl`}>
                                                    {this.state.flexibilityDayTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="penalty">¿Locker?</Label>
                                            <Switch
                                                checked={this.state.locker ? this.state.locker : false}
                                                onChange={this.handleChangeLocker("locker")}
                                                value={this.state.locker}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="amountLocker">Monto del Locker</Label>
                                                <Input
                                                    invalid={this.state.amountLockerError}
                                                    id="amountLocker"
                                                    name="amountLocker"
                                                    onKeyUp={event => this.handlekeyMonto("amountLocker", "amountLockerError", "amountLockerTextError", "amountLockerHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.amountLocker}
                                                    onBlur={this.eventoBlurAmountLocker}
                                                    onFocus={this.eventoFocusAmountLocker}
                                                    disabled={this.props.option === 2 ? this.props.disabled
                                                        : !this.state.locker}
                                                />
                                                <div className={`${this.state.amountLockerHide} errorControl`}>
                                                    {this.state.amountLockerTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="penalty">¿Tendra limite de entradas?</Label>
                                            <Switch
                                                checked={this.state.attendanceLimit ? this.state.attendanceLimit : false}
                                                onChange={this.handleChangeAttendanceLimit("attendanceLimit")}
                                                value={this.state.attendanceLimit}
                                                color="primary"
                                                disabled={this.props.disabled}
                                            />
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="typeLimit">Tipo de Limite</Label>
                                                <div className={this.state.typeLimitError}>
                                                    <Select
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={this.props.option === 2 ? this.props.disabled
                                                            : !this.state.attendanceLimit}
                                                        name="typeLimit"
                                                        id="typeLimit"
                                                        value={this.state.typeLimit}
                                                        onChange={event => this.handleChangeSelect(event, "typeLimit", "typeLimitError", "typeLimitTextError", "typeLimitHide")}
                                                        options={this.state.typeLimitOptions}
                                                    />
                                                </div>
                                                <div className={`${this.state.typeLimitHide} errorControl`}>
                                                    {this.state.typeLimitTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="top form-group col-sm-6">
                                            <div>
                                                <Label for="limitAmount">Cantidad de Entradas Permitidas</Label>
                                                <Input
                                                    invalid={this.state.limitAamountError}
                                                    id="limitAmount"
                                                    name="limitAmount"
                                                    onKeyUp={event => this.handlekey("limitAamountError", "limitAamountTextArea", "limitAamountHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.limitAmount}
                                                    type="number"
                                                    disabled={this.props.option === 2 ? this.props.disabled
                                                        : !this.state.attendanceLimit}
                                                    min="0"
                                                />
                                                <div className={`${this.state.limitAamountHide} errorControl`}>
                                                    {this.state.limitAamountTextArea}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <FormGroup check className="top form-group col-sm-6">
                                            <Label for="inscription">¿Requiere monto para la inscripcion?</Label>
                                            <Switch
                                                checked={this.state.inscription ? this.state.inscription : false}
                                                onChange={this.handleChangeInscription("inscription")}
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
                                                    onKeyUp={event => this.handlekeyMonto("amountInscription", "amountInscriptionError", "amountInscriptionTextError", "amountInscriptionHide")}
                                                    onChange={this.handleChange}
                                                    value={this.state.amountInscription}
                                                    onBlur={this.eventoBlurAmountInscription}
                                                    onFocus={this.eventoFocusAmountInscription}
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
                                                onChange={this.handleChangePartialPayments("partialPayments")}
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
                                                    onKeyUp={event => this.handlekey("dayPartialPaymentsError", "dayPartialPaymentsTextError", "dayPartialPaymentsHide")}
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
                                                            {/* <FormGroup check className="top form-group col-sm-6">
                                                                <Label for="penalty">¿Tendra Penalizaciones?</Label>
                                                                <Switch
                                                                    checked={this.state.penalty ? this.state.penalty : false}
                                                                    onChange={this.handleChangePenalty("penalty")}
                                                                    value={this.state.penalty}
                                                                    color="primary"
                                                                    disabled={this.props.disabled}
                                                                />
                                                            </FormGroup> */}
                                                            <FormGroup className="top form-group col-sm-6">
                                                                <div>
                                                                    <Label for="arrayPenalty">Penalizaciones</Label>
                                                                    <div className={this.state.arrayPenaltyError}>
                                                                        <Select
                                                                            isSearchable
                                                                            isClearable
                                                                            // isDisabled={
                                                                            //     this.props.option === 2 ? this.props.disabled
                                                                            //         : !this.state.penalty
                                                                            // }
                                                                            isDisabled={this.props.disabled}
                                                                            name="arrayPenalty"
                                                                            id="arrayPenalty"
                                                                            value={this.state.arrayPenalty}
                                                                            onChange={event => this.handleChangeSelect(event, "arrayPenalty", "arrayPenaltyError", "arrayPenaltyTextError", "arrayPenaltyHide")}
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
                                                                            arrayPenalty={this.props.plan.arrayPenalty}
                                                                            deletePenaltyFunction={this.props.deletePenaltyFunction}
                                                                            cleanSelectPenalty={this.cleanSelectPenalty}
                                                                            disabled={this.props.disabled}
                                                                        />
                                                                    </FormGroup>
                                                                )
                                                            }
                                                            {
                                                                this.props.plan.arrayPenalty.length > 0 && (
                                                                    <FormGroup className="top form-group col-sm-12">
                                                                        <PenalizacionesAdd
                                                                            confirm={this.props.confirm}
                                                                            arrayPenalty={this.props.plan.arrayPenalty}
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
                                        onClick={this.handleSavePlan}
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
    plan: state.plan.toJS(),
    dataAllBienes: state.area.get('dataAllBienes'),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    savePlanAction: (data, callback) => dispatch(savePlanAction(data, callback)),
    updatePlanAction: (data, callback) => dispatch(updatePlanAction(data, callback)),
    addPenaltyFunction: (data, dataAll) => dispatch(addPenaltyFunction(data, dataAll)),
    deletePenaltyFunction: (id) => dispatch(deletePenaltyFunction(id)),
    saveScheduleAction: (data, callback) => dispatch(saveScheduleAction(data, callback)),
    loadScheduleSelectFunction: (data) => dispatch(loadScheduleSelectFunction(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalPlanes);