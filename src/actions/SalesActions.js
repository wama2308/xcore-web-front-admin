//ClientActions
import { NotificationManager } from "react-notifications";
import axios from "axios";
import { getDataToken, updateLocalStorage, calculatePageSale } from "../helpers/helpers";

export const allClientsFunction = (page = 1, perPage = 10, search = "") => (
  dispatch
) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios
          .get(
            `/api/v1/settings/person?page=` +
            page +
            `&perPage=` +
            perPage +
            `&search=` +
            search,
            datos
          )
          .then((res) => {
            dispatch({
              type: "ALL_CLIENTS",
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

export const disabledClientsFunction = (
  page = 1,
  perPage = 10,
  search = ""
) => (dispatch) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios
          .get(
            `/api/v1/settings/person/disabled?page=` +
            page +
            `&perPage=` +
            perPage +
            `&search=` +
            search,
            datos
          )
          .then((res) => {
            dispatch({
              type: "ALL_CLIENTS_DISABLED",
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

export const storeClientAction = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/person/store`,
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

export const loadClientIdAction = (_id) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "get",
          url: `/api/v1/settings/person/${_id}`,
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

export const updateClientAction = (data) => {
  const { _id } = data;
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "put",
          url: `/api/v1/settings/person/${_id}`,
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

export const storeSaleAction = (data) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/sale/store`,
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

export const changeStatusClientAction = (data) => {
  const { _id } = data;
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "put",
          url: `/api/v1/settings/person/change-status/${_id}`,
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

export const searchClientsAction = (search) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/person/search`,
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

export const searchStoreItemsAction = (form) => dispatch => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/sale/search`,
          data: {
            category: 'all'
          },
          headers: datos.headers,
        })
          .then((res) => {
            updateLocalStorage(
              {
                resultItems: res.data.items,
                resultItemsAll: res.data.items,
                form: form,
                numberPage: calculatePageSale(1, Math.ceil(res.data.items.length / 10), 10),
              },
              'resultItems'
            );
            dispatch({
              type: "ALL_ITEMS_SALE",
              payload: {
                data: res.data.items,
                form: form
              }
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

export const byCategory = (category) => {
  return new Promise((resolve, reject) => {
    getDataToken()
      .then((datos) => {
        axios({
          method: "post",
          url: `/api/v1/settings/sale/search/byCategory`,
          data: { category },
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

export const loadingFalse = () => dispatch => {
  dispatch({
    type: "LOADING_FALSE_SALE",
    payload: false
  });
};

export const procesarSaleAction = (data, callback) => dispatch => {
  console.log(data)
  getDataToken()
    .then(datos => {
      console.log()
      axios({
        method: "post",
        url: `/api/v1/settings/sale/store`,
        data: data,
        headers: datos.headers
      })
        .then(res => {
          callback();
          //NotificationManager.success(res.data.message);
        })
        .catch(error => {
          Array.isArray(error.response.data) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
        });
    })
    .catch(() => {
      console.log("Problemas con el token");
    });
};
