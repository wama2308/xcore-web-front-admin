import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { AddCircle, Delete } from "@material-ui/icons";
import { Label } from "reactstrap";

class ScreensAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    delete(key) {
        const message = {
            title: "Eliminar Penalizacion",
            info: "¿Esta seguro que desea eliminar esta penalizacion?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteScreenFunction(key);
            }
        });
    }

    render() {
        const { dataAdd } = this.props;             
        return (
            <div>
                <hr />
                <div>
                    <Label>Monitores Agregados</Label>
                    <br />
                    <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                        <thead>
                            <tr>
                                <td style={{ width: '10%' }} align="left">Nro</td>
                                <td style={{ width: '20%' }} align="left">Nombre</td>
                                <td style={{ width: '20%' }} align="left">Descripcion</td>
                                <td style={{ width: '20%' }} align="left">Marca</td>
                                <td style={{ width: '20%' }} align="left">Mac</td>
                                <td style={{ width: '10%' }} align="left">Accion</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataAdd.map((data, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ width: '10%' }} align="left">{i + 1}</td>
                                            <td style={{ width: '20%' }} align="left">{data.name}</td>
                                            <td style={{ width: '20%' }} align="left">{data.description}</td>
                                            <td style={{ width: '20%' }} align="left">{data.brand}</td>
                                            <td style={{ width: '20%' }} align="left">{data.mac}</td>
                                            <td style={{ width: '10%' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Eliminar Monitor"
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
export default ScreensAdd;