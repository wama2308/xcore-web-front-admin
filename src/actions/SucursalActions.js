import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage, validations, clearForm } from "../helpers/helpers";
const branchOfficesStoreUrl = `/api/v1/settings/branch-office/store`;


export const LoadSucursalesAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/branch-office?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_SUCURSALES",
                        payload: {
                            data: res.data.data,
                            pagination: {
                                total: res.data.total,
                                page: res.data.page,
                                perPage: res.data.perPage,
                                lastPage: res.data.lastPage,
                                numberPage: calculatePage(res.data.page, offset, res.data.lastPage),
                            },
                            actionDisable: 0,
                            dataDisabled: [],
                            paginationDisabled: {},
                            brachOfficesId: {},
                            contactos: [],
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

const branchOfficesDisabledFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios
        .get(`/api/v1/settings/branch-office/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const allBranchOfficesFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_BRANCHOFFICES",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/branch-office?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_BRANCHOFFICES",
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

export const allBranchOfficesDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_BRANCHOFFICES",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/branch-office/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_BRANCHOFFICES_DISABLED",
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

export const addContactosFunction = (data, callback) => dispatch => {
    dispatch({
        type: "ADD_CONTACTOS",
        payload: {
            data: data
        }
    });
    callback();
    NotificationManager.success("Contacto agregado");
};

export const editContactosFunction = (key, data, callback) => dispatch => {
    dispatch({
        type: "EDIT_CONTACTOS",
        payload: {
            key: key,
            data: data
        }
    });
    callback();
    NotificationManager.success("Contacto editado");
};

export const deleteContactosFunction = (data, key) => dispatch => {
    if (data.id === '') {
        dispatch({
            type: "DELETE_CONTACTOS",
            payload: key
        });
        NotificationManager.success("Contacto eliminado");
    } else {
        getDataToken()
            .then(datos => {
                axios({
                    method: "delete",
                    url: `/api/v1/settings/contact/destroy/${data._id}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        dispatch({
                            type: "DELETE_CONTACTOS",
                            payload: key
                        });
                        NotificationManager.success(res.data.message);
                    })
                    .catch(error => {
                        Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                            NotificationManager.warning(error.response.data.message);
                    });
            })
            .catch(() => {
                console.log("Problemas con el token");
            });
    }

};

export const limpiarContactosFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_CONTACTOS",
        payload: []
    });
};

export const saveBranchOfficesAction = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        clearForm('form-sucursal')
        getDataToken()
            .then(datos => {
                axios({
                    method: "post",
                    url: branchOfficesStoreUrl,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        resolve(res);
                    })
                    .catch(error => {
                        if (error.response.status === 422) {
                            let errors = error.response.data
                            validations('form-sucursal', errors)
                        }
                        reject(error);
                    });
            })
            .catch(() => {
                console.log("Problemas con el token");
            });
    })
};

export const loadBranchOfficesIdAction = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        getDataToken()
            .then(datos => {
                axios({
                    method: "get",
                    url: `/api/v1/settings/branch-office/${id}`,
                    headers: datos.headers
                })
                    .then(res => {
                        dispatch({
                            type: "LOAD_BRANCHOFFICES_ID",
                            payload: {
                                data: res.data,
                            }
                        });
                        resolve(res)
                    })
                    .catch(error => {
                        reject(error)
                    });
            })
            .catch(() => {
                console.log("Problemas con el token");
            });
    })
};

export const updateBranchOfficesAction = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        clearForm('form-sucursal')
        getDataToken()
            .then(datos => {
                axios({
                    method: "put",
                    url: `/api/v1/settings/branch-office/${data._id}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        resolve(res);
                    })
                    .catch(error => {
                        if (error.response.status === 422) {
                            let errors = error.response.data
                            validations('form-sucursal', errors)
                        }
                        reject(error);
                    });
            })
            .catch(() => {
                console.log("Problemas con el token");
            });
    })
};
