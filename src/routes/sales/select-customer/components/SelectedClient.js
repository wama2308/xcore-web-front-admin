import React, { useState, Fragment } from "react";
import { connect } from "react-redux";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

//Actions
import { onSetClient } from "./../../../../actions/EcommerceActions";

//Helper
import { textTruncate } from "./../../../../helpers/helpers";

import Modal from "./Modal";

const SelectedClient = (props) => {
  const { match, client, onSetClient } = props;
  const [modal, setModal] = useState(false);

  const valorCloseModal = (valor) => {
    setModal(valor);
  };

  const selectClient = (client) => {
    onSetClient(client);
  };

  const uncheck = () => {
    onSetClient(null);
  };

  return (
    <Fragment>
      <List className="p-0 list-divider active-select-customer">
        <ListItem button>
          <ListItemAvatar>
            <Avatar className="bg-primary">
              <i className="zmdi zmdi-account-circle"></i>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={textTruncate(
              `${client.names} ${client.surnames}`
                ? `${client.names} ${client.surnames}`
                : "",
              25
            )}
            secondary={
              client.typeIdentity
                ? `${client.typeIdentity.name}${client.dni}`
                : client.dni
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Edit"
              onClick={() => {
                setModal(true);
              }}
            >
              <i className="zmdi zmdi-edit text-primary"></i>
            </IconButton>
            <IconButton aria-label="Delete" onClick={uncheck}>
              <i className="zmdi zmdi-close text-primary"></i>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Modal
        option={3}
        modal={modal}
        modalHeader={"Editar Cliente"}
        buttonFooter={"Editar"}
        disabled={false}
        showHide={false}
        data={client}
        valorCloseModal={valorCloseModal}
        selectClient={selectClient}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  client: state.ecommerce.client,
});

export default connect(mapStateToProps, { onSetClient })(SelectedClient);
