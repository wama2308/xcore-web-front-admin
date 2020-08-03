import React, { useState, useEffect, Fragment } from "react";
import {
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Delete } from "@material-ui/icons";

const ListContacts = props => {
    return (
        <div>
            <hr />
            <div>
                <Label>Lista de Contactos</Label>
                <br />
                <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                    <thead>
                        <tr>
                            <td style={{ width: '5%' }} align="left">Nro</td>
                            <td style={{ width: '20%' }} align="left">Nombres</td>
                            <td style={{ width: '20%' }} align="left">Apellidos</td>
                            <td style={{ width: '20%' }} align="left">Email</td>
                            <td style={{ width: '20%' }} align="left">Telefono</td>
                            {
                                !props.disabled &&
                                <td style={{ width: '15%' }} align="left">Accion</td>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((data, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ width: '5%' }} align="left">{i + 1}</td>
                                        <td style={{ width: '20%' }} align="left">{data.name}</td>
                                        <td style={{ width: '20%' }} align="left">{data.surname}</td>
                                        <td style={{ width: '20%' }} align="left">{data.email}</td>
                                        <td style={{ width: '20%' }} align="left">{data.phone}</td>
                                        {
                                            !props.disabled &&
                                            <td style={{ width: '15%' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Editar Contacto"
                                                        className="iconButtons"
                                                        onClick={() => { props.editContacto(i, data); }}
                                                        disabled={props.disabled}
                                                    >
                                                        <Edit className="iconTable" />
                                                    </IconButton>
                                                    <IconButton aria-label="Delete"
                                                        title="Eliminar Contacto"
                                                        className="iconButtons"
                                                        onClick={() => { props.deleteContacto(i); }}
                                                        disabled={props.disabled}
                                                    >
                                                        <Delete className="iconTable" />
                                                    </IconButton>
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

export default ListContacts;