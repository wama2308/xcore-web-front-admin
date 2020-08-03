import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allUsersFunction = (state, payload) => {
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

const allUsersDisabledFunction = (state, payload) => {
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

const loadUsersIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.userId = payload.data;    
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.userId = payload.clean;
    estado.newRol = payload.clean;    
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const usersReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_USERS': {
            return Map(action.payload)
        }
        case "ALL_USERS": {
            return allUsersFunction(state, action.payload);
        }
        case "ALL_USERS_DISABLED": {
            return allUsersDisabledFunction(state, action.payload);
        }
        case "LOAD_USERS_ID": {
            return loadUsersIdAction(state, action.payload);
        }              
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_USERS': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default usersReducer;