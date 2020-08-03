import React, { Fragment, useState, useEffect } from 'react';
import {
    Input,
    Form,
    FormGroup,
    Label,
} from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Chip from '@material-ui/core/Chip';
import { stateInitial } from './StateInitial';
import {
    number_format
} from "./../../../../helpers/helpers";
import "../../../../assets/css/style.css";

const PartialPayments = props => {
    const initialFormState = stateInitial;
    const [datosForm, setDatosForm] = useState(initialFormState)
    const { data, currency_symbol } = props;

    return (
        <div>
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                {
                    data.payPartial && data.amountFijo > 0 && (
                        <Chip
                            size="medium"
                            // avatar={<Avatar><PaymentIcon /></Avatar>}
                            label={` Monto Fijo: ${number_format(data.amountFijo, 2)} ${currency_symbol}`}
                            clickable
                            color="default"
                        />
                    )
                }
                {
                    data.payPartial && (
                        <Chip
                            size="medium"
                            // avatar={<Avatar><PaymentIcon /></Avatar>}
                            label={` Monto Maximo Parcial: 
                            ${number_format(data.amountTotal - data.amountFijo, 2)} ${currency_symbol}`
                            }
                            clickable
                            color="primary"
                            // style={{ left: '4%' }}
                        />
                    )
                }
                {
                    data.payPartial && (
                        <Chip
                            size="medium"
                            // avatar={<Avatar><PaymentIcon /></Avatar>}
                            label={` Monto Parcial Total: 
                            ${number_format(data.amountTotalPartial, 2)} ${currency_symbol}`
                            }
                            clickable
                            color="primary"
                            // style={{ left: '7%' }}
                        />
                    )
                }
            </div>
            {
                data.payPartial && (
                    <div>
                        <br />
                        <FormGroup row>
                            <Label sm={3} for='montoPartial'>
                                <IntlMessages id="components.montoWayToPayPartial" />
                            </Label>
                            <div className={` col-sm-9`}>
                                <Input
                                    invalid={props.datosForm.montoPartialError}
                                    id="montoPartial"
                                    name="montoPartial"
                                    onKeyUp={event => props.handlekey(
                                        "montoPartial",
                                        "montoPartialError",
                                        "montoPartialErrorText",
                                        "montoPartialErrorHide"
                                    )}
                                    value={data.amountPartial}
                                    onChange={event => props.handleChange(event)}
                                    onBlur={props.eventoBlur("montoPartial")}
                                    onFocus={props.eventoFocus("montoPartial")}
                                    type="text"
                                />
                                <div className={`${props.datosForm.montoPartialErrorHide} errorControlRowInput`}>
                                    {props.datosForm.montoPartialErrorText}
                                </div>
                            </div>
                        </FormGroup>
                        <hr />
                    </div>
                )
            }
        </div>
    );

}
export default PartialPayments;