import { NotificationManager } from 'react-notifications';
import axios from "axios";
import { url, getDataToken, calculatePage } from "../helpers/helpers";

export const LoadPurchasesAction = () => dispatch => {
    let page = 1;
    let perPage = 10;
    let search = "";
    let offset = 2;
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/provider?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    providerSelectFunction(datos, selectProviderData => {
                        dispatch({
                            type: "LOAD_PURCHASES",
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
                                purchaseId: {},
                                selectProviderData: selectProviderData,
                                products: [
                                    // {
                                    //     categoria: "BEBIDAS",
                                    //     descripcion: "aaaaaaaaaaaa",
                                    //     exempt: false,
                                    //     name: "Agua",
                                    //     product_category_id: "5efe4ce74b519a877fa62c16",
                                    //     product_id: "0",
                                    //     profit_amount: "5,500.00",
                                    //     profit_percentage: "10",
                                    //     quantity: 10,
                                    //     sale_price: 5500,
                                    //     tax: 16,
                                    //     tax_id: "5e4ee55353122b60f6002987",
                                    //     unit_price: 5000,
                                    // }
                                ],
                                dataProducts: [],
                                paginationProducts: {},
                                subTotalPurchase: '0.00',
                                taxPurchase: '0.00',
                                totalPurchase: '0.00',
                                wayToPay: [],
                                paidUp: 0,
                                loading: false,
                                loadingSearchProduct: false,
                            }
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

const providerSelectFunction = (datos, execute) => {
    axios
        .get(`/api/v1/settings/provider/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const allPurchasesFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_PURCHASES",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/provider?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_PURCHASES",
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

export const allPurchasesDisabledFunction = (page, perPage, search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_PURCHASES",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`${url}/api/v1/settings/provider/disabled?page=` + page + `&perPage=` + perPage + `&search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "ALL_PURCHASES_DISABLED",
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

export const savePurchasesAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "post",
                url: `${url}/api/v1/settings/purchases/store`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    callback();
                    dispatch({
                        type: "ADD_NEW_PURCHASES",
                        payload: res.data.provider
                    });
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

export const updatePurchasesAction = (data, callback) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/provider/${data._id}`,
                data: data,
                headers: datos.headers
            })
                .then(res => {
                    callback();
                    dispatch({
                        type: "UPDATE_REDUX_PURCHASES_ID",
                        payload: res.data.provider
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

export const loadPurchasesIdAction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "get",
                url: `${url}/api/v1/settings/provider/${id}`,
                headers: datos.headers
            })
                .then(res => {
                    dispatch({
                        type: "LOAD_PURCHASES_ID",
                        payload: {
                            data: res.data.provider,
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

export const changeEstatusPurchasesFunction = (id) => dispatch => {
    getDataToken()
        .then(datos => {
            axios({
                method: "put",
                url: `${url}/api/v1/settings/provider/change-status/${id}`,
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
        payload: {}
    });
};

export const addNewProductFunction = (data, dataAll, callback) => dispatch => {
    let searchProductRepeat;
    if (data.product_id === '0') {
        searchProductRepeat = dataAll.find(product => product.name === data.name || product.codeBar === data.codeBar);
    } else {
        searchProductRepeat = dataAll.find(product => product.product_id === data.product_id ||
            product.name === data.name ||
            product.codeBar === data.codeBar
        );
    }
    if (searchProductRepeat) {
        NotificationManager.warning("Este producto ya se encuentra agregado");
    } else {
        dispatch({
            type: "ADD_NEW_PRODUCT_PURCHASES",
            payload: {
                data: data
            }
        });
        callback();
        NotificationManager.success("Producto agregado");
    }
};

export const editProductPurchaseFunction = (key, data, dataPrev, callback) => dispatch => {
    dispatch({
        type: "EDIT_PRODUCT_PURCHASE",
        payload: {
            key: key,
            data: data,
            dataPrev: dataPrev,
        }
    });
    callback();
    NotificationManager.success("Producto editado");
};

export const deleteProdutcPurchaseFunction = (key, data) => dispatch => {
    dispatch({
        type: "DELETE_PRODUCT_PURCHASE",
        payload: {
            key: key,
            data: data,
        }
    });
    NotificationManager.success("Producto eliminado");
}

export const addWayToPayFunction = (data, callback) => dispatch => {
    dispatch({
        type: "ADD_WAYTOPAY_PURCHASES",
        payload: {
            data: data
        }
    });
    callback();
    NotificationManager.success("Pago agregado");
};

export const deleteWayToPayFunction = (key, data) => dispatch => {
    dispatch({
        type: "DELETE_WAYTOPAY_PURCHASE",
        payload: {
            key: key,
            data: data
        }
    });
    NotificationManager.success("Pago eliminado");
}

export const searchProducturchaseFunction = (search) => dispatch => {
    dispatch({
        type: "LOADING_TRUE_SEARCH_PRODUCT_PURCHASE",
        payload: true
    });
    getDataToken()
        .then(datos => {
            axios.get(`/api/v1/management/product/find?search=` + search, datos)
                .then(res => {
                    dispatch({
                        type: "SEARCH_PRODUCT_PURCHASE",
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


