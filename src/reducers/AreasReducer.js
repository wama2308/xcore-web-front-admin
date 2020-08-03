import { Map, List, fromJS } from "immutable";
import { calculatePage } from './../helpers/helpers';
const setData = (state, node, payload) => state.set(node, payload);

const allAreasFunction = (state, payload) => {
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

const allAreasDisabledFunction = (state, payload) => {
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

const searchBienId = (state, payload) => {
    let objBien = {
        goods_id: payload.value,
        name: payload.label,
        quantity: payload.info.quantity
    };
    let estado = state.toJS();
    estado.bienId.push(objBien);
    return Map(estado);
}

const setQuantityBienAction = (state, payload) => {
    let estado = state.toJS();
    const key = estado.bienId.findIndex(data => data.goods_id === payload.id);
    estado.bienId[key].quantity = payload.value;
    return Map(estado);
}

const deleteBienIdFunction = (state, payload) => {
    let estado = state.toJS();
    estado.bienId.splice(payload.key, 1);
    return Map(estado);
}

const limpiarStoreForm = (state, payload) => {
    let estado = state.toJS();
    estado.bienId = [];
    estado.dataAllBienes ? estado.dataAllBienes.data = [] : [];
    estado.areaId = {};
    return Map(estado);
}

const loadAreaIdAction = (state, payload) => {
    let penalties = [];
    payload.data.area.penalties.map((data, i) => {
        penalties.push(data.info);
    });
    let estado = state.toJS();
    estado.areaId = payload.data.area;
    estado.bienId = payload.data.area.goods;
    estado.arrayPenalty = penalties;
    return Map(estado);
}

const addPenaltyFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPenalty.push(payload.data);
    return Map(estado);
}

const deletePenaltyFunction = (state, payload) => {
    let estado = state.toJS();
    estado.arrayPenalty.splice(payload, 1);
    return Map(estado);
}

const loadingTrue = (state, payload) => {
    let estado = state.toJS();
    estado.loading = payload;
    return Map(estado);
}

const addNewAreaRegister = (state, payload) => {
    if (state.get('data').length < 10) {
        return state.updateIn(['data'], arr => arr.concat([payload]))
    } else {
        return state;
    }
}

const editAreaId = (state, payload) => {
    const initialState = fromJS({ data: state.get('data') });
    const indexOfAreaUpdate = initialState.get('data').findIndex(areaUpdate => {
        return areaUpdate._id === payload._id;
    });
    const updateItem = initialState.setIn(["data", indexOfAreaUpdate], payload)
    return state.set('data', updateItem.get('data'));
}

const deleteAreaId = (state, payload) => {
    if (payload.option === 'inactivar') {
        const initialState = fromJS({ data: state.get('data') });
        const indexOfAreaDelete = initialState.get('data').findIndex(areaDelete => {
            return areaDelete._id === payload._id;
        });
        const deleteItem = initialState.deleteIn(["data", indexOfAreaDelete])
        if (state.get('dataDisabled').length < 10) {
            return state
                .set('data', deleteItem.get('data'))
                .updateIn(['dataDisabled'], arr => arr.concat([payload]));
        } else {
            return state.set('data', deleteItem.get('data'));
        }
    } else {
        const initialState = fromJS({ dataDisabled: state.get('dataDisabled') });
        const indexOfAreaDelete = initialState.get('dataDisabled').findIndex(areaDelete => {
            return areaDelete._id === payload._id;
        });
        const deleteItem = initialState.deleteIn(["dataDisabled", indexOfAreaDelete])
        if (state.get('data').length < 10) {
            return state
                .set('dataDisabled', deleteItem.get('dataDisabled'))
                .updateIn(['data'], arr => arr.concat([payload]));
        } else {
            return state.set('dataDisabled', deleteItem.get('dataDisabled'));
        }
    }
}

const areaReducer = (state = Map(), action) => {
    switch (action.type) {
        case 'LOAD_AREAS': {
            return Map(action.payload)
        }

        case "ALL_AREAS": {
            return allAreasFunction(state, action.payload);
        }

        case "ALL_AREAS_DISABLED": {
            return allAreasDisabledFunction(state, action.payload);
        }

        case "SEARCH_BIENES_AREAS": {
            return setData(state, "dataAllBienes", action.payload);
        }

        case "SEARCH_BIEN_ID_AREAS": {
            return searchBienId(state, action.payload);
        }

        case "SET_QUANTITY_BIEN": {
            return setQuantityBienAction(state, action.payload);
        }

        case "DELETE_BIEN": {
            return deleteBienIdFunction(state, action.payload);
        }

        case "CLEAN_STORE_FORM": {
            return limpiarStoreForm(state, action.payload);
        }

        case "LOAD_AREA_ID": {
            return loadAreaIdAction(state, action.payload);
        }
        case 'ADD_PENALTY_AREAS': {
            return addPenaltyFunction(state, action.payload)
        }
        case 'DELETE_PENALTY_AREAS': {
            return deletePenaltyFunction(state, action.payload)
        }
        case 'LOADING_TRUE_AREAS': {
            return loadingTrue(state, action.payload)
        }
        case 'ADD_NEW_AREA': {
            return addNewAreaRegister(state, action.payload)
        }
        case 'UPDATE_AREA_ID': {
            return editAreaId(state, action.payload)
        }
        case 'DELETE_AREA_ID': {
            return deleteAreaId(state, action.payload)
        }
        default:
            return state;
    }
};

export default areaReducer;