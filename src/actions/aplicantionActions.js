import axios from "axios";
import { url, getDataToken } from "../helpers/helpers";
const selectLoadUrl = `/api/v1/form/select-load`;
const paisLoadUrl = `/api/v1/form/select-country`;
const countryConfigurationUrl = `/api/v1/form/country-configuration`;
const typePenaltiesUrl = `/api/v1/settings/penalty/type-penalties`;
const scheduleSelectUrl = `/api/v1/settings/schedule/select`;
const departamentsSelectUrl = `/api/v1/settings/department/select`;
const usersSelectUrl = `/api/v1/users/select`;
const selectDiscountUrl = `/api/v1/settings/discount/select`;
const selectScreenUrl = `${url}/api/v1/settings/screen/select-screen`;
const selectForeignExchangeUrl = `${url}/api/v1/settings/screen/select-screen`;

export const ConfigGeneralFunction = () => dispatch => {
    getDataToken()
        .then(datos => {
            axios
                .get(selectLoadUrl, datos)
                .then(res => {
                    loadPaisesFunction(datos, dataPaises => {
                        countryConfigurationFunction(datos, countryConfiguration => {
                            dynamicMenuFunction(datos, dataMenu => {
                                typePenaltiesFunction(datos, dataPenalties => {
                                    scheduleSelectFunction(datos, dataSchedule => {
                                        departamentsSelectFunction(datos, dataDepartaments => {
                                            usersSelectFunction(datos, dataUsers => {
                                                discountSelectFunction(datos, dataDiscount => {
                                                    selectScreenFunction(datos, dataScreen => {
                                                        modulesPermitsFunction(datos, dataModulesPermits => {
                                                            rolsSelectFunction(datos, dataRols => {
                                                                selectSettingBillsFunction(datos, dataSettingBills => {
                                                                    selectCategoryProductFunction(datos, dataCategoryProducts => {
                                                                        selectPurchaseTypeDocumentFunction(datos, dataPurchaseTypeDocument => {
                                                                            selectForeignExchangeFunction(datos, dataSelectExchange => {
                                                                                dispatch({
                                                                                    type: "CONFIG_GENERAl",
                                                                                    payload: {
                                                                                        dataGeneral: res.data,
                                                                                        dataPaises: dataPaises,
                                                                                        countryConfiguration: countryConfiguration,
                                                                                        dataMenu: dataMenu,
                                                                                        dataPenalties: dataPenalties,
                                                                                        dataSchedule: dataSchedule,
                                                                                        dataDepartaments: dataDepartaments,
                                                                                        dataUsers: dataUsers,
                                                                                        dataDiscount: dataDiscount,
                                                                                        dataScreen: dataScreen,
                                                                                        dataModulesPermitsAll: dataModulesPermits,
                                                                                        dataModulesPermits: dataModulesPermits,
                                                                                        dataModulesPermitsSpecials: dataModulesPermits,
                                                                                        dataRols: dataRols,
                                                                                        dataSettingBills: dataSettingBills.length > 0 ?
                                                                                            dataSettingBills.filter(dato => dato.info.type === 'receipt') : [],
                                                                                        dataCategoryProducts: dataCategoryProducts,
                                                                                        dataPurchaseTypeDocument: dataPurchaseTypeDocument,
                                                                                        dataSelectExchange: dataSelectExchange,
                                                                                        checked: [],
                                                                                        expanded: [],
                                                                                        checkedSpecials: [],
                                                                                        expandedSpecials: [],
                                                                                        newSchedule: {},
                                                                                        newDiscount: {},
                                                                                        newRol: {},
                                                                                        loading: false,
                                                                                        actionReducer: 1,
                                                                                        stateSale: addDataBaseLocalStore()
                                                                                    }
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                })
                .catch(error => {
                    Array.isArray(error) ? console.log(error.response.data[0].message) :
                        console.log(error.response.data.message);
                });
        })
        .catch(() => {
            console.log("Problemas con el token");
        });
};

const loadPaisesFunction = (datos, execute) => {
    axios
        .get(paisLoadUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? console.log(error.response.data[0].message) :
                console.log(error.response.data.message);
        });
};

const countryConfigurationFunction = (datos, execute) => {
    axios
        .get(countryConfigurationUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const dynamicMenuFunction = (datos, execute) => {
    let data = {
        client_default: localStorage.getItem("client_default")
    };
    axios({
        method: "post",
        url: `/api/v1/users/dynamic-menu`,
        data: data,
        headers: datos.headers
    })
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const typePenaltiesFunction = (datos, execute) => {
    axios
        .get(typePenaltiesUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const scheduleSelectFunction = (datos, execute) => {
    axios
        .get(scheduleSelectUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const departamentsSelectFunction = (datos, execute) => {
    axios
        .get(departamentsSelectUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const usersSelectFunction = (datos, execute) => {
    axios
        .get(usersSelectUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const discountSelectFunction = (datos, execute) => {
    axios
        .get(selectDiscountUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const selectScreenFunction = (datos, execute) => {
    axios
        .get(selectScreenUrl, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const modulesPermitsFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/module`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const rolsSelectFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/rol/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const selectSettingBillsFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/setting_bill/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const selectCategoryProductFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/product-category/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const selectPurchaseTypeDocumentFunction = (datos, execute) => {
    let page = 1;
    let perPage = 10;
    let search = "";
    axios.get(`/api/v1/settings/purchase-type-document/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

const selectForeignExchangeFunction = (datos, execute) => {
    axios
        .get(`/api/v1/settings/foreignExchange/select`, datos)
        .then(res => {
            execute(res.data);
        })
        .catch(error => {
            Array.isArray(error) ? NotificationManager.warning(error.response.data[0].message) :
                NotificationManager.warning(error.response.data.message);
            console.log(error.response)
        });
};

export const outsideClick = () => {
    return {
        type: "OUT_CLICK",
        payload: true
    };
};

export const search = data => {
    return {
        type: "SEARCH_DATA",
        payload: data
    };
};

export const seeker = data => {
    return {
        type: "SEEKER_DATA",
        payload: data
    };
};

export const seekerProducts = data => {
    return {
        type: "SEEKER_PRODUCTS",
        payload: data
    };
};

export const seekerServices = data => {
    return {
        type: "SEEKER_SERVICES",
        payload: data
    };
};

export const openConfirmDialog = (message, callback) => {
    return {
        type: "OPEN_CONFIRM",
        payload: {
            message,
            callback
        }
    };
};

export const closeDialog = () => {
    return {
        type: "CLOSE_CONFIRM"
    };
};

export const loadScheduleSelectFunction = data => dispatch => {
    dispatch({
        type: "LOAD_SCHEDULE_SELECT",
        payload: data
    });
};

export const addDiscountSelect = (data) => dispatch => {
    dispatch({
        type: "ADD_SELECT_DISCOUNT",
        payload: data
    });
};

export const addDiscountSelectRewards = (data) => dispatch => {
    dispatch({
        type: "ADD_SELECT_DISCOUNT_REWARDS",
        payload: data
    });
};

export const checkedTreeFunction = (checked, option) => dispatch => {
    dispatch({
        type: "CHECKED_TREE",
        payload: {
            checked: checked,
            option: option,
        }
    });
};

export const expandedTreeFunction = (expanded, option) => dispatch => {
    dispatch({
        type: "EXPANDED_TREE",
        payload: {
            expanded: expanded,
            option: option,
        }
    });
};

export const checkedAllTreeFunction = (value, option) => dispatch => {
    dispatch({
        type: "CHECKED_ALL_TREE",
        payload: {
            value: value,
            option: option,
        }
    });
};

export const searchModulesRolsFunction = (value, option) => dispatch => {
    dispatch({
        type: "SEARCH_MODULES_ROLS",
        payload: {
            value: value,
            option: option,
        }
    });
};

export const cleanStoreNewRolUSerFunction = (option) => dispatch => {
    dispatch({
        type: "CLEAN_STORE_FORM_NEW_ROL_USER",
        payload: {
            clean: {},
            option: option,
        }
    });
};

export const selectRolFunction = (value) => dispatch => {
    dispatch({
        type: "SELECT_ROL_VALUE",
        payload: {
            value: value,
        }
    });
};

const addDataBaseLocalStore = () => {
    let stateSale = {};
    if (localStorage.getItem('stateSale') === null) {
        stateSale = {
            ecommerce: {
                cart: [],
                client: null,
                foreignExchange: [],
                form_currency: {
                    foreign_currency: [],
                    local_currency: []
                },
                newCartItem: {
                    description: "",
                    image: "",
                    name: "",
                    price: null,
                    productQuantity: null,
                    totalPrice: null,
                    _id: "",
                },
                pages: null,
                page: 1,
                numberPage: [],
                resultItems: [],
                resultItemsAll: [],
                form: {
                    search: "",
                    category: "all",
                }
            },
            wayToPaySale: {
                arrayWayToPaySale: [],
                amount: '0.00',
                amountPaidOut: 0,
                amountTotal: '0.00',
                amountTotalPartial: 0,
                amountFijo: 0,
                amountPartial: '0.00',
                payPartial: false,
            }
        };
        localStorage.setItem("stateSale", JSON.stringify(stateSale));
    } else {
        stateSale = JSON.parse(localStorage.getItem('stateSale'));

    }
    return stateSale;
};