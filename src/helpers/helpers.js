/**
 * Helpers Functions
 */
import moment from "moment";
import $ from "jquery";

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      alpha +
      ")"
    );
  }
  throw new Error("Bad Hex");
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
  let time = timestamp * 1000;
  let formatDate = format ? format : "MM-DD-YYYY";
  return moment(time).format(formatDate);
}

/**
 * Convert Date To Timestamp
 */
export function convertDateToTimeStamp(date, format) {
  let formatDate = format ? format : "YYYY-MM-DD";
  return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
  let location = url.pathname;
  let path = location.split("/");
  return path[1];
}

//export const url = `http://192.168.0.119:3333`;
export const url =
  process.env.NODE_ENV === "production"
    ? `http://xcoreweb.ddns.net:3333`
    : `http://192.168.0.107:3333`;
export const urlWs =
  process.env.NODE_ENV === "production"
    ? `ws://xcoreweb.ddns.net:3333`
    : `ws://192.168.0.107:3333`;

export const getDataToken = () => {
  return new Promise((resolve) => {
    const token = "Bearer " + window.localStorage.getItem("token");
    // const business_id = window.localStorage.getItem("business_default");
    // const branch_office_id = window.localStorage.getItem(
    //   "branch_office_default"
    // );
    const datos = {
      headers: {
        Authorization: token,
        // business_id: business_id,
        // branch_office_id: branch_office_id,
      },
    };
    resolve(datos);
  });
};

export const getArray = (props) => {
  if (!props) {
    return [];
  }
  const ArrayData = [];
  props.map((data, key) => {
    ArrayData.push({
      ...data,
      number: key + 1,
    });
  });
  return ArrayData;
};

export const number_format = (amount, decimals) => {
  amount += ""; // por si pasan un numero en vez de un string
  amount = parseFloat(amount.replace(/[^0-9\.]/g, "")); // elimino cualquier cosa que no sea numero o punto

  decimals = decimals || 0; // por si la variable no fue fue pasada

  // si no es un numero o es igual a cero retorno el mismo cero
  if (isNaN(amount) || amount === 0) return parseFloat(0).toFixed(decimals);

  // si es mayor o menor que cero retorno el valor formateado como numero
  amount = "" + amount.toFixed(decimals);

  var amount_parts = amount.split("."),
    regexp = /(\d+)(\d{3})/;

  while (regexp.test(amount_parts[0]))
    amount_parts[0] = amount_parts[0].replace(regexp, "$1" + "," + "$2");

  return amount_parts.join(".");
};

const formatValor = (campo, preformat) => {
  var vr = campo.value;

  //vr = vr.replace( ".", "" );

  vr = replaceAll(vr, ",");

  vr = replaceAll(vr, ".");

  campo.value = "";

  var sign = "";

  if (vr.indexOf("-") !== -1) {
    vr = replaceAll(vr, "-");

    sign = "-";
  }

  var tam = preformat ? vr.length : vr.length + 1;

  campo.maxLength = 13;

  if (tam <= 2) {
    campo.value = "0." + vr;
  }

  if (tam > 2 && tam <= 5) {
    campo.maxLength = 13;
    campo.value = vr.substr(0, tam - 2) + "." + vr.substr(tam - 2, tam);
  }

  if (tam >= 6 && tam <= 8) {
    campo.maxLength = 13;
    campo.value =
      vr.substr(0, tam - 5) +
      "," +
      vr.substr(tam - 5, 3) +
      "." +
      vr.substr(tam - 2, tam);
  }

  if (tam >= 9 && tam <= 11) {
    campo.maxLength = 14;
    campo.value =
      vr.substr(0, tam - 8) +
      "," +
      vr.substr(tam - 8, 3) +
      "," +
      vr.substr(tam - 5, 3) +
      "." +
      vr.substr(tam - 2, tam);
  }

  if (tam >= 12 && tam <= 14) {
    campo.maxLength = 21;
    campo.value =
      vr.substr(0, tam - 11) +
      "," +
      vr.substr(tam - 11, 3) +
      "," +
      vr.substr(tam - 8, 3) +
      "," +
      vr.substr(tam - 5, 3) +
      "." +
      vr.substr(tam - 2, tam);
  }

  /*if ( (tam >= 15) && (tam <= 17) ){
              console.log(6)
              campo.maxLength = 22;
              campo.value = vr.substr( 0, tam - 14 ) + ',' + vr.substr( tam - 14, 3 ) + ',' + vr.substr( tam - 11, 3 ) + ',' + vr.substr( tam - 8, 3 ) + ',' + vr.substr( tam - 5, 3 ) + ',' + vr.substr( tam - 2, tam ) ;
              console.log("6 tam ",tam)
              console.log("6 campo.value ",campo.value)
          }*/

  var pos = campo.value.indexOf(".");

  if (pos !== -1) {
    vr = campo.value.substr(0, pos);

    if (vr === "00" || (vr.length === 2 && vr.substr(0, 1) === "0"))
      campo.value = campo.value.substr(1, tam);
  }

  campo.value = sign + campo.value;
};

const replaceAll = (value, charte) => {
  var result = value;

  var posi = value.indexOf(charte);

  if (posi > -1) {
    while (posi > -1) {
      result = value.substring(0, posi);

      result = result + value.substring(posi + 1);

      posi = result.indexOf(charte);

      value = result;
    }
  }
  return result;
};

export const enterDecimal = (elEvento) => {
  var amountformat = true;
  var event = elEvento || window.event;
  var elem = event.currentTarget || event.srcElement;
  var kcode = event.which || event.keyCode;
  var val;
  var newVal = "";
  if (amountformat) elem.value = replaceAll(elem.value, ".");
  switch (kcode) {
    case 66:
    case 98: {
      if (amountformat) formatValor(elem, true);
      //break;
      return false;
    }
    case 72:
    case 104: {
      if (amountformat) formatValor(elem, true);
      //break;
      return false;
    }
    case 77:
    case 109: {
      if (amountformat) formatValor(elem, true);
      //break;
      return false;
    }
    case 84:
    case 116: {
      if (amountformat) formatValor(elem, true);
      //break;
      return false;
    }
    default: {
      if (amountformat) {
        if ((kcode < 48 || kcode > 57) && kcode !== 13) {
          if (kcode === 37 || kcode === 39) {
            //event.returnValue = true;
            //formatValor(elem,true);
            return true;
          } else if (kcode === 8) {
            //event.returnValue = true;
            //formatValor(elem,true);
            if (
              elem.value === "0" ||
              elem.value === "00" ||
              elem.value === "0.00" ||
              elem.value === "0.00" ||
              elem.value === ""
            ) {
              elem.value = "0.00";
            }
            return true;
          } else {
            event.preventDefault();
          }
          //break;
        } else if (kcode !== 13) {
          formatValor(elem, false);
          //break;
          return true;
        } else {
          formatValor(elem, true);
          if (
            elem.value === "0" ||
            elem.value === "00" ||
            elem.value === "0.00" ||
            elem.value === "0.00" ||
            elem.value === ""
          ) {
            elem.value = "0.00";
          }
          //break;
          return true;
        }
      } else {
        if ((kcode < 48 || kcode > 57) && kcode !== 13) {
          //event.returnValue = false;
          return false;
        } else if (kcode === 46 && elem.value.indexOf(".") !== -1) {
          //event.returnValue = false;
          return false;
        }
      }
    }
  }
};

export const validations = (formName, errors) => {
  let $form = $(`[name="${formName}"]`);
  let msg =
    '<span style="color:#ef3b3b" class="error-msg-validation-serve">{msg}</span>';
  $($form).find(".error-msg-validation-serve").remove();
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      const element = errors[key];
      $($form)
        .find(`[data-validate="${element.field}"]`)
        .after(msg.replace("{msg}", element.message));
    }
  }
};

export const clearForm = (formName) => {
  let $form = $(`[data-validate="${formName}"]`);
  $($form).find(".error-msg-validation-serve").remove();
};

export const calculatePage = (page, offset, last_page) => {
  let from = page - offset;
  if (from < 1) {
    from = 1;
  }

  let to = from + offset * 2;
  if (to >= last_page) {
    to = last_page;
  }

  var pagesArray = [];
  while (from <= to) {
    pagesArray.push(from);
    from++;
  }
  return pagesArray;
};

export const calculatePageSale = (page, totalPage, perPage) => {
  var pagesArray = [];
  if (totalPage < perPage) {
    for (let i = 0; i < totalPage; i++) {
      pagesArray.push(i + 1);
    }
  } else {
    let pageDiv = page / perPage;
    let from = page < totalPage ? Math.ceil(pageDiv) * Math.ceil(pageDiv) : totalPage - perPage;
    let to = page < totalPage ? Math.ceil(pageDiv) * perPage : totalPage;

    if (Number.isInteger(pageDiv)) {
      from = (pageDiv * perPage) < totalPage ? (pageDiv * perPage) : totalPage - perPage;
      to = (from + perPage) < totalPage ? (from + perPage) : totalPage;
      while (from <= to) {
        pagesArray.push(from);
        from++;
      }
    } else {
      while (from <= to) {
        pagesArray.push(from);
        from++;
      }
    }
  }
  return pagesArray;
}

export const formatMonto = (data) => {
  return parseFloat(data.replace(/,/g, ""));
};

export const validarEmail = (email) => {
  var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email) ? true : false;
};

export const type_setting_bills = [
  { label: "Impresora fiscal", value: "printer_fiscal" },
  { label: "Impresora ticket", value: "printer_ticket" },
  { label: "Factura electrónica", value: "electronic_bill" },
  { label: "Recibo", value: "receipt" },
];

export const getTypeSettingBill = (value) => {
  return type_setting_bills.find((item) => item.value === value);
};

export const getLabelTypeSettingBill = (value) => {
  const type = getTypeSettingBill(value);
  return type && type.label ? type.label : value;
};

export const GetDisabledPermits = (permits, type) => {
  let disabled = true;

  permits.map((permit) => {
    if (permit.label === type) {
      disabled = false;
    }
  });

  return disabled;
};

export const replaceDiscountDescription = (
  discount_description,
  currency_symbol = "$"
) => {
  return discount_description.replace(/currency_symbol/g, currency_symbol);
};

export const permitsMenu = (data, categorieType, moduleType) => {
  let categorias = data.find((categoria) => categoria.name === categorieType);
  let modulos = categorias.child_routes.find(
    (modulo) => modulo.name === moduleType
  );
  return modulos.permits;
};

export const updateLocalStorage = (data, nodo) => {
  let stateSale = JSON.parse(localStorage.getItem('stateSale'));
  if (nodo === 'client') {
    stateSale.ecommerce.client = data;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'resultItems') {
    stateSale.ecommerce.resultItems = data.resultItems;
    stateSale.ecommerce.resultItemsAll = data.resultItemsAll;
    stateSale.ecommerce.form = data.form;
    stateSale.ecommerce.numberPage = data.numberPage;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'pages') {
    stateSale.ecommerce.pages = data.pages;
    stateSale.ecommerce.form = data.form;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'addItemCart') {
    stateSale.ecommerce.cart.push(data);
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'setQuantityItemCart') {
    stateSale.ecommerce.cart.map((dataCart, key) => {
      if (dataCart._id === data._id) {
        dataCart = data
      }
    });
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'onchangeQuantityItemCart') {
    stateSale.ecommerce.cart.map((dataCart, key) => {
      if (dataCart._id === data.cartItem._id) {
        dataCart.productQuantity = parseFloat(data.quantity);
        dataCart.importe = (parseFloat(data.quantity) * dataCart.price);
        dataCart.totalPrice = dataCart.tax ? (dataCart.price + dataCart.tax._amount) * parseFloat(data.quantity) :
          (dataCart.price + 0) * parseFloat(data.quantity);
      }
    });
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'deleteItemCart') {
    let index;
    stateSale.ecommerce.cart.forEach((item, i) => {
      if (item._id === data._id) {
        index = i;
      }
    });
    stateSale.ecommerce.cart.splice(index, 1);
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'onSetLocalCurrency') {
    stateSale.ecommerce.form_currency.local_currency = data;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'onSetForeignCurrency') {
    stateSale.ecommerce.form_currency.foreign_currency = data;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'getAmountTotal') {
    stateSale.wayToPaySale.amount = data.amount;
    stateSale.wayToPaySale.amountTotal = data.amountTotal;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'addWayToPaySale') {
    stateSale.wayToPaySale.amount = data.amount;
    stateSale.wayToPaySale.amountPaidOut = data.amountPaidOut;
    stateSale.wayToPaySale.arrayWayToPaySale = data.arrayWayToPaySale;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'deletePayment') {
    stateSale.wayToPaySale.amount = data.amount;
    stateSale.wayToPaySale.amountPaidOut = data.amountPaidOut;
    stateSale.wayToPaySale.arrayWayToPaySale = data.arrayWayToPaySale;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'setAmountTotal') {
    stateSale.wayToPaySale.amount = data.amount;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'changePage') {
    stateSale.ecommerce.page = data.page;
    stateSale.ecommerce.numberPage = data.numberPage;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'setSwitchPayPartial') {
    stateSale.wayToPaySale.payPartial = data.payPartial;
    stateSale.wayToPaySale.amount = data.amount;
    stateSale.wayToPaySale.amountFijo = data.amountFijo;
    stateSale.wayToPaySale.amountPartial = data.amountPartial;
    stateSale.wayToPaySale.arrayWayToPaySale = data.arrayWayToPaySale;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'setAmountPartial') {
    stateSale.wayToPaySale.amount = data.amount;
    stateSale.wayToPaySale.amountPartial = data.amountPartial;
    stateSale.wayToPaySale.amountTotalPartial = data.amountTotalPartial;
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'skipRegistrationItemCart') {
    stateSale.ecommerce.cart.map((dataCart, key) => {
      if (dataCart._id === data.cartItem._id) {
        dataCart.skip_registration = data.option === 'omitir' ? true : false;
        dataCart.registry_skip_amount = data.option === 'omitir' ? data.cartItem.price - data.newPrice : 0;
        dataCart.price = data.newPrice;
        dataCart.importe = (dataCart.productQuantity * data.newPrice);
        dataCart.tax._amount = (data.newPrice * (data.cartItem.tax.amount / 100));
        dataCart.totalPrice = dataCart.tax ? (data.newPrice + (data.newPrice * (data.cartItem.tax.amount / 100))) * parseFloat(data.quantity) :
          (data.newPrice + 0) * parseFloat(data.quantity);
      }
    });
    localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
  if (nodo === 'editLocalStorageAreaId') {
    // if (stateSale.ecommerce.resultItemsAll.find(dataFind => dataFind.typeItem === 'areas')) {
    //   console.log("AQUII ", data);
    //   stateSale.ecommerce.resultItemsAll = [...stateSale.ecommerce.resultItemsAll, data]
    // }
    // localStorage.setItem("stateSale", JSON.stringify(stateSale));
  }
}

export const arraysFormatAction = (data) => {
  let arrayFormats = [];
  data.map((formatData, i) => {
    arrayFormats.push(
      {
        typeFormato: formatData.type,
        formatTemplate: formatData.layout,
      }
    );
  });
  return arrayFormats;
}

export const arraysDevicesAction = (data) => {
  let arrayDevices = [];
  data.map((devicesData, i) => {
    arrayDevices.push(
      {
        nombre: devicesData.name,
        ip: devicesData.ip,
        mac: devicesData.mac,
        serial: devicesData.serial_print,
      }
    );
  });
  return arrayDevices;
}

export const loadItemsAll = () => {
  let stateSale = JSON.parse(localStorage.getItem('stateSale'));
  if (stateSale.ecommerce.resultItemsAll.length > 0) {
    return true;
  } else {
    return false;
  }
}

export const formatDateDateTables = (data) => {
  let fecha = new Date(data);
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return fecha.toLocaleDateString("es-ES", options);
}