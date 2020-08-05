import { search } from "../actions/aplicantionActions";
import { seeker } from "../actions/aplicantionActions";
import { Map } from "immutable";
import { calculatePage, getArray } from './../helpers/helpers';

const InitalState = {
    snackBars: {
        type: "success",
        message: "",
        open: false
    },
    confirm: {
        open: false,
        message: "",
        callback: undefined
    },
    openModalExists: false,
    search: "",
    seeker: "",
    seekerProducts: "",
    seekerServices: "",
    outside: true,
    dataGeneral: null,
    searchloading: true,
    chat: {
        message: ""
    }
};

const limpiarStoreDataGeneral = (state, payload) => {
    let estado = state;    
    estado.seeker = "";
    estado.seekerProducts = "";
    estado.seekerServices = "";
    return estado;
}

const loadingChangeBranchOffice = (state, payload) => {
    let estado = state;
    estado.dataGeneral.loading = true;
    return estado;
}

const changeDynamicMenu = (state, payload) => {
    let estado = state;
    estado.dataGeneral.dataMenu = payload;
    estado.dataGeneral.loading = false;
    return estado;
}

const sessionOff = (state, payload) => {
    let estado = state;        
    estado.dataGeneral = null;    
    return estado;
}

const aplicationReducers = (state = InitalState, action) => {
    switch (action.type) {
        case "SEARCH_DATA": {
            return { ...state, search: action.payload, view: action.view };
        }
        case "SEEKER_DATA": {
            return { ...state, seeker: action.payload, view: action.view };
        }
        case "SEEKER_PRODUCTS": {
            return { ...state, seekerProducts: action.payload, view: action.view };
        }
        case "SEEKER_SERVICES": {
            return { ...state, seekerServices: action.payload, view: action.view };
        }
        case "OUT_CLICK": {
            return { ...state, outside: action.payload };
        }
        case "CONFIG_GENERAl": {
            return { ...state, dataGeneral: action.payload };
        }
        case "OPEN_CONFIRM": {
            return {
                ...state,
                confirm: {
                    open: true,
                    ...action.payload.message,
                    callback: action.payload.callback
                }
            };
        }
        case "CLOSE_CONFIRM": {
            return { ...state, confirm: { ...state.confirm, open: false } };
        }
        case "CLEAN_STORE_FORM": {
            return limpiarStoreDataGeneral(state, action.payload);
        }
        case 'LOADING_CHANGE_BRANCH_OFFICES': {
            return loadingChangeBranchOffice(state, action.payload)
        }
        case 'CHANGE_DYNAMIC_MENU': {
            return changeDynamicMenu(state, action.payload)
        }
        case "SESION_OFF": {
            return sessionOff(state, action.payload);
        }
        default:
            return state;
    }
};

export default aplicationReducers;
