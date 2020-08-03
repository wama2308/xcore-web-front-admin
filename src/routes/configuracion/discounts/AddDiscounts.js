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
import { saveDiscountsAction } from "../../../actions/DiscountsActions";
import { connect } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import { formatMonto } from "../../../helpers/helpers";

class AddDiscounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameError: false,
      nameTextError: "",
      nameHide: "hide",
      arrayType: null,
      arrayTypeError: "",
      arrayTypeTextError: "",
      arrayTypeHide: "hide",
      valueDiscount: "0.00",
      valueDiscountError: false,
      valueDiscountTextError: "",
      valueDiscountHide: "hide",
      startDate: new Date(),
      startDateError: "",
      startDateTextError: "",
      startDateHide: "hide",
      endDate: new Date(),
      endDateError: "",
      endDateTextError: "",
      endDateHide: "hide",
      all_areas: false,
      all_class: false,
      all_plans: false,
      all_packages: false,
      all_products: false,
      all_services: false,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps = (props) => {};

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

  handleChangeSelect = (
    value,
    select,
    selectError,
    selectErrorText,
    selecthide
  ) => {
    this.setState({
      [select]: value,
      [selectError]: "",
      [selectErrorText]: "",
      [selecthide]: "hide",
    });
  };

  handlekeyMonto(campo, campoError, campoErrorText, campohide) {
    let monto = event.target.value
      .replace(/\D/g, "")
      .replace(/([0-9])([0-9]{2})$/, "$1.$2")
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    this.setState({
      [campo]: monto,
      [campoError]: false,
      [campoErrorText]: "",
      [campohide]: "hide",
    });
  }

  eventoBlur = (name) => (event) => {
    if (event.target.value === "" || event.target.value === "0.0") {
      this.setState({
        [name]: "0.00",
      });
    }
  };

  eventoFocus = (name) => (event) => {
    if (event.target.value === "0.00") {
      this.setState({
        [name]: "",
      });
    }
  };

  handleChangeSwitch = (name, error, textError, hide, option) => (event) => {
    this.setState({
      [name]: event.target.checked,
      [error]: option === 1 ? false : "",
      [textError]: "",
      [hide]: "hide",
    });
  };

  limpiarCampos = (valor) => {
    this.setState({
      name: "",
      nameError: false,
      nameTextError: "",
      nameHide: "hide",
      arrayType: null,
      arrayTypeError: "",
      arrayTypeTextError: "",
      arrayTypeHide: "hide",
      valueDiscount: "0.00",
      valueDiscountError: false,
      valueDiscountTextError: "",
      valueDiscountHide: "hide",
      startDate: new Date(),
      startDateError: "",
      startDateTextError: "",
      startDateHide: "hide",
      endDate: new Date(),
      endDateError: "",
      endDateTextError: "",
      endDateHide: "hide",
    });
    if (valor) {
      this.props.cleanNewDiscount();
    }
  };

  validate = () => {
    let acum = "";
    if (this.state.name === "") {
      this.setState({
        nameError: true,
        nameTextError: "Ingrese el nombre",
        nameHide: "show",
      });
      acum = 1;
    }
    if (this.state.arrayType === null) {
      this.setState({
        arrayTypeError: "borderColor",
        arrayTypeTextError: "Seleccione el tipo",
        arrayTypeHide: "show",
      });
    }
    if (
      this.state.valueDiscount === "0.00" ||
      this.state.valueDiscount === "0.0"
    ) {
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
        startDateTextError: "Ingrese la fecha de inicio",
        startDateHide: "show",
      });
      acum = 1;
    }
    if (!this.state.endDate) {
      this.setState({
        endDateError: "borderColor",
        endDateTextError: "Ingrese la fecha de finalizacion",
        endDateHide: "show",
      });
      acum = 1;
    }
    if (this.state.endDate < this.state.startDate) {
      this.setState({
        endDateError: "borderColor",
        endDateTextError:
          "La fecha de finalizacion no se puede ser menor a la de inicio",
        endDateHide: "show",
      });
      acum = 1;
    }

    if (acum > 0) {
      return false;
    }
    return true;
  };

  handleSaveDiscount = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.props.saveDiscountsAction(
        {
          name: this.state.name,
          type: this.state.arrayType.value,
          value: formatMonto(this.state.valueDiscount),
          start_date: this.state.startDate,
          final_date: this.state.endDate,
          all_areas: false,
          all_class: false,
          all_plans: false,
          all_packages: false,
          all_products: false,
          all_services: false,
        },
        () => {
          this.limpiarCampos(true);
        },
        true
      );
    }
  };

  render() {
    return (
      <div>
        <div className="row">
          <FormGroup className="top form-group col-sm-6">
            <div>
              <Label for="name">Nombre</Label>
              <Input
                invalid={this.state.nameError}
                id="name"
                name="name"
                onKeyUp={(event) =>
                  this.handlekey("nameError", "nameTextError", "nameHide")
                }
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
                  onChange={(event) =>
                    this.handleChangeSelect(
                      event,
                      "arrayType",
                      "arrayTypeError",
                      "arrayTypeTextError",
                      "arrayTypeHide"
                    )
                  }
                  options={[
                    { label: "Porcentaje", value: "percentage" },
                    { label: "Monto", value: "amount" },
                  ]}
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
                onKeyUp={(event) =>
                  this.handlekeyMonto(
                    "valueDiscount",
                    "valueDiscountError",
                    "valueDiscountTextError",
                    "valueDiscountHide"
                  )
                }
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
          <FormGroup className="top form-group col-sm-6">
            <div>
              <Label for="startDate">Fecha de Inicio</Label>
              <div className={this.state.startDateError}>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={(event) =>
                    this.handleChangeSelect(
                      event,
                      "startDate",
                      "startDateError",
                      "startDateTextError",
                      "startDateHide"
                    )
                  }
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
                  onChange={(event) =>
                    this.handleChangeSelect(
                      event,
                      "endDate",
                      "endDateError",
                      "endDateTextError",
                      "endDateHide"
                    )
                  }
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
        <FormGroup className="top form-group col-sm-12">
          {!this.props.disabled && (
            <div className="" style={{ marginLeft: "auto" }}>
              <Button
                style={{ marginRight: "5px" }}
                color="danger"
                className="text-white"
                variant="contained"
                onClick={() => {
                  this.limpiarCampos(false);
                }}
              >
                Limpiar
              </Button>
              <Button
                color="primary"
                className="text-white"
                variant="contained"
                onClick={this.handleSaveDiscount}
              >
                Agregar
              </Button>
            </div>
          )}
        </FormGroup>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  saveDiscountsAction: (data, callback, addDiscount, callbackDiscount) =>
    dispatch(
      saveDiscountsAction(data, callback, addDiscount, callbackDiscount)
    ),
});

export default connect(null, mapDispatchToProps)(AddDiscounts);
