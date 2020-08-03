import { Map, List } from "immutable";
import { calculatePage } from "../helpers/helpers";

const setData = (state, node, payload) => state.set(node, payload);

const allTypeClientFunction = (state, payload) => {
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

const allTypeClientDisabledFunction = (state, payload) => {
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

const loadTypeClientIdAction = (state, payload) => {
    let areas = [];
    let clases = [];
    let planes = [];
    let packages = [];
    let servicios = [];

    if (payload.data.typeClient.areas.length > 0) {
        payload.data.typeClient.areas.map((data, i) => {

            let time_cycle = {};
            data.pivot.time_cycle ? time_cycle = { label: 'Mensual', value: true } :
                time_cycle = { label: 'Diario', value: false }

            let percentage = {};
            data.pivot.percentage ? percentage = { label: 'Porcentaje', value: true } :
                percentage = { label: 'Monto', value: false }

            areas.push({
                _id: data._id,
                name: data.name,
                amount: data.amount,
                type_comparison: data.pivot.type_comparison,
                time_cycle: time_cycle,
                time_amount: data.pivot.time_amount,
                percentage: percentage,
                percentage_amount: data.pivot.percentage_amount.toString(),
            });
        });
    }

    if (payload.data.typeClient.classes.length > 0) {
        payload.data.typeClient.classes.map((data, i) => {

            let time_cycle = {};
            data.pivot.time_cycle ? time_cycle = { label: 'Mensual', value: true } :
                time_cycle = { label: 'Diario', value: false }

            let percentage = {};
            data.pivot.percentage ? percentage = { label: 'Porcentaje', value: true } :
                percentage = { label: 'Monto', value: false }

            clases.push({
                _id: data._id,
                name: data.name,
                amount: data.amount,
                type_comparison: data.pivot.type_comparison,
                time_cycle: time_cycle,
                time_amount: data.pivot.time_amount,
                percentage: percentage,
                percentage_amount: data.pivot.percentage_amount.toString(),
            });
        });
    }

    if (payload.data.typeClient.plans.length > 0) {
        payload.data.typeClient.plans.map((data, i) => {

            let time_cycle = {};
            data.pivot.time_cycle ? time_cycle = { label: 'Mensual', value: true } :
                time_cycle = { label: 'Diario', value: false }

            let percentage = {};
            data.pivot.percentage ? percentage = { label: 'Porcentaje', value: true } :
                percentage = { label: 'Monto', value: false }

            planes.push({
                _id: data._id,
                name: data.name,
                amount: data.amount,
                type_comparison: data.pivot.type_comparison,
                time_cycle: time_cycle,
                time_amount: data.pivot.time_amount,
                percentage: percentage,
                percentage_amount: data.pivot.percentage_amount.toString(),
            });
        });
    }

    if (payload.data.typeClient.packages.length > 0) {
        payload.data.typeClient.packages.map((data, i) => {

            let time_cycle = {};
            data.pivot.time_cycle ? time_cycle = { label: 'Mensual', value: true } :
                time_cycle = { label: 'Diario', value: false }

            let percentage = {};
            data.pivot.percentage ? percentage = { label: 'Porcentaje', value: true } :
                percentage = { label: 'Monto', value: false }

            packages.push({
                _id: data._id,
                name: data.name,
                amount: data.amount,
                type_comparison: data.pivot.type_comparison,
                time_cycle: time_cycle,
                time_amount: data.pivot.time_amount,
                percentage: percentage,
                percentage_amount: data.pivot.percentage_amount.toString(),
            });
        });
    }

    if (payload.data.typeClient.services.length > 0) {
        payload.data.typeClient.services.map((data, i) => {

            let time_cycle = {};
            data.pivot.time_cycle ? time_cycle = { label: 'Mensual', value: true } :
                time_cycle = { label: 'Diario', value: false }

            let percentage = {};
            data.pivot.percentage ? percentage = { label: 'Porcentaje', value: true } :
                percentage = { label: 'Monto', value: false }

            servicios.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                type_comparison: data.pivot.type_comparison,
                time_cycle: time_cycle,
                time_amount: data.pivot.time_amount,
                percentage: percentage,
                percentage_amount: data.pivot.percentage_amount.toString(),
            });
        });
    }

    let estado = state.toJS();
    estado.typeClientId = payload.data.typeClient;
    estado.arrayAreas = areas;
    estado.arrayClasses = clases;
    estado.arrayPlanes = planes;
    estado.arrayPackages = packages;
    estado.services = servicios;
    return Map(estado);
}

const addAreasFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        amount: payload.data.amount,
        type_comparison: payload.objectData.type_comparison,
        time_cycle: payload.objectData.time_cycle,
        time_amount: payload.objectData.time_amount,
        percentage: payload.objectData.percentage,
        percentage_amount: payload.objectData.percentage_amount,
    };
    let estado = state.toJS();
    estado.arrayAreas.push(data);
    return Map(estado);
}

const deleteAreasFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas.splice(payload, 1);
    return Map(estado);
}

const addClassFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        amount: payload.data.amount,
        type_comparison: payload.objectData.type_comparison,
        time_cycle: payload.objectData.time_cycle,
        time_amount: payload.objectData.time_amount,
        percentage: payload.objectData.percentage,
        percentage_amount: payload.objectData.percentage_amount,
    };
    let estado = state.toJS();
    estado.arrayClasses.push(data);
    return Map(estado);
}

const deleteClassFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayClasses.splice(payload, 1);
    return Map(estado);
}

const addPlanFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        amount: payload.data.amount,
        type_comparison: payload.objectData.type_comparison,
        time_cycle: payload.objectData.time_cycle,
        time_amount: payload.objectData.time_amount,
        percentage: payload.objectData.percentage,
        percentage_amount: payload.objectData.percentage_amount,
    };
    let estado = state.toJS();
    estado.arrayPlanes.push(data);
    return Map(estado);
}

const deletePlanFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPlanes.splice(payload, 1);
    return Map(estado);
}

const addPackageFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        amount: payload.data.amount,
        type_comparison: payload.objectData.type_comparison,
        time_cycle: payload.objectData.time_cycle,
        time_amount: payload.objectData.time_amount,
        percentage: payload.objectData.percentage,
        percentage_amount: payload.objectData.percentage_amount,
    };
    let estado = state.toJS();
    estado.arrayPackages.push(data);
    return Map(estado);
}

const deletePackageFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPackages.splice(payload, 1);
    return Map(estado);
}

const searchProductoId = (state, payload) => {
    let objProduct = {
        products_id: payload.value,
        name: payload.label,
        code: payload.code,
        type_comparison: "",
        time_cycle: null,
        time_amount: "",
        percentage: null,
        percentage_amount: "",
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

const setDataProductsAction = (state, payload) => {
    let estado = state.toJS();
    const key = estado.products.findIndex(data => data.products_id === payload.id);
    if (payload.type === 'type_comparison') {
        estado.products[key].type_comparison = payload.value;
    } else if (payload.type === 'time_amount') {
        estado.products[key].time_amount = payload.value;
    } else {
        let monto = "";
        if (payload.value) {
            monto = payload.value.replace(/\D/g, "")
                .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        }

        estado.products[key].percentage_amount = monto;
    }
    return Map(estado);
}

const setSelectDataProducts = (state, payload) => {
    let estado = state.toJS();
    const key = estado.products.findIndex(data => data.products_id === payload.id);
    if (payload.type === 'time_cycle') {
        estado.products[key].time_cycle = payload.data;
    } else {
        estado.products[key].percentage = payload.data;
    }
    return Map(estado);
}

const searchServiceId = (state, payload) => {
    let objService = {
        services_id: payload.value,
        name: payload.label,
        description: payload.description,
        type_comparison: "",
        time_cycle: null,
        time_amount: "",
        percentage: null,
        percentage_amount: "",
    };
    let estado = state.toJS();
    estado.services.push(objService);
    return Map(estado);
}

const deleteServiceIdFunction = (state, payload) => {
    let estado = state.toJS();
    estado.services.splice(payload.key, 1);
    return Map(estado);
}

const setDataServicesAction = (state, payload) => {
    let estado = state.toJS();
    const key = estado.services.findIndex(data => data.services_id === payload.id);
    if (payload.type === 'type_comparison') {
        estado.services[key].type_comparison = payload.value;
    } else if (payload.type === 'time_amount') {
        estado.services[key].time_amount = payload.value;
    } else {
        let monto = "";
        if (payload.value) {
            monto = payload.value.replace(/\D/g, "")
                .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        }
        estado.services[key].percentage_amount = monto;
    }
    return Map(estado);
}

const setSelectDataServices = (state, payload) => {
    let estado = state.toJS();
    const key = estado.services.findIndex(data => data.services_id === payload.id);
    if (payload.type === 'time_cycle') {
        estado.services[key].time_cycle = payload.data;
    } else {
        estado.services[key].percentage = payload.data;
    }
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.typeClientId = payload.typeClientId;
    estado.arrayAreas = [];
    estado.arrayClasses = [];
    estado.arrayPlanes = [];
    estado.arrayPackages = [];
    estado.products = [];
    estado.services = [];
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();    
    estado.loading = payload;    
    return Map(estado);
}

const cleanStoreTypeClientFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas = [];
    estado.arrayClasses = [];
    estado.arrayPlanes = [];
    estado.arrayPackages = []
    estado.services = [];
    return Map(estado);
}

const typeClientReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_TYPE_CLIENT': {
            return Map(action.payload)
        }
        case "ALL_TYPE_CLIENT": {
            return allTypeClientFunction(state, action.payload);
        }
        case "ALL_TYPE_CLIENT_DISABLED": {
            return allTypeClientDisabledFunction(state, action.payload);
        }
        case "LOAD_TYPE_CLIENT_ID": {
            return loadTypeClientIdAction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'ADD_AREA_TYPE_CLIENT': {
            return addAreasFunction(state, action.payload)
        }
        case 'DELETE_AREA_TYPE_CLIENT': {
            return deleteAreasFunction(state, action.payload)
        }
        case 'ADD_CLASS_TYPE_CLIENT': {
            return addClassFunction(state, action.payload)
        }
        case 'DELETE_CLASS_TYPE_CLIENT': {
            return deleteClassFunction(state, action.payload)
        }
        case 'ADD_PLAN_TYPE_CLIENT': {
            return addPlanFunction(state, action.payload)
        }
        case 'DELETE_PLAN_TYPE_CLIENT': {
            return deletePlanFunction(state, action.payload)
        }
        case 'ADD_PACKAGE_TYPE_CLIENT': {
            return addPackageFunction(state, action.payload)
        }
        case 'DELETE_PACKAGE_TYPE_CLIENT': {
            return deletePackageFunction(state, action.payload)
        }
        case "SEARCH_PRODUCTS_TYPE_CLIENT": {
            return setData(state, "dataAllProducts", action.payload);
        }
        case "SEARCH_PRODUCTO_ID_TYPE_CLIENT": {
            return searchProductoId(state, action.payload);
        }
        case "DELETE_PRODUCTO_TYPE_CLIENT": {
            return deleteProductoIdFunction(state, action.payload);
        }
        case "SET_DATA_PRODUCTS": {
            return setDataProductsAction(state, action.payload);
        }
        case "SET_SELECT_DATA_PRODUCTS": {
            return setSelectDataProducts(state, action.payload);
        }
        case "SEARCH_SERVICES_TYPE_CLIENT": {
            return setData(state, "dataAllServices", action.payload);
        }
        case "SEARCH_SERVICE_ID_TYPE_CLIENT": {
            return searchServiceId(state, action.payload);
        }
        case "DELETE_SERVICE_TYPE_CLIENT": {
            return deleteServiceIdFunction(state, action.payload);
        }
        case "SET_DATA_SERVICES": {
            return setDataServicesAction(state, action.payload);
        }
        case "SET_SELECT_DATA_SERVICES": {
            return setSelectDataServices(state, action.payload);
        }
        case 'LOADING_TRUE_TYPE_CLIENT': {
            return loadingTrue(state, action.payload)
        }
        case 'CLEAN_STORE_FORM_TYPE_CLIENTS': {
            return cleanStoreTypeClientFunction(state, action.payload)
        }
        default:
            return state;
    }
};

export default typeClientReducer;