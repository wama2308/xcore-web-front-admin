/**
 * Filters Component
 */
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Panel,
  RefinementList,
  SearchBox,
  HierarchicalMenu,
  RatingMenu,
  ClearRefinements,
  NumericMenu,
  RangeInput,
} from "react-instantsearch-dom";

import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { getAppLayout } from "Helpers/helpers";

//intl Messages
import IntlMessages from "Util/IntlMessages";

// Card Component
import { RctCard, RctCardContent } from "Components/RctCard";

import SearchProduct from "./SearchProduct";
import { filterItemsSale } from "./../../../../actions/EcommerceActions";
//Actions
import {
  onSetResultItems,
  onSetPagesItem,
} from "./../../../../actions/EcommerceActions";
import { getServerErrors } from "./../../../../factorys/validations";

const Filters = (props) => {
  const {
    onSetResultItems,
    onSetPagesItem,
    setLoadingFilter,
    form,
    cart,
    client,
    setForm,
  } = props;

  const [storeItems, setStoreItems] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});

  const searchFocus = () => {
    const input = document.getElementById("search-items-shop");
    if (input) input.focus();
  };

  const onByCategory = (category) => {
    let _form = { ...form };
    setForm({
      ...form,
      category,
    });
    _form["category"] = category;
    props.filterItemsSale({ search: form.search, category: category, })
    searchFocus();
  };

  const onSetLoadingFilter = (loading) => {
    if (setLoadingFilter) {
      setLoadingFilter(loading);
    }
  };

  //Is Cart Empty
  const isCartEmpty = () => {
    const { cart } = props;
    if (cart.length === 0) {
      return true;
    }
  };

  const isEmpty = isCartEmpty();

  return (
    <div className="filters-wrapper">
      <RctCard>
        <RctCardContent>
          <SearchProduct {...props} errors={errors} setErrors={setErrors} />
          {!isEmpty && (
            <div>
              <br />
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to={`/${getAppLayout(location)}/sales/cart`}
                disabled={isEmpty || !client}
                color="primary"
                className="mr-10 btn-xs bg-primary text-white"
              >
                <IntlMessages id="components.viewCart" />
              </Button>
            </div>
          )}
          {/* <SearchBox
            translations={{ placeholder: "Buscar productos y servicios" }}
            showLoadingIndicator
          /> */}
        </RctCardContent>
      </RctCard>
      {/* <RctCard className="brand">
        <RctCardContent>
          <Panel header="Brand">
            <RefinementList attribute="brand" limit={5} />
          </Panel>
        </RctCardContent>
      </RctCard> */}
      <RctCard>
        <div className="categories items">
          <Panel header="CATEGORÍA">
            <div className="ais-Panel-body">
              <div className="ais-HierarchicalMenu">
                <ul className="ais-HierarchicalMenu-list">
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "all"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("all");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">Todos</span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "plans"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("plans");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">Planes</span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "classs"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("classs");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">Clases</span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "services"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("services");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">
                        Servicios
                      </span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "areas"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("areas");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">Areas</span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "products"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("products");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">
                        Productos
                      </span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                  <li className="ais-HierarchicalMenu-item">
                    <a
                      className={
                        form.category === "packages"
                          ? "ais-HierarchicalMenu-link active"
                          : "ais-HierarchicalMenu-link"
                      }
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onByCategory("packages");
                      }}
                    >
                      <span className="ais-HierarchicalMenu-label">
                        Paquetes
                      </span>
                      {/* <span className="ais-HierarchicalMenu-count"></span> */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Panel>
        </div>
      </RctCard>
      {/* <RctCard className="price">
        <RctCardContent>
          <Panel header="Price" className="mb-20">
            <NumericMenu
              attribute="price"
              items={[
                { end: 10, label: "Below $10" },
                { start: 10, end: 100, label: "$10 - $100" },
                { start: 100, end: 500, label: "$100 - $500" },
                { start: 500, label: "Above $500" },
              ]}
            />
          </Panel>
          <Panel header="Enter Price Range">
            <RangeInput
              attribute="price"
              className="py-2"
              translations={{
                submit: "Go",
                separator: "-",
              }}
            />
          </Panel>
        </RctCardContent>
      </RctCard>
      <RctCard>
        <RctCardContent>
          <Panel header="Rating Menu">
            <RatingMenu
              attribute="rating"
              min={1}
              max={5}
              translations={{
                ratingLabel: "",
              }}
            />
          </Panel>
        </RctCardContent>
      </RctCard>
      <RctCard>
        <RctCardContent>
          <ClearRefinements />
        </RctCardContent>
      </RctCard> */}
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
  filterItemsSale: (form) => dispatch(filterItemsSale(form)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
