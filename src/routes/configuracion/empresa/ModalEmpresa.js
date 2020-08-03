import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  FormFeedback
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { editarBusinessAction } from "../../../actions/EmpresaActions"
import { connect } from "react-redux";
import { business } from './../../../sockets/business'
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { getServerErrors } from './../../../factorys/validations'

const ModalEmpresaHooks = (props) => {

  const { editarBusinessAction, valorCloseModal } = props;

  const [loading, setLoading] = useState("hide");
  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: props.data._id,
    email: window.localStorage.getItem("email"),
    name: props.data.name,
    logo: props.data.logo,
  });


  const handleChange = event => {
    const value = (event.target.type !== "checkbox") ? event.target.value : event.target.checked;
    const name = [event.target.name];
    setForm({
      ...form,
      [name]: value
    })
    setErrors({
      ...errors,
      [name]: ''
    })
  }

  const closeModal = (option) => {
    if (option === 0) {
      const message = {
        title: "Cerrar Ventana",
        info: "¿Esta seguro que desea cerrar la ventana?"
      };
      props.confirm(message, res => {
        if (res) {
          valorCloseModal(false);
        }
      });
    } else {
      valorCloseModal(false);
    }
  };

  const fileHandler = event => {
    const data = event.currentTarget.files[0]
    const name = event.currentTarget.name
    if (data.size && (data.size) / 1024 > 2048) {
      setForm({
        ...form,
        errors: {
          ...form.errors,
          logo: 'Tamaño de la imagen no permitido'
        }
      })
    } else {
      const file = data;
      if (!file) { return; }
      let reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = () => {
        setForm({
          ...form,
          [name]: reader.result
        })
        setErrors({
          ...errors,
          [name]: ''
        })
      };
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    setLoadingForm(true);
    editarBusinessAction(form)
      .then(response => {
        setLoadingForm(false);
        const branch_office_id = window.localStorage.getItem("branch_office_default");
        const business_id = window.localStorage.getItem("business_default");
        business.emit('business', {
          branch_office_id,
          business_id
        })
        closeModal(1);
      })
      .catch(error => {
        const { status, data } = error.response
        let serverErrors = {}
        if (status && status === 422) {
          serverErrors = getServerErrors(data)
        }
        setLoadingForm(false);
        setErrors(serverErrors)
      });
  }

  const { name, logo } = form;

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={props.modal}
      onClose={() => { closeModal(0); }}
      aria-labelledby="responsive-dialog-title"
    >
      <Form name="form-business" onSubmit={handleSubmit}>
        {loading === "hide" ? (
          <div>
            <DialogTitle id="form-dialog-title">
              <div style={{ display: 'flex' }}>
                <div>
                  {props.modalHeader}
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <IconButton aria-label="Delete"
                    className="iconButtons"
                    onClick={() => { closeModal(0); }}
                  >
                    <Close className="iconTable" />
                  </IconButton>
                </div>
              </div>
            </DialogTitle>
            <DialogContent dividers>

              <FormGroup className="top form-group col-sm-20">
                <Input
                  label="Nombre"
                  id="name"
                  invalid={(errors['name']) ? true : false}
                  name="name"
                  onChange={handleChange}
                  value={name}
                  type="text"
                  disabled={props.disabled}
                />
                <FormFeedback>{errors['name']}</FormFeedback>
              </FormGroup>
              {
                props.option === 2 &&
                <FormGroup className="top form-group col-sm-20">
                  <Label>Logo</Label>
                  <div>
                    <Input
                      className="top"
                      invalid={(errors['logo']) ? true : false}
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={event => fileHandler(event)}
                      valid={true}
                    />
                    <FormFeedback>{errors['logo']}</FormFeedback>
                  </div>
                </FormGroup>
              }
              {
                props.option === 1 &&
                <Label>Logo</Label>
              }
              <div>
                {logo && (
                  <img
                    style={{ width: 300, height: 200 }}
                    className="image"
                    src={logo}
                  />
                )}
              </div>

            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => { closeModal(0); }} color="primary" className="text-white">
                Cancel
                          </Button>
              {
                !props.showHide &&
                <Button
                  type="submit"
                  disabled={loadingForm}
                  className="btn-info text-white"
                  variant="contained"
                >
                  {props.buttonFooter}
                </Button>
              }

            </DialogActions>
          </div>
        ) : (
            <div style={{ height: "55vh" }}>
              <CircularProgress
                style={{
                  position: "fixed",
                  height: 40,
                  top: "45%",
                  right: "50%",
                  zIndex: 2
                }}
              />
            </div>
          )}
      </Form>
    </Dialog>
  )

}

const mapDispatchToProps = dispatch => ({
  editarBusinessAction: (data) => dispatch(editarBusinessAction(data)),
});

export default connect(
  null,
  mapDispatchToProps
)(ModalEmpresaHooks);