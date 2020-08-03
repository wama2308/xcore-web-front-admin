import { updateLocalStorage } from "../helpers/helpers";
import {
  ON_DELETE_ITEM_FROM_CART,
  ON_QUANTITY_CHANGE,
  ON_ADD_ITEM_TO_CART,
  ON_SET_RESULT_ITEMS,
  ON_SET_PAGES_ITEMS,
  ON_SET_CLIENT,
  ON_SET_FOREIGN_EXCHANGE,
  ON_SET_LOCAL_CURRENCY,
  ON_SET_VALUE_IN_CURRENCY,
  SKIP_REGISTRATION,
} from "./types";

export const deleteItemFromCart = (item) => ({
  type: ON_DELETE_ITEM_FROM_CART,
  payload: item,
});

export const onChangeProductQuantity = (quantity, cartItem) => ({
  type: ON_QUANTITY_CHANGE,
  payload: { quantity, cartItem },
});

export const skipRegistrationAction = (newPrice, cartItem, option) => ({
  type: SKIP_REGISTRATION,
  payload: {
    newPrice,
    cartItem,
    option
  },
});

export const onAddItemToCart = (hitItem) => ({
  type: ON_ADD_ITEM_TO_CART,
  payload: hitItem,
});

export const onSetResultItems = (resultItems, form) => dispatch => {
  let data = { resultItems: resultItems, form: form }
  updateLocalStorage(data, 'resultItems');
  dispatch({
    type: "ON_SET_RESULT_ITEMS",
    payload: data,
  });
};

export const onSetPagesItem = (pages, form) => dispatch => {
  let data = { pages: pages, form: form }
  updateLocalStorage(data, 'pages');
  dispatch({
    type: "ON_SET_PAGES_ITEMS",
    payload: data,
  });
};

export const onSetClient = (client) => dispatch => {
  updateLocalStorage(client, 'client');
  dispatch({
    type: "ON_SET_CLIENT",
    payload: client,
  });
};

export const onSetForeignExchange = (foreignExchange) => ({
  type: ON_SET_FOREIGN_EXCHANGE,
  payload: foreignExchange,
});

export const onSetLocalCurrency = (localCurrency) => ({
  type: ON_SET_LOCAL_CURRENCY,
  payload: localCurrency,
});

export const setValueInCurrency = (currency, name, value) => ({
  type: ON_SET_VALUE_IN_CURRENCY,
  payload: {
    currency,
    name,
    value,
  },
});

// export const addDataBaseLocalStore = () => dispatch => {
//   let stateSale = {};
//   if (localStorage.getItem('stateSale') === null) {
//     stateSale = {
//       ecommerce: {
//         cart: [],
//         client: null,
//         foreignExchange: [],
//         form_currency: {
//           foreign_currency: [],
//           local_currency: []
//         },
//         newCartItem: {
//           description: "",
//           image: "",
//           name: "",
//           price: null,
//           productQuantity: null,
//           totalPrice: null,
//           _id: "",
//         },
//         pages: null,
//         page: 1,
//         numberPage: [],
//         resultItems: [],
//         resultItemsAll: [],
//         form: {
//           search: "",
//           category: "all",
//         }
//       },
//       wayToPaySale: {
//         arrayWayToPaySale: [],
//         amount: '0.00',
//         amountPaidOut: 0,
//         amountTotal: '0.00',
//       }
//     };
//     dispatch({
//       type: "UPDATE_STORE_SALE",
//       payload: {
//         stateSale: stateSale,
//       }
//     });
//     localStorage.setItem("stateSale", JSON.stringify(stateSale));
//   } else {
//     stateSale = JSON.parse(localStorage.getItem('stateSale'));
//     dispatch({
//       type: "UPDATE_STORE_SALE",
//       payload: {
//         stateSale: stateSale,
//       }
//     });
//   }
// };

export const filterItemsSale = (data) => dispatch => {
  dispatch({
    type: "LOADING_TRUE_SALE",
    payload: true
  });
  dispatch({
    type: "FILTER_ITEMS_SALE",
    payload: {
      data: data,
    }
  });
}

export const paginatItemsSale = (page, totalPage) => dispatch => {
  dispatch({
    type: "LOADING_TRUE_SALE",
    payload: true
  });
  dispatch({
    type: "PAGINATOR_ITEMS_SALE",
    payload: {
      page: page,
      totalPage: totalPage
    }
  });
}