import axios from "axios";
import { url, getDataToken } from "../helpers/helpers";
const loadSelectLanguajeUrl = `/api/v1/admin/language/find/select`;

export const ConfigGeneralFunction = () => dispatch => {
    getDataToken()
        .then(datos => {
            axios
                .get(loadSelectLanguajeUrl, datos)
                .then(res => {
                    dispatch({
                        type: "CONFIG_GENERAl",
                        payload: {
                            dataGeneral: [],
                            dataLanguajes: res.data,
                            loading: false,
                            actionReducer: 1,
                            stateSale: addDataBaseLocalStore()
                        }
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