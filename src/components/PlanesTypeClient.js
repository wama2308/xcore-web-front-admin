import React from "react";
import {
    Input,
    FormGroup
} from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import { AddCircle } from "@material-ui/icons";
import { number_format } from "../helpers/helpers";
import Select from "react-select";
import { NotificationManager } from 'react-notifications';
import "../assets/css/style.css";

class PlanesTypeClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type_comparison: "",
            type_comparison_error: false,
            time_cycle: null,
            time_cycle_error: "",
            time_amount: "",
            time_amount_error: false,
            percentage: null,
            percentage_error: "",
            percentage_amount: "",
            percentage_amount_error: false,
            options_time: [
                { label: 'Mensual', value: true },
                { label: 'Diario', value: false }
            ],
            options_amounts: [
                { label: 'Porcentaje', value: true },
                { label: 'Monto', value: false }
            ],
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

    add(data) {
        const message = {
            title: "Agregar Plan",
            info: "¿Esta seguro que desea agregar este plan?"
        };
        this.props.confirm(message, res => {
            if (res) {
                let acum = 0;
                if (this.state.type_comparison === "") {
                    this.setState({
                        type_comparison_error: true,
                    });
                    acum = 1;
                }
                if (this.state.time_cycle === null) {
                    this.setState({
                        time_cycle_error: "borderColor",
                    });
                    acum = 1;
                }
                if (this.state.time_amount === "") {
                    this.setState({
                        time_amount_error: true,
                    });
                    acum = 1;
                }
                if (this.state.percentage === null) {
                    this.setState({
                        percentage_error: "borderColor",
                    });
                    acum = 1;
                }
                if (this.state.percentage_amount === "") {
                    this.setState({
                        percentage_amount_error: true,
                    });
                    acum = 1;
                }
                if (acum !== 0) {
                    NotificationManager.warning("Campos requeridos");
                } else {
                    let objectData = {
                        type_comparison: this.state.type_comparison,
                        time_cycle: this.state.time_cycle,
                        time_amount: this.state.time_amount,
                        percentage: this.state.percentage,
                        percentage_amount: this.state.percentage_amount,
                    };
                    this.props.addPlanFunction(data, this.props.arrayAll, objectData);
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
                        <tr>
                            <td style={{ width: '15%' }} align="left">Nombre</td>
                            <td style={{ width: '10%' }} align="left">Monto</td>
                            <td style={{ width: '10%' }} align="left">Regla</td>
                            <td style={{ width: '15%' }} align="left">Tiempo</td>
                            <td style={{ width: '10%' }} align="left">Cantidad</td>
                            <td style={{ width: '15%' }} align="left">Tipo Monto</td>
                            <td style={{ width: '15%' }} align="left">Monto</td>
                            <td style={{ width: '10%' }} align="left">Accion</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ width: '15%' }} align="left">{data.name}</td>
                            <td style={{ width: '10%' }} align="left">{number_format(data.amount, 2)}</td>
                            <td style={{ width: '10%' }} align="left">
                                <div>
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
                                </div>
                            </td>
                            <td style={{ width: '15%' }} align="left">
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
                                        )}
                                        options={this.state.options_time}
                                    />
                                </div>
                            </td>
                            <td style={{ width: '10%' }} align="left">
                                <div>
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
                            </td>
                            <td style={{ width: '15%' }} align="left">
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
                                        )}
                                        options={this.state.options_amounts}
                                    />
                                </div>
                            </td>
                            <td style={{ width: '15%' }} align="left">
                                <div>
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
                            </td>
                            <td style={{ width: '10%' }} align="left">
                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                    <IconButton aria-label="Delete"
                                        title="Agregar Plan"
                                        className="iconButtons"
                                        onClick={() => { this.add(data); }}
                                        disabled={this.props.disabled}
                                    >
                                        <AddCircle className="iconTable" />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default PlanesTypeClient;