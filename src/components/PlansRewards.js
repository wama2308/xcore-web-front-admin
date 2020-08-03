import React from "react";
import { Input } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import { AddCircle } from "@material-ui/icons";
import { number_format } from "../helpers/helpers";
import Select from "react-select";
import { NotificationManager } from 'react-notifications';
import "../assets/css/style.css";

class PlansRewards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayDescuentos: null,
            arrayDescuentosError: '',
            arrayDescuentosTextError: '',
            arrayDescuentosHide: 'hide',
            quantity: '',
            quantity_error: false,
        };
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekey(campoError, type) {
        this.setState({
            [campoError]: type === 1 ? false : "",
        });
    };

    handleChangeSelect = (value, select, selectError) => {
        this.setState({
            [select]: value,
            [selectError]: "",
        });
    };

    add(data, dataDiscountCant, option) {
        const message = {
            title: "Agregar Plan",
            info: "¿Esta seguro que desea agregar este plan?"
        };
        this.props.confirm(message, res => {
            let acum = 0;
            if (res) {
                if (!this.state.arrayDescuentos && option === 1) {
                    this.setState({
                        arrayDescuentosError: "borderColor",
                    });
                    acum = 1;
                }
                if (this.state.quantity === '' && option === 2) {
                    this.setState({
                        quantity_error: true,
                    });
                    acum = 1;
                }
                if (acum !== 0) {
                    NotificationManager.warning("Campos requeridos");
                }
                if (acum === 0) {                    
                    this.props.addPlanFunction(data, this.props.arrayAll, dataDiscountCant, option);
                    this.props.cleanSelectPlan();
                }
            }
        });
    }

    render() {
        const { data } = this.props;
        return (
            <div>
                <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                    <thead>
                        {
                            (this.props.rule === 0 && this.props.discountGeneral) && (
                                <tr>
                                    <td style={{ width: '20%' }} align="left">Nombre</td>
                                    <td style={{ width: '30%' }} align="left">Descripcion</td>
                                    <td style={{ width: '10%' }} align="left">Monto</td>
                                    <td style={{ width: '15%' }} align="left">Tipo</td>
                                    <td style={{ width: '15%' }} align="left">Descuento</td>
                                    <td style={{ width: '10%' }} align="left">Accion</td>
                                </tr>
                            )
                        }
                        {
                            (this.props.rule === 0 && !this.props.discountGeneral) && (
                                <tr>
                                    <td style={{ width: '20%' }} align="left">Nombre</td>
                                    <td style={{ width: '30%' }} align="left">Descripcion</td>
                                    <td style={{ width: '10%' }} align="left">Monto</td>
                                    <td style={{ width: '30%' }} align="left">Descuento</td>
                                    <td style={{ width: '10%' }} align="left">Accion</td>
                                </tr>
                            )
                        }
                        {
                            this.props.rule === 6 && (
                                <tr>
                                    <td style={{ width: '20%' }} align="left">Nombre</td>
                                    <td style={{ width: '30%' }} align="left">Descripcion</td>
                                    <td style={{ width: '20%' }} align="left">Monto</td>
                                    <td style={{ width: '20%' }} align="left">Cantidad</td>
                                    <td style={{ width: '10%' }} align="left">Accion</td>
                                </tr>
                            )
                        }
                    </thead>
                    <tbody>
                        {
                            (this.props.rule === 0 && this.props.discountGeneral) && (
                                <tr>
                                    <td style={{ width: '20%' }} align="left">{data.name}</td>
                                    <td style={{ width: '30%' }} align="left">{data.description}</td>
                                    <td style={{ width: '10%' }} align="left">{number_format(data.amount, 2)}</td>
                                    <td style={{ width: '15%' }} align="left">
                                        {this.props.discountValue.info.type.trim() === "percentage" ? "Porcentaje" : "Monto"}
                                    </td>
                                    <td style={{ width: '15%' }} align="left">{number_format(this.props.discountValue.info.value, 2)}</td>
                                    <td style={{ width: '10%' }} align="left">
                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                            <IconButton aria-label="Delete"
                                                title="Agregar Plan"
                                                className="iconButtons"
                                                onClick={() => { this.add(data, this.props.discountValue, 0); }}
                                                disabled={this.props.disabled}
                                            >
                                                <AddCircle className="iconTable" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        {
                            (this.props.rule === 0 && !this.props.discountGeneral) && (
                                <tr>
                                    <td style={{ width: '20%' }} align="left">{data.name}</td>
                                    <td style={{ width: '30%' }} align="left">{data.description}</td>
                                    <td style={{ width: '10%' }} align="left">{number_format(data.amount, 2)}</td>
                                    <td style={{ width: '30%' }} align="left">
                                        <div className={this.state.arrayDescuentosError}>
                                            <Select
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={this.props.disabled}
                                                name="arrayDescuentos"
                                                id="arrayDescuentos"
                                                value={this.state.arrayDescuentos}
                                                onChange={event => this.handleChangeSelect(
                                                    event,
                                                    "arrayDescuentos",
                                                    "arrayDescuentosError",
                                                )}
                                                options={this.props.dataDiscount}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ width: '10%' }} align="left">
                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                            <IconButton aria-label="Delete"
                                                title="Agregar Plan"
                                                className="iconButtons"
                                                onClick={() => { this.add(data, this.state.arrayDescuentos, 1); }}
                                                disabled={this.props.disabled}
                                            >
                                                <AddCircle className="iconTable" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        {
                            this.props.rule === 6 && (
                                <tr>
                                    <td style={{ width: '20%' }} align="left">{data.name}</td>
                                    <td style={{ width: '30%' }} align="left">{data.description}</td>
                                    <td style={{ width: '20%' }} align="left">{number_format(data.amount, 2)}</td>
                                    <td style={{ width: '20%' }} align="left">
                                        <div>
                                            <Input
                                                invalid={this.state.quantity_error}
                                                id="quantity"
                                                name="quantity"
                                                onKeyUp={event => this.handlekey(
                                                    "quantity_error",
                                                    1
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.quantity}
                                                type="number"
                                                min="0"
                                                disabled={this.props.disabled}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ width: '10%' }} align="left">
                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                            <IconButton aria-label="Delete"
                                                title="Agregar Plan"
                                                className="iconButtons"
                                                onClick={() => { this.add(data, this.state.quantity, 2); }}
                                                disabled={this.props.disabled}
                                            >
                                                <AddCircle className="iconTable" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
export default PlansRewards;