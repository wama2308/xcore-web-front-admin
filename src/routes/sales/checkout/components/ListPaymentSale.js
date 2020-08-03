import React, { Fragment, useState, useEffect } from 'react';
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
} from "./../../../../helpers/helpers";

const ListPaymentSale = props => {

    const eliminarPago = (data, key) => {
        const message = {
            title: "Eliminar pago",
            info: "¿Esta seguro que desea eliminar este pago?"
        };
        props.confirm(message, res => {
            if (res) {
                props.deletePaymentFunction(data, key);
            }
        });
    }

    const { data, currency_symbol } = props;
    return (
        <div>
            <hr />
            <List dense={true}>
                {data ? data.map((payment, i) => {
                    return (
                        <ListItem key={i} button>
                            <ListItemAvatar>
                                <Avatar>
                                    <PaymentIcon />
                                </Avatar>
                            </ListItemAvatar>
                            {
                                payment.paymentMethodLocal !== null && (
                                    <ListItemText
                                        primary={payment.paymentMethodLocal.label}
                                        secondary={`${number_format(payment.amount, 2)} ${currency_symbol}`}
                                    />
                                )
                            }
                            {
                                payment.paymentMethodForeign !== null && (
                                    <ListItemText
                                        primary={payment.paymentMethodForeign.label}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"

                                                    color="textSecondary"
                                                >
                                                    {`${number_format(payment.amountForeign, 2)} ${payment.paymentMethodForeign.info.currency_symbol}`}
                                                </Typography>
                                                <br />
                                                {`${number_format(payment.amount, 2)} ${currency_symbol}`}
                                            </React.Fragment>
                                        }
                                    />
                                )
                            }
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    title="Eliminar pago"
                                    onClick={() => { eliminarPago(payment, i); }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })
                    :
                    null
                }
            </List>
        </div>
    );

}
export default ListPaymentSale;