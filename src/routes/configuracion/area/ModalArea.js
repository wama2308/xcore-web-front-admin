import React from "react";
import {
  Button,
  Input,
  FormGroup,
  Label,
  Card,
  CardBody,
  Collapse,
} from "reactstrap";
import "../../../assets/css/style.css";
import "../../../assets/css/geo.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import {
  saveAreaAction,
  updateAreaAction,
  searchBienes,
  searchBienId,
  setQuantityBienAction,
  deleteBienIdFunction,
  addPenaltyFunction,
  deletePenaltyFunction,
} from "../../../actions/AreasActions";
import { loadScheduleSelectFunction } from "../../../actions/aplicantionActions";
import { saveScheduleAction } from "../../../actions/ScheduleActions";
import { connect } from "react-redux";
import { estadoInicial } from "./estadoInicial";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import Geosuggest from "react-geosuggest";
import MapComponent from "../sucursal/Map";
import Bienes from "./Bienes";
import Descuento from "./Descuento";
import ScheduleComponent from "../../../components/IS7Schedule";
import Penalizaciones from "../../../components/Penalizaciones";
import PenalizacionesAdd from "../../../components/PenalizacionesAdd";
import AddDiscounts from "../discounts/AddDiscounts";
import { number_format, formatMonto } from "../../../helpers/helpers";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";

class ModalAreas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...estadoInicial,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handlekey(campoError, campoErrorText, hide, type) {
    this.setState({
      [campoError]: false,
      [campoErrorText]: "",
      [hide]: "hide",
    });
  }

  handlekeyMonto() {
    let monto = event.target.value
      .replace(/\D/g, "")
      .replace(/([0-9])([0-9]{2})$/, "$1.$2")
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    this.setState({
      monto: monto,
      montoError: false,
      montoTextError: "",
      montoHide: "hide",
    });
  }

  handleChangeTelefonos = (tagsTelefonos) => {
    this.setState({
      telefonos: tagsTelefonos,
      telefonoError: "",
      telefonoTextError: "",
      telefonoHide: "hide",
    });
  };

  handleChangeGerente = (arrayGerente) => {
    this.setState({
      arrayGerente: arrayGerente,
      arrayGerenteError: "",
      arrayGerenteTextError: "",
      arrayGerenteHide: "hide",
    });
  };

  handleChangeImpuesto = (arrayImpuesto) => {
    this.setState({
      arrayImpuesto: arrayImpuesto,
      arrayImpuestoError: "",
      arrayImpuestoTextError: "",
      arrayImpuestoHide: "hide",
    });
  };

  handleChangeDescuentos = (arrayDescuentos) => {
    this.setState({
      arrayDescuentos: arrayDescuentos,
      arrayDescuentosError: "",
      arrayDescuentosTextError: "",
      arrayDescuentosHide: "hide",
    });
  };

  handleChangeSelectPenalizaciones = (arrayPenalizaciones) => {
    this.setState({
      arrayPenalizaciones: arrayPenalizaciones,
      arrayPenalizacionesError: "",
      arrayPenalizacionesTextError: "",
      arrayPenalizacionesHide: "hide",
    });
  };

  handleChangeSelectSchedule = (arraySchedule) => {
    if (arraySchedule) {
      this.props.loadScheduleSelectFunction(arraySchedule);
      this.setState({
        arraySchedule: arraySchedule,
        selectionsSchedule: arraySchedule.info.items,
        arrayScheduleError: "",
        arrayScheduleTextError: "",
        arrayScheduleHide: "hide",
        scheduleTextError: "",
      });
    } else {
      this.setState({
        arraySchedule: null,
        selectionsSchedule: [],
      });
    }
  };

  handleChangeEncargadoMantenimiento = (arrayEncargadoMantenimiento) => {
    this.setState({
      arrayEncargadoMantenimiento: arrayEncargadoMantenimiento,
      arrayEncargadoMantenimientoError: "",
      arrayEncargadoMantenimientoTextError: "",
      arrayEncargadoMantenimientoHide: "hide",
    });
  };

  eventoBlur = (e) => {
    if (this.state.monto === "" || this.state.monto === "0.0") {
      this.setState({
        monto: "0.00",
      });
    }
  };

  eventoFocus = (e) => {
    if (this.state.monto === "0.00") {
      this.setState({
        monto: "",
      });
    }
  };

  componentDidMount() {
    if (this.props.option === 1) {
      this.setState({
        loading: "hide",
      });
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          initialLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    }
  }

  componentWillReceiveProps = (props) => {
    if (props.option === 2 || props.option === 3) {
      if (props.area.areaId && this.state.actionReducer === 0) {
        this.cargarData(props.area.areaId);
      }
    }
    if (props.dataGeneral.newSchedule) {
      this.setState({
        arraySchedule:
          Object.keys(props.dataGeneral.newSchedule).length > 0
            ? props.dataGeneral.newSchedule
            : null,
      });
    }
    if (props.dataGeneral.newDiscount) {
      this.setState({
        arrayDescuentos:
          Object.keys(props.dataGeneral.newDiscount).length > 0
            ? props.dataGeneral.newDiscount
            : null,
      });
    }
  };

  cargarData(data) {
    this.setState({
      nombre: data.name,
      descripcion: data.description,
      telefonos: data.phone,
      monto: number_format(data.amount, 2),
      capacidadMaxima: data.capacity.toString(),
      obsequiable: data.gift_areas.toString(),
      arrayImpuesto: data.tax,
      icono: data.name_icon,
      logo: data.icon,
      gerenteRequired: data.required_manager,
      arrayGerente: data.manager,
      reservable: data.reserve,
      reservableWeb: data.type_reserve.web,
      reservableApp: data.type_reserve.movil,
      reservableSede: data.type_reserve.branch,
      arraySchedule: data.schedule,
      selectionsSchedule: data.schedule.info.items,
      requiereMantenimiento: data.required_maintenance,
      arrayEncargadoMantenimiento: data.required_maintenance
        ? data.responsible_maintenance
        : null,
      tiempoMantenimiento: data.required_maintenance
        ? data.maintenance_time
        : "",
      pagosParciales: data.partial_payment,
      diasPagosParcial: data.number_days,
      imagenUno: data.photos[0],
      imagenDos: data.photos[1],
      imagenTres: data.photos[2],
      arrayDescuentos: data.discount,
      internal: data.interna,
      lat: data.location[1],
      lng: data.location[0],
      initialLocation: {
        lat: data.location[1],
        lng: data.location[0],
      },
      isMarkerShown: true,
      zoom: 14,
      multimedia: true,
      collapseDescuento: data.discount ? true : false,
      collapsePenalizaciones: data.penalties.length > 0 ? true : false,
      horario: true,
      bienes: data.goods.length > 0 ? true : false,
      loading: "hide",
      actionReducer: 1,
    });
  }

  handleSaveArea = (event) => {
    event.preventDefault();
    const isValid = true;
    if (isValid) {
      let penalizaciones = [];
      if (this.props.area.arrayPenalty) {
        this.props.area.arrayPenalty.map((data, i) => {
          penalizaciones.push(data._id);
        });
      }
      let location = [this.state.lng, this.state.lat];
      let photos = [
        this.state.imagenUno,
        this.state.imagenDos,
        this.state.imagenTres,
      ];
      let type_reserve = {
        web: this.state.reservableWeb,
        movil: this.state.reservableApp,
        branch: this.state.reservableSede,
      };

      //this.setState({ loading: "show" });

      this.setState({ loadingForm: true });

      let amount = formatMonto(this.state.monto);
      amount = amount > 0 ? amount : null;

      let data = {
        quantity: this.state.cantidad,
        name: this.state.nombre,
        description: this.state.descripcion,
        required_manager: this.state.gerenteRequired,
        manager: this.state.gerenteRequired
          ? this.state.arrayGerente && this.state.arrayGerente.value
            ? this.state.arrayGerente.value
            : null
          : null,
        reserve: this.state.reservable,
        type_reserve: type_reserve,
        photos: photos,
        icon: this.state.logo,
        name_icon: this.state.icono,
        capacity: this.state.capacidadMaxima,
        gift_areas: this.state.obsequiable,
        amount: amount,
        phone: this.state.telefonos,
        internal: this.state.interna,
        location: location,
        penalty: this.props.area.arrayPenalty.length > 0 ? true : false,
        type_penalties: penalizaciones,
        required_maintenance: this.state.requiereMantenimiento,
        maintenance_time: this.state.tiempoMantenimiento,
        responsible_maintenance:
          this.state.arrayEncargadoMantenimiento &&
            this.state.arrayEncargadoMantenimiento.value
            ? this.state.arrayEncargadoMantenimiento.value
            : null,
        schedule_id:
          this.state.arraySchedule && this.state.arraySchedule.value
            ? this.state.arraySchedule.value
            : null,
        tax_id:
          this.state.arrayImpuesto && this.state.arrayImpuesto.value
            ? this.state.arrayImpuesto.value
            : null,
        partial_payment: this.state.pagosParciales,
        number_days: this.state.diasPagosParcial,
        discount_id:
          this.state.arrayDescuentos && this.state.arrayDescuentos.value
            ? this.state.arrayDescuentos.value
            : null,
        goods:
          this.props.area && this.props.area.bienId
            ? this.props.area.bienId
            : null,
        multi_branch: false,
      };

      if (this.props.option === 1) {
        this.props
          .saveAreaAction(data)
          .then((res) => {
            this.closeModal(1);
            //this.setState({ loadingForm: false });
          })
          .catch((error) => {
            this.setState({ loadingForm: false });
          });
      }
      if (this.props.option === 3) {
        data.id = this.props.data._id;
        this.props
          .updateAreaAction(data)
          .then((res) => {
            this.closeModal(1);
            // this.setState({ loadingForm: false });
          })
          .catch((error) => {
            this.setState({ loadingForm: false });
          });
      }
    }
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
            ...estadoInicial,
          });
          this.props.valorCloseModal(false);
        }
      });
    } else {
      this.setState({
        ...estadoInicial,
      });
      this.props.valorCloseModal(false);
    }
  };

  fileHandlerUno = (data) => {
    if (data.size / 1024 > 2048) {
      this.setState({
        imagenUnoError: "borderColor",
        imagenUnoTextError: "Tamaño de la imagen no permitido",
        imagenUnoHide: "show",
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
          imagenUno: reader.result,
        });
      };
      this.setState({
        imagenUnoError: "",
        imagenUnoTextError: "",
        imagenUnoHide: "hide",
      });
    }
  };

  fileHandlerDos = (data) => {
    if (data.size / 1024 > 2048) {
      this.setState({
        imagenDosError: "borderColor",
        imagenDosTextError: "Tamaño de la imagen no permitido",
        imagenDosHide: "show",
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
          imagenDos: reader.result,
        });
      };
      this.setState({
        imagenDosError: "",
        imagenDosTextError: "",
        imagenDosHide: "hide",
      });
    }
  };

  fileHandlerTres = (data) => {
    if (data.size / 1024 > 2048) {
      this.setState({
        imagenTresError: "borderColor",
        imagenTresTextError: "Tamaño de la imagen no permitido",
        imagenTresHide: "show",
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
          imagenTres: reader.result,
        });
      };
      this.setState({
        imagenTresError: "",
        imagenTresTextError: "",
        imagenTresHide: "hide",
      });
    }
  };

  fileHandlerLogo = (data) => {
    if (data.size / 1024 > 2048) {
      this.setState({
        logoError: "borderColor",
        logoTextError: "Tamaño de la imagen no permitido",
        logoHide: "show",
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
          logo: reader.result,
        });
      };
      this.setState({
        logoError: "",
        logoTextError: "",
        logoHide: "hide",
      });
    }
  };

  handleChangeGerenteRequired = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      arrayGerente: null,
      arrayGerenteError: "",
      arrayGerenteTextError: "",
      arrayGerenteHide: "hide",
    });
  };

  handleChangeReservable = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      reservableWeb: false,
      reservableApp: false,
      reservableSede: false,
    });
  };

  handleChangeReservableWeb = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      opcionesReservablesError: "",
      opcionesReservablesTextError: "",
      opcionesReservablesHide: "hide",
    });
  };
  handleChangeReservableApp = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      opcionesReservablesError: "",
      opcionesReservablesTextError: "",
      opcionesReservablesHide: "hide",
    });
  };
  handleChangeReservableSede = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      opcionesReservablesError: "",
      opcionesReservablesTextError: "",
      opcionesReservablesHide: "hide",
    });
  };

  handleChangePenalizaciones = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      arrayPenalizaciones: null,
      arrayPenalizacionesError: "",
      arrayPenalizacionesTextError: "",
      arrayPenalizacionesHide: "hide",
    });
  };

  handleChangeRequiereMantenimiento = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      tiempoMantenimiento: "",
      tiempoMantenimientoError: false,
      tiempoMantenimientoTextError: "",
      tiempoMantenimientoHide: "hide",
      arrayEncargadoMantenimiento: null,
      arrayEncargadoMantenimientoError: "",
      arrayEncargadoMantenimientoTextError: "",
      arrayEncargadoMantenimientoHide: "hide",
    });
  };

  handleChangePagosParciales = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      diasPagosParcial: "",
      diasPagosParcialError: false,
      diasPagosParcialTextError: "",
      diasPagosParcialHide: "hide",
    });
  };

  handleChangeRegisterSchedule = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      arraySchedule: null,
      nameSchedule: "",
      nameScheduleError: false,
      nameScheduleTextError: "",
      nameScheduleHide: "hide",
      selectionsSchedule: [],
    });
  };

  handleChangeRegisterDiscount = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
      arrayDescuentos: null,
    });
  };

  handleChangeInterna = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  onSuggestSelect = (suggest) => {
    if (!suggest || this.props.disabled) {
      return;
    }
    this.setState({
      lat: suggest.location.lat,
      lng: suggest.location.lng,
      isMarkerShown: false,
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

  handleClickmap = (event) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      isMarkerShown: true,
    });
  };

  limpiarValidacionesBienes = () => {
    this.setState({
      tableBienesTextError: "",
      tableBienesHide: "hide",
    });
  };

  cleanSelectPenalty = () => {
    this.setState({
      arrayPenalizaciones: null,
      arrayPenalizacionesError: "",
      arrayPenalizacionesTextError: "",
      arrayPenalizacionesHide: "hide",
    });
  };

  handleChangeSchedule = (items, item) => {
    this.setState({
      selectionsSchedule: items,
      scheduleTextError: "",
    });
  };

  validateSchedule = () => {
    let acum = "";
    if (this.state.nameSchedule === "") {
      this.setState({
        nameScheduleError: true,
        nameScheduleTextError: "Ingrese el nombre del horario",
        nameScheduleHide: "show",
      });
      acum = 1;
    }
    if (
      this.state.selectionsSchedule === null ||
      this.state.selectionsSchedule.length === 0
    ) {
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

  handleSaveSchedule = (event) => {
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
            nameSchedule: "",
            registerSchedule: false,
          });
        }
      );
    }
  };

  cleanSchedule() {
    this.setState({
      nameSchedule: "",
      arraySchedule: null,
      selectionsSchedule: [],
      registerSchedule: false,
    });
  }

  cleanNewDiscount = () => {
    this.setState({
      registerDiscount: false,
    });
  };

  render() {
    let googleMaps =
      window.google && window.google.maps
        ? new window.google.maps.LatLng(this.state.lat, this.state.lng)
        : {};

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
          <div name="form-area">
            <DialogTitle id="form-dialog-title">
              <div style={{ display: "flex" }}>
                <div>{this.props.modalHeader}</div>
                <div style={{ marginLeft: "auto" }}>
                  <IconButton
                    aria-label="Delete"
                    className="iconButtons"
                    onClick={() => { this.closeModal(0); }}
                  >
                    <Close className="iconTable" />
                  </IconButton>
                </div>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <div className="row">
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="nombre">Nombre</Label>
                    <Input
                      invalid={this.state.nombreError}
                      id="nombre"
                      data-validate="name"
                      name="nombre"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "nombreError",
                          "nombreTextError",
                          "nombreHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.nombre}
                      type="text"
                      disabled={this.props.disabled}
                    />
                    <div className={`${this.state.nombreHide} errorControl`}>
                      {this.state.nombreTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="descripcion">Descripcion</Label>
                    <Input
                      invalid={this.state.descripcionError}
                      id="descripcion"
                      data-validate="description"
                      name="descripcion"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "descripcionError",
                          "descripcionTextError",
                          "descripcionHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.descripcion}
                      type="textarea"
                      disabled={this.props.disabled}
                    />
                    <div
                      className={`${this.state.descripcionHide} errorControl`}
                    >
                      {this.state.descripcionTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="telefonos">Telefono</Label>
                    <div
                      className={this.state.telefonoError}
                      data-validate="phone"
                    >
                      <TagsInput
                        className="react-tagsinputMy"
                        inputProps={{
                          placeholder: "Telefono",
                          className: "react-tagsinput-inputMy",
                        }}
                        focusedClassName="react-tagsinput-focusedMy"
                        tagProps={{
                          className: "react-tagsinput-tagMy",
                          classNameRemove: "react-tagsinput-removeMy",
                        }}
                        value={this.state.telefonos}
                        disabled={this.props.disabled}
                        onChange={this.handleChangeTelefonos}
                        disabled={this.props.disabled}
                      />
                    </div>
                    <div className={`${this.state.telefonoHide} errorControl`}>
                      {this.state.telefonoTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="monto">Monto</Label>
                    <Input
                      invalid={this.state.montoError}
                      id="monto"
                      data-validate="amount"
                      name="monto"
                      onKeyUp={(event) => this.handlekeyMonto()}
                      onChange={this.handleChange}
                      value={this.state.monto}
                      type="text"
                      onBlur={this.eventoBlur}
                      onFocus={this.eventoFocus}
                      disabled={this.props.disabled}
                    />
                    <div className={`${this.state.montoHide} errorControl`}>
                      {this.state.montoTextError}
                    </div>
                  </div>
                </FormGroup>
                {this.props.option === 1 && (
                  <FormGroup className="top form-group col-sm-6">
                    <div>
                      <Label for="cantidad">Cantidad de areas a crear</Label>
                      <Input
                        invalid={this.state.cantidadError}
                        id="cantidad"
                        data-validate="quantity"
                        name="cantidad"
                        onKeyUp={(event) =>
                          this.handlekey(
                            "cantidadError",
                            "cantidadTextError",
                            "cantidadHide"
                          )
                        }
                        onChange={this.handleChange}
                        value={this.state.cantidad}
                        type="number"
                        min="0"
                        disabled={this.props.disabled}
                      />
                      <div
                        className={`${this.state.cantidadHide} errorControl`}
                      >
                        {this.state.cantidadTextError}
                      </div>
                    </div>
                  </FormGroup>
                )}
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="capacidadMaxima">
                      Capacidad Maxima de Personas
                    </Label>
                    <Input
                      invalid={this.state.capacidadMaximaError}
                      id="capacidadMaxima"
                      data-validate="capacity"
                      name="capacidadMaxima"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "capacidadMaximaError",
                          "capacidadMaximaTextError",
                          "capacidadMaximaHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.capacidadMaxima}
                      type="number"
                      disabled={this.props.disabled}
                      min="0"
                    />
                    <div
                      className={`${this.state.capacidadMaximaHide} errorControl`}
                    >
                      {this.state.capacidadMaximaTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="obsequiable">¿Se puede regalar?</Label>
                    <Input
                      invalid={this.state.obsequiableError}
                      id="obsequiable"
                      data-validate="gift_areas"
                      name="obsequiable"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "obsequiableError",
                          "obsequiableTextError",
                          "obsequiableHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.obsequiable}
                      type="number"
                      disabled={this.props.disabled}
                      min="0"
                    />
                    <div
                      className={`${this.state.obsequiableHide} errorControl`}
                    >
                      {this.state.obsequiableTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="arrayImpuesto">Impuesto (%)</Label>
                    <div
                      className={this.state.arrayImpuestoError}
                      data-validate="tax_id"
                    >
                      <Select
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={this.props.disabled}
                        name="arrayImpuesto"
                        id="arrayImpuesto"
                        value={this.state.arrayImpuesto}
                        onChange={this.handleChangeImpuesto}
                        options={this.props.countryConfiguration.tax.filter(
                          (option) => option.default === true
                        )}
                      />
                    </div>
                    <div
                      className={`${this.state.arrayImpuestoHide} errorControl`}
                    >
                      {this.state.arrayImpuestoTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="icono">Nombre del Icono</Label>
                    <Input
                      invalid={this.state.iconoError}
                      id="icono"
                      name="icono"
                      data-validate="name_icon"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "iconoError",
                          "iconoTextError",
                          "iconoHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.icono}
                      type="text"
                      disabled={this.props.disabled}
                    />
                    <div className={`${this.state.iconoHide} errorControl`}>
                      {this.state.iconoTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="central">Icono</Label>
                    <div
                      style={{ height: "39px" }}
                      className={this.state.logoError}
                      data-validate="icon"
                    >
                      <Label
                        color="primary"
                        className="btn"
                        variant="contained"
                        style={{
                          width: "100%",
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>Cargar Icono</span>
                        <Input
                          style={{ display: "none" }}
                          className="top"
                          type="file"
                          name="logo"
                          accept="image/*"
                          onChange={(event) =>
                            this.fileHandlerLogo(event.currentTarget.files[0])
                          }
                          disabled={this.props.disabled}
                        />
                      </Label>
                    </div>
                    <div className={`${this.state.logoHide} errorControl`}>
                      {this.state.logoTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <Label for="central">
                    <div>
                      {this.state.logo && (
                        <img
                          style={{ width: 300, height: 180 }}
                          className="image"
                          src={this.state.logo}
                        />
                      )}
                    </div>
                  </Label>
                </FormGroup>
              </div>
              <hr />
              <div className="row">
                <FormGroup check className="top form-group col-sm-6">
                  <Label for="gerente">Requiere Administrador</Label>
                  <Switch
                    checked={
                      this.state.gerenteRequired
                        ? this.state.gerenteRequired
                        : false
                    }
                    onChange={this.handleChangeGerenteRequired(
                      "gerenteRequired"
                    )}
                    value={this.state.gerenteRequired}
                    color="primary"
                    disabled={this.props.disabled}
                  />
                  <div data-validate="required_manager"></div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="arrayGerente">Administrador</Label>
                    <div
                      className={this.state.arrayGerenteError}
                      data-validate="manager"
                    >
                      <Select
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={
                          this.props.option === 2
                            ? this.props.disabled
                            : !this.state.gerenteRequired
                        }
                        name="arrayGerente"
                        id="arrayGerente"
                        value={this.state.arrayGerente}
                        onChange={this.handleChangeGerente}
                        options={this.props.dataGeneral.dataUsers}
                      />
                    </div>
                    <div
                      className={`${this.state.arrayGerenteHide} errorControl`}
                    >
                      {this.state.arrayGerenteTextError}
                    </div>
                  </div>
                </FormGroup>
              </div>
              <hr />
              <div className="row">
                <FormGroup check className="top form-group col-sm-6">
                  <Label for="reservable">¿Reservable?</Label>
                  <Switch
                    checked={
                      this.state.reservable ? this.state.reservable : false
                    }
                    onChange={this.handleChangeReservable("reservable")}
                    value={this.state.reservable}
                    color="primary"
                    disabled={this.props.disabled}
                  />
                  <div data-validate="reserve"></div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <Label for="reservable">Opciones</Label>
                  <div
                    style={{ display: "flex", width: "100%" }}
                    className={this.state.opcionesReservablesError}
                  >
                    <div>
                      <Switch
                        checked={
                          this.state.reservableWeb
                            ? this.state.reservableWeb
                            : false
                        }
                        onChange={this.handleChangeReservableWeb(
                          "reservableWeb"
                        )}
                        value={this.state.reservableWeb}
                        color="primary"
                        disabled={
                          this.props.option === 2
                            ? this.props.disabled
                            : !this.state.reservable
                        }
                      />
                      <Label>Web</Label>
                    </div>
                    <div>
                      <Switch
                        checked={
                          this.state.reservableApp
                            ? this.state.reservableApp
                            : false
                        }
                        onChange={this.handleChangeReservableApp(
                          "reservableApp"
                        )}
                        value={this.state.reservableApp}
                        color="primary"
                        disabled={
                          this.props.option === 2
                            ? this.props.disabled
                            : !this.state.reservable
                        }
                      />
                      <Label>App</Label>
                    </div>
                    <div>
                      <Switch
                        checked={
                          this.state.reservableSede
                            ? this.state.reservableSede
                            : false
                        }
                        onChange={this.handleChangeReservableSede(
                          "reservableSede"
                        )}
                        value={this.state.reservableSede}
                        color="primary"
                        disabled={
                          this.props.option === 2
                            ? this.props.disabled
                            : !this.state.reservable
                        }
                      />
                      <Label>Sede</Label>
                    </div>
                  </div>
                  <div
                    className={`${this.state.opcionesReservablesHide} errorControl`}
                  >
                    {this.state.opcionesReservablesTextError}
                  </div>
                </FormGroup>
              </div>
              <hr />
              <div className="row">
                <FormGroup check className="top form-group col-sm-6">
                  <Label for="requiereMantenimiento">
                    ¿Requiere Mantenimiento?
                  </Label>
                  <Switch
                    checked={
                      this.state.requiereMantenimiento
                        ? this.state.requiereMantenimiento
                        : false
                    }
                    onChange={this.handleChangeRequiereMantenimiento(
                      "requiereMantenimiento"
                    )}
                    value={this.state.requiereMantenimiento}
                    color="primary"
                    disabled={this.props.disabled}
                  />
                  <div data-validate="required_maintenance"></div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="arrayEncargadoMantenimiento">
                      Encargado de Mantenimiento
                    </Label>
                    <div
                      className={this.state.arrayEncargadoMantenimientoError}
                      data-validate="responsible_maintenance"
                    >
                      <Select
                        isSearchable
                        isClearable
                        isDisabled={
                          this.props.option === 2
                            ? this.props.disabled
                            : !this.state.requiereMantenimiento
                        }
                        name="arrayEncargadoMantenimiento"
                        id="arrayEncargadoMantenimiento"
                        value={this.state.arrayEncargadoMantenimiento}
                        onChange={this.handleChangeEncargadoMantenimiento}
                        options={this.props.dataUsers}
                      />
                    </div>
                    <div
                      className={`${this.state.arrayEncargadoMantenimientoHide} errorControl`}
                    >
                      {this.state.arrayEncargadoMantenimientoTextError}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="tiempoMantenimiento">
                      Tiempo de Mantenimiento (min)
                    </Label>
                    <Input
                      invalid={this.state.tiempoMantenimientoError}
                      id="tiempoMantenimiento"
                      data-validate="maintenance_time"
                      name="tiempoMantenimiento"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "tiempoMantenimientoError",
                          "tiempoMantenimientoTextError",
                          "tiempoMantenimientoHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.tiempoMantenimiento}
                      type="number"
                      disabled={
                        this.props.option === 2
                          ? this.props.disabled
                          : !this.state.requiereMantenimiento
                      }
                    />
                    <div
                      className={`${this.state.tiempoMantenimientoHide} errorControl`}
                    >
                      {this.state.tiempoMantenimientoTextError}
                    </div>
                  </div>
                </FormGroup>
              </div>
              <hr />
              <div className="row">
                <FormGroup check className="top form-group col-sm-6">
                  <Label for="pagosParciales">¿Permite Pagos Parciales?</Label>
                  <Switch
                    checked={
                      this.state.pagosParciales
                        ? this.state.pagosParciales
                        : false
                    }
                    onChange={this.handleChangePagosParciales("pagosParciales")}
                    value={this.state.pagosParciales}
                    color="primary"
                    disabled={this.props.disabled}
                  />
                  <div data-validate="partial_payment"></div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                  <div>
                    <Label for="diasPagosParcial">Dias Pago Parcial</Label>
                    <Input
                      invalid={this.state.diasPagosParcialError}
                      id="diasPagosParcial"
                      name="diasPagosParcial"
                      data-validate="number_days"
                      onKeyUp={(event) =>
                        this.handlekey(
                          "diasPagosParcialError",
                          "diasPagosParcialTextError",
                          "diasPagosParcialHide"
                        )
                      }
                      onChange={this.handleChange}
                      value={this.state.diasPagosParcial}
                      type="number"
                      disabled={
                        this.props.option === 2
                          ? this.props.disabled
                          : !this.state.pagosParciales
                      }
                    />
                    <div
                      className={`${this.state.diasPagosParcialHide} errorControl`}
                    >
                      {this.state.diasPagosParcialTextError}
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
                        collapsePenalizaciones: !this.state
                          .collapsePenalizaciones,
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
                              <Label for="arrayPenalizaciones">
                                Penalizaciones
                              </Label>
                              <div
                                className={this.state.arrayPenalizacionesError}
                                data-validate="type_penalties"
                              >
                                <Select
                                  isSearchable
                                  isClearable
                                  isDisabled={this.props.disabled}
                                  name="arrayPenalizaciones"
                                  id="arrayPenalizaciones"
                                  value={this.state.arrayPenalizaciones}
                                  onChange={
                                    this.handleChangeSelectPenalizaciones
                                  }
                                  options={this.props.dataGeneral.dataPenalties}
                                />
                              </div>
                              <div
                                className={`${this.state.arrayPenalizacionesHide} errorControl`}
                              >
                                {this.state.arrayPenalizacionesTextError}
                              </div>
                            </div>
                          </FormGroup>
                          {this.state.arrayPenalizaciones && (
                            <FormGroup className="top form-group col-sm-12">
                              <Penalizaciones
                                dataPenalty={
                                  this.state.arrayPenalizaciones.info
                                }
                                confirm={this.props.confirm}
                                addPenaltyFunction={
                                  this.props.addPenaltyFunction
                                }
                                arrayPenalty={this.props.area.arrayPenalty}
                                deletePenaltyFunction={
                                  this.props.deletePenaltyFunction
                                }
                                cleanSelectPenalty={this.cleanSelectPenalty}
                                disabled={this.props.disabled}
                              />
                            </FormGroup>
                          )}
                          {this.props.area.arrayPenalty.length > 0 && (
                            <FormGroup className="top form-group col-sm-12">
                              <PenalizacionesAdd
                                confirm={this.props.confirm}
                                arrayPenalty={this.props.area.arrayPenalty}
                                deletePenaltyFunction={
                                  this.props.deletePenaltyFunction
                                }
                                disabled={this.props.disabled}
                              />
                            </FormGroup>
                          )}
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
                        multimedia: !this.state.multimedia,
                      })
                    }
                    disabled={this.props.disabled}
                  >
                    Multimedia
                  </Button>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                  <Collapse isOpen={this.state.multimedia}>
                    <Card>
                      <CardBody>
                        <div className="row">
                          <FormGroup className="top form-group col-sm-4">
                            <div className={this.state.imagenUnoError}>
                              <Label
                                color="primary"
                                className="btn"
                                variant="contained"
                                style={{
                                  width: "100%",
                                  backgroundColor: "rgba(0,0,0,0.2)",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  Imagen Uno
                                </span>
                                <Input
                                  style={{ display: "none" }}
                                  className="top"
                                  type="file"
                                  name="imagenUno"
                                  accept="image/*"
                                  onChange={(event) =>
                                    this.fileHandlerUno(
                                      event.currentTarget.files[0]
                                    )
                                  }
                                  disabled={this.props.disabled}
                                />
                              </Label>
                            </div>
                            <div
                              className={`${this.state.imagenUnoHide} errorControl`}
                            >
                              {this.state.imagenUnoTextError}
                            </div>
                          </FormGroup>
                          <FormGroup className="top form-group col-sm-4">
                            <div className={this.state.imagenDosError}>
                              <Label
                                color="primary"
                                className="btn"
                                variant="contained"
                                style={{
                                  width: "100%",
                                  backgroundColor: "rgba(0,0,0,0.2)",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  Imagen Dos
                                </span>
                                <Input
                                  style={{ display: "none" }}
                                  className="top"
                                  type="file"
                                  name="imagenDos"
                                  accept="image/*"
                                  onChange={(event) =>
                                    this.fileHandlerDos(
                                      event.currentTarget.files[0]
                                    )
                                  }
                                  disabled={this.props.disabled}
                                />
                              </Label>
                            </div>
                            <div
                              className={`${this.state.imagenDosHide} errorControl`}
                            >
                              {this.state.imagenDosTextError}
                            </div>
                          </FormGroup>
                          <FormGroup className="top form-group col-sm-4">
                            <div className={this.state.imagenTresError}>
                              <Label
                                color="primary"
                                className="btn"
                                variant="contained"
                                style={{
                                  width: "100%",
                                  backgroundColor: "rgba(0,0,0,0.2)",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  Imagen Tres
                                </span>
                                <Input
                                  style={{ display: "none" }}
                                  className="top"
                                  type="file"
                                  name="imagenTres"
                                  accept="image/*"
                                  onChange={(event) =>
                                    this.fileHandlerTres(
                                      event.currentTarget.files[0]
                                    )
                                  }
                                  disabled={this.props.disabled}
                                />
                              </Label>
                            </div>
                            <div
                              className={`${this.state.imagenTresHide} errorControl`}
                            >
                              {this.state.imagenTresTextError}
                            </div>
                          </FormGroup>
                        </div>
                        <div className="row">
                          <FormGroup className="top form-group col-sm-4">
                            <div>
                              {this.state.imagenUno && (
                                <img
                                  style={{ width: 270, height: 150 }}
                                  className="image"
                                  src={this.state.imagenUno}
                                />
                              )}
                            </div>
                          </FormGroup>
                          <FormGroup className="top form-group col-sm-4">
                            <div>
                              {this.state.imagenDos && (
                                <img
                                  style={{ width: 270, height: 150 }}
                                  className="image"
                                  src={this.state.imagenDos}
                                />
                              )}
                            </div>
                          </FormGroup>
                          <FormGroup className="top form-group col-sm-4">
                            <div>
                              {this.state.imagenTres && (
                                <img
                                  style={{ width: 270, height: 150 }}
                                  className="image"
                                  src={this.state.imagenTres}
                                />
                              )}
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
                        bienes: !this.state.bienes,
                      })
                    }
                    disabled={this.props.disabled}
                  >
                    Bienes
                  </Button>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                  <Collapse isOpen={this.state.bienes}>
                    <Card>
                      <CardBody>
                        <Bienes
                          dataAllBienes={this.props.dataAllBienes}
                          searchBienes={this.props.searchBienes}
                          searchBienId={this.props.searchBienId}
                          bienSelect={this.props.area.bienId}
                          setQuantityBienAction={
                            this.props.setQuantityBienAction
                          }
                          deleteBienIdFunction={this.props.deleteBienIdFunction}
                          confirm={this.props.confirm}
                          tableBienesHide={this.state.tableBienesHide}
                          tableBienesTextError={this.state.tableBienesTextError}
                          limpiarValidacionesBienes={
                            this.limpiarValidacionesBienes
                          }
                          disabled={this.props.disabled}
                        />
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
                        horario: !this.state.horario,
                      })
                    }
                    disabled={this.props.disabled}
                  >
                    Horario
                  </Button>
                  <div data-validate="schedule_id"></div>
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
                                  isDisabled={
                                    this.props.option !== 2
                                      ? this.state.registerSchedule
                                      : this.props.disabled
                                  }
                                  name="arraySchedule"
                                  id="arraySchedule"
                                  value={this.state.arraySchedule}
                                  onChange={this.handleChangeSelectSchedule}
                                  options={this.props.dataGeneral.dataSchedule}
                                />
                              </div>
                              <div
                                className={`${this.state.arrayScheduleHide} errorControl`}
                              >
                                {this.state.arrayScheduleTextError}
                              </div>
                            </div>
                          </FormGroup>
                          <FormGroup className="top form-group col-sm-6">
                            <Label for="registerSchedule">
                              ¿Nuevo Horario?
                            </Label>
                            <Switch
                              checked={
                                this.state.registerSchedule
                                  ? this.state.registerSchedule
                                  : false
                              }
                              onChange={this.handleChangeRegisterSchedule(
                                "registerSchedule"
                              )}
                              value={this.state.registerSchedule}
                              color="primary"
                              disabled={this.props.disabled}
                            />
                          </FormGroup>
                          {this.state.registerSchedule && (
                            <FormGroup className="top form-group col-sm-6">
                              <div>
                                <Label for="icono">Nombre del Horario</Label>
                                <Input
                                  invalid={this.state.nameScheduleError}
                                  id="nameSchedule"
                                  name="nameSchedule"
                                  onKeyUp={(event) =>
                                    this.handlekey(
                                      "nameScheduleError",
                                      "nameScheduleTextError",
                                      "nameScheduleHide"
                                    )
                                  }
                                  onChange={this.handleChange}
                                  value={this.state.nameSchedule}
                                  type="text"
                                  disabled={this.props.disabled}
                                />
                                <div
                                  className={`${this.state.nameScheduleHide} errorControl`}
                                >
                                  {this.state.nameScheduleTextError}
                                </div>
                              </div>
                            </FormGroup>
                          )}
                        </div>
                        <div className="row">
                          <FormGroup className="top form-group col-sm-12">
                            <div
                              style={{ width: "100%" }}
                              className={`errorControl`}
                            >
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
                            <div className="" style={{ marginLeft: "auto" }}>
                              <Button
                                style={{ marginRight: "5px" }}
                                color="danger"
                                className="text-white"
                                variant="contained"
                                onClick={() => {
                                  this.cleanSchedule();
                                }}
                              >
                                Limpiar
                              </Button>
                              {this.state.registerSchedule && (
                                <Button
                                  color="primary"
                                  className="text-white"
                                  variant="contained"
                                  disabled={this.state.loadingFormSchedule}
                                  onClick={this.handleSaveSchedule}
                                >
                                  Guardar
                                </Button>
                              )}
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
                        collapseDescuento: !this.state.collapseDescuento,
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
                                  isDisabled={
                                    this.props.option !== 2
                                      ? this.state.registerDiscount
                                      : this.props.disabled
                                  }
                                  name="arrayDescuentos"
                                  id="arrayDescuentos"
                                  value={this.state.arrayDescuentos}
                                  onChange={this.handleChangeDescuentos}
                                  options={this.props.dataDiscount}
                                />
                              </div>
                              <div
                                className={`${this.state.arrayDescuentosHide} errorControl`}
                              >
                                {this.state.arrayDescuentosTextError}
                              </div>
                            </div>
                          </FormGroup>
                          <FormGroup className="top form-group col-sm-6">
                            <Label for="registerDiscount">
                              ¿Nuevo Descuento?
                            </Label>
                            <Switch
                              checked={
                                this.state.registerDiscount
                                  ? this.state.registerDiscount
                                  : false
                              }
                              onChange={this.handleChangeRegisterDiscount(
                                "registerDiscount"
                              )}
                              value={this.state.registerDiscount}
                              color="primary"
                              disabled={this.props.disabled}
                            />
                          </FormGroup>
                        </div>
                        {this.state.registerDiscount && (
                          <FormGroup className="top form-group col-sm-12">
                            <AddDiscounts
                              cleanNewDiscount={this.cleanNewDiscount}
                            />
                          </FormGroup>
                        )}
                        {this.state.arrayDescuentos && (
                          <FormGroup className="top form-group col-sm-12">
                            <Descuento
                              dataDescuento={this.state.arrayDescuentos.info}
                            />
                          </FormGroup>
                        )}
                      </CardBody>
                    </Card>
                  </Collapse>
                </FormGroup>
              </div>
              <hr />
              <div className="row">
                <FormGroup check className="top form-group col-sm-6">
                  <Label for="interna">¿Esta fuera de la sucursal?</Label>
                  <Switch
                    checked={this.state.interna ? this.state.interna : false}
                    onChange={this.handleChangeInterna("interna")}
                    value={this.state.interna}
                    color="primary"
                    disabled={this.props.disabled}
                  />
                </FormGroup>
              </div>
              <div className="row">
                {this.state.interna && (
                  <div className="form-group col-lg-12 Widht">
                    <Card>
                      {this.state.lat && (
                        <CardBody>
                          <div>
                            {!this.props.disabled && (
                              <Geosuggest
                                placeholder="Buscar en el mapa"
                                onSuggestSelect={this.onSuggestSelect}
                                location={googleMaps}
                                radius="20"
                              />
                            )}
                          </div>
                          <MapComponent
                            lat={this.state.lat}
                            lng={this.state.lng}
                            onMarkerClick={this.handleMarkerClick}
                            isMarkerShown={this.state.isMarkerShown}
                            initialLocation={this.state.initialLocation}
                            currentLocation={this.state.currentLatLng}
                            handleClickmap={this.handleClickmap}
                            zoom={this.state.zoom}
                            handleClickmap={this.handleClickmap}
                          />
                          <br />
                          {!this.props.disabled && (
                            <Button
                              color="primary"
                              onClick={this.refrescarMapa}
                            >
                              Refrescar
                            </Button>
                          )}
                        </CardBody>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => { this.closeModal(0); }}
                color="danger"
                className="text-white"
              >
                Cancel
              </Button>
              {!this.props.showHide && (
                <Button
                  color="primary"
                  className="text-white"
                  variant="contained"
                  disabled={this.state.loadingForm}
                  onClick={this.handleSaveArea}
                >
                  {this.props.buttonFooter}
                </Button>
              )}
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
                  zIndex: 2,
                }}
              />
            </div>
          )}
        <style jsx="">
          {/* {`
            .schedule {
              max-height: 300px;
              overflow-y: auto;
            }
            .schedule .title {
              background-color: #6a9af4;
              color: #fff;
              border-color: #6a9af4 !important;
              font-size: 14px;
            }
          `} */}
        </style>
      </Dialog>
    );
  }
}
const mapStateToProps = (state) => ({
  area: state.area.toJS(),
  dataAllBienes: state.area.get("dataAllBienes"),
  dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = (dispatch) => ({
  saveAreaAction: (data, callback) => dispatch(saveAreaAction(data, callback)),
  updateAreaAction: (data, callback) => dispatch(updateAreaAction(data, callback)),
  updateAreaAction: (data, callback) => dispatch(updateAreaAction(data, callback)),
  searchBienes: (data) => dispatch(searchBienes(data)),
  searchBienId: (data, bienesAll) => dispatch(searchBienId(data, bienesAll)),
  setQuantityBienAction: (id, value) => dispatch(setQuantityBienAction(id, value)),
  deleteBienIdFunction: (key) => dispatch(deleteBienIdFunction(key)),
  addPenaltyFunction: (data, dataAll) => dispatch(addPenaltyFunction(data, dataAll)),
  deletePenaltyFunction: (id) => dispatch(deletePenaltyFunction(id)),
  loadScheduleSelectFunction: (data) => dispatch(loadScheduleSelectFunction(data)),
  saveScheduleAction: (data, callback) => dispatch(saveScheduleAction(data, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAreas);
