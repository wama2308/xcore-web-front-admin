import React, { useState, useEffect, Fragment } from "react";
import {
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Delete } from "@material-ui/icons";
import { number_format } from "../../../helpers/helpers";

const ListProducts = props => {

    const deleteProducto = (key, data) => {
        const message = {
            title: "Eliminar Producto",
            info: "¿Esta seguro que desea eliminar este producto?"
        };
        props.confirm(message, res => {
            if (res) {
                props.deleteProdutcPurchaseFunction(key, data);
            }
        });
    }

    return (
        <div>
            <Label>Lista de Productos</Label>
            <br />
            <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                <thead>
                    <tr>
                        <td style={{ width: '5%' }} align="left">Nro</td>
                        <td style={{ width: '20%' }} align="left">Nombre</td>
                        <td style={{ width: '15%' }} align="left">Categoria</td>
                        <td style={{ width: '15%' }} align="left">Cantidad</td>
                        <td style={{ width: '20%' }} align="left">Precio</td>
                        <td style={{ width: '10%' }} align="left">Exento</td>

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
                                    <td style={{ width: '15%' }} align="left">{data.categoria}</td>
                                    <td style={{ width: '15%' }} align="left">{data.quantity}</td>
                                    <td style={{ width: '20%' }} align="left">{number_format(data.unit_price, 2)}</td>
                                    <td style={{ width: '10%' }} align="left">{!data.exempt ? 'NO' : 'SI'}</td>
                                    {
                                        !props.disabled &&
                                        <td style={{ width: '15%' }} align="left">
                                            <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                <IconButton aria-label="Delete"
                                                    title="Editar Producto"
                                                    className="iconButtons"
                                                    onClick={() => { props.openModal(2, 'editar', data, i); }}
                                                    disabled={props.disabled}
                                                >
                                                    <Edit className="iconTable" />
                                                </IconButton>
                                                <IconButton aria-label="Delete"
                                                    title="Eliminar Producto"
                                                    className="iconButtons"
                                                    onClick={() => { deleteProducto(i, data); }}
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
    );
}

export default ListProducts;