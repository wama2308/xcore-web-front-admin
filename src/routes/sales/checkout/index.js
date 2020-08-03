import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

//Components
import CheckoutForm from "./components/CheckoutForm";
import CheckoutItem from "./components/CheckoutItem";

// Card Component
import { RctCard, RctCardContent } from "Components/RctCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import { selectExchange } from "./../../../actions/ExchangesActions";

import {
  getAmountTotal,  
} from "./../../../actions/WayToPayActions";

import {
  onSetForeignExchange,
  onSetLocalCurrency,
} from "./../../../actions/EcommerceActions";

import {
  number_format
} from "./../../../helpers/helpers";

const Checkout = (props) => {
  const { match, cart, client, form_currency } = props;

  const [loading, setLoading] = useState("hide");
  const [loadingForm, setLoadingForm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadingForm(true);
    //console.log(form_currency);
    setTimeout(() => {
      setLoadingForm(false);
    }, 3000);
  };

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

  const getSelectExchange = () => {
    selectExchange()
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          props.onSetForeignExchange(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //console.log("index checkout ", props.wayToPaySale)
    props.onSetLocalCurrency(props.wayToPays);
    getSelectExchange();
    //props.getAmountTotal(getTotalPrice().totalPrice)
  }, [])
  //console.log("ecommerce ", props.cart)
  //console.log("wayToPaySale ", props.wayToPaySale)  
  return (
    <div className="checkout-wrap">
      <PageTitleBar
        title={<IntlMessages id="sidebar.checkout" />}
        match={match}
      />
      <RctCard customClasses="overflow-hidden">
        <RctCardContent noPadding>
          <div className="row no-gutters">
            <div className="col-lg-8 col-md-6 col-sm-12">
              <CheckoutForm
                {...props}
                onSubmit={handleSubmit}
                loading={loading}
                loadingForm={loadingForm}
                getTotalPrice={getTotalPrice}
                disabled={disabled}
                errors={errors}
              />
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <CheckoutItem
                {...props}
                onSubmit={handleSubmit}
                loading={loading}
                loadingForm={loadingForm}
                getTotalPrice={getTotalPrice}
                disabled={disabled}
                errors={errors}
              />
            </div>
          </div>
        </RctCardContent>
      </RctCard>
    </div>
  );
};

const mapStateToProps = ({ ecommerce, general, wayToPaySale }) => {
  const { cart, client, form_currency } = ecommerce;
  const { dataGeneral } = general;
  const { countryConfiguration } = dataGeneral;
  const { wayToPays } = countryConfiguration;
  return {
    cart,
    client,
    form_currency,
    wayToPays,
    wayToPaySale,
    ecommerce,
    general
  };
};

export default connect(mapStateToProps, {
  onSetForeignExchange,
  onSetLocalCurrency,
  getAmountTotal,
})(Checkout);
