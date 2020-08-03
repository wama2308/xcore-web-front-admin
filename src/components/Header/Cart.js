/**
 * Cart Component
 */
import React, { Component, Fragment } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import Button from "@material-ui/core/Button";
import { Badge } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { withRouter } from "react-router-dom";
import "../../assets/css/style.css";

//Helper
import { textTruncate, getAppLayout, number_format } from "Helpers/helpers";

//Actions
import { deleteItemFromCart } from "Actions";
import { openConfirmDialog } from "../../actions/aplicantionActions"

//intl Messages
import IntlMessages from "Util/IntlMessages";

const Carts = (props) => {
  //Get Total Price
  const getTotalPrice = () => {
    const { cart } = props;
    let subTotal = 0;
    let impuesto = 0;
    let totalPrice = 0;
    for (const item of cart) {
      subTotal += item.importe;
      impuesto += (item.tax._amount * item.productQuantity);
      totalPrice += item.totalPrice;
    }
    return {
      subTotal: number_format(subTotal, 2),
      impuesto: number_format(impuesto, 2),
      totalPrice: number_format(totalPrice, 2),
    };
  };

  //Is Cart Empty
  const isCartEmpty = () => {
    const { cart } = props;
    if (cart.length === 0) {
      return true;
    }
  };

  const isEmpty = isCartEmpty();

  const { cart, client, deleteItemFromCart, location, dataGeneral } = props;

  const { countryConfiguration } = dataGeneral;
  const { currency_symbol } = countryConfiguration;

  const deleteItemCart = (cart) => {
    const message = {
      title: "Eliminar Item",
      info: "¿Esta seguro que desea eliminar este item?"
    };
    props.openConfirmDialog(message, res => {
      if (res) {
        deleteItemFromCart(cart)
      }
    });
  }


  return (
    <UncontrolledDropdown nav className="list-inline-item cart-dropdown">
      <DropdownToggle nav className="p-0">
        <Tooltip title="Shopping Cart" placement="bottom">
          <IconButton aria-label="bag">
            <i className="zmdi zmdi-shopping-cart"></i>
            <Badge color="primary" className="badge-xs badge-top-right">
              {cart.length}
            </Badge>
          </IconButton>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-anchor">
        <div className="dropdown-content">
          <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
            <span className="text-white font-weight-bold">
              <IntlMessages id="components.cart" />
            </span>
            {/* <Badge color="warning">4 NEW</Badge> */}
          </div>
          {isEmpty ? (
            <div className="text-center p-4">
              <span className="d-block font-3x mb-15 text-danger">
                <i className="zmdi zmdi-shopping-cart"></i>
              </span>
              <h3>
                <IntlMessages id="components.CartEmptyText" />
              </h3>
            </div>
          ) : (
              <Fragment>
                <Scrollbars
                  className="rct-scroll"
                  autoHeight
                  autoHeightMin={100}
                  autoHeightMax={280}
                  autoHide
                >
                  <ul className="list-unstyled dropdown-list">
                    {cart.map((cart, key) => (
                      <li className="d-flex justify-content-between" key={key}>
                        <div className="media overflow-hidden w-60">
                          <div className="mr-15">
                            <img
                              src={cart.image}
                              alt="products"
                              className="media-object"
                              width="63"
                              height="63"
                            />
                          </div>
                          <div className="media-body">
                            <span className="fs-14 d-block">
                              {textTruncate(cart.name, 25)}
                            </span>
                            <span className="fs-12 d-block text-muted">
                              {textTruncate(cart.description, 50)}
                            </span>
                            <span className="fs-12 d-block text-muted">
                              {cart.brand}
                            </span>
                          </div>
                        </div>
                        <div className="text-center w-30">
                          <span className="text-muted fs-12 d-block mb-10">
                            {number_format(cart.price, 2)} {currency_symbol} X {cart.productQuantity}
                          </span>
                        </div>
                        <div className="text-center w-5">
                          <button
                            type="button"
                            title="Eliminar Item"
                            className="hover-close rct-link-btn"
                            onClick={() => deleteItemCart(cart)}
                          >
                            <i style={{ color: 'RED' }} className="ti-close"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Scrollbars>
                <div className="dropdown-foot d-flex justify-content-between align-items-center p-2 bg-white rounded-bottom">
                  <div>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/${getAppLayout(location)}/sales/cart`}
                      disabled={isEmpty || !client}
                      color="primary"
                      className="mr-10 btn-xs bg-primary text-white"
                    >
                      <IntlMessages id="components.viewCart" />
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/${getAppLayout(location)}/sales/checkout`}
                      disabled={isEmpty || !client}
                      color="secondary"
                      className="btn-xs text-white"
                    >
                      <IntlMessages id="components.checkout" />
                    </Button>
                  </div>
                  <span className="fw-normal text-dark font-weight-bold font-xs">
                    <IntlMessages id="widgets.total" /> {getTotalPrice().totalPrice} {currency_symbol}
                  </span>
                </div>
              </Fragment>
            )}
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

// map state to props
const mapStateToProps = ({ ecommerce, general }) => {
  const { cart, client } = ecommerce;
  const { dataGeneral } = general;
  return { cart, client, dataGeneral };
};

export default withRouter(
  connect(mapStateToProps, {
    deleteItemFromCart,
    openConfirmDialog
  })(Carts)
);
