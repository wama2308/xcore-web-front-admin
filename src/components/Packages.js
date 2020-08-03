import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { AddCircle } from "@material-ui/icons";
import { number_format } from "../helpers/helpers";

class Packages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    add(data) {
        const message = {
            title: "Agregar Paquete",
            info: "¿Esta seguro que desea agregar este paquete?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.addPackagesFunction(data, this.props.arrayAll);
                this.props.cleanSelectPackages();
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
                            <td style={{ width: '30%' }} align="left">Nombre</td>
                            <td style={{ width: '30%' }} align="left">Descripcion</td>
                            <td style={{ width: '30%' }} align="left">Monto</td>
                            <td style={{ width: '10%' }} align="left">Accion</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ width: '30%' }} align="left">{data.name}</td>
                            <td style={{ width: '30%' }} align="left">{data.description}</td>
                            <td style={{ width: '30%' }} align="left">{number_format(data.amount, 2)}</td>
                            <td style={{ width: '20%' }} align="left">
                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                    <IconButton aria-label="Delete"
                                        title="Agregar Paquete"
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
export default Packages;