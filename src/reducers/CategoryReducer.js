import { calculatePage } from '../helpers/helpers';

const allCategoryFunction = (state, payload) => {
    let pagination = {
        total: payload.data.total,
        page: payload.data.page,
        perPage: payload.data.perPage,
        lastPage: payload.data.lastPage,
        numberPage: calculatePage(payload.data.page, 2, payload.data.lastPage),
    };
    let estado = state;
    estado.data = payload.data.data;
    estado.pagination = pagination;
    estado.loading = false;
    return estado;
}

const allCategoryDisabledFunction = (state, payload) => {
    let pagination = {
        total: payload.data.total,
        page: payload.data.page,
        perPage: payload.data.perPage,
        lastPage: payload.data.lastPage,
        numberPage: calculatePage(payload.data.page, 2, payload.data.lastPage),
    };
    let estado = state;
    estado.actionDisable = 1;
    estado.dataDisabled = payload.data.data;
    estado.paginationDisabled = pagination;
    estado.loading = false;
    return estado;
}

const loadCategoryIdAction = (state, payload) => {
    console.log(payload)
    let estado = state;
    // let data = {
    //     country: payload.data.country,
    //     province: payload.data.province,
    //     district: payload.data.district,
    //     name: payload.data.name,
    //     ruc: payload.data.ruc,
    //     type_identity: payload.data.type_identity,
    //     web: payload.data.web,
    //     _id: payload.data._id,
    // }    
    // estado.providerId = data;
    // estado.contactsProvider = payload.data.contacts;
    return estado;
}

const addSettingsCategoryFunction = (state, payload) => {
    let dataSettingsState = state.dataSettings;
    let dataSettings = [...dataSettingsState, payload.data];
    let estado = state;
    estado.dataSettings = dataSettings;
    return estado;
}

const updateSettingsCategoryFunction = (state, payload) => {
    let dataSettingsState = state.dataSettings;
    let dataSettings = [...dataSettingsState.splice(payload.key, 1, payload.data)];
    let estado = state;
    return estado
}

const deleteSettingsCategoryFunction = (state, payload) => {
    let dataSettingsState = state.dataSettings;
    let dataSettings = dataSettingsState.slice(0, payload).concat(dataSettingsState.slice(payload + 1))
    let estado = state;
    estado.dataSettings = dataSettings;
    return estado
}

const addSettingsModuleFunction = (state, payload) => {
    let dataSettingsModulesState = state.dataSettingsModules;
    let dataSettingsModules = [...dataSettingsModulesState, payload.data];
    let estado = state;
    estado.dataSettingsModules = dataSettingsModules;
    return estado;
}

const updateSettingsModuleFunction = (state, payload) => {
    let dataSettingsModulesState = state.dataSettingsModules;
    let dataSettingsModules = [...dataSettingsModulesState.splice(payload.key, 1, payload.data)];
    let estado = state;
    return estado
}

const deleteSettingsModuleFunction = (state, payload) => {
    let dataSettingsModulesState = state.dataSettingsModules;
    let dataSettingsModules = dataSettingsModulesState.slice(0, payload).concat(dataSettingsModulesState.slice(payload + 1))
    let estado = state;
    estado.dataSettingsModules = dataSettingsModules;
    return estado
}

const clenaSettingsModuleFunction = (state, payload) => {
    let estado = state;
    estado.dataSettingsModules = payload;
    return estado
}

const cleanStoreFunction = (state, payload) => {
    let estado = state;
    estado.categoryId = payload;
    return estado;
}

const loadingTrue = (state, payload) => {
    let estado = state;
    estado.loading = payload;
    return estado;
}


const CategoryReducer = (state = {}, action) => {
    switch (action.type) {
        case 'LOAD_CATEGORY': {
            return action.payload;
        }
        case "ALL_CATEGORY": {
            return allCategoryFunction(state, action.payload);
        }
        case "ALL_CATEGORY_DISABLED": {
            return allCategoryDisabledFunction(state, action.payload);
        }
        case "LOAD_CATEGORY_ID": {
            return loadCategoryIdAction(state, action.payload);
        }
        case 'ADD_SEETINGS_CATEGORY': {
            return addSettingsCategoryFunction(state, action.payload)
        }
        case 'UPDATE_SETTINGS_CATEGORY': {
            return updateSettingsCategoryFunction(state, action.payload)
        }
        case 'DELETE_SETTINGS_CATEGORY': {
            return deleteSettingsCategoryFunction(state, action.payload)
        }
        case 'ADD_SEETINGS_MODULE': {
            return addSettingsModuleFunction(state, action.payload)
        }
        case 'UPDATE_SETTINGS_MODULE': {
            return updateSettingsModuleFunction(state, action.payload)
        }
        case 'DELETE_SETTINGS_MODULE': {
            return deleteSettingsModuleFunction(state, action.payload)
        }
        case 'CLEAN_SETTINGS_MODULE': {
            return clenaSettingsModuleFunction(state, action.payload)
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_CATEGORY': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default CategoryReducer;