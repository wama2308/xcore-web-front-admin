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
            `/api/v1/settings/foreignExchange?page=` +
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

export const selectExchange = () => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios
          .get(`/api/v1/settings/foreignExchange/select`, datos)
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
            `/api/v1/settings/foreignExchange/disabled?page=` +
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

export const storeSettingBillAction = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/foreignExchange/store`,
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

export const loadSettingBillIdAction = (_id) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "get",
          url: `/api/v1/settings/foreignExchange/${_id}`,
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

export const updateSettingBillAction = (data) => {
  const { _id } = data;
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "put",
          url: `/api/v1/settings/foreignExchange/${_id}`,
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

export const changeStatusSettingBillAction = (data) => {
  const { _id } = data;
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "put",
          url: `/api/v1/settings/foreignExchange/change-status/${_id}`,
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
          url: `/api/v1/settings/foreignExchange/search`,
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
