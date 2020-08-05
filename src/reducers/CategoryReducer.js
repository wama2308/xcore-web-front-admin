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