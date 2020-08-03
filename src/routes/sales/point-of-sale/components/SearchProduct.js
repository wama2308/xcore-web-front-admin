import React, { useState, Fragment, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { filterItemsSale } from "./../../../../actions/EcommerceActions";
import { NotificationManager } from 'react-notifications';


const SearchProduct = (props) => {
  const {
    setLoadingFilter,
    form,
    setForm,
    errors,
    setErrors,
  } = props;

  const [storeItems, setStoreItems] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [errorInputText, setErrorInputText] = useState('');
  const [errorInputHide, setErrorInputHide] = useState('hide');

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      setLoadingForm(true);
      onSetLoadingFilter(true);
      props.filterItemsSale(form)
      searchFocus();
    }
  };

  const handleChange = (event) => {
    const value =
      event.target.type !== "checkbox"
        ? event.target.value
        : event.target.checked;
    const name = event.target.name;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    setErrorInput(false);
    setErrorInputText('');
    setErrorInputHide('hide');
    if (value.length === 0) {
      props.filterItemsSale({ search: event.target.value, category: form.category })
    }
  };

  const onSetLoadingFilter = (loading) => {
    if (setLoadingFilter) {
      setLoadingFilter(loading);
    }
  };

  const searchFocus = () => {
    const input = document.getElementById("search-items-shop");
    if (input) input.focus();
  };

  const validate = () => {
    let acum = "";
    if (form.search === '') {
      setErrorInput(true);
      setErrorInputText('Campo vacio');
      setErrorInputHide('show');
      acum = 1;
    }
    if (acum > 0) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (props.ecommerce.resultItems.length > 0) {
      setLoadingForm(false);
      searchFocus();
    }
    if (props.ecommerce.resultItems.length === 0) {
      setLoadingForm(false);
      searchFocus();
    }  
    //console.log("search product ",props)  
  }, [props])

  return (
    <Fragment>
      <Form
        name="form-client"
        className="form-search-sale-flex"
        onSubmit={handleSubmit}
      >
        <FormGroup>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <Input
                invalid={errorInput}
                id="search-items-shop"
                name="search"
                onChange={handleChange}
                value={form.search}
                type="text"
                disabled={loadingForm}
                autoFocus
                placeholder="Buscar productos y servicios..."
              />
            </div>
            <Button
              color="primary"
              className="text-white btn-icon __btn"
              variant="contained"
              disabled={loadingForm}
              type="submit"
            >
              {loadingForm ? (
                <CircularProgress
                  style={{
                    width: "15px",
                    height: "15px",
                    color: "#fff",
                    margin: "0px 6px 0px 6px",
                  }}
                />
              ) : (
                  <span aria-hidden="true" className="ti-search"></span>
                )}
            </Button>
          </div>
          <div className={`${errorInputHide} errorControl`}>
            {errorInputText}
          </div>
        </FormGroup>

      </Form>
      <div className={errors["search"] ? "is-invalid" : "false"}>
        <FormFeedback>{errors["search"]}</FormFeedback>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
  filterItemsSale: (form) => dispatch(filterItemsSale(form)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  SearchProduct
);
