
import React, { Fragment, useState, useEffect } from 'react';
import { Label, } from "reactstrap";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PaymentIcon from '@material-ui/icons/Payment';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

import {
    number_format
} from "../../../helpers/helpers";

const ListPaymentPurchase = props => {

    const eliminarPago = (key, data) => {
        const message = {
            title: "Eliminar pago",
            info: "¿Esta seguro que desea eliminar este pago?"
        };
        props.confirm(message, res => {
            if (res) {
                props.deleteWayToPayFunction(key, data);
            }
        });
    }

    const { data, currency_symbol } = props;
    return (
        <div>
            <hr />
            <Label>Lista de Pagos</Label>
            <div>
                <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                    <tbody>
                        {
                            data.map((data, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ width: '25%' }} align="left">
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PaymentIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                        </td>
                                        <td style={{ width: '30%' }} align="left">{data.name}</td>
                                        {
                                            data.local ?
                                                <td style={{ width: '25%' }} align="left">
                                                    {`${number_format(data.amount, 2)} ${currency_symbol}`}
                                                </td>
                                                :
                                                <td style={{ width: '25%' }} align="left">
                                                    {`${number_format(data.amount, 2)} ${data.currencySymbolExchange}`}
                                                    <span style={{fontSize:'12px', fontWeight:'900'}}>
                                                        {` (${number_format(data.amount * data.rate, 2)} ${currency_symbol})`}
                                                    </span>
                                                </td>
                                        }

                                        {
                                            !props.disabled &&
                                            <td style={{ width: '20%' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Eliminar Pago"
                                                        className="iconButtons"
                                                        onClick={() => { eliminarPago(i, data); }}
                                                        disabled={props.disabled}
                                                    >
                                                        <DeleteIcon className="iconTable" />
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
export default ListPaymentPurchase;