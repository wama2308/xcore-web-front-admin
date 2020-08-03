import {
  ON_DELETE_ITEM_FROM_CART,
  ON_QUANTITY_CHANGE,
  SKIP_REGISTRATION,
  ON_ADD_ITEM_TO_CART,
  ON_SET_RESULT_ITEMS,
  ON_SET_PAGES_ITEMS,
  ON_SET_CLIENT,
  ON_SET_FOREIGN_EXCHANGE,
  ON_SET_LOCAL_CURRENCY,
  ON_SET_VALUE_IN_CURRENCY,
} from "../actions/types";
import { calculatePage, calculatePageSale, getArray, updateLocalStorage } from "./../helpers/helpers";
import update from "react-addons-update";
import { NotificationManager } from 'react-notifications';

const getTotalPrice = (cart) => {
  let totalPrice = 0;
  for (const item of cart) {
    totalPrice += item.totalPrice;
  }
  return totalPrice.toFixed(2);
};

const INIT_STATE = {
  form_currency: {
    local_currency: [],
    foreign_currency: [],
  },
  foreignExchange: [],
  client: null,
  cart: [],
  pages: null,
  resultItems: [],
  resultItemsAll: [],
  form: {
    search: "",
    category: "all",
  },
  newCartItem: {
    _id: "",
    name: "",
    image: "",
    description: "",
    price: null,
    productQuantity: null,
    totalPrice: null,
  },
  page: 1,
  perPage: 10,
  numberPage: [],
  loading: true,
};

const filterItemsSale = (state, payload) => {
  let estado = state;
  let filterState = []
  estado.resultItems = estado.resultItemsAll;
  if (payload.data.search === '' && payload.data.category !== 'all') {
    console.log(1)
    filterState = estado.resultItems.filter(dato => dato.typeItem === payload.data.category)
    estado.resultItems = filterState;
    if (filterState.length === 0) {
      NotificationManager.warning("¡No existen resultados!");
    }
    estado.page = 1;
    estado.numberPage = calculatePageSale(1, Math.ceil(estado.resultItems.length / 10), 10);
    estado.loading = false;
  }
  if (payload.data.search === '' && payload.data.category === 'all') {
    console.log(2)
    estado.resultItems = estado.resultItemsAll;
    estado.page = 1;
    estado.numberPage = calculatePageSale(1, Math.ceil(estado.resultItems.length / 10), 10);
    estado.loading = false;
  }
  if (payload.data.search !== '' && payload.data.category === 'all') {
    console.log(3)
    const itemsAll = getArray(estado.resultItemsAll)
    let expresion = new RegExp(`${payload.data.search}.*`, "i");
    const result = itemsAll.filter(data => expresion.test(data.name));
    if (result.length === 0) {
      NotificationManager.warning("¡No existen resultados!");
    }
    estado.resultItems = result;
    estado.page = 1;
    estado.numberPage = calculatePageSale(1, Math.ceil(estado.resultItems.length / 10), 10);
    estado.loading = false;
  }
  if (payload.data.search !== '' && payload.data.category !== 'all') {
    console.log(4)
    filterState = estado.resultItems.filter(dato => dato.typeItem === payload.data.category)
    const itemsAll = getArray(filterState)
    let expresion = new RegExp(`${payload.data.search}.*`, "i");
    const result = itemsAll.filter(data => expresion.test(data.name));
    if (result.length === 0) {
      NotificationManager.warning("¡No existen resultados!");
    }
    estado.resultItems = result;
    estado.page = 1;
    estado.numberPage = calculatePageSale(1, Math.ceil(estado.resultItems.length / 10), 10);
    estado.loading = false;
  }
  let data = {
    resultItems: estado.resultItems,
    resultItemsAll: estado.resultItemsAll,
    form: { search: payload.data.search, category: payload.data.category },
    numberPage: calculatePageSale(1, Math.ceil(estado.resultItems.length / 10), 10)
  };
  updateLocalStorage(data, 'resultItems');
  estado.form = { search: payload.data.search, category: payload.data.category };
  return estado;
}

const paginatItemsSale = (state, payload) => {
  let estado = state;
  estado.page = payload.page
  estado.numberPage = calculatePageSale(payload.page, Math.ceil(estado.resultItems.length / 10), 10);
  estado.loading = false;
  updateLocalStorage({ page: estado.page, numberPage: estado.numberPage }, 'changePage');
  return estado;
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ON_DELETE_ITEM_FROM_CART:
      let splice = [0, 0];
      state.cart.forEach((item, index) => {
        if (item._id === action.payload._id) {
          splice = [index, 1];
        }
      });
      updateLocalStorage(action.payload, 'deleteItemCart');
      NotificationManager.success("¡Item eliminado con exito!");
      return update(state, {
        cart: {
          $splice: [splice],
        },
      });

    case ON_QUANTITY_CHANGE:
      let cartItemIndex = state.cart.indexOf(action.payload.cartItem);
      updateLocalStorage(action.payload, 'onchangeQuantityItemCart');
      return update(state, {
        cart: {
          [cartItemIndex]: {
            productQuantity: { $set: action.payload.quantity },
            importe: { $set: (action.payload.cartItem.price * action.payload.quantity) },
            totalPrice: {
              $set: action.payload.cartItem.tax ?
                (action.payload.cartItem.price + action.payload.cartItem.tax._amount) * parseFloat(action.payload.quantity) :
                (action.payload.cartItem.price + 0) * parseFloat(action.payload.quantity),
            },
          },
        },
      });

    case SKIP_REGISTRATION:
      let index = state.cart.indexOf(action.payload.cartItem);
      updateLocalStorage(action.payload, 'skipRegistrationItemCart');

      action.payload.option === 'omitir' ?
        NotificationManager.success("¡Inscripcion omitida con exito!") :
        NotificationManager.success("¡Inscripcion agregada con exito!");

      return update(state, {
        cart: {
          [index]: {
            skip_registration: { $set: action.payload.option === 'omitir' ? true : false },
            registry_skip_amount: {
              $set: action.payload.option === 'omitir' ?
                (action.payload.cartItem.price - action.payload.newPrice) :
                0
            },
            price: { $set: action.payload.newPrice },
            importe: { $set: (action.payload.newPrice * action.payload.cartItem.productQuantity) },
            tax: { _amount: { $set: (action.payload.newPrice * (action.payload.cartItem.tax.amount / 100)) } },
            totalPrice: {
              $set: action.payload.cartItem.tax ?
                (action.payload.newPrice + (action.payload.newPrice * (action.payload.cartItem.tax.amount / 100))) * parseFloat(action.payload.cartItem.productQuantity) :
                (action.payload.newPrice + 0) * parseFloat(action.payload.cartItem.productQuantity),
            },
          },
        },
      });

    case ON_ADD_ITEM_TO_CART:
      action.payload.tax._amount = (action.payload.price * (action.payload.tax.amount / 100))
      let newCartItem = {
        _id: action.payload._id,
        name: action.payload.name,
        image: action.payload.icon,
        description: action.payload.description,
        productQuantity: 1,
        price: action.payload.price,
        tax: action.payload.tax ? action.payload.tax._amount : 0,
        importe: action.payload.price,
        totalPrice: (action.payload.price + action.payload.tax._amount),
        skip_registration: false,
        registry_skip_amount: 0,
        registry_skip_approved_by: 0,
        registry_skip_approved_at: '',
        registry_skip_approved_method: '',
        ...action.payload,
      };
      updateLocalStorage(newCartItem, 'addItemCart');
      return update(state, {
        cart: {
          $push: [newCartItem],
        },
      });

    case ON_SET_RESULT_ITEMS:
      return {
        ...state,
        resultItems: [...action.payload.resultItems],
        form: action.payload.form,
      };

    case "ALL_ITEMS_SALE":
      return {
        ...state,
        resultItems: [...action.payload.data],
        resultItemsAll: [...action.payload.data],
        form: action.payload.form,
        page: 1,
        loading: false,
        numberPage: calculatePageSale(1, Math.ceil(action.payload.data.length / 10), 10),
      };

    case ON_SET_PAGES_ITEMS:
      let pages = action.payload.pages;
      let form = action.payload.form;
      if (pages && pages.lastPage) {
        pages.numberPage = calculatePage(pages.page, 2, pages.lastPage);
      }
      return {
        ...state,
        pages: pages,
        form: form,
      };

    case ON_SET_CLIENT:
      return {
        ...state,
        client: action.payload,
      };

    case ON_SET_FOREIGN_EXCHANGE:
      const foreignExchange = action.payload.map((item) => {
        if (item.value) {
          item["amount"] = "";
        }
        return item;
      });
      updateLocalStorage(foreignExchange, 'onSetForeignCurrency');
      return {
        ...state,
        foreignExchange: [...foreignExchange],
        form_currency: {
          ...state.form_currency,
          foreign_currency: [...foreignExchange],
        },
      };
    case ON_SET_LOCAL_CURRENCY:
      // const total = getTotalPrice(state.cart);
      const localCurrency = action.payload.map((item, index) => {
        // if (item.default) {
        //   item[item.value] = total;
        // } else if (item.value) {
        // }
        item["amount"] = "";
        return item;
      });
      updateLocalStorage(localCurrency, 'onSetLocalCurrency');
      return {
        ...state,
        form_currency: {
          ...state.form_currency,
          local_currency: [...localCurrency],
        },
      };
    case ON_SET_VALUE_IN_CURRENCY:
      const { currency, name, value } = action.payload;
      if (Array.isArray(state.form_currency[currency])) {
        return {
          ...state,
          form_currency: {
            ...state.form_currency,
            [currency]: state.form_currency[currency].filter((item) => {
              if (item.value == name) {
                item["amount"] = value;
              }
              return item;
            }),
          },
        };
      }

    case "CONFIG_GENERAl":
      return {
        ...state,
        client: action.payload.stateSale.ecommerce.client,
        foreignExchange: action.payload.stateSale.ecommerce.foreignExchange,
        form_currency: action.payload.stateSale.ecommerce.form_currency,
        newCartItem: action.payload.stateSale.ecommerce.newCartItem,
        pages: action.payload.stateSale.ecommerce.pages,
        resultItems: action.payload.stateSale.ecommerce.resultItems,
        resultItemsAll: action.payload.stateSale.ecommerce.resultItemsAll,
        form: action.payload.stateSale.ecommerce.form,
        cart: action.payload.stateSale.ecommerce.cart,
        page: action.payload.stateSale.ecommerce.page,
        numberPage: action.payload.stateSale.ecommerce.numberPage,
      };

    case "LOADING_FALSE_SALE":
      return {
        ...state,
        loading: false
      };

    case "LOADING_TRUE_SALE":
      return {
        ...state,
        loading: true
      };

    case "FILTER_ITEMS_SALE":
      return filterItemsSale(state, action.payload)

    case "PAGINATOR_ITEMS_SALE":
      return paginatItemsSale(state, action.payload)

    default:
      return { ...state };
  }
};
