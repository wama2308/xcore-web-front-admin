import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import { Label } from "reactstrap";
import { number_format } from "../helpers/helpers";

class ClassesRewardsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    delete(key) {
        const message = {
            title: "Eliminar Clase",
            info: "¿Esta seguro que desea eliminar esta clase?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteClassFunction(key);
            }
        });
    }

    render() {
        const { arrayAdd } = this.props;
        return (
            <div>
                <hr />
                <div>
                    <Label>Clases Agregadas</Label>
                    <br />
                    <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                        <thead>
                            {
                                this.props.rule === 0 && (
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '20%' }} align="left">Nombre</td>
                                        <td style={{ width: '20%' }} align="left">Descripcion</td>
                                        <td style={{ width: '10%' }} align="left">Monto</td>
                                        <td style={{ width: '15%' }} align="left">Tipo</td>
                                        <td style={{ width: '15%' }} align="left">Descuento</td>
                                        <td style={{ width: '10%' }} align="left">Accion</td>
                                    </tr>
                                )
                            }
                            {
                                this.props.rule === 5 && (
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '20%' }} align="left">Nombre</td>
                                        <td style={{ width: '30%' }} align="left">Descripcion</td>
                                        <td style={{ width: '15%' }} align="left">Monto</td>
                                        <td style={{ width: '15%' }} align="left">Cantidad</td>
                                        <td style={{ width: '10%' }} align="left">Accion</td>
                                    </tr>
                                )
                            }
                        </thead>
                        {
                            (this.props.rule === 0) &&
                            <tbody>
                                {
                                    arrayAdd.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ width: '10%' }} align="left">{i + 1}</td>
                                                <td style={{ width: '20%' }} align="left">{data.name}</td>
                                                <td style={{ width: '20%' }} align="left">{data.description}</td>
                                                <td style={{ width: '10%' }} align="left">{number_format(data.amount, 2)}</td>
                                                <td style={{ width: '15%' }} align="left">
                                                    {data.dataDiscount.info.type.trim() === "percentage" ? "Porcentaje" : "Monto"}
                                                </td>
                                                <td style={{ width: '15%' }} align="left">
                                                    {number_format(data.dataDiscount.info.value, 2)}
                                                </td>
                                                <td style={{ width: '10%' }} align="left">
                                                    <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                        <IconButton aria-label="Delete"
                                                            title="Eliminar Clase"
                                                            className="iconButtons"
                                                            onClick={() => { this.delete(i); }}
                                                            disabled={this.props.disabled}
                                                        >
                                                            <Delete className="iconTable" />
                                                        </IconButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        }
                        {
                            (this.props.rule === 5) &&
                            <tbody>
                                {
                                    arrayAdd.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ width: '10%' }} align="left">{i + 1}</td>
                                                <td style={{ width: '20%' }} align="left">{data.name}</td>
                                                <td style={{ width: '20%' }} align="left">{data.description}</td>
                                                <td style={{ width: '15%' }} align="left">{number_format(data.amount, 2)}</td>
                                                <td style={{ width: '15%' }} align="left">{data.quantity}</td>
                                                <td style={{ width: '10%' }} align="left">
                                                    <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                        <IconButton aria-label="Delete"
                                                            title="Eliminar Clase"
                                                            className="iconButtons"
                                                            onClick={() => { this.delete(i); }}
                                                            disabled={this.props.disabled}
                                                        >
                                                            <Delete className="iconTable" />
                                                        </IconButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        }
                    </table>
                </div>
            </div >
        );
    }
}
export default ClassesRewardsAdd;