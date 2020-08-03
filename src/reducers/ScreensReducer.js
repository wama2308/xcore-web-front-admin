import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allScreenFunction = (state, payload) => {
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

const allScreenDisabledFunction = (state, payload) => {
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

const loadScreenIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.screenId = payload.data.screen;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.screenId = payload.screenId;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const screenReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_SCREEN': {
            return Map(action.payload)
        }
        case "ALL_SCREEN": {
            return allScreenFunction(state, action.payload);
        }
        case "ALL_SCREEN_DISABLED": {
            return allScreenDisabledFunction(state, action.payload);
        }
        case "LOAD_SCREEN_ID": {
            return loadScreenIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_SCREENS': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default screenReducer;