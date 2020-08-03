import React, { Fragment } from "react";
import { connect } from "react-redux";
import "rc-input-number/assets/index.css";
import InputNumber from "rc-input-number";

//Actions
import { onChangeProductQuantity } from "../../../../actions/EcommerceActions";

const InputQuantity = (props) => {
  const {
    errors,
    keyInput,
    item,
    handleChangeStoreItems,
    disabled,
    onChangeProductQuantity,
  } = props;

  const onChangeQuantity = (quantity, cartItem) => {
    if (quantity > 0) {
      onChangeProductQuantity(quantity, cartItem);
    }
  };

  const value = item && item.productQuantity ? item.productQuantity : 1;

  return (
    <Fragment>
      <InputNumber
        aria-label="Cantidad"
        min={1}
        max={1000}
        style={{ width: 100 }}
        value={value}
        onChange={(value) => {
          onChangeQuantity(value, item);
        }}
        readOnly={false}
        disabled={disabled}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  onChangeProductQuantity,
})(InputQuantity);
