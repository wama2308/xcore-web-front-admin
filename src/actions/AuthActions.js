import AuthService from "./AuthService";
import firebase from 'firebase/app';
import 'firebase/auth';
import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken } from "../helpers/helpers";
const requestCodeUrl = `${url}/api/v1/auth/generate-code`;
const validateCodeUrl = `${url}/api/v1/auth/virify-code`;
const recoveryPasswordUrl = `${url}/api/v1/auth/recovery-password`;
const codeForgotPasswordUrl = `${url}/api/v1/auth/verify-code-recovery-password`;
const changePasswordPasswordUrl = `${url}/api/v1/auth/change-password-recovery`;
const secretQuestionsUrl = `${url}/api/v1/form/secret-questions`;
const usersStoreUrl = `${url}/api/v1/users/store`;
const auth = new AuthService(url);

export const requestCode = (data, loading, next) => dispatch => {
   axios({
      method: "post",
      url: requestCodeUrl,
      data: data
   })
      .then(res => {
         next();
         NotificationManager.success(res.data.message);
      })
      .catch(error => {
         loading();
         Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
      });
};

export const validateCode = (data, loading, next) => dispatch => {
   axios({
      method: "post",
      url: validateCodeUrl,
      data: data
   })
      .then(res => {
         next();
         NotificationManager.success(res.data.message);
      })
      .catch(error => {
         loading();
         Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
      });
};

export const registerUser = (data, next) => dispatch => {
   axios({
      method: "post",
      url: usersStoreUrl,
      data: data
   })
      .then(res => {
         next();
         NotificationManager.success(res.data.message);
      })
      .catch(error => {
         Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
      });
};

export const recoveryPassword = (data, loading, next) => dispatch => {
   axios({
      method: "post",
      url: recoveryPasswordUrl,
      data: data
   })
      .then(res => {
         next();
         NotificationManager.success(res.data.message);
      })
      .catch(error => {
         loading();
         Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
      });
};

export const codeForgotPassword = (data, loading, next) => dispatch => {
   axios({
      method: "post",
      url: codeForgotPasswordUrl,
      data: data
   })
      .then(res => {
         next();
         NotificationManager.success(res.data.message);
      })
      .catch(error => {
         loading();
         Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
      });
};

export const changePassword = (data, loading, next) => dispatch => {
   axios({
      method: "post",
      url: changePasswordPasswordUrl,
      data: data
   })
      .then(res => {
         next();
         NotificationManager.success(res.data.message);
      })
      .catch(error => {
         loading();
         Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
            NotificationManager.warning(error.response.data.message);
      });
};

export const loginAction = (data) => dispatch => {
   return new Promise((resolve, reject) => {
      auth.login({ email: data.email, password: data.password })
         .then(response => {
            dispatch({
               type: "GET_DATA_USER",
               payload: response.user
            });
            resolve(response)
         })
         .catch(error => {
            reject(error)
         });
   })
};

export const logout = () => dispatch => {
   auth.logout(() =>
      dispatch({
         type: "SESION_OFF"
      })
   );
};

export const loadSelect = () => dispatch => {
   axios.get(secretQuestionsUrl).then(res => {
      dispatch({
         type: "LOAD_SECRECT_QUESTIONS",
         payload: res.data
      });
   });
};

export const verify = () => dispatch => {
   getDataToken().then(token => {
      auth.verify(url, token, data => {
         dispatch({
            type: "GET_DATA_USER",
            payload: data.data
         });
      });
   });
};

export const getTokenInfo = () => dispatch => {
   const token = localStorage.getItem("token");
   dispatch({
      type: "USERS_PERMISS",
      payload: {
         logged: true
      }
   });
};

export const changeBusinessBranchOfficesMenu = (businessId, branchOfficesId, option) => dispatch => {
   if (option === 0) {
      localStorage.setItem("business_default", businessId);
      localStorage.setItem("branch_office_default", branchOfficesId);
   } else {
      localStorage.setItem("business_default", businessId);
      localStorage.setItem("branch_office_default", branchOfficesId);
      let dataClient = {
         client_default: localStorage.getItem("client_default")
      };
      dispatch({
         type: "LOADING_CHANGE_BRANCH_OFFICES",
         payload: {
            loading: true,
            data: branchOfficesId
         }
      });
      getDataToken()
         .then(datos => {
            axios({
               method: "post",
               url: `/api/v1/users/dynamic-menu`,
               data: dataClient,
               headers: datos.headers
            })
               .then(res => {
                  dispatch({
                     type: "CHANGE_DYNAMIC_MENU",
                     payload: res.data
                  });
               })
               .catch(error => {
                  Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                     NotificationManager.warning(error.response.data.message);
                  console.log(error.response)
               });
         })
         .catch(() => {
            console.log("Problemas con el token");
         });
   }
}

export const changePerfilMenu = (data) => dispatch => {
   localStorage.setItem("client_default", data);
   let dataClient = {
      client_default: data
   };
   dispatch({
      type: "LOADING_CHANGE_BRANCH_OFFICES",
      payload: true
   });
   getDataToken()
      .then(datos => {
         axios({
            method: "post",
            url: `/api/v1/users/dynamic-menu`,
            data: dataClient,
            headers: datos.headers
         })
            .then(res => {
               dispatch({
                  type: "CHANGE_DYNAMIC_MENU",
                  payload: res.data
               });
            })
            .catch(error => {
               Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                  NotificationManager.warning(error.response.data.message);
               console.log(error.response)
            });
      })
      .catch(() => {
         console.log("Problemas con el token");
      });
}

