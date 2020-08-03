import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadDiscountsAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/discount?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    classSelectFunction(datos, dataClass => {
                        planSelectFunction(datos, dataPlan => {
                            packagesSelectFunction(datos, dataPackages => {
                                areasSelectFunction(datos, dataAreas => {
                                    dispatch({
                                        type: "LOAD_DISCOUNTS",
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
                                            discountId: {},
                                            arrayAreas: [],
                                            arrayClasses: [],
                                            arrayPlanes: [],
                                            arrayPackages: [],
                                            products: [],
                                            services: [],
                                            dataClass: dataClass,
                                            dataPlan: dataPlan,
                                            dataPackages: dataPackages,
                                            dataAreas: dataAreas,
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

const classSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`${url}/api/v1/settings/class/select`, datos)
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
    axios.get(`${url}/api/v1/settings/plan/select`, datos)
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
    axios.get(`${url}/api/v1/settings/package/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const areasSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`${url}/api/v1/settings/area/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const allDiscountsFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_DISCOUNT",
        payload: true
    });

    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/discount?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_DISCOUNTS",
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

export const allDiscountsDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_DISCOUNT",
        payload: true
    });

    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/discount/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_DISCOUNTS_DISABLED",
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

export const saveDiscountsAction = (data, callback, addDiscount) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `${url}/api/v1/settings/discount/store`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    if (addDiscount) {
                        dispatch({
                            type: "ADD_DISCOUNT",
                            payload: {
                                data: res.data.discount,
                            }
                        });

                    }
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

export const updateDiscountsAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/discount/${data.id}`,
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

export const loadDiscountsIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `${url}/api/v1/settings/discount/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_DISCOUNTS_ID",
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

export const changeEstatusDiscountsFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/discount/change-status/${id}`,
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
            discountId: {},
        }
    });
};

export const cleanStoreArrayAreasFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_ARRAY_AREAS",
        payload: []
    });
};

export const cleanStoreArrayClassFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_ARRAY_CLASS",
        payload: []
    });
};

export const cleanStoreArrayPlanesFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_ARRAY_PLANES",
        payload: []
    });
};

export const cleanStoreArrayPackagesFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_ARRAY_PACKAGES",
        payload: []
    });
};

export const cleanStoreArrayProductsFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_ARRAY_PRODUCTS",
        payload: []
    });
    dispatch({
        type: "SEEKER_PRODUCTS",
        payload: ""
    });
};

export const cleanStoreArrayServicesFunction = () => dispatch => {
    dispatch({
        type: "CLEAN_STORE_ARRAY_SERVICES",
        payload: []
    });
    dispatch({
        type: "SEEKER_SERVICES",
        payload: ""
    });
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
            axios.get(`${url}/api/v1/settings/product?page=` + page + `&perPage=` + perPage + `&search=` + data, datos)
                .then(res => {
                    dispatch({
                        type: "SEARCH_PRODUCTS_DISCOUNTS",
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
            NotificationManager.warning("Este producto ya se encuentra agregado");
        } else {
            dispatch({
                type: "SEEKER_PRODUCTS",
                payload: ""
            });
            dispatch({
                type: "SEARCH_PRODUCTO_ID_DISCOUNTS",
                payload: data
            });
        }
    }
};

export const deleteProductoIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_PRODUCTO",
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
            axios.get(`${url}/api/v1/settings/service?page=` + page + `&perPage=` + perPage + `&search=` + data, datos)
                .then(res => {
                    dispatch({
                        type: "SEARCH_SERVICES_DISCOUNTS",
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
                type: "SEARCH_SERVICE_ID_DISCOUNTS",
                payload: data
            });
        }
    }
};

export const deleteServiceIdFunction = key => dispatch => {
    dispatch({
        type: "DELETE_SERVICE",
        payload: key
    });
};

export const addClassFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este clase ya esta agregada");
    } else {
        dispatch({
            type: "ADD_CLASS_DISCOUNT",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Clase Agregada");
    }
};

export const deleteClassFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_CLASS_DISCOUNT",
        payload: key
    });
    NotificationManager.success("Clase Eliminada");
};

export const addPlanFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este plan ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PLAN_DISCOUNT",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Plan Agregado");
    }
};

export const deletePlanFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PLAN_DISCOUNT",
        payload: key
    });
    NotificationManager.success("Plan Eliminado");
};

export const addPackagesFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Este paquete ya esta agregado");
    } else {
        dispatch({
            type: "ADD_PACKAGE_DISCOUNT",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Paquete Agregado");
    }
};

export const deletePackageFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_PACKAGE_DISCOUNT",
        payload: key
    });
    NotificationManager.success("Paquete Eliminado");
};

export const addAreasFunction = (data, dataAll) => dispatch => {
    const repeat = dataAll.find(penalty => penalty._id === data._id);
    if (repeat) {
        NotificationManager.warning("Esta area ya esta agregada");
    } else {
        dispatch({
            type: "ADD_AREA_DISCOUNT",
            payload: {
                data: data
            }
        });
        NotificationManager.success("Area Agregada");
    }
};

export const deleteAreasFunction = (key) => dispatch => {
    dispatch({
        type: "DELETE_AREA_DISCOUNT",
        payload: key
    });
    NotificationManager.success("Area Eliminada");
};

