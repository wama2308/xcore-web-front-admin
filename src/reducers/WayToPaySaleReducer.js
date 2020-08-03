import { formatMonto, number_format } from "../helpers/helpers";
import { NotificationManager } from 'react-notifications';
import { updateLocalStorage } from "./../helpers/helpers";

const InitalState = {
    arrayWayToPaySale: [],
    amount: '0.00',
    amountPaidOut: 0,
    amountTotal: '0.00',
    amountTotalPartial: 0,
    amountFijo: 0,
    amountPartial: '0.00',
    payPartial: false,
};

const getAmountTotal = (state, payload) => {
    let estado = state;
    if (estado.amountPaidOut > formatMonto(payload.data)) {
        estado.arrayWayToPaySale = [];
        estado.amountPaidOut = 0;
        NotificationManager.warning("¡Venta modificada, debe agregar nuevamente la forma de pago!");
    }
    estado.amount = number_format(formatMonto(payload.data) - estado.amountPaidOut, 2);
    estado.amountTotal = formatMonto(payload.data);
    updateLocalStorage({ amount: estado.amount, amountTotal: estado.amountTotal }, 'getAmountTotal');
    return estado;
}

const setAmountTotal = (state, payload) => {
    let estado = state;
    let monto = "";
    if (payload.evento === 'focus' && estado.amount === '0.00') {
        monto = '';
    } else if (payload.evento === 'blur' && estado.amount === '') {
        monto = '0.00';
    } else {
        monto = payload.data.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    }
    estado.amount = monto;
    updateLocalStorage({ amount: estado.amount }, 'setAmountTotal');
    return estado;
}

const addWayToPaySale = (state, payload) => {
    let estado = state;
    let amountTotal = estado.payPartial ? estado.amountTotalPartial : estado.amountTotal;
    estado.arrayWayToPaySale.push(payload.data);
    if (payload.data.paymentMethodLocal !== null) {
        estado.amount = number_format(amountTotal - estado.amountPaidOut - formatMonto(estado.amount), 2);
        estado.amountPaidOut = payload.data.amount + estado.amountPaidOut;
    }
    if (payload.data.paymentMethodForeign !== null) {
        estado.amount = number_format(amountTotal - estado.amountPaidOut - payload.data.amount, 2);
        estado.amountPaidOut = payload.data.amount + estado.amountPaidOut;
    }
    updateLocalStorage(
        {
            amount: estado.amount,
            amountPaidOut: estado.amountPaidOut,
            arrayWayToPaySale: estado.arrayWayToPaySale
        },
        'addWayToPaySale'
    );
    return estado;
}

const deletePayment = (state, payload) => {
    let estado = state;
    let amountTotal = estado.payPartial ? estado.amountTotalPartial : estado.amountTotal;
    estado.arrayWayToPaySale.splice(payload.key, 1);
    estado.amountPaidOut = estado.amountPaidOut - payload.data.amount;
    estado.amount = number_format(amountTotal - estado.amountPaidOut, 2);
    updateLocalStorage(
        {
            amount: estado.amount,
            amountPaidOut: estado.amountPaidOut,
            arrayWayToPaySale: estado.arrayWayToPaySale
        },
        'deletePayment'
    );
    return estado;
}

const addDataBaseLocalStoreWayToPaySale = (state, payload) => {
    let estado = state;
    estado.arrayWayToPaySale = payload.stateSale.wayToPaySale.arrayWayToPaySale;
    estado.amountPaidOut = payload.stateSale.wayToPaySale.amountPaidOut;
    estado.amountTotal = payload.stateSale.wayToPaySale.amountTotal;
    estado.amount = payload.stateSale.wayToPaySale.amount;
    estado.amountTotalPartial = payload.stateSale.wayToPaySale.amountTotalPartial;
    estado.amountFijo = payload.stateSale.wayToPaySale.amountFijo;
    estado.amountPartial = payload.stateSale.wayToPaySale.amountPartial;
    estado.payPartial = payload.stateSale.wayToPaySale.payPartial;

    return estado;
}

const setSwitchPayPartial = (state, payload) => {
    let estado = state;
    let amountFijo = 0;
    let subTotal = 0;
    let impuesto = 0;
    let total = 0;
    estado.payPartial = payload.data;
    if (payload.data) {
        payload.cart.map((dataCart, i) => {
            if (!dataCart.partial_payment) {
                subTotal += (dataCart.productQuantity * dataCart.price);
                if (dataCart.tax !== null) {
                    impuesto += (dataCart.price * (dataCart.tax.amount / 100)) * dataCart.productQuantity;
                    total += (dataCart.price + (dataCart.price * (dataCart.tax.amount / 100))) * dataCart.productQuantity;
                } else {
                    impuesto += (dataCart.price * 0) * dataCart.productQuantity;
                    total += (dataCart.price + (dataCart.price * 0)) * dataCart.productQuantity;
                }
            }
        });

        if (total === estado.amountTotal) {
            NotificationManager.warning("¡No se puede realizar pago parcial a los items seleccionados!");
            estado.amountFijo = 0;
            estado.payPartial = false;
        } else {
            estado.amountFijo = total;
            estado.amount = "0.00";
            estado.amountPartial = "0.00";
            estado.arrayWayToPaySale = [];
        }
    } else {
        estado.amountFijo = 0;
        estado.amount = number_format(estado.amountTotal, 2);
        estado.amountPartial = "0.00";
        estado.arrayWayToPaySale = [];
    }

    updateLocalStorage(
        {
            payPartial: estado.payPartial,
            amount: estado.amount,
            amountFijo: estado.amountFijo,
            amountPartial: estado.amountPartial,
            arrayWayToPaySale: estado.arrayWayToPaySale
        },
        'setSwitchPayPartial'
    );
    return estado;
}

const setAmountPartial = (state, payload) => {
    let estado = state;
    let monto = "";
    if (payload.evento === 'focus' && estado.amountPartial === '0.00') {
        monto = '';
    } else if (payload.evento === 'blur' && estado.amountPartial === '') {
        monto = '0.00';
    } else {
        monto = payload.data.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    }
    estado.amountPartial = monto;
    estado.amount = number_format(formatMonto(monto) + estado.amountFijo, 2);
    estado.amountTotalPartial = formatMonto(monto) + estado.amountFijo;
    updateLocalStorage(
        {
            amount: estado.amount,
            amountPartial: estado.amountPartial,
            amountTotalPartial: estado.amountTotalPartial,
        },
        'setAmountPartial'
    );
    return estado;
}

const wayToPaySaleReducer = (state = InitalState, action) => {
    switch (action.type) {
        case 'ADD_WAY_TO_PAY_SALE': {
            return addWayToPaySale(state, action.payload)
        }
        case 'DELETE_PAYMENT': {
            return deletePayment(state, action.payload)
        }
        case 'GET_AMOUNT_TOTAL': {
            return getAmountTotal(state, action.payload)
        }
        case 'SET_AMOUNT_TOTAL': {
            return setAmountTotal(state, action.payload)
        }
        case 'SET_AMOUNT_PARTIAL': {
            return setAmountPartial(state, action.payload)
        }
        case 'SET_SWITCH_PAY_PARTIAL': {
            return setSwitchPayPartial(state, action.payload)
        }
        case 'CONFIG_GENERAl': {
            return addDataBaseLocalStoreWayToPaySale(state, action.payload)
        }

        default:
            return state;
    }
};

export default wayToPaySaleReducer;
