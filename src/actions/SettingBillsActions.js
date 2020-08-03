//SettingBillActions
import { NotificationManager } from "react-notifications";
import axios from "axios";
import { getDataToken, calculatePage } from "../helpers/helpers";

export const allSettingBillsFunction = (
  page = 1,
  perPage = 10,
  search = ""
) => (dispatch) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios
          .get(
            `/api/v1/settings/setting_bill?page=` +
            page +
            `&perPage=` +
            perPage +
            `&search=` +
            search,
            datos
          )
          .then((res) => {
            dispatch({
              type: "ALL_SETTINGBILLS",
              payload: {
                data: res.data,
              },
            });
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Problemas con el token");
        reject(error);
      });
  });
};

export const disabledSettingBillsFunction = (
  page = 1,
  perPage = 10,
  search = ""
) => (dispatch) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios
          .get(
            `/api/v1/settings/setting_bill/disabled?page=` +
            page +
            `&perPage=` +
            perPage +
            `&search=` +
            search,
            datos
          )
          .then((res) => {
            dispatch({
              type: "ALL_SETTINGBILLS_DISABLED",
              payload: {
                data: res.data,
              },
            });
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Problemas con el token");
        reject(error);
      });
  });
};

export const storeSettingBillAction = (data, callback) => (dispatch) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/setting_bill/store`,
          data: data,
          headers: datos.headers,
        })
          .then((res) => {
            resolve(res);
            callback();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Problemas con el token");
        reject(error);
      });
  });
};

export const loadSettingBillIdAction = (_id) => dispatch => {
  getDataToken()
    .then(datos => {
      axios({
        method: "get",
        url: `/api/v1/settings/setting_bill/${_id}`,
        headers: datos.headers
      })
        .then(res => {
          //console.log(res.data)
          dispatch({
            type: "LOAD_SETTING_BILLS_ID",
            payload: {
              data: res.data,
            }
          });
        })
        .catch(error => {
          console.log(error)
          Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
        });
    })
    .catch(() => {
      console.log("Problemas con el token");
    });
};

export const updateSettingBillAction = (data, callback) => (dispatch) => {
  const { _id } = data;
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "put",
          url: `/api/v1/settings/setting_bill/${_id}`,
          data: data,
          headers: datos.headers,
        })
          .then((res) => {
            resolve(res);
            callback();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Problemas con el token");
        reject(error);
      });
  });
};

export const changeStatusSettingBillAction = (data) => {
  const { _id } = data;
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "put",
          url: `/api/v1/settings/setting_bill/change-status/${_id}`,
          data: data,
          headers: datos.headers,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Problemas con el token");
        reject(error);
      });
  });
};

export const searchSettingBillsAction = (search) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/setting_bill/search`,
          data: search,
          headers: datos.headers,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Problemas con el token");
        reject(error);
      });
  });
};

export const addFormatFunction = (data, dataAll, callback, option, index) => dispatch => {
  let formatExist;
  let formatExistEdit;
  let acum = 0;
  if (option === 'Agregar') {
    formatExist = dataAll.find(formatData => formatData.typeFormato === data.typeFormato);
  } else {
    formatExist = dataAll.filter((filterData, i) => i !== index);
    formatExistEdit = formatExist.find(formatDataEdit => formatDataEdit.typeFormato === data.typeFormato);
  }

  if (data.typeFormato === 'ticket') {
    dataAll.find(formatData => formatData.typeFormato === 'print') ? acum = 1 : acum = 0;
  }
  if (data.typeFormato === 'print') {
    dataAll.find(formatData => formatData.typeFormato === 'ticket') ? acum = 1 : acum = 0;
  }

  if (formatExist && option === 'Agregar') {
    NotificationManager.warning("Esta formato ya esta registrado");
  } else if (formatExistEdit && option === 'Editar') {
    NotificationManager.warning("Esta formato ya esta registrado");
  } else if (acum === 1) {
    NotificationManager.warning("No puede tener print y ticket juntos en los formatos");
  } else {
    dispatch({
      type: "ADD_FORMAT_SETTING_BILLS",
      payload: {
        data: data,
        option: option,
        index: index,
      }
    });
    option === 'Agregar' ? NotificationManager.success("Formato agregado") : NotificationManager.success("Formato modificado");
    callback();
  }
};

export const deleteFormatFunction = (index) => dispatch => {
  dispatch({
    type: "DELETE_FORMAT_SETTING_BILLS",
    payload: index
  });
  NotificationManager.success("Formato Eliminado");
};

export const addDevicesFunction = (data, dataAll, callback, option, index) => dispatch => {
  let formatExist;
  let formatExistEdit;
  let acum = 0;
  if (option === 'Agregar') {
    formatExist = dataAll.find(deviceData => deviceData.serial === data.serial);
  } else {
    formatExist = dataAll.filter((filterData, i) => i !== index);
    formatExistEdit = formatExist.find(deviceDataEdit => deviceDataEdit.serial === data.serial);
  }

  if (formatExist && option === 'Agregar') {
    NotificationManager.warning("Esta formato ya esta registrado");
  } else if (formatExistEdit && option === 'Editar') {
    NotificationManager.warning("Esta formato ya esta registrado");
  } else {
    dispatch({
      type: "ADD_DEVICE_SETTING_BILLS",
      payload: {
        data: data,
        option: option,
        index: index,
      }
    });
    option === 'Agregar' ? NotificationManager.success("Dispositivo agregado") : NotificationManager.success("Dispositivo modificado");
    callback();
  }
};

export const deleteDeviceFunction = (index) => dispatch => {
  dispatch({
    type: "DELETE_DEVICE_SETTING_BILLS",
    payload: index
  });
  NotificationManager.success("Dispositivo Eliminado");
};

export const cleanStoreFunction = () => dispatch => {
  dispatch({
    type: "CLEAN_STORE_FORM",
    payload: {}
  });
};

export const cleanTypeDeviceStoreFunction = () => dispatch => {
  dispatch({
    type: "CLEAN_TYPE_DEVICE_FORM",
    payload: []
  });
};
