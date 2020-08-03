import React, { useState, useEffect, Fragment } from "react";
import {
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Visibility, Delete } from "@material-ui/icons";

const ListDevices = props => {

    const viewFormat = (data, option, index) => {
        props.setModal(prev => ({
            ...prev,
            nameDevices: data.nombre,
            ipDevices: data.ip,
            macDevices: data.mac,
            serialPrintDevices: data.serial,
            actionDevices: option,
            indexArrayDevice: index,
        }));
    }

    const deleteFormat = (key) => {
        const message = {
            title: "Eliminar Dispositivo",
            info: "¿Esta seguro que desea eliminar este dispositivo?"
        };
        props.confirm(message, res => {
            if (res) {
                props.deleteDeviceFunction(key);
                props.setModal(prev => ({
                    ...prev,
                    nameDevices: "",
                    nameDevicesError: false,
                    nameDevicesTextError: '',
                    nameDevicesHide: 'hide',
                    ipDevices: "",
                    ipDevicesError: '',
                    ipDevicesTextError: '',
                    ipDevicesHide: 'hide',
                    macDevices: "",
                    macDevicesError: false,
                    macDevicesTextError: '',
                    macDevicesHide: 'hide',
                    serialPrintDevices: "",
                    serialPrintDevicesError: false,
                    serialPrintDevicesTextError: '',
                    serialPrintDevicesHide: 'hide',
                    actionDevices: 'Agregar',
                    indexArrayDevice: 0,
                }));
            }
        });
    }

    return (
        <div>
            <hr />
            <div>
                <Label>Lista de Dispositivos</Label>
                <br />
                <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                    <thead>
                        <tr>
                            <td style={{ width: '5%' }} align="left">Nro</td>
                            <td style={{ width: '20%' }} align="left">Nombre</td>
                            <td style={{ width: '15%' }} align="left">IP</td>
                            <td style={{ width: '15%' }} align="left">MAC</td>
                            <td style={{ width: '20%' }} align="left">Serial</td>
                            <td style={{ width: '25%' }} align="left">Accion</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((data, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ width: '5%' }} align="left">{i + 1}</td>
                                        <td style={{ width: '20%' }} align="left">{data.nombre}</td>
                                        <td style={{ width: '15%' }} align="left">{data.ip}</td>
                                        <td style={{ width: '15%' }} align="left">{data.mac}</td>
                                        <td style={{ width: '20%' }} align="left">{data.serial}</td>
                                        <td style={{ width: '25%' }} align="left">
                                            <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                <IconButton aria-label="Delete"
                                                    title="Ver Dispositivo"
                                                    className="iconButtons"
                                                    onClick={() => { viewFormat(data, 'Ver', i); }}
                                                // disabled={this.props.disabled}
                                                >
                                                    <Visibility className="iconTable" />
                                                </IconButton>
                                                <IconButton aria-label="Delete"
                                                    title="Editar Dispositivo"
                                                    className="iconButtons"
                                                    onClick={() => { viewFormat(data, 'Editar', i); }}
                                                // disabled={this.props.disabled}
                                                >
                                                    <Edit className="iconTable" />
                                                </IconButton>
                                                <IconButton aria-label="Delete"
                                                    title="Eliminar Dispositivo"
                                                    className="iconButtons"
                                                    onClick={() => { deleteFormat(i); }}
                                                // disabled={this.props.disabled}
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

const mapStateToProps = state => ({
    settingBills: state.settingBills.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveCargosAction: (data, callback) => dispatch(saveCargosAction(data, callback)),
    updateCargosAction: (data, callback) => dispatch(updateCargosAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListDevices);