import { Map, List } from "immutable";
import { calculatePage } from './../helpers/helpers';

const setData = (state, node, payload) => state.set(node, payload);

const allRewardsFunction = (state, payload) => {
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

const allRewardsDisabledFunction = (state, payload) => {
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

const loadRewardIdAction = (state, payload) => {
    let classes = [];
    let plans = [];
    let packages = [];
    let products = [];
    let services = [];
    if (payload.data.reward.rule === 0 && payload.data.reward.discount_all) {
        if (payload.data.reward.classes.length > 0) {
            payload.data.reward.classes.map((data, i) => {
                classes.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: payload.data.reward.discount.value,
                    dataDiscount: payload.data.reward.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.plans.length > 0) {
            payload.data.reward.plans.map((data, i) => {
                plans.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: payload.data.reward.discount.value,
                    dataDiscount: payload.data.reward.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.packages.length > 0) {
            payload.data.reward.packages.map((data, i) => {
                packages.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: payload.data.reward.discount.value,
                    dataDiscount: payload.data.reward.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.products.length > 0) {
            payload.data.reward.products.map((data, i) => {
                products.push({
                    products_id: data._id,
                    name: data.name,
                    code: data.code,
                    discount: payload.data.reward.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.services.length > 0) {
            payload.data.reward.services.map((data, i) => {
                services.push({
                    services_id: data._id,
                    name: data.name,
                    description: data.description,
                    discount: payload.data.reward.discount,
                    quantity: "",
                });
            });
        }
    } else if (payload.data.reward.rule === 0 && !payload.data.reward.discount_all) {
        if (payload.data.reward.classes.length > 0) {
            payload.data.reward.classes.map((data, i) => {
                classes.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: data.discount.value,
                    dataDiscount: data.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.plans.length > 0) {
            payload.data.reward.plans.map((data, i) => {
                plans.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: data.discount.value,
                    dataDiscount: data.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.packages.length > 0) {
            payload.data.reward.packages.map((data, i) => {
                packages.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: data.discount.value,
                    dataDiscount: data.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.products.length > 0) {
            payload.data.reward.products.map((data, i) => {
                products.push({
                    products_id: data._id,
                    name: data.name,
                    code: data.code,
                    discount: data.discount,
                    quantity: "",
                });
            });
        }
        if (payload.data.reward.services.length > 0) {
            payload.data.reward.services.map((data, i) => {
                services.push({
                    services_id: data._id,
                    name: data.name,
                    description: data.description,
                    discount: data.discount,
                    quantity: "",
                });
            });
        }
    } else if (payload.data.reward.rule !== 0 || payload.data.reward.rule !== 1 || payload.data.reward.rule !== 7) {
        if (payload.data.reward.classes.length > 0) {
            payload.data.reward.classes.map((data, i) => {
                classes.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: "",
                    dataDiscount: "",
                    quantity: data.pivot.quantity,
                });
            });
        }
        if (payload.data.reward.plans.length > 0) {
            payload.data.reward.plans.map((data, i) => {
                plans.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: "",
                    dataDiscount: "",
                    quantity: data.pivot.quantity,
                });
            });
        }
        if (payload.data.reward.packages.length > 0) {
            payload.data.reward.packages.map((data, i) => {
                packages.push({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    discount_id: "",
                    dataDiscount: "",
                    quantity: data.pivot.quantity,
                });
            });
        }
        if (payload.data.reward.products.length > 0) {
            payload.data.reward.products.map((data, i) => {
                products.push({
                    products_id: data._id,
                    name: data.name,
                    code: data.code,
                    discount: null,
                    quantity: data.pivot.quantity,
                });
            });
        }
        if (payload.data.reward.services.length > 0) {
            payload.data.reward.services.map((data, i) => {
                services.push({
                    services_id: data._id,
                    name: data.name,
                    description: data.description,
                    discount: null,
                    quantity: data.pivot.quantity,
                });
            });
        }
    }

    let estado = state.toJS();
    estado.rewardId = payload.data.reward;
    estado.arrayClasses = classes;
    estado.arrayPlanes = plans;
    estado.arrayPackages = packages;
    estado.products = products;
    estado.services = services;
    return Map(estado);
}

const addClassFunction = (state, payload) => {
    let data = {
        _id: payload.data._id,
        name: payload.data.name,
        description: payload.data.description,
        amount: payload.data.amount,
        discount_id: payload.option !== 2 ? payload.dataDiscountQuantity.value : "",
        dataDiscount: payload.option !== 2 ? payload.dataDiscountQuantity : "",
        quantity: payload.option === 2 ? payload.dataDiscountQuantity : "",
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
        discount_id: payload.option !== 2 ? payload.dataDiscountQuantity.value : "",
        dataDiscount: payload.option !== 2 ? payload.dataDiscountQuantity : "",
        quantity: payload.option === 2 ? payload.dataDiscountQuantity : "",
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
        description: payload.data.description,
        amount: payload.data.amount,
        discount_id: payload.option !== 2 ? payload.dataDiscountQuantity.value : "",
        dataDiscount: payload.option !== 2 ? payload.dataDiscountQuantity : "",
        quantity: payload.option === 2 ? payload.dataDiscountQuantity : "",
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
        discount: payload.dataDiscount,
        quantity: payload.quantity,
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

const addDiscountSelectProduct = (state, payload) => {
    let estado = state.toJS();
    const key = estado.products.findIndex(data => data.products_id === payload.id);
    estado.products[key].discount = payload.data;
    return Map(estado);
}

const setDataProductsQuantityRewardAction = (state, payload) => {
    let estado = state.toJS();
    const key = estado.products.findIndex(data => data.products_id === payload.id);
    estado.products[key].quantity = payload.value;
    return Map(estado);
}

const searchServiceId = (state, payload) => {
    let objProduct = {
        services_id: payload.value,
        name: payload.label,
        description: payload.description,
        discount: payload.dataDiscount,
        quantity: payload.quantity,
    };
    let estado = state.toJS();
    estado.services.push(objProduct);
    return Map(estado);
}

const deleteServiceIdFunction = (state, payload) => {
    let estado = state.toJS();
    estado.services.splice(payload.key, 1);
    return Map(estado);
}

const addDiscountSelectService = (state, payload) => {
    let estado = state.toJS();
    const key = estado.services.findIndex(data => data.services_id === payload.id);
    estado.services[key].discount = payload.data;
    return Map(estado);
}

const setDataServicesQuantityRewardAction = (state, payload) => {
    let estado = state.toJS();
    const key = estado.services.findIndex(data => data.services_id === payload.id);
    estado.services[key].quantity = payload.value;
    return Map(estado);
}

const cleanStoreRewardsFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayClasses = [];
    estado.arrayPlanes = [];
    estado.arrayPackages = [];
    estado.products = [];
    estado.services = [];
    return Map(estado);
}

const changeDiscountSelectRewards = (state, payload) => {
    let estado = state.toJS();
    estado.arrayClasses.map((data, i) => {
        data.dataDiscount = payload
    });
    estado.arrayPlanes.map((data, i) => {
        data.dataDiscount = payload
    });
    estado.arrayPackages.map((data, i) => {
        data.dataDiscount = payload
    });
    estado.products.map((data, i) => {
        data.discount = payload
    });
    estado.services.map((data, i) => {
        data.discount = payload
    });
    return Map(estado);
}

const cleanStoreFunction = (state, payload) => {
    let estado = state.toJS();
    estado.rewardId = payload.rewardId;
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

const rewardsReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_REWARDS': {
            return Map(action.payload)
        }
        case "ALL_REWARDS": {
            return allRewardsFunction(state, action.payload);
        }
        case "ALL_REWARDS_DISABLED": {
            return allRewardsDisabledFunction(state, action.payload);
        }
        case "LOAD_REWARD_ID": {
            return loadRewardIdAction(state, action.payload);
        }
        case 'ADD_CLASS_REWARDS': {
            return addClassFunction(state, action.payload)
        }
        case 'DELETE_CLASS_REWARDS': {
            return deleteClassFunction(state, action.payload)
        }
        case 'ADD_PLAN_REWARDS': {
            return addPlanFunction(state, action.payload)
        }
        case 'DELETE_PLAN_REWARDS': {
            return deletePlanFunction(state, action.payload)
        }
        case 'ADD_PACKAGE_REWARDS': {
            return addPackageFunction(state, action.payload)
        }
        case 'DELETE_PACKAGE_REWARDS': {
            return deletePackageFunction(state, action.payload)
        }
        case "SEARCH_PRODUCTS_REWARDS": {
            return setData(state, "dataAllProducts", action.payload);
        }
        case "SEARCH_PRODUCTO_ID_REWARDS": {
            return searchProductoId(state, action.payload);
        }
        case "DELETE_PRODUCTO_REWARDS": {
            return deleteProductoIdFunction(state, action.payload);
        }
        case "SEARCH_SERVICES_REWARDS": {
            return setData(state, "dataAllServices", action.payload);
        }
        case "SEARCH_SERVICE_ID_REWARDS": {
            return searchServiceId(state, action.payload);
        }
        case "DELETE_SERVICE_REWARDS": {
            return deleteServiceIdFunction(state, action.payload);
        }
        case 'ADD_DISCOUNT_SELECT_PRODUCT_REWARDS': {
            return addDiscountSelectProduct(state, action.payload)
        }
        case 'ADD_DISCOUNT_SELECT_SERVICE_REWARDS': {
            return addDiscountSelectService(state, action.payload)
        }
        case "SET_DATA_PRODUCTS_QUANTITY_REWARDS": {
            return setDataProductsQuantityRewardAction(state, action.payload);
        }
        case "SET_DATA_SERVICES_QUANTITY_REWARDS": {
            return setDataServicesQuantityRewardAction(state, action.payload);
        }
        case "CLEAN_STORE_FORM_REWARDS": {
            return cleanStoreRewardsFunction(state, action.payload);
        }
        case "ADD_SELECT_DISCOUNT_REWARDS": {
            return changeDiscountSelectRewards(state, action.payload);
        }
        case 'CLEAN_STORE_FORM': {
            return cleanStoreFunction(state, action.payload)
        }
        case 'LOADING_TRUE_REWARDS': {
            return loadingTrue(state, action.payload)
        }

        default:
            return state;
    }
};

export default rewardsReducer;