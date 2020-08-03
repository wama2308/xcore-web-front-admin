import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allServicesFunction = (state, payload) => {
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

const allServicesDisabledFunction = (state, payload) => {
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

const loadServiceIdAction = (state, payload) => {
    let penalties = [];
    let screens = [];
    payload.data.service.penalties.map((data, i) => {
        penalties.push(data.info);
    });
    payload.data.service.screens.map((data, i) => {
        screens.push(data.info);
    });
    let estado = state.toJS();
    estado.serviceId = payload.data.service;
    estado.arrayPenalty = penalties;
    estado.arrayScreens = screens;
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
    estado.serviceId = payload.serviceId;
    estado.arrayPenalty = payload.arrayPenalty;
    estado.arrayScreens = payload.arrayScreens;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const servicesReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_SERVICES': {
            return Map(action.payload)
        }    
        case "ALL_SERVICES": {
            return allServicesFunction(state, action.payload);
        }
        case "ALL_SERVICES_DISABLED": {
            return allServicesDisabledFunction(state, action.payload);
        } 
        case "LOAD_SERVICE_ID": {
            return loadServiceIdAction(state, action.payload);
        }   
        case 'ADD_PENALTY_SERVICE': {
            return addPenaltyFunction(state, action.payload)
        }
        case 'DELETE_PENALTY_SERVICE': {
            return deletePenaltyFunction(state, action.payload)
        }
        case 'ADD_SCREEN_SERVICE': {
            return addScreenFunction(state, action.payload)
        }
        case 'DELETE_SCREEN_SERVICE': {
            return deleteScreenFunction(state, action.payload)
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_SERVICES': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default servicesReducer;