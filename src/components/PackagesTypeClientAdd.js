import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import { Label } from "reactstrap";
import { number_format } from "../helpers/helpers";

class PackagesTypeClientAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    delete(key) {
        const message = {
            title: "Eliminar Paquete",
            info: "¿Esta seguro que desea eliminar esta paquete?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deletePackageFunction(key);
            }
        });
    }

    render() {
        const { arrayAdd } = this.props;
        return (
            <div>
                <hr />
                <div>
                    <Label>Paquetes Agregados</Label>
                    <br />
                    <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                        <thead>
                            <tr>
                                <td style={{ width: '5%' }} align="left">Nro</td>
                                <td style={{ width: '15%' }} align="left">Nombre</td>
                                <td style={{ width: '10%' }} align="left">Monto</td>
                                <td style={{ width: '10%' }} align="left">Regla</td>
                                <td style={{ width: '15%' }} align="left">Tiempo</td>
                                <td style={{ width: '10%' }} align="left">Cantidad</td>
                                <td style={{ width: '10%' }} align="left">Tipo Monto</td>
                                <td style={{ width: '15%' }} align="left">Monto</td>
                                <td style={{ width: '10%' }} align="left">Accion</td>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                arrayAdd.map((data, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ width: '5%' }} align="left">{i + 1}</td>
                                            <td style={{ width: '15%' }} align="left">{data.name}</td>                                            
                                            <td style={{ width: '10%' }} align="left">{number_format(data.amount, 2)}</td>
                                            <td style={{ width: '10%' }} align="left">{data.type_comparison}</td>
                                            <td style={{ width: '15%' }} align="left">{data.time_cycle.label}</td>
                                            <td style={{ width: '10%' }} align="left">{data.time_amount}</td>
                                            <td style={{ width: '10%' }} align="left">{data.percentage.label}</td>
                                            <td style={{ width: '15%' }} align="left">{number_format(data.percentage_amount, 2)}</td>
                                            <td style={{ width: '10%' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Eliminar Paquete"
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
                    </table>
                </div>
            </div>
        );
    }
}
export default PackagesTypeClientAdd;