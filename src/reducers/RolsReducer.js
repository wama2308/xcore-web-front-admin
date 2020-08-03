import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allRolsFunction = (state, payload) => {
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

const allRolsDisabledFunction = (state, payload) => {
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

const loadRolsIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.rolId = payload.data.rol;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.rolId = payload.clean;    
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const rolsReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_ROLS': {
            return Map(action.payload)
        }
        case "ALL_ROLS": {
            return allRolsFunction(state, action.payload);
        }
        case "ALL_ROLS_DISABLED": {
            return allRolsDisabledFunction(state, action.payload);
        }
        case "LOAD_ROLS_ID": {
            return loadRolsIdAction(state, action.payload);
        }        
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_ROLS': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default rolsReducer;