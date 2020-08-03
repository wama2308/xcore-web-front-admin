import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadTypeClientAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/type-client?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    areasSelectFunction(datos, dataAreas => {
                        classSelectFunction(datos, dataClass => {
                            planSelectFunction(datos, dataPlan => {
                                packagesSelectFunction(datos, dataPackages => {
                                    dispatch({
                                        type: "LOAD_TYPE_CLIENT",
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
                                            typeClientId: {},
                                            dataAreas: dataAreas,
                                            dataClass: dataClass,
                                            dataPackages: dataPackages,
                                            dataPlan: dataPlan,
                                            arrayAreas: [],
                                            arrayClasses: [],
                                            arrayPlanes: [],
                                            arrayPackages: [],
                                            products: [],
                                            services: [],
                                            loading: false,
                                        }
                                    });
                                });
                            });
                        });
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

const areasSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/area/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const classSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/class/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const planSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/plan/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const packagesSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/package/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const allTypeClientFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_TYPE_CLIENT",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/type-client?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_TYPE_CLIENT",
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

export const allTypeClientDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_TYPE_CLIENT",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/type-client/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_TYPE_CLIENT_DISABLED",
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

export const saveTypeClientAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `/api/v1/settings/type-client/store`,
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

export const updateTypeClientAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/type-client/${data.id}`,
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

export const loadTypeClientIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `/api/v1/settings/type-client/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_TYPE_CLIENT_ID",
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

export const changeEstatusTypeClientFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/type-client/change-status/${id}`,
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
            typeClientId: {},
        }
    });
};

export const addAreasFunction = (data, dataAll, objectData) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Esta area ya esta agregada");
    } else {
        dispatch({
            type: "ADD_AREA_TYPE_CLIENT",
            payload: {
                data: data,
                objectData: objectData,
            }
        });
        NotificationManager.success("Area Agregada");
    }
};

export const deleteAreasFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_AREA_TYPE_CLIENT",
        payload: key
    });
    NotificationManager.success("Area Eliminada");
};

export const addClassFunction = (data, dataAll, objectData) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este clase ya esta agregada");
    } else {
        dispatch({
            type: "ADD_CLASS_TYPE_CLIENT",
            payload: {
                data: data,
                objectData: objectData,
            }
        });
        NotificationManager.success("Clase Agregada");
    }
};

export const deleteClassFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_CLASS_TYPE_CLIENT",
        payload: key
    });
    NotificationManager.success("Clase Eliminada");
};

export const addPlanFunction = (data, dataAll, objectData) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este plan ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PLAN_TYPE_CLIENT",
            payload: {
                data: data,
                objectData: objectData,
            }
        });
        NotificationManager.success("Plan Agregado");
    }
};

export const deletePlanFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PLAN_TYPE_CLIENT",
        payload: key
    });
    NotificationManager.success("Plan Eliminado");
};

export const addPackageFunction = (data, dataAll, objectData) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este paquete ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PACKAGE_TYPE_CLIENT",
            payload: {
                data: data,
                objectData: objectData,
            }
        });
        NotificationManager.success("Paquete Agregado");
    }
};

export const deletePackageFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PACKAGE_TYPE_CLIENT",
        payload: key
    });
    NotificationManager.success("Paquete Eliminado");
};

export const searchProducts = data => dispatch => {
    let page = 1;
    let perPage = 10;
    getDataToken()
        .then(datos => {
            dispatch({
                type: "SEEKER_PRODUCTS",
                payload: data
            });
            axios.get(`/api/v1/settings/product?page=` + page + `&perPage=` + perPage + `&search=` + data, datos)
                .then(res => {
                    dispatch({
                        type: "SEARCH_PRODUCTS_TYPE_CLIENT",
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

export const searchProductId = (data, dataAllProducts) => dispatch => {
    if (!data) {
        NotificationManager.warning("Ningun producto seleccionado");
    }
    else {
        const bienRepeat = dataAllProducts.find(product => product.products_id === data.value);
        if (bienRepeat) {
            dispatch({
                type: "SEEKER_PRODUCTS",
                payload: ""
            });
            NotificationManager.warning("Este  ya se encuentra agregado");
        } else {
            dispatch({
                type: "SEEKER_PRODUCTS",
                payload: ""
            });
            dispatch({
                type: "SEARCH_PRODUCTO_ID_TYPE_CLIENT",
                payload: data
            });
        }
    }
};

export const deleteProductoIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_PRODUCTO_TYPE_CLIENT",
        payload: key
    });
};

export const setDataProductsAction = (id, value, type) => dispatch => {
    if (value) {
        dispatch({
            type: "SET_DATA_PRODUCTS",
            payload: {
                id: id,
                value: value,
                type: type,
            }
        });
    } else {
        dispatch({
            type: "SET_DATA_PRODUCTS",
            payload: {
                id: id,
                value: 0,
                type: type,
            }
        });
    }
};

export const setSelectDataProducts = (id, data, type) => dispatch => {
    dispatch({
        type: "SET_SELECT_DATA_PRODUCTS",
        payload: {
            data: data,
            id: id,
            type: type,
        }
    });
};

export const searchServices = data => dispatch => {
    let page = 1;
    let perPage = 10;
    getDataToken()
        .then(datos => {
            dispatch({
                type: "SEEKER_SERVICES",
                payload: data
            });
            axios.get(`/api/v1/settings/service?page=` + page + `&perPage=` + perPage + `&search=` + data, datos)
                .then(res => {
                    dispatch({
                        type: "SEARCH_SERVICES_TYPE_CLIENT",
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

export const searchServiceId = (data, dataAllProducts) => dispatch => {
    if (!data) {
        NotificationManager.warning("Ningun servicio seleccionado");
    }
    else {
        const bienRepeat = dataAllProducts.find(product => product.services_id === data.value);
        if (bienRepeat) {
            dispatch({
                type: "SEEKER_SERVICES",
                payload: ""
            });
            NotificationManager.warning("Este servicio ya se encuentra agregado");
        } else {
            dispatch({
                type: "SEEKER_SERVICES",
                payload: ""
            });
            dispatch({
                type: "SEARCH_SERVICE_ID_TYPE_CLIENT",
                payload: data
            });
        }
    }
};

export const deleteServiceIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_SERVICE_TYPE_CLIENT",
        payload: key
    });
};

export const setDataServicesAction = (id, value, type) => dispatch => {
    if (value) {
        dispatch({
            type: "SET_DATA_SERVICES",
            payload: {
                id: id,
                value: value,
                type: type,
            }
        });
    } else {
        dispatch({
            type: "SET_DATA_SERVICES",
            payload: {
                id: id,
                value: 0,
                type: type,
            }
        });
    }
};

export const setSelectDataServices = (id, data, type) => dispatch => {
    dispatch({
        type: "SET_SELECT_DATA_SERVICES",
        payload: {
            data: data,
            id: id,
            type: type,
        }
    });
};

export const cleanStoreTypeClientFunction = () => dispatch => {
    dispatch({
        type: "SEEKER_SERVICES",
        payload: ""
    });
    dispatch({
        type: "CLEAN_STORE_FORM_TYPE_CLIENTS",
        payload: {
            packageId: {},
        }
    });
};
