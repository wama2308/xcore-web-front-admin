import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, validations, clearForm, calculatePage, loadItemsAll, updateLocalStorage } from "../helpers/helpers";
const typePenaltiesUrl = `/api/v1/settings/penalty/type-penalties`;
const areasStoreUrl = `/api/v1/settings/area/store`;
const selectDiscountUrl = `/api/v1/settings/discount/select`;
export const LoadAreasAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/area?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_AREAS",
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
                            areaId: {},
                            bienId: [],
                            arrayPenalty: [],
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

export const allAreasFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_AREAS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/area?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_AREAS",
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

export const allAreasDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_AREAS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/area/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_AREAS_DISABLED",
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

const areasDisabledFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios
        .get(`/api/v1/settings/area/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const saveAreaAction = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        clearForm('form-area')
        getDataToken()
            .then(datos => {
                axios({
                    method: "post",
                    url: areasStoreUrl,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        resolve(res);
                        dispatch({
                            type: "ADD_NEW_AREA",
                            payload: res.data.areas[0]                                
                        });
                    })
                    .catch(error => {
                        if (error.response.status === 422) {
                            let errors = error.response.data
                            validations('form-area', errors)
                        }
                        reject(error);
                    });
            })
            .catch((error) => {
                console.log("Problemas con el token");
                reject(error);
            });
    })
};

export const updateAreaAction = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        clearForm('form-area')
        getDataToken()
            .then(datos => {
                axios({
                    method: "put",
                    url: `/api/v1/settings/area/${data.id}`,
                    data: data,
                    headers: datos.headers
                })
                    .then(res => {
                        resolve(res);
                        dispatch({
                            type: "UPDATE_AREA_ID",
                            payload: {
                                _id: res.data.area._id,
                                name: res.data.area.name,
                            }
                        });
                        // if(loadItemsAll()){
                        //     updateLocalStorage(res.data.area, 'editLocalStorageAreaId');
                        // }
                    })
                    .catch(error => {
                        reject(error);
                        if (error.response.status === 422) {
                            let errors = error.response.data
                            validations('form-area', errors)
                        } else if (error.response.data && error.response.data.message) {
                            NotificationManager.warning(error.response.data.message);
                        }
                    });
            })
            .catch(() => {
                console.log("Problemas con el token");
                reject(error);
            });
    })
};

export const cambiarEstatusAreaFunction = (id, option, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/area/change-status/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    NotificationManager.success(res.data.message);
                    dispatch({
                        type: "DELETE_AREA_ID",
                        payload: {
                            _id: res.data.area._id,
                            name: res.data.area.name,
                            option: option
                        }
                    });
                    callback();                    
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

export const searchBienes = data => dispatch => {
    getDataToken()
        .then(datos => {
            dispatch({
                type: "SEEKER_DATA",
                payload: data
            });
            axios.get(`/api/v1/settings/good/select?search=` + data, datos)
                .then(res => {
                    dispatch({
                        type: "SEARCH_BIENES_AREAS",
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

export const searchBienId = (data, dataAllBienes) => dispatch => {
    if (!data) {
        NotificationManager.warning("Ningun bien seleccionado");
    }
    else {
        const bienRepeat = dataAllBienes.find(bien => bien.goods_id === data.value);
        if (bienRepeat) {
            dispatch({
                type: "SEEKER_DATA",
                payload: ""
            });
            NotificationManager.warning("Este bien ya se encuentra agregado");
        } else {
            dispatch({
                type: "SEEKER_DATA",
                payload: ""
            });
            dispatch({
                type: "SEARCH_BIEN_ID_AREAS",
                payload: data
            });
        }
    }

};

export const setQuantityBienAction = (id, value) => dispatch => {
    if (value) {
        dispatch({
            type: "SET_QUANTITY_BIEN",
            payload: {
                id: id,
                value: value,
            }
        });
    } else {
        dispatch({
            type: "SET_QUANTITY_BIEN",
            payload: {
                id: id,
                value: 0,
            }
        });
    }
};

export const deleteBienIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_BIEN",
        payload: key
    });
};

export const limpiarStoreForm = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_FORM",
        payload: []
    });
};

export const loadAreaIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `/api/v1/settings/area/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_AREA_ID",
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

export const addPenaltyFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este penalizacion ya esta agregada");
    } else {
        dispatch({
            type: "ADD_PENALTY_AREAS",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Penalizacion Agregada");
    }
};

export const deletePenaltyFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PENALTY_AREAS",
        payload: key
    });
    NotificationManager.success("Penalizacion Eliminada");
};
