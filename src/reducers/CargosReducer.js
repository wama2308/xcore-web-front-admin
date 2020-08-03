import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allCargosFunction = (state, payload) => {
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

const allCargosDisabledFunction = (state, payload) => {
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

const loadCargosIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.cargoId = payload.data.departmentPosition;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.cargoId = payload.cargoId;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const cargosReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_CARGOS': {
            return Map(action.payload)
        }
        case "ALL_CARGOS": {
            return allCargosFunction(state, action.payload);
        }
        case "ALL_CARGOS_DISABLED": {
            return allCargosDisabledFunction(state, action.payload);
        }
        case "LOAD_CARGOS_ID": {
            return loadCargosIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_CARGOS': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default cargosReducer;