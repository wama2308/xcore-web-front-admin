import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allStoreFunction = (state, payload) => {
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

const allStoreDisabledFunction = (state, payload) => {
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

const loadStoreIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.storeId = payload.data.store;
    estado.shelfs = payload.data.store.shelfs;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.storeId = payload.storeId;
    estado.shelfs = payload.shelfs;
    return Map(estado);
}

const addShelfsFunction = (state, payload) => {
    let estado = state.toJS();
    estado.shelfs.push(payload.data);
    return Map(estado);
}

const editShelfsFunction = (state, payload) => {
    let estado = state.toJS();
    estado.shelfs[payload.key].name = payload.data.name;
    estado.shelfs[payload.key].description = payload.data.description;    
    return Map(estado);
}

const deleteShelfsFunction = (state, payload) => {
    let estado = state.toJS();    
    estado.shelfs.splice(payload, 1);    
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const storeReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_STORE': {
            return Map(action.payload)
        }
        case "ALL_STORE": {
            return allStoreFunction(state, action.payload);
        }
        case "ALL_STORE_DISABLED": {
            return allStoreDisabledFunction(state, action.payload);
        }
        case "LOAD_STORE_ID": {
            return loadStoreIdAction(state, action.payload);
        }
        case 'ADD_SHELFS': {
            return addShelfsFunction(state, action.payload)
        }
        case 'EDIT_SHELFS': {
            return editShelfsFunction(state, action.payload)
        }
        case 'DELETE_SHELFS': {
            return deleteShelfsFunction(state, action.payload)
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_STORE': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default storeReducer;