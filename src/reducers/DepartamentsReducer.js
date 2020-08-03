import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allDepartamentsFunction = (state, payload) => {
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

const allDepartamentsDisabledFunction = (state, payload) => {
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

const loadDepartamentsIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.departamentId = payload.data.department;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.departamentId = payload.departamentId;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const departamentsReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_DEPARTAMENTS': {
            return Map(action.payload)
        }
        case "ALL_DEPARTAMENTS": {
            return allDepartamentsFunction(state, action.payload);
        }
        case "ALL_DEPARTAMENTS_DISABLED": {
            return allDepartamentsDisabledFunction(state, action.payload);
        }
        case "LOAD_DEPARTAMENTS_ID": {
            return loadDepartamentsIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_DEPARTAMENTS': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default departamentsReducer;