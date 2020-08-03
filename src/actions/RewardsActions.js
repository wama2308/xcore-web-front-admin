import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { getDataToken, calculatePage } from "../helpers/helpers";

export const LoadRewardsAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/reward?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    classSelectFunction(datos, dataClass => {
                        planSelectFunction(datos, dataPlan => {
                            packagesSelectFunction(datos, dataPackages => {
                                dispatch({
                                    type: "LOAD_REWARDS",
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
                                        rewardId: {},
                                        dataClass: dataClass,
                                        dataPlan: dataPlan,
                                        dataPackages: dataPackages,
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

const packagesDisabledFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/package/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
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

export const allRewardsFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_REWARDS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/reward?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_REWARDS",
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

export const allRewardsDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_REWARDS",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/reward/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_REWARDS_DISABLED",
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

export const saveRewardAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `/api/v1/settings/reward/store`,
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

export const updateRewardAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/reward/${data.id}`,
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

export const loadRewardIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `/api/v1/settings/reward/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_REWARD_ID",
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

export const changeEstatusRewardFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/reward/change-status/${id}`,
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
            rewardId: {},
        }
    });
};

export const addClassFunction = (data, dataAll, dataDiscountQuantity, option) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este clase ya esta agregada");
    } else {
        dispatch({
            type: "ADD_CLASS_REWARDS",
            payload: {
                data: data,
                dataDiscountQuantity: dataDiscountQuantity,
                option: option,
            }
        });
        NotificationManager.success("Clase Agregada");
    }
};

export const deleteClassFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_CLASS_REWARDS",
        payload: key
    });
    NotificationManager.success("Clase Eliminada");
};

export const addPlanFunction = (data, dataAll, dataDiscountQuantity, option) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este plan ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PLAN_REWARDS",
            payload: {
                data: data,
                dataDiscountQuantity: dataDiscountQuantity,
                option: option,
            }
        });
        NotificationManager.success("Plan Agregado");
    }
};

export const deletePlanFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PLAN_REWARDS",
        payload: key
    });
    NotificationManager.success("Plan Eliminado");
};

export const addPackageFunction = (data, dataAll, dataDiscountQuantity, option) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este paquete ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PACKAGE_REWARDS",
            payload: {
                data: data,
                dataDiscountQuantity: dataDiscountQuantity,
                option: option,
            }
        });
        NotificationManager.success("Paquete Agregado");
    }
};

export const deletePackageFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PACKAGE_REWARDS",
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
                        type: "SEARCH_PRODUCTS_REWARDS",
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
                type: "SEARCH_PRODUCTO_ID_REWARDS",
                payload: data
            });
        }
    }
};

export const deleteProductoIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_PRODUCTO_REWARDS",
        payload: key
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
                        type: "SEARCH_SERVICES_REWARDS",
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
                type: "SEARCH_SERVICE_ID_REWARDS",
                payload: data
            });
        }
    }
};

export const deleteServiceIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_SERVICE_REWARDS",
        payload: key
    });
};

export const addDiscountSelectProduct = (id, data) => dispatch => {
    dispatch({
        type: "ADD_DISCOUNT_SELECT_PRODUCT_REWARDS",
        payload: {
            data: data,
            id: id,
        }
    });
};

export const addDiscountSelectService = (data, id) => dispatch => {
    dispatch({
        type: "ADD_DISCOUNT_SELECT_SERVICE_REWARDS",
        payload: {
            data: data,
            id: id,
        }
    });
};

export const setDataProductsQuantityRewardAction = (id, value) => dispatch => {
    if (value) {
        dispatch({
            type: "SET_DATA_PRODUCTS_QUANTITY_REWARDS",
            payload: {
                id: id,
                value: value,
            }
        });
    } else {
        dispatch({
            type: "SET_DATA_PRODUCTS_QUANTITY_REWARDS",
            payload: {
                id: id,
                value: 0,
            }
        });
    }
};

export const setDataServicesQuantityRewardAction = (id, value) => dispatch => {
    if (value) {
        dispatch({
            type: "SET_DATA_SERVICES_QUANTITY_REWARDS",
            payload: {
                id: id,
                value: value,
            }
        });
    } else {
        dispatch({
            type: "SET_DATA_SERVICES_QUANTITY_REWARDS",
            payload: {
                id: id,
                value: 0,
            }
        });
    }
};

export const cleanStoreRewardsFunction = () => dispatch => {
    dispatch({
        type: "SEEKER_SERVICES",
        payload: ""
    });
    dispatch({
        type: "SEEKER_PRODUCTS",
        payload: ""
    });
    dispatch({
        type: "CLEAN_STORE_FORM_REWARDS",
        payload: {
            packageId: {},
        }
    });
};