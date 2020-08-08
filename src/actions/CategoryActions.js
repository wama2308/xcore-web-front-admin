import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadCategoryAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/admin/category?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_CATEGORY",
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
                            categoryId: {},
                            loading: false,
                            dataSettings: [],
                            dataSettingsModules: [],
                            dataModules: [],
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

export const allCategoryFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_CATEGORY",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/admin/category?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_CATEGORY",
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

export const allCategoryDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_CATEGORY",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/admin/category/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_CATEGORY_DISABLED",
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

export const saveCategoryAction = (data, callback, callbackLoading) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `${url}/api/v1/admin/category/store`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    callback();
                    dispatch({
                        type: "ADD_NEW_CATEGORY",
                        payload: res.data.xcCategory
                    });
                    //NotificationManager.success(res.data.message);
                })
                .catch(error => {
                    callbackLoading();
                    //     Array.isArray(error.response.data) ? NotificationManager.warning(error.response.data[0].message) :
                    //         NotificationManager.warning(error.response.data.message);
                });
        })
        .catch(() => {
            console.log("Problemas con el token");
        });
};

export const loadCategoryIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `${url}/api/v1/admin/category/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_CATEGORY_ID",
                        payload: {
                            data: res.data.xcCategory[0],
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

export const updateCategoryAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/admin/category/${data._id}`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    callback();
                    dispatch({
                        type: "UPDATE_REDUX_CATEGORY",
                        payload: res.data.xcCategory
                    });
                    //NotificationManager.success(res.data.message);
                })
                .catch(error => {
                    Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                        NotificationManager.warning(error.response.data.message);
                });
        })
        .catch(() => {
            console.log("Problemas con el token");
        });
};

export const changeEstatusCategoryFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/admin/category/change-status/${id}`,
                headers: datos.headers
            })
                .then(res => {
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
};

export const cleanStoreFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_FORM",
        payload: {}
    });
};

export const addSettingsCategoryFunction = (data, callback) => dispatch => {
    dispatch({
        type: "ADD_SEETINGS_CATEGORY",
        payload: {
            data: data
        }
    });
    callback();
    NotificationManager.success("Configuracion agregada");
};

export const updateSettingsCategoryFunction = (key, data, callback) => dispatch => {
    if (data.xc_category_id === 0) {
        dispatch({
            type: "UPDATE_SETTINGS_CATEGORY",
            payload: {
                key: key,
                data: data
            }
        });
        callback();
        NotificationManager.success("Configuracion editada");
    }else{
        getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/admin/category/setting/${data.id}`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "UPDATE_SETTINGS_CATEGORY",
                        payload: {
                            key: key,
                            data: data
                        }
                    });
                    callback();
                    //NotificationManager.success("Configuracion editada");
                })
                .catch(error => {                    
                    //NotificationManager.warning(error.response.data[0].message);
                    // Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                    //     NotificationManager.warning(error.response.data[0].message);
                });
        })
        .catch(() => {
            console.log("Problemas con el token");
        });
    }

};

export const deleteSettingsCategoryFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_SETTINGS_CATEGORY",
        payload: key
    });
    NotificationManager.success("Configuracion eliminada");
}

export const addSettingsModuleFunction = (data, callback) => dispatch => {
    dispatch({
        type: "ADD_SEETINGS_MODULE",
        payload: {
            data: data
        }
    });
    callback();
    NotificationManager.success("Configuracion agregada");
};

export const updateSettingsModuleFunction = (key, data, callback) => dispatch => {
    dispatch({
        type: "UPDATE_SETTINGS_MODULE",
        payload: {
            key: key,
            data: data
        }
    });
    callback();
    NotificationManager.success("Configuracion editada");
};

export const deleteSettingsModuleFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_SETTINGS_MODULE",
        payload: key
    });
    NotificationManager.success("Configuracion eliminada");
}

export const clenaSettingsModuleFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_SETTINGS_MODULE",
        payload: []
    });
}