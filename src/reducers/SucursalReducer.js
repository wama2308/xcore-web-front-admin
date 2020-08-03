import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const allBranchOfficesFunction = (state, payload) => {
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

const allBranchOfficesDisabledFunction = (state, payload) => {
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

const addContactosFunction = (state, payload) => {
    let estado = state.toJS();
    estado.contactos.push(payload.data);
    return Map(estado);
}

const editContactosFunction = (state, payload) => {
    let estado = state.toJS();
    estado.contactos[payload.key].name = payload.data.name;
    estado.contactos[payload.key].surname = payload.data.surname;
    estado.contactos[payload.key].email = payload.data.email;
    estado.contactos[payload.key].phone = payload.data.phone;
    return Map(estado);
}

const deleteContactosFunction = (state, payload) => {
    let estado = state.toJS();
    var listContactos = estado.contactos;
    listContactos.splice(payload, 1);
    estado.contactos = listContactos;
    return Map(estado);
}

const limpiarContactosFunction = (state, payload) => {
    let estado = state.toJS();
    estado.contactos = [];
    return Map(estado);
}

const setBranchOficcesId = (state, payload) => {
    let estado = state.toJS();
    estado.brachOfficesId = payload.data;
    estado.contactos = payload.data.contacts;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const sucursalReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_SUCURSALES': {
            return Map(action.payload)
        }
        case "ALL_BRANCHOFFICES": {
            return allBranchOfficesFunction(state, action.payload);
        }
        case "ALL_BRANCHOFFICES_DISABLED": {
            return allBranchOfficesDisabledFunction(state, action.payload);
        }
        case 'ADD_CONTACTOS': {
            return addContactosFunction(state, action.payload)
        }
        case 'EDIT_CONTACTOS': {
            return editContactosFunction(state, action.payload)
        }
        case 'DELETE_CONTACTOS': {
            return deleteContactosFunction(state, action.payload)
        }
        case 'CLEAN_CONTACTOS': {
            return limpiarContactosFunction(state, action.payload)
        }
        case 'LOAD_BRANCHOFFICES_ID': {
            return setBranchOficcesId(state, action.payload)
        }
        case 'LOADING_TRUE_BRANCHOFFICES': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default sucursalReducer;