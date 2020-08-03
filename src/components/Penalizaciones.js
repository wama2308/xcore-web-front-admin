import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { AddCircle, Delete } from "@material-ui/icons";
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    Collapse,
    FormFeedback,
    FormText
} from "reactstrap";

class Penalizaciones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addPenalty(data) {
        const message = {
            title: "Agregar Penalizacion",
            info: "¿Esta seguro que desea agregar esta penalizacion?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.addPenaltyFunction(data, this.props.arrayPenalty);
                this.props.cleanSelectPenalty();
            }
        });
    }

    render() {
        const { dataPenalty } = this.props;
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
                            <td style={{ width: '30%' }} align="left">{dataPenalty.name}</td>
                            <td style={{ width: '30%' }} align="left">{dataPenalty.description}</td>
                            <td style={{ width: '30%' }} align="left">{dataPenalty.amount}</td>
                            <td style={{ width: '20%' }} align="left">
                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                    <IconButton aria-label="Delete"
                                        title="Agregar Penalizacion"
                                        className="iconButtons"
                                        onClick={() => { this.addPenalty(dataPenalty); }}
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
export default Penalizaciones;