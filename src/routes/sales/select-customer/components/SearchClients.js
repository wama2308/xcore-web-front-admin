import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Spinner,
} from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import Modal from "./Modal";
import { getServerErrors } from "./../../../../factorys/validations";
import { searchClientsAction } from "./../../../../actions/SalesActions";

const SearchClients = (props) => {
  const { selectClient } = props;

  const [form, setForm] = useState({
    search: "",
  });

  const [modal, setModal] = useState(false);

  const [clients, setClients] = useState([]);
  const [busco, setBusco] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadingForm(true);
    setClients([]);
    searchClientsAction(form)
      .then((response) => {
        const { person } = response.data;
        if (person && Array.isArray(person)) {
          setClients(person);
          setBusco(true);
        }
        setLoadingForm(false);
      })
      .catch((error) => {
        const { status, data } = error.response;
        let serverErrors = {};
        if (status && status === 422) {
          serverErrors = getServerErrors(data);
        } else if (status === 404) {
          setBusco(true);
          // setModal(true);
        } else {
          setBusco(false);
        }
        setLoadingForm(false);
        setErrors(serverErrors);
      });
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
      setBusco(false);
    }
  };

  const handleToggleListItems = (data) => {
    selectClient(data);
  };

  const valorCloseModal = (valor) => {
    setModal(valor);
  };

  return (
    <div>
      <div className="">
        <Form
          name="form-client"
          className="form-search-flex"
          onSubmit={handleSubmit}
        >
          <FormGroup>
            <Input
              invalid={errors["search"] ? true : false}
              id="search"
              name="search"
              onChange={handleChange}
              value={form.search}
              type="text"
              disabled={loadingForm}
              placeholder="Busca al cliente por DNI, Nombres o Apellidos..."
            />
          </FormGroup>
          <Button
            color="primary"
            className="text-white btn-icon _btn"
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
                  margin: "0px 0px 0px 0px",
                }}
              />
            ) : (
              <span aria-hidden="true" className="ti-search"></span>
            )}
          </Button>
          <Button
            color="primary"
            className="text-white btn-icon"
            variant="contained"
            type="button"
            onClick={() => {
              setModal(true);
            }}
          >
            <i className="zmdi zmdi-account-add"></i>
          </Button>
        </Form>
        <div className={errors["search"] ? "is-invalid" : "false"}>
          <FormFeedback>{errors["search"]}</FormFeedback>
        </div>
        <Modal
          option={1}
          modal={modal}
          modalHeader={"Registrar Cliente"}
          buttonFooter={"Guardar"}
          disabled={false}
          showHide={false}
          data={{}}
          valorCloseModal={valorCloseModal}
          selectClient={selectClient}
        />
      </div>
      <div style={{ marginTop: "5px" }}>
        {clients && clients.length > 0 && (
          <div>
            <Scrollbars
              className="rct-scroll"
              autoHeight
              autoHeightMin={100}
              autoHeightMax={260}
              autoHide
            >
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
                      primary={`${client.names} ${client.surnames}`}
                      secondary={
                        client.typeIdentity
                          ? `${client.typeIdentity.name}${client.dni}`
                          : client.dni
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Scrollbars>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SearchClients);
