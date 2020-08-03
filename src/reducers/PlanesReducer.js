import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const allPlanesFunction = (state, payload) => {
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

const allPlanesDisabledFunction = (state, payload) => {
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

const loadPlanIdAction = (state, payload) => {
    let penalties = [];
    payload.data.plan.penalties.map((data, i) => {
        penalties.push(data.info);
    });
    let estado = state.toJS();
    estado.planId = payload.data.plan;
    estado.arrayPenalty = penalties;
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

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.planId = payload.planId;
    estado.arrayPenalty = payload.arrayPenalty;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const planesReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_PLANES': {
            return Map(action.payload)
        }
        case "ALL_PLANES": {
            return allPlanesFunction(state, action.payload);
        }
        case "ALL_PLANES_DISABLED": {
            return allPlanesDisabledFunction(state, action.payload);
        }
        case "LOAD_PLAN_ID": {
            return loadPlanIdAction(state, action.payload);
        }
        case 'ADD_PENALTY': {
            return addPenaltyFunction(state, action.payload)
        }
        case 'DELETE_PENALTY': {
            return deletePenaltyFunction(state, action.payload)
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_PLANES': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default planesReducer;