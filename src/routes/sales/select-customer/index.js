import React, { useState, Fragment } from "react";
import { connect } from "react-redux";

// intl messages
import IntlMessages from "Util/IntlMessages";
import SearchClients from "./components/SearchClients";

import { Panel } from "react-instantsearch-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

// Card Component
import { RctCard, RctCardContent } from "Components/RctCard";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

//Actions
import { onSetClient } from "./../../../actions/EcommerceActions";

import Modal from "./components/Modal";
import SelectedClient from "./components/SelectedClient";

const SelectCustomer = (props) => {
  const { match, client, onSetClient } = props;

  const selectClient = (client) => {
    onSetClient(client);
  };

  return (
    <Fragment>
      <div className="shop-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.select-customer" />}
          match={match}
        />
        <div className="ais-InstantSearch">
          <div className="row">
            <div className="col-lg-2 col-md-2 d-none d-md-block"></div>
            <div className="col-lg-8 col-md-8 d-none d-md-block">
              {!client && (
                <RctCard>
                  <RctCardContent>
                    <SearchClients {...props} selectClient={selectClient} />
                  </RctCardContent>
                </RctCard>
              )}
              {client && (
                <Fragment>
                  <RctCard>
                    <RctCardContent>
                      <Panel header="Cliente selecionado">
                        <SelectedClient />
                        <br />
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to="/app/sales/point-of-sale"
                          className="text-white"
                        >
                          <IntlMessages id="components.goToShop" />
                        </Button>
                      </Panel>
                    </RctCardContent>
                  </RctCard>
                </Fragment>
              )}
            </div>
            <div className="col-lg-2 col-md-2 d-none d-md-block"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  client: state.ecommerce.client,
});

export default connect(mapStateToProps, { onSetClient })(SelectCustomer);
