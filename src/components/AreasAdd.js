import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import { Label } from "reactstrap";
import { number_format } from "../helpers/helpers";

class AreasAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    delete(key) {
        const message = {
            title: "Eliminar Area",
            info: "¿Esta seguro que desea eliminar esta area?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteAreasFunction(key);
            }
        });
    }

    render() {
        const { arrayAdd } = this.props;        
        return (
            <div>
                <hr />
                <div>
                    <Label>Areas Agregadas</Label>
                    <br />
                    <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                        <thead>
                            {
                                (this.props.discountGeneral || this.props.discountIndividual) ?
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '20%' }} align="left">Nombre</td>
                                        <td style={{ width: '20%' }} align="left">Descripcion</td>
                                        <td style={{ width: '10%' }} align="left">Monto</td>
                                        <td style={{ width: '15%' }} align="left">Tipo</td>
                                        <td style={{ width: '15%' }} align="left">Descuento</td>
                                        <td style={{ width: '10%' }} align="left">Accion</td>
                                    </tr>
                                    :
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '30%' }} align="left">Nombre</td>
                                        <td style={{ width: '30%' }} align="left">Descripcion</td>
                                        <td style={{ width: '20%' }} align="left">Monto</td>
                                        <td style={{ width: '10%' }} align="left">Accion</td>
                                    </tr>
                            }

                        </thead>
                        {
                            (this.props.discountGeneral || this.props.discountIndividual) ?
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
                                                        {data.type_discount.trim() === "percentage" ? "Porcentaje" : "Monto"}
                                                    </td>
                                                    <td style={{ width: '15%' }} align="left">{number_format(data.value_discount, 2)}</td>
                                                    <td style={{ width: '10%' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Eliminar Areas"
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
                                :
                                <tbody>
                                    {
                                        arrayAdd.map((data, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ width: '10%' }} align="left">{i + 1}</td>
                                                    <td style={{ width: '30%' }} align="left">{data.name}</td>
                                                    <td style={{ width: '30%' }} align="left">{data.description}</td>
                                                    <td style={{ width: '20%' }} align="left">{number_format(data.amount, 2)}</td>
                                                    <td style={{ width: '10%' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Eliminar Areas"
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
            </div>
        );
    }
}
export default AreasAdd;