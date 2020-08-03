import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const allPackagesFunction = (state, payload) => {
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

const allPackagesDisabledFunction = (state, payload) => {
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

const loadPackagesIdAction = (state, payload) => {
    let areas = [];
    let clases = [];
    let planes = [];
    let productos = [];
    let servicios = [];
    let penalties = [];
    if (payload.data.package.discount_general) {
        payload.data.package.areas.map((data, i) => {
            areas.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: payload.data.package.discount.value,
                name_discount: payload.data.package.discount.label,
                type_discount: payload.data.package.discount.info.type,
                value_discount: payload.data.package.discount.info.value,
            });
        });
        payload.data.package.class.map((data, i) => {
            clases.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: payload.data.package.discount.value,
                name_discount: payload.data.package.discount.label,
                type_discount: payload.data.package.discount.info.type,
                value_discount: payload.data.package.discount.info.value,
            });
        });
        payload.data.package.plans.map((data, i) => {
            planes.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: payload.data.package.discount.value,
                name_discount: payload.data.package.discount.label,
                type_discount: payload.data.package.discount.info.type,
                value_discount: payload.data.package.discount.info.value,
            });
        });
        payload.data.package.products.map((data, i) => {
            productos.push({
                products_id: data._id,
                name: data.name,
                code: data.code,
                valueSelect: null,
                discount_id: payload.data.package.discount.value,
                name_discount: payload.data.package.discount.label,
                type_discount: payload.data.package.discount.info.type,
                value_discount: payload.data.package.discount.info.value,
            });
        });
        payload.data.package.services.map((data, i) => {
            servicios.push({
                services_id: data._id,
                name: data.name,
                description: data.description,
                valueSelect: null,
                discount_id: payload.data.package.discount.value,
                name_discount: payload.data.package.discount.label,
                type_discount: payload.data.package.discount.info.type,
                value_discount: payload.data.package.discount.info.value,
            });
        });
    }
    else if (payload.data.package.discount_individual) {
        payload.data.package.areas.map((data, i) => {
            areas.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: data.discount.value,
                name_discount: data.discount.label,
                type_discount: data.discount.info.type,
                value_discount: data.discount.info.value,
            });
        });
        payload.data.package.class.map((data, i) => {
            clases.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: data.discount.value,
                name_discount: data.discount.label,
                type_discount: data.discount.info.type,
                value_discount: data.discount.info.value,
            });
        });
        payload.data.package.plans.map((data, i) => {
            planes.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: data.discount.value,
                name_discount: data.discount.label,
                type_discount: data.discount.info.type,
                value_discount: data.discount.info.value,
            });
        });
        payload.data.package.products.map((data, i) => {
            productos.push({
                products_id: data._id,
                name: data.name,
                code: data.code,
                valueSelect: data.discount,
                discount_id: data.discount.value,
                name_discount: data.discount.label,
                type_discount: data.discount.info.type,
                value_discount: data.discount.info.value,
            });
        });
        payload.data.package.services.map((data, i) => {
            servicios.push({
                services_id: data._id,
                name: data.name,
                description: data.description,
                valueSelect: data.discount,
                discount_id: data.discount.value,
                name_discount: data.discount.label,
                type_discount: data.discount.info.type,
                value_discount: data.discount.info.value,
            });
        });
    }
    else if (!payload.data.package.discount_general && !payload.data.package.discount_individual) {
        payload.data.package.areas.map((data, i) => {
            areas.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: "",
                name_discount: "",
                type_discount: "",
                value_discount: 0,
            });
        });
        payload.data.package.class.map((data, i) => {
            clases.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: "",
                name_discount: "",
                type_discount: "",
                value_discount: 0,
            });
        });
        payload.data.package.plans.map((data, i) => {
            planes.push({
                _id: data._id,
                name: data.name,
                description: data.description,
                amount: data.amount,
                discount_id: "",
                name_discount: "",
                type_discount: "",
                value_discount: 0,
            });
        });
        payload.data.package.products.map((data, i) => {
            productos.push({
                products_id: data._id,
                name: data.name,
                code: data.code,
                valueSelect: null,
                discount_id: "",
                name_discount: "",
                type_discount: "",
                value_discount: 0,
            });
        });
        payload.data.package.services.map((data, i) => {
            servicios.push({
                services_id: data._id,
                name: data.name,
                description: data.description,
                valueSelect: null,
                discount_id: "",
                name_discount: "",
                type_discount: "",
                value_discount: 0,
            });
        });
    }

    payload.data.package.penalties.map((data, i) => {
        penalties.push(data.info);
    });

    let estado = state.toJS();
    estado.packageId = payload.data.package;
    estado.arrayAreas = areas;
    estado.arrayClasses = clases;
    estado.arrayPlanes = planes;
    estado.products = productos;
    estado.services = servicios;
    estado.penalties = penalties;
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.packageId = payload.packageId;
    estado.arrayAreas = [];
    estado.arrayClasses = [];
    estado.arrayPlanes = [];
    estado.products = [];
    estado.services = [];
    estado.penalties = [];
    if(estado.modal){
        estado.modal.modal = false;
    }    
    return Map(estado);
}

const cleanStoreDiscountPackagesFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas = [];
    estado.arrayClasses = [];
    estado.arrayPlanes = [];
    estado.products = []
    estado.services = [];
    return Map(estado);
}

const addPenaltyFunction = (state, payload) => {
    let estado = state.toJS();
    estado.penalties.push(payload.data);
    return Map(estado);
}

const deletePenaltyFunction = (state, payload) => {
    let estado = state.toJS();
    estado.penalties.splice(payload, 1);
    return Map(estado);
}

const searchProductoId = (state, payload) => {
    let objProduct = {
        products_id: payload.value,
        name: payload.label,
        code: payload.code,
        valueSelect: null,
        discount_id: payload.dataDiscount ? payload.dataDiscount._id : "",
        name_discount: payload.dataDiscount ? payload.dataDiscount.name : "",
        type_discount: payload.dataDiscount ? payload.dataDiscount.type : "",
        value_discount: payload.dataDiscount ? payload.dataDiscount.value : 0,
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
        valueSelect: null,
        discount_id: payload.dataDiscount ? payload.dataDiscount._id : "",
        name_discount: payload.dataDiscount ? payload.dataDiscount.name : "",
        type_discount: payload.dataDiscount ? payload.dataDiscount.type : "",
        value_discount: payload.dataDiscount ? payload.dataDiscount.value : 0,
    };
    let estado = state.toJS();
    estado.services.push(objServices);
    return Map(estado);
}

const addClassFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        description: payload.data.description,
        amount: payload.data.amount,
        discount_id: payload.option !== 3 ? payload.dataDiscount._id : '',
        name_discount: payload.option !== 3 ? payload.dataDiscount.name : '',
        type_discount: payload.option !== 3 ? payload.dataDiscount.type : '',
        value_discount: payload.option !== 3 ? payload.dataDiscount.value : '',
        option: payload.option,
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
        description: payload.data.description,
        amount: payload.data.amount,
        discount_id: payload.option !== 3 ? payload.dataDiscount._id : '',
        name_discount: payload.option !== 3 ? payload.dataDiscount.name : '',
        type_discount: payload.option !== 3 ? payload.dataDiscount.type : '',
        value_discount: payload.option !== 3 ? payload.dataDiscount.value : '',
        option: payload.option,
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

const addAreasFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        description: payload.data.description,
        amount: payload.data.amount,
        discount_id: payload.option !== 3 ? payload.dataDiscount._id : '',
        name_discount: payload.option !== 3 ? payload.dataDiscount.name : '',
        type_discount: payload.option !== 3 ? payload.dataDiscount.type : '',
        value_discount: payload.option !== 3 ? payload.dataDiscount.value : '',
        option: payload.option,
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

const deleteServiceIdFunction = (state, payload) => {
    let estado = state.toJS();
    estado.services.splice(payload.key, 1);
    return Map(estado);
}

const addDiscountSelectProduct = (state, payload) => {
    let estado = state.toJS();
    const key = estado.products.findIndex(data => data.products_id === payload.id);
    estado.products[key].valueSelect = payload.data;
    estado.products[key].discount_id = payload.data.info._id;
    estado.products[key].name_discount = payload.data.info.name;
    estado.products[key].type_discount = payload.data.info.type;
    estado.products[key].value_discount = payload.data.info.value;
    return Map(estado);
}

const addDiscountSelectService = (state, payload) => {
    let estado = state.toJS();
    const key = estado.services.findIndex(data => data.services_id === payload.id);
    estado.services[key].valueSelect = payload.data;
    estado.services[key].discount_id = payload.data.info._id;
    estado.services[key].name_discount = payload.data.info.name;
    estado.services[key].type_discount = payload.data.info.type;
    estado.services[key].value_discount = payload.data.info.value;
    return Map(estado);
}

const changeDiscountSelectPackages = (state, payload) => {
    let estado = state.toJS();
    estado.arrayAreas.map((data, i) => {
        data.discount_id = payload.value;
        data.name_discount = payload.label;
        data.type_discount = payload.info.type;
        data.value_discount = payload.info.value;
    });
    estado.arrayClasses.map((data, i) => {
        data.discount_id = payload.value;
        data.name_discount = payload.label;
        data.type_discount = payload.info.type;
        data.value_discount = payload.info.value;
    });
    estado.arrayPlanes.map((data, i) => {
        data.discount_id = payload.value;
        data.name_discount = payload.label;
        data.type_discount = payload.info.type;
        data.value_discount = payload.info.value;
    });
    estado.products.map((data, i) => {
        data.discount_id = payload.value;
        data.name_discount = payload.label;
        data.type_discount = payload.info.type;
        data.value_discount = payload.info.value;
    });
    estado.services.map((data, i) => {
        data.discount_id = payload.value;
        data.name_discount = payload.label;
        data.type_discount = payload.info.type;
        data.value_discount = payload.info.value;
    });
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const modalFunction = (state, payload) => {
    let dataModal = {};
    if (payload.option === 1) {
        dataModal = {
            option: 1,
            modal: true,
            modalHeader: 'Registrar Paquete',
            buttonFooter: 'Guardar',
            disabled: false,
            showHide: false,
            data: {},
        };
    } else if (payload.option === 2) {
        dataModal = {
            option: 2,
            modal: true,
            modalHeader: 'Ver Paquete',
            buttonFooter: 'Editar',
            disabled: true,
            showHide: true,
            data: payload.data,
        };
    } else if (payload.option === 3) {
        dataModal = {
            option: 3,
            modal: true,
            modalHeader: 'Editar Paquete',
            buttonFooter: 'Editar',
            disabled: false,
            showHide: false,
            data: payload.data,
        };
    }
    let estado = state.toJS();
    estado.modal = dataModal;
    return Map(estado);
}

const dataExtraPackages = (state, payload) => {
    let estado = state.toJS();
    estado.dataClass = payload.dataClass;
    estado.dataPlan = payload.dataPlan;
    estado.dataAreas = payload.dataAreas;
    estado.actionDataExtra = 1;
    return Map(estado);
}

const packagesReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_PACKAGES': {
            return Map(action.payload)
        }
        case "ALL_PACKAGES": {
            return allPackagesFunction(state, action.payload);
        }
        case "ALL_PACKAGES_DISABLED": {
            return allPackagesDisabledFunction(state, action.payload);
        }
        case "LOAD_PACKAGES_ID": {
            return loadPackagesIdAction(state, action.payload);
        }
        case "ADD_PENALTY_PACKAGES": {
            return addPenaltyFunction(state, action.payload);
        }
        case "DELETE_PENALTY_PACKAGES": {
            return deletePenaltyFunction(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case "SEARCH_PRODUCTS_PAQUETES": {
            return setData(state, "dataAllProducts", action.payload);
        }
        case "SEARCH_PRODUCTO_ID_PAQUETES": {
            return searchProductoId(state, action.payload);
        }
        case "DELETE_PRODUCTO_PACKAGES": {
            return deleteProductoIdFunction(state, action.payload);
        }
        case "SEARCH_SERVICES_PACKAGES": {
            return setData(state, "dataAllServices", action.payload);
        }
        case "SEARCH_SERVICE_ID_PACKAGES": {
            return searchServiceId(state, action.payload);
        }
        case "DELETE_SERVICE_PACKAGES": {
            return deleteServiceIdFunction(state, action.payload);
        }
        case 'ADD_CLASS_PACKAGES': {
            return addClassFunction(state, action.payload)
        }
        case 'DELETE_CLASS_PACKAGES': {
            return deleteClassFunction(state, action.payload)
        }
        case 'ADD_PLAN_PACKAGES': {
            return addPlanFunction(state, action.payload)
        }
        case 'DELETE_PLAN_PACKAGES': {
            return deletePlanFunction(state, action.payload)
        }
        case 'ADD_AREA_PACKAGES': {
            return addAreasFunction(state, action.payload)
        }
        case 'DELETE_AREA_PACKAGES': {
            return deleteAreasFunction(state, action.payload)
        }
        case 'CLEAN_STORE_FORM_PACKAGES_DISCOUNT': {
            return cleanStoreDiscountPackagesFunction(state, action.payload)
        }
        case 'ADD_DISCOUNT_SELECT_PRODUCT': {
            return addDiscountSelectProduct(state, action.payload)
        }
        case 'ADD_DISCOUNT_SELECT_SERVICE': {
            return addDiscountSelectService(state, action.payload)
        }
        case 'ADD_SELECT_DISCOUNT': {
            return changeDiscountSelectPackages(state, action.payload)
        }
        case 'LOADING_TRUE_PACKAGES': {
            return loadingTrue(state, action.payload)
        }
        case 'MODAL_PACKAGES': {
            return modalFunction(state, action.payload)
        }
        case 'DATA_EXTRA_PACKAGES': {
            return dataExtraPackages(state, action.payload)
        }
        default:
            return state;
    }
};

export default packagesReducer;