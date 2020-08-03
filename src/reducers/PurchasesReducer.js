import { Map, fromJS } from "immutable";
import { calculatePage, number_format, formatMonto } from './../helpers/helpers';

const allPurchasesFunction = (state, payload) => {
    let pagination = {
        total: payload.data.total,
        page: payload.data.page,
        perPage: payload.data.perPage,
        lastPage: payload.data.lastPage,
        numberPage: calculatePage(payload.data.page, 2, payload.data.lastPage),
    };
    let estado = state.toJS();
    estado.data = payload.data.data;
    estado.pagination = pagination;
    estado.loading = false;
    return Map(estado);
}

const allPurchasesDisabledFunction = (state, payload) => {
    let pagination = {
        total: payload.data.total,
        page: payload.data.page,
        perPage: payload.data.perPage,
        lastPage: payload.data.lastPage,
        numberPage: calculatePage(payload.data.page, 2, payload.data.lastPage),
    };
    let estado = state.toJS();
    estado.actionDisable = 1;
    estado.dataDisabled = payload.data.data;
    estado.paginationDisabled = pagination;
    estado.loading = false;
    return Map(estado);
}

const loadPurchasesIdAction = (state, payload) => {
    console.log(payload)
    let data = {
        country: payload.data.country,
        province: payload.data.province,
        district: payload.data.district,
        name: payload.data.name,
        ruc: payload.data.ruc,
        type_identity: payload.data.type_identity,
        web: payload.data.web,
        _id: payload.data._id,
    }
    let estado = state.toJS();
    estado.purchaseId = data;
    estado.products = payload.data.products;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.purchaseId = payload;
    estado.products = [];
    estado.subTotalPurchase = '0.00';
    estado.taxPurchase = '0.00';
    estado.totalPurchase = '0.00';
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const loadingTrueSearchProductPurchase = (state, payload) => {
    let estado = state.toJS();
    estado.loadingSearchProduct = payload;
    return Map(estado);
}

const addNewProductFunction = (state, payload) => {
    let subTotal = formatMonto(state.get('subTotalPurchase'));
    let tax = formatMonto(state.get('taxPurchase'));
    let total = formatMonto(state.get('totalPurchase'));

    subTotal += payload.data.unit_price * payload.data.quantity;
    tax += (payload.data.unit_price * payload.data.quantity) * (payload.data.tax / 100);
    total += (payload.data.unit_price * payload.data.quantity) + ((payload.data.unit_price * payload.data.quantity) * (payload.data.tax / 100));

    return state
        .updateIn(['products'], arr => arr.concat([payload.data]))
        .set('subTotalPurchase', number_format(subTotal, 2))
        .set('taxPurchase', number_format(tax, 2))
        .set('totalPurchase', number_format(total, 2))
}

const editProductPurchaseFunction = (state, payload) => {
    let subTotal = formatMonto(state.get('subTotalPurchase'));
    let tax = formatMonto(state.get('taxPurchase'));
    let total = formatMonto(state.get('totalPurchase'));

    subTotal -= payload.dataPrev.unit_price * payload.dataPrev.quantity;
    tax -= (payload.dataPrev.unit_price * payload.dataPrev.quantity) * (payload.dataPrev.tax / 100);
    total -= (payload.dataPrev.unit_price * payload.dataPrev.quantity) + ((payload.dataPrev.unit_price * payload.dataPrev.quantity) * (payload.dataPrev.tax / 100));

    subTotal += payload.data.unit_price * payload.data.quantity;
    tax += (payload.data.unit_price * payload.data.quantity) * (payload.data.tax / 100);
    total += (payload.data.unit_price * payload.data.quantity) + ((payload.data.unit_price * payload.data.quantity) * (payload.data.tax / 100));

    const initialState = fromJS({ products: state.get('products') });
    const updateItem = initialState.setIn(["products", payload.key], payload.data)
    return state
        .set('products', updateItem.get('products'))
        .set('subTotalPurchase', number_format(subTotal, 2))
        .set('taxPurchase', number_format(tax, 2))
        .set('totalPurchase', number_format(total, 2));

}

const deleteProdutcPurchaseFunction = (state, payload) => {
    let subTotal = formatMonto(state.get('subTotalPurchase'));
    let tax = formatMonto(state.get('taxPurchase'));
    let total = formatMonto(state.get('totalPurchase'));

    subTotal -= payload.data.unit_price * payload.data.quantity;
    tax -= (payload.data.unit_price * payload.data.quantity) * (payload.data.tax / 100);
    total -= (payload.data.unit_price * payload.data.quantity) + ((payload.data.unit_price * payload.data.quantity) * (payload.data.tax / 100));
    const initialState = fromJS({ products: state.get('products') });
    const deleteItem = initialState.deleteIn(["products", payload.key])
    return state
        .set('products', deleteItem.get('products'))
        .set('subTotalPurchase', number_format(subTotal, 2))
        .set('taxPurchase', number_format(tax, 2))
        .set('totalPurchase', number_format(total, 2));
}

const addWayToPayFunction = (state, payload) => {
    let paidUp = state.get('paidUp');
    paidUp += payload.data.local ? payload.data.amount : payload.data.amount * payload.data.rate;
    return state
        .updateIn(['wayToPay'], arr => arr.concat([payload.data]))
        .set('paidUp', paidUp);
}

const deleteWayToPayFunction = (state, payload) => {
    let paidUp = state.get('paidUp');
    paidUp -= payload.data.local ? payload.data.amount : payload.data.amount * payload.data.rate;

    const initialState = fromJS({ wayToPay: state.get('wayToPay') });
    const deleteItem = initialState.deleteIn(["wayToPay", payload.key])
    return state
        .set('wayToPay', deleteItem.get('wayToPay'))
        .set('paidUp', paidUp);
}

const searchProducturchaseFunction = (state, payload) => {   
    let paginationProducts = {
        total: payload.data.total,
        page: payload.data.page,
        perPage: payload.data.perPage,
        lastPage: payload.data.lastPage,
        numberPage: calculatePage(payload.data.page, 2, payload.data.lastPage),
    };
    return state
        .set('dataProducts', payload.data.data)
        .set('paginationProducts', paginationProducts)
        .set('loadingSearchProduct', false);    
}

const purchaseReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_PURCHASES': {
            return Map(action.payload)
        }
        case "ALL_PURCHASES": {
            return allPurchasesFunction(state, action.payload);
        }
        case "ALL_PURCHASES_DISABLED": {
            return allPurchasesDisabledFunction(state, action.payload);
        }
        case "LOAD_PURCHASES_ID": {
            return loadPurchasesIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_PURCHASES': {
            return loadingTrue(state, action.payload)
        }
        case 'LOADING_TRUE_SEARCH_PRODUCT_PURCHASE': {
            return loadingTrueSearchProductPurchase(state, action.payload)
        }
        case 'ADD_NEW_PRODUCT_PURCHASES': {
            return addNewProductFunction(state, action.payload)
        }
        case 'EDIT_PRODUCT_PURCHASE': {
            return editProductPurchaseFunction(state, action.payload)
        }
        case 'DELETE_PRODUCT_PURCHASE': {
            return deleteProdutcPurchaseFunction(state, action.payload)
        }
        case 'ADD_WAYTOPAY_PURCHASES': {
            return addWayToPayFunction(state, action.payload)
        }
        case 'DELETE_WAYTOPAY_PURCHASE': {
            return deleteWayToPayFunction(state, action.payload)
        }
        case 'SEARCH_PRODUCT_PURCHASE': {
            return searchProducturchaseFunction(state, action.payload)
        }

        default:
            return state;
    }
};

export default purchaseReducer;