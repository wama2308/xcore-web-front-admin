import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const loadClassIdAction = (state, payload) => {
    let penalties = [];
    let screens = [];
    payload.data.classes.penalties.map((data, i) => {
        penalties.push(data.info);
    });
    payload.data.classes.screens.map((data, i) => {
        screens.push(data.info);
    });
    let estado = state.toJS();
    estado.classId = payload.data.classes;
    estado.arrayPenalty = penalties;
    estado.arrayScreens = screens;
    return Map(estado);
}

const allClassFunction = (state, payload) => {
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

const allClassDisabledFunction = (state, payload) => {
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

const addPenaltyFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPenalty.push(payload.data);
    return Map(estado);
}

const deletePenaltyFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPenalty.splice(payload, 1);
    return Map(estado);
}

const addScreenFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayScreens.push(payload.data);
    return Map(estado);
}

const deleteScreenFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayScreens.splice(payload, 1);
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.classId = payload.classId;
    estado.arrayPenalty = payload.arrayPenalty;
    estado.arrayScreens = payload.arrayScreens;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const lessonsReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_CLASS': {
            return Map(action.payload)
        }
        case "ALL_CLASS": {
            return allClassFunction(state, action.payload);
        }
        case "ALL_CLASS_DISABLED": {
            return allClassDisabledFunction(state, action.payload);
        }
        case "LOAD_CLASS_ID": {
            return loadClassIdAction(state, action.payload);
        }
        case 'ADD_PENALTY_CLASS': {
            return addPenaltyFunction(state, action.payload)
        }
        case 'DELETE_PENALTY_CLASS': {
            return deletePenaltyFunction(state, action.payload)
        }
        case 'ADD_SCREEN_CLASS': {
            return addScreenFunction(state, action.payload)
        }
        case 'DELETE_SCREEN_CLASS': {
            return deleteScreenFunction(state, action.payload)
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_CLASSES': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default lessonsReducer;