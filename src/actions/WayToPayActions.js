import { NotificationManager } from 'react-notifications';
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const getAmountTotal = (data) => dispatch => {
    dispatch({
        type: "GET_AMOUNT_TOTAL",
        payload: {
            data: data,
        }
    });
};

export const setAmountTotal = (data, evento) => dispatch => {
    dispatch({
        type: "SET_AMOUNT_TOTAL",
        payload: {
            data: data,
            evento: evento,
        }
    });
};

export const setAmountPartial = (data, evento) => dispatch => {
    dispatch({
        type: "SET_AMOUNT_PARTIAL",
        payload: {
            data: data,
            evento: evento,
        }
    });
};

export const setSwitchPayPartial = (data, cart) => dispatch => {
    dispatch({
        type: "SET_SWITCH_PAY_PARTIAL",
        payload: {
            data: data,            
            cart: cart,
        }
    });
};

export const addWayToPaySale = (data, callback, dataAll) => dispatch => {
    dispatch({
        type: "ADD_WAY_TO_PAY_SALE",
        payload: {
            data: data,
        }
    });
    callback();
};

export const deletePaymentFunction = (data, key) => dispatch => {
    dispatch({
        type: "DELETE_PAYMENT",
        payload: {
            data: data,
            key: key
        }
    });
    NotificationManager.success("Pago eliminado");
}