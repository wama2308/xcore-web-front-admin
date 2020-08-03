import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const allSchedulesFunction = (state, payload) => {
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

const allSchedulesDisabledFunction = (state, payload) => {
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

const loadScheduleIdAction = (state, payload) => {
    let estado = state.toJS();
    estado.scheduleId = payload.data.schedule;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.scheduleId = payload.scheduleId;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const scheduleReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_SCHEDULES': {
            return Map(action.payload)
        }
        case "ALL_SCHEDULES": {
            return allSchedulesFunction(state, action.payload);
        }
        case "ALL_SCHEDULES_DISABLED": {
            return allSchedulesDisabledFunction(state, action.payload);
        }
        case "LOAD_SCHEDULE_ID": {
            return loadScheduleIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_SCHEDULES': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default scheduleReducer;