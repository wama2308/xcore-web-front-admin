import { Map, List, fromJS } from "immutable";
import { calculatePage, arraysFormatAction, arraysDevicesAction } from "./../helpers/helpers";
const setData = (state, node, payload) => state.set(node, payload);

const allSettingBillsFunction = (state, payload) => {
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

const allSettingBillsDisabledFunction = (state, payload) => {
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

const addFormatFunction = (state, payload) => {
  if (payload.option === 'Agregar') {
    const existFormat = state.has('arrayFormat');
    if (existFormat) {
      return state.updateIn(['arrayFormat'], arr => arr.concat([payload.data]))
    } else {
      return state.set('arrayFormat', [payload.data]);
    }
  } else {
    const initialState = fromJS({ arrayFormat: state.get('arrayFormat') });
    const updateItem = initialState.setIn(["arrayFormat", payload.index], payload.data)
    return state.set('arrayFormat', updateItem.get('arrayFormat'));
  }
}

const deleteFormatFunction = (state, payload) => {
  const initialState = fromJS({ arrayFormat: state.get('arrayFormat') });
  const deleteItem = initialState.deleteIn(["arrayFormat", payload])
  return state.set('arrayFormat', deleteItem.get('arrayFormat'));
}

const addDevicesFunction = (state, payload) => {
  if (payload.option === 'Agregar') {
    const existFormat = state.has('arrayDevices');
    if (existFormat) {
      return state.updateIn(['arrayDevices'], arr => arr.concat([payload.data]))
    } else {
      return state.set('arrayDevices', [payload.data]);;
    }
  } else {
    const initialState = fromJS({ arrayDevices: state.get('arrayDevices') });
    const updateItem = initialState.setIn(["arrayDevices", payload.index], payload.data)
    return state.set('arrayDevices', updateItem.get('arrayDevices'));
  }
}

const deleteDeviceFunction = (state, payload) => {
  const initialState = fromJS({ arrayDevices: state.get('arrayDevices') });
  const deleteItem = initialState.deleteIn(["arrayDevices", payload])
  return state.set('arrayDevices', deleteItem.get('arrayDevices'));
}

const loadSettingBillIdAction = (state, payload) => {
  return state
    .set('dataId', { name: payload.data.settingBill.name, type: payload.data.settingBill.type })
    .set('arrayFormat', arraysFormatAction(payload.data.settingBill.format))
    .set('arrayDevices', payload.data.settingBill.devices === null ? [] : arraysDevicesAction(payload.data.settingBill.devices));
}

const cleanStoreFunction = (state, payload) => {
  return state
    .set('dataId', {})
    .set('arrayFormat', [])
    .set('arrayDevices', []);
}

const cleanTypeDeviceStoreFunction = (state, payload) => {
  return state.set('arrayDevices', []);
}

const SettingBillsReducer = (state = Map(), action) => {
  switch (action.type) {
    case "ALL_SETTINGBILLS": {
      return allSettingBillsFunction(state, action.payload);
    }
    case "ALL_SETTINGBILLS_DISABLED": {
      return allSettingBillsDisabledFunction(state, action.payload);
    }
    case "ADD_FORMAT_SETTING_BILLS": {
      return addFormatFunction(state, action.payload);
    }
    case "DELETE_FORMAT_SETTING_BILLS": {
      return deleteFormatFunction(state, action.payload);
    }
    case "ADD_DEVICE_SETTING_BILLS": {
      return addDevicesFunction(state, action.payload);
    }
    case "DELETE_DEVICE_SETTING_BILLS": {
      return deleteDeviceFunction(state, action.payload);
    }
    case "LOAD_SETTING_BILLS_ID": {
      return loadSettingBillIdAction(state, action.payload);
    }
    case 'CLEAN_STORE_FORM': {
      return cleanStoreFunction(state, action.payload)
    }
    case 'CLEAN_TYPE_DEVICE_FORM': {
      return cleanTypeDeviceStoreFunction(state, action.payload)
    }

    default:
      return state;
  }
};

export default SettingBillsReducer;
