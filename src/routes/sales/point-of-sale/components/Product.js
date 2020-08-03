import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import toastr from "toastr";
import Tooltip from "@material-ui/core/Tooltip";

// Card Component
import { RctCard } from "Components/RctCard";

//Actions
import {
  onAddItemToCart,
  deleteItemFromCart,
  onChangeProductQuantity,
} from "../../../../actions/EcommerceActions";

//intl Messages
import IntlMessages from "Util/IntlMessages";

//Helper
import { textTruncate, replaceDiscountDescription, updateLocalStorage, number_format } from "Helpers/helpers";

import InputQuantity from "./InputQuantity";

const Product = (props) => {
  const {
    hit,
    dataGeneral,
    onAddItemToCart,
    deleteItemFromCart,
    client,
  } = props;
  const { countryConfiguration } = dataGeneral;
  const { currency_symbol } = countryConfiguration;

  const [loading, setLoading] = useState(false);

  const onPressAddToCart = (cartItem, e) => {
    if (client) {
      setLoading(true);
      onAddItemToCart(cartItem);
      setLoading(false);
    } else {
      toastr.warning("Busque y selecione un cliente", "Advertencia");
      document.querySelector("form.search-wrapper #search").focus();
    }
    e.preventDefault();
  };

  const isItemExistInCart = (_id) => {
    const { cart } = props;
    let existence = false;
    for (const item of cart) {
      if (item._id === _id) {
        existence = true;
      }
    }
    return existence;
  };

  const getItemInCart = (hit) => {
    const { cart } = props;
    let existenceItem = {
      _id: hit._id,
      name: hit.name,
      image: hit.icon,
      description: hit.description,
      price: hit.amount,
      productQuantity: 1,
      totalPrice: hit.price,
      ...hit,
    };
    for (const item of cart) {
      if (item._id === hit._id) {
        existenceItem = item;
      }
    }    
    updateLocalStorage(existenceItem, 'setQuantityItemCart');
    return existenceItem;
  };

  const itemExist = isItemExistInCart(hit._id);

  return (
    <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
      <div
        className="overlay-wrap overflow-hidden"
        onClick={(e) => {
          const target = e.target;
          if (target.classList.contains("overlay-content") && !itemExist) {
            onPressAddToCart(hit, e);
          }
        }}
      >
        <div className="text-center p-4">
          <img src={hit.icon} className="img-fluid" alt="product" />
        </div>
        <div
          className={`overlay-content d-flex align-items-end ${
            itemExist ? "itemExist" : "cursor-pointer"
          }`}
        >
          {!itemExist ? (
            <a
              href="#"
              className="bg-primary text-center w-100 cart-link text-white py-2"
              onClick={(e) => onPressAddToCart(hit, e)}
            >
              {loading ? (
                <CircularProgress
                  className="text-white"
                  color="inherit"
                  size={20}
                />
              ) : (
                "Añadir al carrito"
              )}
            </a>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <InputQuantity
                errors={[]}
                keyInput={hit._id}
                item={getItemInCart(hit)}
                disabled={false}
              />
              <Link
                to="/app/sales/cart"
                className="bg-primary text-center w-50 cart-link text-white py-2"
              >
                <IntlMessages id="components.viewCart" />
              </Link>
              <Button
                onClick={() => deleteItemFromCart(hit)}
                color="primary"
                style={{ borderRadius: 0 }}
                className="bg-danger text-center w-50 cart-link text-white py-2"
              >
                Eliminar
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="product-info border-top p-3">
        <div className="d-flex justify-content-between">
          <h2>
            <span
              className={
                hit.discount_description && hit.discount_amount
                  ? "through text-danger"
                  : "text-primary"
              }
            >
              {number_format(hit.amount, 2)} {currency_symbol}              
            </span>
            {hit.discount_description && hit.discount_amount ? (
              <Tooltip
                title={replaceDiscountDescription(
                  hit.discount_description,
                  currency_symbol
                )}
                placement="top"
              >
                <span className="text-primary">
                  {" "}
                  {number_format(hit.price, 2)}
                  {currency_symbol}
                </span>
              </Tooltip>
            ) : null}
          </h2>
        </div>
        <h4 className="text-dark">
          {textTruncate(hit.name ? hit.name : "", 25)}
        </h4>
        <p className="mb-5 text-muted font-xs">
          {textTruncate(hit.description ? hit.description : "", 50)}
        </p>
      </div>
    </RctCard>
  );
};

const mapStateToProps = ({ ecommerce }) => {
  const { cart } = ecommerce;
  return { cart };
};

export default connect(mapStateToProps, {
  onAddItemToCart,
  deleteItemFromCart,
  onChangeProductQuantity,
})(Product);
