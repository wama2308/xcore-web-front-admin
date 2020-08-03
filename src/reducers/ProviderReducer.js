import { Map, fromJS } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allProviderFunction = (state, payload) => {
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

const allProviderDisabledFunction = (state, payload) => {
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

const loadProviderIdAction = (state, payload) => {
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
    estado.providerId = data;
    estado.contactsProvider = payload.data.contacts;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.providerId = payload;
    estado.contactsProvider = [];
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const addContactosProviderFunction = (state, payload) => {
    return state.updateIn(['contactsProvider'], arr => arr.concat([payload.data]))
}

const editContactosProviderFunction = (state, payload) => {
    const initialState = fromJS({ contactsProvider: state.get('contactsProvider') });
    const updateItem = initialState.setIn(["contactsProvider", payload.key], payload.data)
    return state.set('contactsProvider', updateItem.get('contactsProvider'));
}

const deleteContactosProviderFunction = (state, payload) => {
    const initialState = fromJS({ contactsProvider: state.get('contactsProvider') });
    const deleteItem = initialState.deleteIn(["contactsProvider", payload])
    return state.set('contactsProvider', deleteItem.get('contactsProvider'));
}

const addNewProviderFunction = (state, payload) => {
    let data = {
        _id: payload._id,
        name: payload.name,
        ruc: payload.ruc,
        type_identity: payload.type_identity
    }
    if (state.get('data').length < 10) {
        return state.updateIn(['data'], arr => arr.concat([data]))
    } else {
        return state;
    }
}

const updateReduxProviderAction = (state, payload) => {
    let data = {
        _id: payload._id,
        name: payload.name,
        ruc: payload.ruc,
        type_identity: payload.type_identity
    }
    const initialState = fromJS({ data: state.get('data') });
    const indexOfProviderUpdate = initialState.get('data').findIndex(providerUpdate => {
        return providerUpdate._id === payload._id;
    });
    const updateItem = initialState.setIn(["data", indexOfProviderUpdate], data)
    return state.set('data', updateItem.get('data'));
}

const providerReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_PROVIDER': {
            return Map(action.payload)
        }
        case "ALL_PROVIDER": {
            return allProviderFunction(state, action.payload);
        }
        case "ALL_PROVIDER_DISABLED": {
            return allProviderDisabledFunction(state, action.payload);
        }
        case "LOAD_PROVIDER_ID": {
            return loadProviderIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_PROVIDER': {
            return loadingTrue(state, action.payload)
        }
        case 'ADD_CONTACTOS_PROVIDER': {
            return addContactosProviderFunction(state, action.payload)
        }
        case 'EDIT_CONTACTOS_PROVIDER': {
            return editContactosProviderFunction(state, action.payload)
        }
        case 'DELETE_CONTACTOS_PROVIDER': {
            return deleteContactosProviderFunction(state, action.payload)
        }
        case 'ADD_NEW_PROVIDER': {
            return addNewProviderFunction(state, action.payload)
        }
        case 'UPDATE_REDUX_PROVIDER_ID': {
            return updateReduxProviderAction(state, action.payload)
        }
        default:
            return state;
    }
};

export default providerReducer;