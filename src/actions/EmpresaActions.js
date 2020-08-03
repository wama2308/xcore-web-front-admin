import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, validations, clearForm, calculatePage } from "../helpers/helpers";

export const LoadEmpresasAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/business?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_EMPRESAS",
                        payload: {
                            loading: "hide",
                            data: res.data.data,
                            pagination: {
                                total: res.data.total,
                                page: res.data.page,
                                perPage: res.data.perPage,
                                lastPage: res.data.lastPage,
                                numberPage: calculatePage(res.data.page, offset, res.data.lastPage),
                            },
                            loading: false,
                        }
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
};

export const allBusinessFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_BUSINESS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/business?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_BUSINESS",
                        payload: {
                            data: res.data,
                        }
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
};

export const editarBusinessAction = (data, callback) => dispatch => {
    return new Promise((resolve, reject) => {
        clearForm('form-business')
        getDataToken()
            .then(datos => {
                axios({
                    method: "put",
                    url: `/api/v1/settings/business/${data.id}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        dispatch({
                            type: "EMPRESA_ID",
                            payload: data
                        });
                        resolve(res);
                    })
                    .catch(error => {
                        if (error.response.status === 422) {
                            let errors = error.response.data
                            validations('form-business', errors)
                        }
                        reject(error);
                    });
            })
            .catch(() => {
                console.log("Problemas con el token");
            });
    })
};

