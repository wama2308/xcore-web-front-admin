import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadStoreAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/store?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_STORE",
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
                            storeId: {},
                            shelfs: [],
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


export const allStoreFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_STORE",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/store?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_STORE",
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

export const allStoreDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_STORE",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/store/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_STORE_DISABLED",
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

export const saveStoreAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `${url}/api/v1/settings/store/store`,
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

export const updateStoreAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/store/${data.id}`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    callback();
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

export const loadStoreIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `${url}/api/v1/settings/store/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_STORE_ID",
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

export const changeEstatusStoreFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/store/change-status/${id}`,
                headers: datos.headers
            })
                .then(res => {
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

export const cleanStoreFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_FORM",
        payload: {
            storeId: {},
            shelfs: [],
        }
    });
};

export const addShelfsFunction = (data, callback, almacenId) => dispatch => {
    if (almacenId === '') {
        dispatch({
            type: "ADD_SHELFS",
            payload: {
                data: data
            }
        });
        callback();
        NotificationManager.success("Estante agregado");
    } else {
        getDataToken()
            .then(datos => {
                axios({
                    method: "post",
                    url: `${url}/api/v1/settings/shelf/store/${almacenId}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        dispatch({
                            type: "ADD_SHELFS",
                            payload: {
                                data: data
                            }
                        });
                        callback();
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

export const editShelfsFunction = (key, data, almacenId, callback) => dispatch => {
    if (data._id === '') {
        dispatch({
            type: "EDIT_SHELFS",
            payload: {
                key: key,
                data: data
            }
        });
        callback();
        NotificationManager.success("Estante editado");
    } else {
        getDataToken()
            .then(datos => {
                axios({
                    method: "put",
                    url: `${url}/api/v1/settings/shelf/update/${data._id}/${almacenId}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        dispatch({
                            type: "EDIT_SHELFS",
                            payload: {
                                key: key,
                                data: data
                            }
                        });
                        callback();
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

export const deleteShelfsFunction = (data, key, almacenId) => dispatch => {
    if (data._id === '') {
        dispatch({
            type: "DELETE_SHELFS",
            payload: key
        });
        NotificationManager.success("Estante eliminado");
    } else {
        getDataToken()
            .then(datos => {
                axios({
                    method: "put",
                    url: `${url}/api/v1/settings/shelf/change-status/${data._id}/${almacenId}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        dispatch({
                            type: "DELETE_SHELFS",
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
