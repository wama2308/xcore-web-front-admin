import { calculatePage, formatDateDateTables } from '../helpers/helpers';

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
    let estado = state;
    let data = {
        id: payload.data.id,
        name: payload.data.name,
        menu_icon: payload.data.menu_icon,
        description: payload.data.description,
        type: payload.data.type,
        new_item: payload.data.new_item,
        open: payload.data.open,
        position: payload.data.position,
        individual_amount: payload.data.individual_amount,
        test: payload.data.test,
        test_end_date: payload.data.test_end_date,
    }
    estado.categoryId = data;
    estado.dataSettings = payload.data.settings;
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

const addNewCategoryFunction = (state, payload) => {
    let payloadData = {
        id: payload.id,
        name: payload.name,
        type: payload.type,
        createdBy: payload.createdBy,
        created_at: payload.created_at
    }
    let dataState = state.data;
    let estado = state;
    if (dataState.length < 10) {
        let data = [...dataState, payloadData];
        estado.data = data;
        return estado;
    } else {
        return estado;
    }
}

const updateReduxCategoryFunction = (state, payload) => {
    let payloadData = {
        id: payload.id,
        name: payload.name,
        type: payload.type,
        createdBy: payload.createdBy,
        created_at: payload.created_at
    }
    let estado = state;
    let dataArray = state.data;
    let indexData = dataArray.findIndex(dataCategory => dataCategory.id === payload.id);
    let dataSettingsModules = [...dataArray.splice(indexData, 1, payloadData)];    
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
    estado.dataSettings = [];
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
        case 'ADD_NEW_CATEGORY': {
            return addNewCategoryFunction(state, action.payload)
        }
        case 'UPDATE_REDUX_CATEGORY': {
            return updateReduxCategoryFunction(state, action.payload)
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