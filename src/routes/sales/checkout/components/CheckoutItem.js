import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { NotificationManager } from 'react-notifications';
import {
  number_format
} from "./../../../../helpers/helpers";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { procesarSaleAction } from "../../../../actions/SalesActions"
import { setSwitchPayPartial } from "../../../../actions/WayToPayActions"
import Switch from '@material-ui/core/Switch';

// intl messages
import IntlMessages from "Util/IntlMessages";

const CheckoutItem = (props) => {
  const [success, setSuccess] = useState(false);

  //Get Total Price
  const { getTotalPrice } = props;

  //Is Cart Empty
  const isCartEmpty = () => {
    const { cart } = props;
    if (cart.length === 0) {
      return true;
    }
  };

  const isEmpty = isCartEmpty();
  const { cart, client, dataGeneral } = props;
  const { countryConfiguration } = dataGeneral;
  const { currency_symbol } = countryConfiguration;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleChangeSwitch = event => {
    props.setSwitchPayPartial(event.target.checked, cart)
  };

  const validate = (type) => {
    let acum = "";
    if (props.client === null) {
      NotificationManager.warning("¡Debe ingresar el cliente!");
      return false;
    } else if (props.cart.length === 0) {
      NotificationManager.warning("¡Debe ingresar al menos un producto!");
      return false;
    } else if ((props.wayToPaySale.arrayWayToPaySale.length === 0) && (type === 'indicted')) {
      NotificationManager.warning("¡Debe ingresar la forma de pago!");
      return false;
    } else {
      return true;
    }
  };

  const arraysItems = (data) => {
    let subTotal = 0;
    let impuesto = 0;
    let total = 0;
    let item = [];

    data.map((itemData, i) => {
      item.push(
        {
          _id: itemData._id,
          type: itemData.typeItem,
          name: itemData.name,
          quantity: itemData.productQuantity,
          unit_price: itemData.price,
          tax: itemData.tax ? itemData.tax._amount : 0,
          gross_amount: (itemData.productQuantity * itemData.price),
          discount: itemData.discount,
        }
      );
      subTotal += (itemData.productQuantity * itemData.price);
      if (itemData.tax !== null) {
        impuesto += (itemData.price * (itemData.tax.amount / 100)) * itemData.productQuantity;
        total += (itemData.price + (itemData.price * (itemData.tax.amount / 100))) * itemData.productQuantity;
      } else {
        impuesto += (itemData.price * 0) * itemData.productQuantity;
        total += (itemData.price + (itemData.price * 0)) * itemData.productQuantity;
      }
    });

    let datosItems = {
      subTotal: subTotal,
      impuesto: impuesto,
      total: total,
      item: item,
    }

    return datosItems;
  }

  const arraysPays = (data) => {
    let payLocal = [];
    let payForeign = [];
    data.arrayWayToPaySale.map((payData, i) => {
      if (payData.paymentMethodLocal !== null) {
        payLocal.push(
          {
            _id: payData.paymentMethodLocal.value,
            name: payData.paymentMethodLocal.label,
            mount: payData.amount,
          }
        );
      } else {
        payForeign.push(
          {
            _id: payData.paymentMethodForeign.value,
            name: payData.paymentMethodForeign.label,
            mount: payData.amountForeign,
            rate: payData.paymentMethodForeign.info.rate,
          }
        );
      }
    });
    let datosPays = [
      {
        type: props.wayToPaySale.payPartial ? 'partial' : 'full',
        waytopay: payLocal,
        foreign_exchanges: payForeign,
      }
    ]

    return datosPays;
  }

  const handleActionSale = (type) => event => {
    event.preventDefault();
    const isValid = validate(type);
    if (isValid) {
      let items = arraysItems(props.cart);
      let pays = arraysPays(props.wayToPaySale);
      console.log(props)
      console.log(items);
      console.log(pays);
      console.log(type)
      props.procesarSaleAction(
        {
          person_id: props.client._id,
          status: type,
          taxes: items.impuesto,
          subtotal: items.subTotal,
          total: items.total,
          pay: pays,
          items: items.item,
        },
        () => {
          setSuccess(true)
        }
      );
    }
  }

  return (
    <div className="checkout-item-wrap p-4">
      <div className="border-bottom d-flex justify-content-between align-items-center p-3">
        <span className="font-weight-bold w-50">
          <IntlMessages id="components.product" />
        </span>
        <span className="font-weight-bold w-15">
          <IntlMessages id="components.quantity" />
        </span>
        <span className="font-weight-bold w-35">
          <IntlMessages id="widgets.price" />
        </span>
      </div>
      {isEmpty ? (
        <div className="text-center p-4">
          <h3>
            <IntlMessages id="components.NoItemFound" />
          </h3>
        </div>
      ) : (
          <Scrollbars
            className="rct-scroll"
            autoHeight
            autoHeightMin={100}
            autoHeightMax={450}
            autoHide
          >
            <ul className="list-unstyled dropdown-body">
              {cart.map((cart, key) => (
                <li className="d-flex justify-content-between p-3" key={key}>
                  <div className="media overflow-hidden w-50">
                    <div className="mr-15">
                      <img
                        src={cart.image}
                        alt="products"
                        className="media-object"
                        width="63"
                        height="63"
                      />
                    </div>
                    <div className="media-body text-truncate">
                      <span className="fs-14 d-block text-truncate">
                        {cart.name}
                      </span>
                      <span className="fs-12 d-block text-muted text-truncate">
                        {cart.description}
                      </span>
                      <span className="fs-12 d-block text-muted">
                        {cart.brand}
                      </span>
                    </div>
                  </div>
                  <div className="w-15">
                    <span className="text-muted fs-12 d-block mb-10">
                      {cart.productQuantity}
                    </span>
                  </div>
                  <div className="w-35">
                    <span className="text-muted fs-12 d-block mb-10">
                      {number_format(cart.price, 2)} {currency_symbol}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Scrollbars>
        )}
      <div className="border-top d-flex justify-content-between align-items-center py-4">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item className="font-weight-bold text-muted">Pago Full</Grid>
          <Grid item>
            <Switch
              checked={props.wayToPaySale.payPartial ? props.wayToPaySale.payPartial : false}
              onChange={handleChangeSwitch}
              value={props.wayToPaySale.payPartial}
              color="primary"
              disabled={false}
            />
          </Grid>
          <Grid item className="font-weight-bold text-muted">Pago Parcial</Grid>
        </Grid>
      </div>
      <div className="border-top d-flex justify-content-between align-items-center py-4">
        <span className="font-weight-bold text-muted">
          <IntlMessages id="components.subTotalPrice" />
        </span>
        <span className="font-weight-bold">
          {`${getTotalPrice().subTotal} ${currency_symbol}`}
        </span>
      </div>
      <div className="border-top d-flex justify-content-between align-items-center py-4">
        <span className="font-weight-bold text-muted">
          <IntlMessages id="components.taxProduct" />
        </span>
        <span className="font-weight-bold">
          {`${getTotalPrice().impuesto} ${currency_symbol}`}
        </span>
      </div>
      <div className="border-top d-flex justify-content-between align-items-center py-4">
        <span className="font-weight-bold text-muted">
          <IntlMessages id="components.totalPrice" />
        </span>
        <span className="font-weight-bold">
          {`${getTotalPrice().totalPrice} ${currency_symbol}`}
        </span>
      </div>
      {
        props.wayToPaySale.arrayWayToPaySale.length > 0 && (
          <div className="border-top d-flex justify-content-between">
            <span className="font-weight-bold text-muted align-items-center py-4">
              <IntlMessages id="components.resumepayment" />
            </span>
            <List>
              {
                props.wayToPaySale.arrayWayToPaySale.map((payment, i) => {
                  return (
                    <ListItem key={i}>
                      {
                        payment.paymentMethodLocal !== null && (
                          <ListItemText
                            primary={payment.paymentMethodLocal.label}
                            secondary={`${number_format(payment.amount, 2)} ${currency_symbol}`}
                          />
                        )
                      }
                      {
                        payment.paymentMethodForeign !== null && (
                          <ListItemText
                            primary={payment.paymentMethodForeign.label}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"

                                  color="textSecondary"
                                >
                                  {`${number_format(payment.amountForeign, 2)} ${payment.paymentMethodForeign.info.currency_symbol}`}
                                </Typography>
                                <br />
                                {`${number_format(payment.amount, 2)} ${currency_symbol}`}
                              </React.Fragment>
                            }
                          />
                        )
                      }
                    </ListItem>
                  )
                })
              }
            </List>
          </div>
        )
      }
      <div className="border-top d-flex justify-content-between align-items-center py-4">
        <span className="font-weight-bold text-muted">
          <IntlMessages id="components.totalPayOut" />
        </span>
        <span className="font-weight-bold">
          {`${number_format(props.wayToPaySale.amountPaidOut, 2)} ${currency_symbol}`}
        </span>
      </div>
      <div className="border-top d-flex justify-content-end align-items-center py-2">
        {
          isEmpty && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/app/sales/point-of-sale"
              className="text-white"
            >
              <IntlMessages id="components.goToShop" />
            </Button>
          )
        }
        {
          !isEmpty && (
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle color="primary" caret>
                Accion
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={handleActionSale('saved')}>Guardar</DropdownItem>                
                {
                  props.wayToPaySale.amountPaidOut === props.wayToPaySale.amountTotal && (
                    <DropdownItem onClick={handleActionSale('indicted')}>Procesar</DropdownItem>
                  )
                }
              </DropdownMenu>
            </Dropdown>
          )
        }
        {
          props.wayToPaySale.amountPaidOut > props.wayToPaySale.amountTotal && !isEmpty && (
            <Alert color="secondary">
              ¡Venta modificada, debe agregar nuevamente la forma de pago!
            </Alert>
          )
        }
      </div>
      <SweetAlert
        success
        show={success}
        title="Your Order Is Successfully Placed !"
        btnSize="sm"
        onConfirm={() => setSuccess(false)}
      />
    </div>
  );
};

const mapStateToProps = ({ ecommerce, general, wayToPaySale }) => {
  const { cart, client } = ecommerce;
  const { dataGeneral } = general;
  return { cart, client, dataGeneral, wayToPaySale };
};

const mapDispatchToProps = dispatch => ({
  procesarSaleAction: (data, callback) => dispatch(procesarSaleAction(data, callback)),
  setSwitchPayPartial: (data, cart) => dispatch(setSwitchPayPartial(data, cart)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutItem);
