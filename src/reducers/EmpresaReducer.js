import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const setDataEmpresaId = (state, payload) => {
    let estado = state.toJS();
    const key = estado.data.findIndex(empresa => empresa._id === payload.id);
    estado.data[key].name = payload.name;
    estado.data[key].logo = payload.logo;
    return Map(estado);
}

const allBusinessFunction = (state, payload) => {
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

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const empresaReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_EMPRESAS': {
            return Map(action.payload)
        }
        case "ALL_BUSINESS": {
            return allBusinessFunction(state, action.payload);
        }
        case 'EMPRESA_ID': {
            return setDataEmpresaId(state, action.payload)
        }
        case 'LOADING_TRUE_BUSINESS': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }

};

export default empresaReducer;