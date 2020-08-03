import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListProducts from "./components/ListProducts";
import Filters from "./components/Filters";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { searchStoreItemsAction, loadingFalse } from "../../../actions/SalesActions"

const Shop = (props) => {
  const { match, cart, client, resultItems } = props;
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [form, setForm] = useState({
    search: "",
    category: "all",
  });
  const isClient = false;
  useEffect(() => {
    setForm({
      search: props.form.search,
      category: props.form.category,
    })    
    if(props.ecommerce.resultItemsAll.length === 0){
      props.searchStoreItemsAction(form);    
    }else{
      props.loadingFalse()
    }        
  }, [])
  //console.log("index sale ", props)
  //console.log(7777777777777777)
  return (
    <Fragment>
      <div className="shop-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.point-of-sale" />}
          match={match}
        />
        <div className="ais-InstantSearch">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <Filters
                {...props}
                setLoadingFilter={setLoadingFilter}
                form={form}
                setForm={setForm}
              />
            </div>
            <div className="col-lg-9 col-md-8 col-sm-12">
              <div className="shop-content">
                {/* <div className="stats-info d-flex mb-30 justify-content-between align-items-center"></div> */}
                {!props.ecommerce.loading ? (
                  <ListProducts
                    {...props}
                    setLoadingFilter={setLoadingFilter}
                    form={form}
                    setForm={setForm}
                  />
                ) : (
                    <div style={{ height: "60vh" }}>
                      <CircularProgress
                        style={{
                          position: " absolute",
                          height: 40,
                          top: "45%",
                          right: "50%",
                          zIndex: 2,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  dataGeneral: state.general.dataGeneral,
  cart: state.ecommerce.cart,
  client: state.ecommerce.client,
  resultItems: state.ecommerce.resultItems,
  form: state.ecommerce.form,
  ecommerce: state.ecommerce,
});

const mapDispatchToProps = dispatch => ({
  searchStoreItemsAction: (form) => dispatch(searchStoreItemsAction(form)),  
  loadingFalse: () => dispatch(loadingFalse()),  
});

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
