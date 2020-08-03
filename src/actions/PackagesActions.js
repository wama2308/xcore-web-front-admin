import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadPackagesAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/package?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "LOAD_PACKAGES",
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
                            packageId: {},
                            actionDataExtra: 0,
                            dataClass: [],
                            dataPlan: [],
                            dataAreas: [],
                            arrayAreas: [],
                            arrayClasses: [],
                            arrayPlanes: [],
                            products: [],
                            services: [],
                            penalties: [],
                            modal: {
                                modal: false,
                                modalHeader: '',
                                data: {},
                                disabled: '',
                                buttonFooter: 'Guardar',
                                showHide: false,
                                option: 0,
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

export const dataExtraPackages = () => dispatch => {
    getDataToken()
        .then(datos => {
            areasSelectFunction(datos, dataAreas => {
                classSelectFunction(datos, dataClass => {
                    planSelectFunction(datos, dataPlan => {
                        dispatch({
                            type: "DATA_EXTRA_PACKAGES",
                            payload: {
                                dataClass: dataClass,
                                dataPlan: dataPlan,
                                dataAreas: dataAreas,
                            }
                        });
                    });
                });
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

export const allPackagesFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_PACKAGES",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/package?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_PACKAGES",
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

export const allPackagesDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_PACKAGES",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/settings/package/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_PACKAGES_DISABLED",
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

export const savePackagesAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `/api/v1/settings/package/store`,
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

export const updatePackagesAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/package/${data.id}`,
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

export const loadPackagesIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `/api/v1/settings/package/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_PACKAGES_ID",
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

export const changeEstatusPackagesFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `/api/v1/settings/package/change-status/${id}`,
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
            packageId: {},
        }
    });
};

export const cleanStoreDiscountPackagesFunction = () => dispatch => {
    dispatch({
        type: "SEEKER_SERVICES",
        payload: ""
    });
    dispatch({
        type: "SEEKER_PRODUCTS",
        payload: ""
    });
    dispatch({
        type: "CLEAN_STORE_FORM_PACKAGES_DISCOUNT",
        payload: {
            packageId: {},
        }
    });
};

export const addPenaltyFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este penalizacion ya esta agregada");
    } else {
        dispatch({
            type: "ADD_PENALTY_PACKAGES",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Penalizacion Agregada");
    }
};

export const deletePenaltyFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PENALTY_PACKAGES",
        payload: key
    });
    NotificationManager.success("Penalizacion Eliminada");
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
                        type: "SEARCH_PRODUCTS_PAQUETES",
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
                type: "SEARCH_PRODUCTO_ID_PAQUETES",
                payload: data
            });
        }
    }
};

export const deleteProductoIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_PRODUCTO_PACKAGES",
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
                        type: "SEARCH_SERVICES_PACKAGES",
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
                type: "SEARCH_SERVICE_ID_PACKAGES",
                payload: data
            });
        }
    }
};

export const deleteServiceIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_SERVICE_PACKAGES",
        payload: key
    });
};

export const addClassFunction = (data, dataAll, dataDiscount, option) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este clase ya esta agregada");
    } else {
        dispatch({
            type: "ADD_CLASS_PACKAGES",
            payload: {
                data: data,
                dataDiscount: dataDiscount,
                option: option,
            }
        });
        NotificationManager.success("Clase Agregada");
    }
};

export const deleteClassFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_CLASS_PACKAGES",
        payload: key
    });
    NotificationManager.success("Clase Eliminada");
};

export const addPlanFunction = (data, dataAll, dataDiscount, option) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este plan ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PLAN_PACKAGES",
            payload: {
                data: data,
                dataDiscount: dataDiscount,
                option: option,
            }
        });
        NotificationManager.success("Plan Agregado");
    }
};

export const deletePlanFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PLAN_PACKAGES",
        payload: key
    });
    NotificationManager.success("Plan Eliminado");
};

export const addAreasFunction = (data, dataAll, dataDiscount, option) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Esta area ya esta agregada");
    } else {
        dispatch({
            type: "ADD_AREA_PACKAGES",
            payload: {
                data: data,
                dataDiscount: dataDiscount,
                option: option,
            }
        });
        NotificationManager.success("Area Agregada");
    }
};

export const deleteAreasFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_AREA_PACKAGES",
        payload: key
    });
    NotificationManager.success("Area Eliminada");
};

export const addDiscountSelectProduct = (data, id) => dispatch => {
    if (data) {
        dispatch({
            type: "ADD_DISCOUNT_SELECT_PRODUCT",
            payload: {
                data: data,
                id: id,
            }
        });
    }
};

export const addDiscountSelectService = (data, id) => dispatch => {
    if (data) {
        dispatch({
            type: "ADD_DISCOUNT_SELECT_SERVICE",
            payload: {
                data: data,
                id: id,
            }
        });
    }

};

export const changeDiscountSelectPackages = data => dispatch => {
    dispatch({
        type: "CHANGE_DISCOUNT_SELECT_PACKAGES",
        payload: {
            data: data
        }
    });
};

export const modalFunction = (option, data) => dispatch => {
    dispatch({
        type: "MODAL_PACKAGES",
        payload: {
            option: option,
            data: data
        }
    });
};

