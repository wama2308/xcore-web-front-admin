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

const addScheduleFunction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.dataSchedule.push(payload.data);
    estado.dataGeneral.newSchedule = payload.data;
    return estado;
};

const addDiscountFunction = (state, payload) => {
    let objDiscount = {
        label: payload.data.name,
        value: payload.data._id,
        info: {
            _id: payload.data._id,
            name: payload.data.name,
            type: payload.data.type,
            value: payload.data.value,
            start_date: payload.data.start_date,
            final_date: payload.data.final_date,
        }
    };
    let estado = state;
    estado.dataGeneral.dataDiscount.push(objDiscount);
    estado.dataGeneral.newDiscount = objDiscount;
    return estado;
};

const limpiarStoreDataGeneral = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newSchedule = {};
    estado.dataGeneral.newDiscount = {};
    estado.dataGeneral.newRol = {};
    estado.dataGeneral.checked = [];
    estado.dataGeneral.expanded = [];
    estado.dataGeneral.checkedSpecials = [];
    estado.dataGeneral.expandedSpecials = [];
    estado.seeker = "";
    estado.seekerProducts = "";
    estado.seekerServices = "";
    return estado;
}

const loadScheduleAreaFunction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newSchedule = payload.data.area.schedule;
    estado.dataGeneral.newDiscount = payload.data.area.discount;
    return estado;
}

const loadSchedulePlanFunction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newSchedule = payload.data.plan.schedule;
    estado.dataGeneral.newDiscount = payload.data.plan.discount;
    return estado;
}

const loadScheduleClassFunction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newSchedule = payload.data.classes.schedule;
    estado.dataGeneral.newDiscount = payload.data.classes.discount;
    return estado;
}

const loadScheduleServiceIdAction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newSchedule = payload.data.service.schedule;
    estado.dataGeneral.newDiscount = payload.data.service.discount;
    return estado;
}

const loadScheduleSelectFunction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newSchedule = payload.data;
    return estado;
}

const addDiscountSelect = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newDiscount = payload.data;
    return estado;
}

const addDiscountSelectRewards = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newDiscount = payload.data;
    return estado;
}

const loadDiscountPackagesIdAction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newDiscount = payload.data.package.discount;
    return estado;
}

const loadDiscountRewardsIdAction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.newDiscount = payload.data.reward.discount;
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

const checkedTreeFunction = (state, payload) => {
    let estado = state;
    if (payload.option === 0) {
        estado.dataGeneral.checked = payload.checked;
    } else {
        estado.dataGeneral.checkedSpecials = payload.checked;
    }

    return estado;
}

const expandedTreeFunction = (state, payload) => {
    let estado = state;
    if (payload.option === 0) {
        estado.dataGeneral.expanded = payload.expanded;
    } else {
        estado.dataGeneral.expandedSpecials = payload.expanded;
    }
    return estado;
}

const checkedAllTreeFunction = (state, payload) => {
    let modules = [];
    let permits = [];
    let estado = state;
    if (payload.option === 0) {
        if (payload.value) {
            estado.dataGeneral.dataModulesPermitsAll.map((module, i) => {
                modules.push(module.value);
                module.children.map((permit, i) => {
                    permits.push(permit.value);
                });
            });
        }
        estado.dataGeneral.checked = permits;
        estado.dataGeneral.expanded = modules;
    } else {
        if (payload.value) {
            estado.dataGeneral.dataModulesPermitsAll.map((module, i) => {
                modules.push(module.value);
                module.children.map((permit, i) => {
                    permits.push(permit.value);
                });
            });
        }
        estado.dataGeneral.checkedSpecials = permits;
        estado.dataGeneral.expandedSpecials = modules;
    }
    return estado;
}

const searchModulesRolsFunction = (state, payload) => {
    let estado = state;
    const dataModulesPermits = getArray(estado.dataGeneral.dataModulesPermitsAll)
    const dataModulesPermitsSpecials = getArray(estado.dataGeneral.dataModulesPermitsAll)
    let expresion = new RegExp(`${payload.value}.*`, "i");
    if (payload.option === 0) {
        const result = dataModulesPermits.filter(data => expresion.test(data.label));
        estado.dataGeneral.dataModulesPermits = result;
    } else {
        const result = dataModulesPermitsSpecials.filter(data => expresion.test(data.label));
        estado.dataGeneral.dataModulesPermitsSpecials = result;
    }
    return estado;
}

const loadRolsIdAction = (state, payload) => {
    let estado = state;
    estado.dataGeneral.checked = payload.data.rol.permits;
    estado.dataGeneral.expanded = payload.data.rol.modules;
    return estado;
}

const cleanStoreNewRolUSerFunction = (state, payload) => {
    let estado = state;
    if (payload.option === 0) {
        estado.dataGeneral.checked = [];
        estado.dataGeneral.expanded = [];
        estado.dataGeneral.dataModulesPermits = estado.dataGeneral.dataModulesPermitsAll;
    } else {
        estado.dataGeneral.checkedSpecials = [];
        estado.dataGeneral.expandedSpecials = [];
        estado.dataGeneral.dataModulesPermitsSpecials = estado.dataGeneral.dataModulesPermitsAll;
    }
    return estado;
}

const loadUsersIdAction = (state, payload) => {
    let estado = state;    
    estado.dataGeneral.expandedSpecials = payload.data.specialModules;
    estado.dataGeneral.checkedSpecials = payload.data.specialPermits;
    estado.dataGeneral.newRol = payload.data.rol;    
    return estado;
}

const newRolUserFunction = (state, payload) => {
    let estado = state;    
    estado.dataGeneral.dataRols.push(payload.data.newRol);    
    estado.dataGeneral.newRol = payload.data.newRol;        
    return estado;
}

const selectRolFunction = (state, payload) => {
    let estado = state;    
    estado.dataGeneral.newRol = payload.value ? payload.value : {};    
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
        case 'ADD_SCHEDULE': {
            return addScheduleFunction(state, action.payload)
        }
        case 'ADD_DISCOUNT': {
            return addDiscountFunction(state, action.payload)
        }
        case 'LOAD_AREA_ID': {
            return loadScheduleAreaFunction(state, action.payload)
        }
        case "LOAD_PLAN_ID": {
            return loadSchedulePlanFunction(state, action.payload);
        }
        case "LOAD_CLASS_ID": {
            return loadScheduleClassFunction(state, action.payload);
        }
        case "LOAD_SERVICE_ID": {
            return loadScheduleServiceIdAction(state, action.payload);
        }
        case 'LOAD_SCHEDULE_SELECT': {
            return loadScheduleSelectFunction(state, action.payload)
        }
        case 'ADD_SELECT_DISCOUNT': {
            return addDiscountSelect(state, action.payload)
        }
        case "LOAD_PACKAGES_ID": {
            return loadDiscountPackagesIdAction(state, action.payload);
        }
        case "ADD_SELECT_DISCOUNT_REWARDS": {
            return addDiscountSelectRewards(state, action.payload);
        }
        case "LOAD_REWARD_ID": {
            return loadDiscountRewardsIdAction(state, action.payload);
        }
        case 'LOADING_CHANGE_BRANCH_OFFICES': {
            return loadingChangeBranchOffice(state, action.payload)
        }
        case 'CHANGE_DYNAMIC_MENU': {
            return changeDynamicMenu(state, action.payload)
        }
        case "CHECKED_TREE": {
            return checkedTreeFunction(state, action.payload);
        }
        case "EXPANDED_TREE": {
            return expandedTreeFunction(state, action.payload);
        }
        case "CHECKED_ALL_TREE": {
            return checkedAllTreeFunction(state, action.payload);
        }
        case "SEARCH_MODULES_ROLS": {
            return searchModulesRolsFunction(state, action.payload);
        }
        case "LOAD_ROLS_ID": {
            return loadRolsIdAction(state, action.payload);
        }
        case "CLEAN_STORE_FORM_NEW_ROL_USER": {
            return cleanStoreNewRolUSerFunction(state, action.payload);
        }
        case "LOAD_USERS_ID": {
            return loadUsersIdAction(state, action.payload);
        }
        case "NEW_ROL_USERS": {
            return newRolUserFunction(state, action.payload);
        }
        case "SELECT_ROL_VALUE": {
            return selectRolFunction(state, action.payload);
        }
        case "SESION_OFF": {
            return sessionOff(state, action.payload);
        }
        default:
            return state;
    }
};

export default aplicationReducers;
