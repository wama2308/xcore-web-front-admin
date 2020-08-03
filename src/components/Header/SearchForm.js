import React, { useState, Fragment, useEffect } from "react";
import { Form } from "reactstrap";
import { connect } from "react-redux";
import { Input } from "reactstrap";

import { ButtonDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";

import { getServerErrors } from "./../../factorys/validations";
import { searchClientsAction } from "./../../actions/SalesActions";

//Helper
import { textTruncate } from "./../../helpers/helpers";

//Actions
import { onSetClient } from "./../../actions/EcommerceActions";

import SelectedClient from "./../../routes/sales/select-customer/components/SelectedClient";
import Modal from "./../../routes/sales/select-customer/components/Modal";

const SearchForm = (props) => {
  const { client, onSetClient } = props;
  const [form, setForm] = useState({
    search: "",
  });
  const [clients, setClients] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const valorCloseModal = (valor) => {
    setModal(valor);
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
    if (value.length === 0) {
      setClients([]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadingForm(true);
    setClients([]);
    searchClientsAction(form)
      .then((response) => {
        const { person } = response.data;
        setLoadingForm(false);
        if (person && Array.isArray(person)) {
          setClients(person);
          setIsOpen(true);
          if (person.length < 1) {
            document.querySelector("form.search-wrapper #search").focus();
          } else if (person.length === 1) {
            onSetClient(person[0]);
          }
        }
        setForm({ search: "" });
      })
      .catch((error) => {
        setLoadingForm(false);
        const { status, data } = error.response;
        let serverErrors = {};
        if (status && status === 422) {
          serverErrors = getServerErrors(data);
          document.querySelector("form.search-wrapper #search").focus();
        }
        setErrors(serverErrors);
      });
  };

  const handleToggleListItems = (data) => {
    onSetClient(data);
    valorCloseModal(false);
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const openDashboardOverlay = (e) => {
    valorCloseModal(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (props.client !== null) {
      let arrayClient = [];
      arrayClient.push(props.client)
      setClients(arrayClient)
      setIsOpen(true);
    }
  }, [props])

  return (
    <div style={{ display: "flex" }}>
      {!client && (
        <Fragment>
          <ButtonDropdown
            isOpen={isOpen}
            toggle={toggle}
            className="list-inline-item quciklink-dropdown tour-step-1"
          >
            <DropdownToggle nav className="header-icon p-0">
              <Tooltip title="Clientes encontrados" placement="bottom">
                <i className="zmdi zmdi-accounts"></i>
              </Tooltip>
            </DropdownToggle>
            <DropdownMenu>
              <Scrollbars
                className="rct-scroll"
                autoHeight
                autoHeightMin={100}
                autoHeightMax={260}
                autoHide
              >
                <div className="dropdown-content">
                  <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
                    <span className="text-white font-weight-bold">
                      Clientes
                    </span>
                    <Tooltip title="Limpiar resultados" placement="top">
                      <span>
                        <Badge
                          color="danger"
                          className="cursor-pointer"
                          onClick={() => {
                            setForm({
                              search: "",
                            });
                            document
                              .querySelector("form.search-wrapper #search")
                              .focus();
                            setClients([]);
                            valorCloseModal(false);
                          }}
                        >
                          x
                        </Badge>
                      </span>
                    </Tooltip>
                  </div>
                  <List className="p-0 list-divider">
                    {clients.map((client, key) => (
                      <ListItem
                        button
                        onClick={() => handleToggleListItems(client)}
                        key={key}
                      >
                        <Avatar className="bg-primary">
                          <i className="zmdi zmdi-account-circle"></i>
                        </Avatar>
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
                      </ListItem>
                    ))}
                    {clients && clients.length === 0 && (
                      <ListItem>
                        <ListItemText primary={"No hay clientes en la lista"} />
                      </ListItem>
                    )}
                  </List>
                </div>
              </Scrollbars>
            </DropdownMenu>
          </ButtonDropdown>
          <Form className="search-wrapper" onSubmit={handleSubmit}>
            <Input
              type="search"
              className="search-input-lg"
              invalid={errors["search"] ? true : false}
              id="search"
              name="search"
              onChange={handleChange}
              value={form.search}
              type="text"
              disabled={loadingForm}
              placeholder="Buscar al cliente por DNI, Nombres o Apellidos..."
            />
          </Form>
          <Tooltip title="Registrar cliente" placement="bottom">
            <a
              href="#"
              style={{ marginLeft: "0.5rem" }}
              className="header-icon tour-step-3"
              onClick={(e) => openDashboardOverlay(e)}
            >
              <i className="zmdi zmdi-accounts-add"></i>
            </a>
          </Tooltip>          
          <Modal
            option={1}
            modal={modal}
            modalHeader={"Registrar Cliente"}
            buttonFooter={"Registrar"}
            disabled={false}
            showHide={false}
            data={null}
            valorCloseModal={valorCloseModal}
            selectClient={handleToggleListItems}
          />
        </Fragment>
      )}
      {client && <SelectedClient />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  client: state.ecommerce.client,
});

export default connect(mapStateToProps, { onSetClient })(SearchForm);
