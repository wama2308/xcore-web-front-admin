import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import Product from "./Product";
import PagerSaleAll from "./../../../../components/PagerSaleAll";
//Actions
import {
  paginatItemsSale,

} from "./../../../../actions/EcommerceActions";
import { getArray } from "Helpers/helpers";

const ListProducts = (props) => {
  const {
    resultItems,
    form,
  } = props;
  const arrayData = getArray(resultItems)

  const handlePagination = (page, totalPage) => {
    props.paginatItemsSale(parseInt(page), parseInt(totalPage))
  }
  //console.log(props.ecommerce)
  return (
    <Fragment>
      {resultItems && resultItems.length > 0 && (
        <Fragment>
          <div className="ais-Hits mb-30">
            <ul className="ais-Hits-list">
              {arrayData.slice((props.ecommerce.page - 1) * props.ecommerce.perPage, props.ecommerce.page * props.ecommerce.perPage).
              map((item, key) => {
                return (
                  <li key={key} className="ais-Hits-item">
                    <Product {...props} hit={item} />
                  </li>
                );
              })}
            </ul>
          </div>
          {resultItems.length > 10 && (
            <div>
              <PagerSaleAll
                page={props.ecommerce.page}
                perPage={props.ecommerce.perPage}
                dataPagination={resultItems}
                numberPage={props.ecommerce.numberPage}
                handlePagination={handlePagination}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  ecommerce: state.ecommerce,
});

export default connect(mapStateToProps, { paginatItemsSale })(
  ListProducts
);
