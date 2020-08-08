import React, { useState, useEffect, Fragment } from "react";
import {
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Delete } from "@material-ui/icons";

const ListSettingsCategory = props => {
    return (
        <div>
            <hr />
            <div>
                <Label>Lista de Configuraciones</Label>
                <br />
                <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                    <thead>
                        <tr>
                            <td style={{ width: '20%' }} align="left">Nro</td>
                            <td style={{ width: '30%' }} align="left">Lenguaje</td>
                            <td style={{ width: '30%' }} align="left">Titulo</td>
                            {
                                !props.disabled &&
                                <td style={{ width: '20%' }} align="left">Accion</td>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((data, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ width: '20%' }} align="left">{i + 1}</td>
                                        <td style={{ width: '30%' }} align="left">{data.language.label}</td>
                                        <td style={{ width: '30%' }} align="left">{data.menu_title}</td>
                                        {
                                            !props.disabled &&
                                            <td style={{ width: '20%' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Editar Configuracion"
                                                        className="iconButtons"
                                                        onClick={() => { props.updateSetting(i, data); }}
                                                        disabled={props.disabled}
                                                    >
                                                        <Edit className="iconTable" />
                                                    </IconButton>
                                                    {
                                                        data.id === 0 && (
                                                            <IconButton aria-label="Delete"
                                                                title="Eliminar Configuracion"
                                                                className="iconButtons"
                                                                onClick={() => { props.deleteSetting(i); }}
                                                                disabled={props.disabled}
                                                            >
                                                                <Delete className="iconTable" />
                                                            </IconButton>
                                                        )
                                                    }
                                                </div>
                                            </td>
                                        }
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

export default ListSettingsCategory;