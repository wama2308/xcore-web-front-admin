import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadUsersAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/user?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_USERS",
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
                            userId: {},
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

export const allUsersFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_USERS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/user?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_USERS",
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

export const allUsersDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_USERS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/user/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_USERS_DISABLED",
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

export const saveUsersAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `/api/v1/settings/user/store`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    callback();
                    NotificationManager.success(res.data.message);
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

export const updateUsersAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/user/${data.id}`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
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
};

export const loadUsersIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `/api/v1/settings/user/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_USERS_ID",
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

export const changeEstatusUsersFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/user/change-status/${id}`,
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
        payload: {
            clean: {},
        }
    });
};