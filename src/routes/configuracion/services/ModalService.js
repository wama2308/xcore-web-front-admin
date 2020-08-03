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
import 'react-tagsinput/react-tagsinput.css';
import {
    saveServiceAction,
    updateServiceAction,
    addPenaltyFunction,
    deletePenaltyFunction,
    addScreenFunction,
    deleteScreenFunction,
}
    from "../../../actions/ServicesConfigurationActions"
import { loadScheduleSelectFunction } from "../../../actions/aplicantionActions";
import { saveScheduleAction } from "../../../actions/ScheduleActions";
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Penalizaciones from "../../../components/Penalizaciones";
import PenalizacionesAdd from "../../../components/PenalizacionesAdd";
import Screens from "../../../components/Screens";
import ScreensAdd from "../../../components/ScreensAdd";
import { number_format, formatMonto } from "../../../helpers/helpers";
import ScheduleComponent from "../../../components/IS7Schedule";
import Descuento from "../area/Descuento";
import AddDiscounts from "../discounts/AddDiscounts";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';

class ModalService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...stateInitial
        };
    }

    cargarData(data) {
        let expirationDateSplit = data.expiration_date.split('-');
        let expirationDate = new Date(expirationDateSplit[0], expirationDateSplit[1] - 1, expirationDateSplit[2].substring(0, 2));

        this.setState({
            name: data.name,
            description: data.description,
            amount: number_format(data.amount, 2),
            arrayImpuesto: data.tax,
            quotas: data.quotas,
            corporateGroup: data.corporate_group,
            giftedServices: data.gifted_service,
            acumulativeServices: data.cumulative_service,
            reserve: data.reserve,
            reserveWeb: data.type_reserve.web,
            reserveApp: data.type_reserve.movil,
            reserveSede: data.type_reserve.branch,
            additionalDay: data.additional_day,
            amountDayAdditional: number_format(data.amount_additional_day, 2),
            arrayDaysAdditional: data.additional_day_array,
            expiration: data.expiration,
            expirationDate: expirationDate,
            partialPayments: data.partial_payment,
            dayPartialPayments: data.days_partial_payments,
            icono: data.icon,
            nameIcono: data.name_icon,
            arraySchedule: data.schedule,
            selectionsSchedule: data.schedule.info.items,
            collapsePenalizaciones: data.penalties.length > 0 ? true : false,
            collapseMonitores: data.screens.length > 0 ? true : false,
            collapseDescuento: data.discount ? true : false,
            horario: true,
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
            if (props.services.serviceId && this.state.actionReducer === 0) {
                this.cargarData(props.services.serviceId);
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

    handleChangeExpirationDate = date => {
        this.setState({
            expirationDate: date,
            expirationDateError: "",
            expirationDateTextError: '',
            expirationDateHide: 'hide',
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
        if (name === "expiration") {
            this.setState({
                expirationDate: new Date(),
            });
        }
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
        // console.log("items ", items)
        // console.log("item ", item)
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
        if (this.state.quotas === '' || this.state.quotas === '0') {
            this.setState({
                quotasError: true,
                quotasTextError: 'Ingrese la cantidad de secciones del servicio',
                quotasHide: 'show',
            });
            acum = 1;
        }
        if (this.state.giftedServices === '') {
            this.setState({
                giftedServicesError: true,
                giftedServicesTextError: 'Ingrese el numero de servicios a regalar',
                giftedServicesHide: 'show',
            });
            acum = 1;
        }
        if (this.state.acumulativeServices === '') {
            this.setState({
                acumulativeServicesError: true,
                acumulativeServicesTextError: 'Cantidad maxima de servicios acumulados',
                acumulativeServicesHide: 'show',
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
        if (this.state.expiration && !this.state.expirationDate) {
            this.setState({
                expirationDateError: "borderColor",
                expirationDateTextError: 'Ingrese la fecha de expiracion',
                expirationDateHide: 'show',
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

    handleSaveService = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            let penalizaciones = [];
            let screens = [];
            let diasAdicionales = [];
            if (this.props.services.arrayPenalty.length > 0) {
                this.props.services.arrayPenalty.map((data, i) => {
                    penalizaciones.push(data._id);
                });
            }
            if (this.props.services.arrayScreens.length > 0) {
                this.props.services.arrayScreens.map((data, i) => {
                    screens.push(data._id);
                });
            }
            if (this.state.arrayDaysAdditional) {
                this.state.arrayDaysAdditional.map((data, i) => {
                    diasAdicionales.push(data.value);
                });
            }
            let type_reserve = {
                web: this.state.reserveWeb,
                movil: this.state.reserveApp,
                branch: this.state.reserveSede
            };

            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveServiceAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        quotas: this.state.quotas,
                        screens: screens,
                        corporate_group: this.state.corporateGroup,
                        schedule_id: this.state.arraySchedule.value,
                        discount_id: this.state.arrayDescuentos ? this.state.arrayDescuentos.value : null,
                        gifted_service: this.state.giftedServices,
                        cumulative_service: this.state.acumulativeServices,
                        reserve: this.state.reserve,
                        type_reserve: type_reserve,
                        penalty: this.props.services.arrayPenalty.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        icon: this.state.icono,
                        name_icon: this.state.nameIcono,
                        expiration: this.state.expiration,
                        expiration_date: this.state.expirationDate,
                        partial_payment: this.state.partialPayments,
                        days_partial_payments: this.state.dayPartialPayments,
                        additional_day: this.state.additionalDay,
                        amount_additional_day: formatMonto(this.state.amountDayAdditional),
                        additional_day_array: diasAdicionales
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateServiceAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        amount: formatMonto(this.state.amount),
                        tax_id: this.state.arrayImpuesto.value,
                        quotas: this.state.quotas,
                        screens: screens,
                        corporate_group: this.state.corporateGroup,
                        schedule_id: this.state.arraySchedule.value,
                        discount_id: this.state.arrayDescuentos ? this.state.arrayDescuentos.value : null,
                        gifted_service: this.state.giftedServices,
                        cumulative_service: this.state.acumulativeServices,
                        reserve: this.state.reserve,
                        type_reserve: type_reserve,
                        penalty: this.props.services.arrayPenalty.length > 0 ? true : false,
                        type_penalties: penalizaciones,
                        icon: this.state.icono,
                        name_icon: this.state.nameIcono,
                        expiration: this.state.expiration,
                        expiration_date: this.state.expirationDate,
                        partial_payment: this.state.partialPayments,
                        days_partial_payments: this.state.dayPartialPayments,
                        additional_day: this.state.additionalDay,
                        amount_additional_day: formatMonto(this.state.amountDayAdditional),
                        additional_day_array: diasAdicionales
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
        }
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
                                            <Label for="quotas">Cantidad de secciones del servicio</Label>
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
                                            <Label for="giftedServices">Numero de servicios a regalar</Label>
                                            <Input
                                                invalid={this.state.giftedServicesError}
                                                id="giftedServices"
                                                name="giftedServices"
                                                onKeyUp={event => this.handlekey(
                                                    "giftedServicesError",
                                                    "giftedServicesTextError",
                                                    "giftedServicesHide"
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.giftedServices}
                                                type="number"
                                                min="0"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.giftedServicesHide} errorControl`}>
                                                {this.state.giftedServicesTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-6">
                                        <div>
                                            <Label for="name">Clases maxima de servicios acumulados</Label>
                                            <Input
                                                invalid={this.state.acumulativeServicesError}
                                                id="acumulativeServices"
                                                name="acumulativeServices"
                                                onKeyUp={event => this.handlekey(
                                                    "acumulativeServicesError",
                                                    "acumulativeServicesTextError",
                                                    "acumulativeServicesHide"
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.acumulativeServices}
                                                type="number"
                                                min="0"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.acumulativeServicesHide} errorControl`}>
                                                {this.state.acumulativeServicesTextError}
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
                                        <Label for="expiration">¿Expiracion?</Label>
                                        <Switch
                                            checked={this.state.expiration ? this.state.expiration : false}
                                            onChange={this.handleChangeSwitch(
                                                "expiration",
                                                "expirationDateError",
                                                "expirationDateTextError",
                                                "expirationDateHide",
                                                2,
                                            )}
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
                                        <Label for="additionalDay">¿Dia Adicional?</Label>
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
                                                onBlur={this.eventoBlur("amountDayAdditional")}
                                                onFocus={this.eventoFocus("amountDayAdditional")}
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
                                                                        arrayPenalty={this.props.services.arrayPenalty}
                                                                        deletePenaltyFunction={this.props.deletePenaltyFunction}
                                                                        cleanSelectPenalty={this.cleanSelectPenalty}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.props.services.arrayPenalty.length > 0 && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <PenalizacionesAdd
                                                                        confirm={this.props.confirm}
                                                                        arrayPenalty={this.props.services.arrayPenalty}
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
                                                                    disabled={this.props.disabled}
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
                                                                        arrayScreens={this.props.services.arrayScreens}
                                                                        cleanSelectScreen={this.cleanSelectScreen}
                                                                        disabled={this.props.disabled}
                                                                    />
                                                                </FormGroup>
                                                            )
                                                        }
                                                        {
                                                            this.props.services.arrayScreens.length > 0 && (
                                                                <FormGroup className="top form-group col-sm-12">
                                                                    <ScreensAdd
                                                                        confirm={this.props.confirm}
                                                                        dataAdd={this.props.services.arrayScreens}
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
                                    onClick={this.handleSaveService}
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
    services: state.services.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveServiceAction: (data, callback) => dispatch(saveServiceAction(data, callback)),
    updateServiceAction: (data, callback) => dispatch(updateServiceAction(data, callback)),
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
)(ModalService);