import { Map, List } from "immutable";
import { calculatePage } from "./../helpers/helpers";
const setData = (state, node, payload) => state.set(node, payload);

const allClientsFunction = (state, payload) => {
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
};

const allClientsDisabledFunction = (state, payload) => {
  let pagination = {
    total: payload.data.total,
    page: payload.data.page,
    perPage: payload.data.perPage,
    lastPage: payload.data.lastPage,
    numberPage: calculatePage(payload.data.page, 2, payload.data.lastPage),
  };
  let estado = state.toJS();
  estado.dataDisabled = payload.data.data;
  estado.paginationDisabled = pagination;
  estado.loading = false;
  return Map(estado);
};

const searchBienId = (state, payload) => {
  let objBien = {
    goods_id: payload.value,
    name: payload.label,
    quantity: payload.info.quantity,
  };
  let estado = state.toJS();
  estado.bienId.push(objBien);
  return Map(estado);
};

const setQuantityBienAction = (state, payload) => {
  let estado = state.toJS();
  const key = estado.bienId.findIndex((data) => data.goods_id === payload.id);
  estado.bienId[key].quantity = payload.value;
  return Map(estado);
};

const deleteBienIdFunction = (state, payload) => {
  let estado = state.toJS();
  estado.bienId.splice(payload.key, 1);
  return Map(estado);
};

const limpiarStoreForm = (state, payload) => {
  let estado = state.toJS();
  estado.bienId = [];
  estado.dataAllBienes ? (estado.dataAllBienes.data = []) : [];
  estado.areaId = {};
  return Map(estado);
};

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
};

const addPenaltyFunction = (state, payload) => {
  let estado = state.toJS();
  estado.arrayPenalty.push(payload.data);
  return Map(estado);
};

const deletePenaltyFunction = (state, payload) => {
  let estado = state.toJS();
  estado.arrayPenalty.splice(payload, 1);
  return Map(estado);
};

const loadingTrue = (state, payload) => {
  let estado = state.toJS();
  estado.loading = payload;
  return Map(estado);
};

const ClientsReducer = (state = Map(), action) => {
  switch (action.type) {
    case "LOAD_CLIENTS": {
      return Map(action.payload);
    }

    case "ALL_CLIENTS": {
      return allClientsFunction(state, action.payload);
    }

    case "ALL_CLIENTS_DISABLED": {
      return allClientsDisabledFunction(state, action.payload);
    }

    case "SEARCH_BIENES_CLIENTS": {
      return setData(state, "dataAllBienes", action.payload);
    }

    case "SEARCH_BIEN_ID_CLIENTS": {
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
    case "ADD_PENALTY_CLIENTS": {
      return addPenaltyFunction(state, action.payload);
    }
    case "DELETE_PENALTY_CLIENTS": {
      return deletePenaltyFunction(state, action.payload);
    }
    case "LOADING_TRUE": {
      return loadingTrue(state, action.payload);
    }
    default:
      return state;
  }
};

export default ClientsReducer;
