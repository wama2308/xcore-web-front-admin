import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const allDiscountsFunction = (state, payload) => {
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

const allDiscountsDisabledFunction = (state, payload) => {
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

const loadDiscountsIdAction = (state, payload) => {
    let arrayAreas = [];
    payload.data.discount.areas.map((data, key) => {
        arrayAreas.push(data.info);
    });
    let arrayClases = [];
    payload.data.discount.clases.map((data, key) => {
        arrayClases.push(data.info);
    });
    let arrayPlanes = [];
    payload.data.discount.plans.map((data, key) => {
        arrayPlanes.push(data.info);
    });
    let arrayPackages = [];
    payload.data.discount.packages.map((data, key) => {
        arrayPackages.push(data.info);
    });
    let arrayProducts = [];
    payload.data.discount.products.map((data, key) => {
        arrayProducts.push({
            products_id: data.info._id,
            name: data.info.name,
            code: data.info.code,
        });
    });
    let arrayServices = [];
    payload.data.discount.services.map((data, key) => {
        arrayServices.push({
            services_id: data.info._id,
            name: data.info.name,
            description: data.info.description,
        });
    });

    let estado = state.toJS();
    estado.discountId = payload.data.discount;
    estado.arrayAreas = arrayAreas;
    estado.arrayClasses = arrayClases;
    estado.arrayPlanes = arrayPlanes;
    estado.arrayPackages = arrayPackages;
    estado.products = arrayProducts;
    estado.services = arrayServices;

    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.discountId = payload.discountId;
    estado.arrayAreas = [];
    estado.arrayClasses = [];
    estado.arrayPlanes = [];
    estado.arrayPackages = [];
    estado.products = [];
    estado.services = [];
    return Map(estado);
}

const searchProductoId = (state, payload) => {
    let objProduct = {
        products_id: payload.value,
        name: payload.label,
        code: payload.code,
    };
    let estado = state.toJS();
    estado.products.push(objProduct);
    return Map(estado);
}

const deleteProductoIdFunction = (state, payload) => {
    let estado = state.toJS();
    estado.products.splice(payload.key, 1);
    return Map(estado);
}

const searchServiceId = (state, payload) => {
    let objServices = {
        services_id: payload.value,
        name: payload.label,
        description: payload.description,
    };
    let estado = state.toJS();
    estado.services.push(objServices);
    return Map(estado);
}

const deleteServiceIdFunction = (state, payload) => {
    let estado = state.toJS();
    estado.services.splice(payload.key, 1);
    return Map(estado);
}

const addClassFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayClasses.push(payload.data);
    return Map(estado);
}

const deleteClassFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayClasses.splice(payload, 1);
    return Map(estado);
}

const addPlanFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPlanes.push(payload.data);
    return Map(estado);
}

const deletePlanFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPlanes.splice(payload, 1);
    return Map(estado);
}

const addPackagesFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPackages.push(payload.data);
    return Map(estado);
}

const deletePackageFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPackages.splice(payload, 1);
    return Map(estado);
}

const addAreasFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas.push(payload.data);
    return Map(estado);
}

const deleteAreasFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas.splice(payload, 1);
    return Map(estado);
}

const cleanStoreArrayAreasFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas = payload;
    return Map(estado);
}

const cleanStoreArrayClassFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayClasses = payload;
    return Map(estado);
}

const cleanStoreArrayPlanesFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPlanes = payload;
    return Map(estado);
}

const cleanStoreArrayPackagesFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPackages = payload;
    return Map(estado);
}

const cleanStoreArrayProductsFunction = (state, payload) => {
    let estado = state.toJS();
    estado.products = payload;
    return Map(estado);
}

const cleanStoreArrayServicesFunction = (state, payload) => {
    let estado = state.toJS();
    estado.services = payload;
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const discountsReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_DISCOUNTS': {
            return Map(action.payload)
        }
        case "ALL_DISCOUNTS": {
            return allDiscountsFunction(state, action.payload);
        }
        case "ALL_DISCOUNTS_DISABLED": {
            return allDiscountsDisabledFunction(state, action.payload);
        }
        case "LOAD_DISCOUNTS_ID": {
            return loadDiscountsIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case "SEARCH_PRODUCTS_DISCOUNTS": {
            return setData(state, "dataAllProducts", action.payload);
        }
        case "SEARCH_PRODUCTO_ID_DISCOUNTS": {
            return searchProductoId(state, action.payload);
        }
        case "DELETE_PRODUCTO": {
            return deleteProductoIdFunction(state, action.payload);
        }
        case "SEARCH_SERVICES_DISCOUNTS": {
            return setData(state, "dataAllServices", action.payload);
        }
        case "SEARCH_SERVICE_ID_DISCOUNTS": {
            return searchServiceId(state, action.payload);
        }
        case "DELETE_SERVICE": {
            return deleteServiceIdFunction(state, action.payload);
        }
        case 'ADD_CLASS_DISCOUNT': {
            return addClassFunction(state, action.payload)
        }
        case 'DELETE_CLASS_DISCOUNT': {
            return deleteClassFunction(state, action.payload)
        }
        case 'ADD_PLAN_DISCOUNT': {
            return addPlanFunction(state, action.payload)
        }
        case 'DELETE_PLAN_DISCOUNT': {
            return deletePlanFunction(state, action.payload)
        }
        case 'ADD_PACKAGE_DISCOUNT': {
            return addPackagesFunction(state, action.payload)
        }
        case 'DELETE_PACKAGE_DISCOUNT': {
            return deletePackageFunction(state, action.payload)
        }
        case 'ADD_AREA_DISCOUNT': {
            return addAreasFunction(state, action.payload)
        }
        case 'DELETE_AREA_DISCOUNT': {
            return deleteAreasFunction(state, action.payload)
        }
        case 'CLEAN_STORE_ARRAY_AREAS': {
            return cleanStoreArrayAreasFunction(state, action.payload)
        }
        case 'CLEAN_STORE_ARRAY_CLASS': {
            return cleanStoreArrayClassFunction(state, action.payload)
        }
        case 'CLEAN_STORE_ARRAY_PLANES': {
            return cleanStoreArrayPlanesFunction(state, action.payload)
        }
        case 'CLEAN_STORE_ARRAY_PACKAGES': {
            return cleanStoreArrayPackagesFunction(state, action.payload)
        }
        case 'CLEAN_STORE_ARRAY_PRODUCTS': {
            return cleanStoreArrayProductsFunction(state, action.payload)
        }
        case 'CLEAN_STORE_ARRAY_SERVICES': {
            return cleanStoreArrayServicesFunction(state, action.payload)
        }
        case 'LOADING_TRUE_DISCOUNT': {
            return loadingTrue(state, action.payload)
        }
        default:
            return state;
    }
};

export default discountsReducer;