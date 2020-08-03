import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { AddCircle } from "@material-ui/icons";
import { number_format } from "../helpers/helpers";
import Select from "react-select";
import { NotificationManager } from 'react-notifications';

class Areas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayDescuentos: null,
            arrayDescuentosError: '',
            arrayDescuentosTextError: '',
            arrayDescuentosHide: 'hide',
        };
    }

    handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        this.setState({
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        });
    };

    add(data, dataDiscount, option) {
        const message = {
            title: "Agregar Areas",
            info: "¿Esta seguro que desea agregar esta area?"
        };
        this.props.confirm(message, res => {
            if (res) {
                if (dataDiscount === null && option !== 3) {
                    NotificationManager.warning("Debe seleccionar un descuento");
                }else{
                    this.props.addAreasFunction(data, this.props.arrayAll, option === 2 ? dataDiscount.info : dataDiscount, option);
                    this.props.cleanSelectAreas();
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
                            this.props.discountGeneral &&
                            <tr>
                                <td style={{ width: '20%' }} align="left">Nombre</td>
                                <td style={{ width: '20%' }} align="left">Descripcion</td>
                                <td style={{ width: '20%' }} align="left">Monto</td>
                                <td style={{ width: '15%' }} align="left">Tipo</td>
                                <td style={{ width: '15%' }} align="left">Descuento</td>
                                <td style={{ width: '10%' }} align="left">Accion</td>
                            </tr>
                        }
                        {
                            this.props.discountIndividual &&
                            <tr>
                                <td style={{ width: '20%' }} align="left">Nombre</td>
                                <td style={{ width: '20%' }} align="left">Descripcion</td>
                                <td style={{ width: '20%' }} align="left">Monto</td>
                                <td style={{ width: '30%' }} align="left">Descuento</td>
                                <td style={{ width: '10%' }} align="left">Accion</td>
                            </tr>
                        }
                        {
                            (!this.props.discountGeneral && !this.props.discountIndividual) &&
                            <tr>
                                <td style={{ width: '30%' }} align="left">Nombre</td>
                                <td style={{ width: '30%' }} align="left">Descripcion</td>
                                <td style={{ width: '30%' }} align="left">Monto</td>
                                <td style={{ width: '10%' }} align="left">Accion</td>
                            </tr>
                        }

                    </thead>
                    <tbody>
                        {
                            this.props.discountGeneral &&
                            <tr>
                                <td style={{ width: '20%' }} align="left">{data.name}</td>
                                <td style={{ width: '20%' }} align="left">{data.description}</td>
                                <td style={{ width: '20%' }} align="left">{number_format(data.amount, 2)}</td>
                                <td style={{ width: '15%' }} align="left">
                                    {this.props.discountValue.info.type.trim() === "percentage" ? "Porcentaje" : "Monto"}
                                </td>
                                <td style={{ width: '15%' }} align="left">{number_format(this.props.discountValue.info.value, 2)}</td>
                                <td style={{ width: '10%' }} align="left">
                                    <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                        <IconButton aria-label="Delete"
                                            title="Agregar Area"
                                            className="iconButtons"
                                            onClick={() => { this.add(data, this.props.discountValue.info, 1); }}
                                            disabled={this.props.disabled}
                                        >
                                            <AddCircle className="iconTable" />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        }
                        {
                            this.props.discountIndividual &&
                            <tr>
                                <td style={{ width: '20%' }} align="left">{data.name}</td>
                                <td style={{ width: '20%' }} align="left">{data.description}</td>
                                <td style={{ width: '20%' }} align="left">{number_format(data.amount, 2)}</td>
                                <td style={{ width: '30%' }} align="left">
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
                                            "arrayDescuentosTextError",
                                            "arrayDescuentosHide"
                                        )}
                                        options={this.props.dataDiscount}
                                    />
                                </td>
                                <td style={{ width: '10%' }} align="left">
                                    <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                        <IconButton aria-label="Delete"
                                            title="Agregar Area"
                                            className="iconButtons"
                                            onClick={() => { this.add(data, this.state.arrayDescuentos, 2); }}
                                            disabled={this.props.disabled}
                                        >
                                            <AddCircle className="iconTable" />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        }
                        {
                            (!this.props.discountGeneral && !this.props.discountIndividual) &&
                            <tr>
                                <td style={{ width: '30%' }} align="left">{data.name}</td>
                                <td style={{ width: '30%' }} align="left">{data.description}</td>
                                <td style={{ width: '30%' }} align="left">{number_format(data.amount, 2)}</td>
                                <td style={{ width: '20%' }} align="left">
                                    <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                        <IconButton aria-label="Delete"
                                            title="Agregar Area"
                                            className="iconButtons"
                                            onClick={() => { this.add(data, null, 3); }}
                                            disabled={this.props.disabled}
                                        >
                                            <AddCircle className="iconTable" />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        }

                    </tbody>
                </table>
            </div>
        );
    }
}
export default Areas;