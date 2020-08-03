import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";
const saveClassUrl = `${url}/api/v1/settings/class/store`;

export const LoadClassAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/class?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_CLASS",
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
                            classId: {},
                            arrayPenalty: [],
                            arrayHorario: [],
                            arrayScreens: [],
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

const classDisabledFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`${url}/api/v1/settings/class/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const allClassFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_CLASSES",
        payload: true
    });

    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/class?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_CLASS",
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

export const allClassDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_CLASSES",
        payload: true
    });

    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/class/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_CLASS_DISABLED",
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

export const saveClassAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: saveClassUrl,
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

export const updateClassAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/class/${data.id}`,
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

export const loadClassIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `${url}/api/v1/settings/class/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_CLASS_ID",
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

export const changeEstatusClassFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/class/change-status/${id}`,
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

export const addPenaltyFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este penalizacion ya esta agregada");
    } else {
        dispatch({
            type: "ADD_PENALTY_CLASS",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Penalizacion Agregada");
    }
};

export const deletePenaltyFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PENALTY_CLASS",
        payload: key
    });
    NotificationManager.success("Penalizacion Eliminada");
};

export const addScreenFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(monitor => monitor._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este monitor ya esta agregado");
    } else {
        dispatch({
            type: "ADD_SCREEN_CLASS",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Monitor Agregado");
    }
};

export const deleteScreenFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_SCREEN_CLASS",
        payload: key
    });
    NotificationManager.success("Monitor Eliminado");
};

export const cleanStoreFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_FORM",
        payload: {
            classId: {},
            arrayPenalty: [],
            arrayScreens: [],
        }
    });
};
