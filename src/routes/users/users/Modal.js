import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    Collapse,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    saveUsersAction,
    updateUsersAction,
} from "../../../actions/UsersActions"
import {
    selectRolFunction
} from "../../../actions/aplicantionActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import NewRol from './NewRol';
import PermitsSpecials from './PermitsSpecials';
import ViewRol from './ViewRol';
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { validarEmail } from "../../../helpers/helpers";
import { NotificationManager } from 'react-notifications';

const Modal = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const cargarData = (data) => {
        setModal(prev => ({
            ...prev,
            email: data.email,
            collapsePermitsSpecials: data.specialModules.length > 0 ? true : false,
            loading: 'hide',
            actionReducer: 1,
        }));
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setModal(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setModal(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        props.selectRolFunction(value);
        setModal(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));
    };

    const closeModal = (option) => {
        if (option === 0) {
            const message = {
                title: "Cerrar Ventana",
                info: "¿Esta seguro que desea cerrar la ventana?"
            };
            props.confirm(message, res => {
                if (res) {
                    setModal({
                        ...initialFormState
                    });
                    props.valorCloseModal(false);
                }
            });
        } else {
            setModal({
                ...initialFormState
            });
            props.valorCloseModal(false);
        }
    };

    const validate = () => {
        let acum = 0;
        let acumPermitsSpecials = 0;
        if (modal.email === '') {
            setModal(prev => ({
                ...prev,
                email_error: true,
                email_text_error: "Ingrese el email",
                email_hide: "show",
            }))
            acum = 1;
        }
        if (modal.email && !validarEmail(modal.email)) {
            setModal(prev => ({
                ...prev,
                email_error: true,
                email_text_error: "Email invalido",
                email_hide: "show",
            }))
            acum = 1;
        }
        if (modal.rold_id === null) {
            setModal(prev => ({
                ...prev,
                rol_id_error: 'borderColor',
                rol_id_text_error: 'Seleccione el rol',
                rold_id_hide: 'show',
            }))
            acum = 1;
        }
        if (props.dataGeneral.checkedSpecials.length > 0) {
            props.dataGeneral.checkedSpecials.map((permitsSpecial, i) => {
                const permitsRepeat = props.dataGeneral.newRol.info.simplePermits.find(data => data === permitsSpecial);
                if (permitsRepeat) {
                    acumPermitsSpecials++;
                }
            });
        }
        if (acumPermitsSpecials > 0) {
            NotificationManager.warning("Los permisos especiales seleccionados ya estan en el rol seleccionado");
            return false;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    const handleSaveUser = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));
            if (props.option === 1) {
                props.saveUsersAction(
                    {
                        email: modal.email,
                        rol_id: props.dataGeneral.newRol.value,
                        special_permits: props.dataGeneral.checkedSpecials,
                    },
                    () => {
                        closeModal(1);
                    }
                );
            }
            if (props.option === 3) {
                props.updateUsersAction(
                    {
                        id: props.data._id,
                        email: modal.email,
                        rol_id: props.dataGeneral.newRol.value,
                        special_permits: props.dataGeneral.checkedSpecials,
                    },
                    () => {
                        closeModal(1);
                    }
                );
            }
        }
    }

    useEffect(() => {
        if (props.option === 1) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        } else if (props.option === 2 || props.option === 3) {
            if (Object.keys(props.users.userId).length > 0 && modal.actionReducer === 0) {
                cargarData(props.users.userId);
            }
        }
        setModal(prev => ({ ...prev, rold_id: Object.keys(props.dataGeneral.newRol).length > 0 ? props.dataGeneral.newRol : null }))

    }, [props])

    // console.log("props.users ", props.users)
    // console.log("props.dataGeneral ", props.dataGeneral)
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={props.modal}
            onClose={() => { closeModal(0); }}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
            {modal.loading === "hide" ? (
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
                        <Form>
                            <div className='row'>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="email">Email</Label>
                                        <Input
                                            invalid={modal.email_error}
                                            id="email"
                                            name="email"
                                            onKeyUp={event => handlekey(
                                                "email_error",
                                                "email_text_error",
                                                "email_hide",
                                                1
                                            )}
                                            onChange={handleChange}
                                            value={modal.email}
                                            type="text"
                                            disabled={props.disabled}
                                        />
                                        <div className={`${modal.email_hide} errorControl`}>
                                            {modal.email_text_error}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="rold_id">Rol</Label>
                                        <div className={modal.rol_id_error}>
                                            <Select
                                                isClearable
                                                isSearchable
                                                isDisabled={props.disabled}
                                                name="rold_id"
                                                id="rold_id"
                                                value={Object.keys(props.dataGeneral.newRol).length > 0 ? props.dataGeneral.newRol : null}
                                                onChange={event => handleChangeSelect(
                                                    event,
                                                    "rold_id",
                                                    "rol_id_error",
                                                    "rol_id_text_error",
                                                    "rold_id_hide"
                                                )}
                                                options={props.dataGeneral.dataRols}
                                            />
                                        </div>
                                        <div className={`${modal.rold_id_hide} errorControl`}>
                                            {modal.rol_id_text_error}
                                        </div>
                                    </div>
                                </FormGroup>
                                {
                                    modal.rold_id && (
                                        <FormGroup className="top form-group col-sm-12">
                                            <ViewRol
                                                data={modal.rold_id.info}
                                            />
                                        </FormGroup>
                                    )
                                }
                            </div>
                            <hr />
                            <div className="row">
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            setModal(prev => ({
                                                ...prev,
                                                collapseNewRol: !modal.collapseNewRol
                                            }))
                                        }
                                        disabled={props.disabled}
                                    >
                                        Nuevo Rol
                                    </Button>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={modal.collapseNewRol}>
                                        <Card>
                                            <CardBody>
                                                <NewRol disabled={props.disabled} />
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </FormGroup>
                            </div>
                            <hr />
                            <div className="row">
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            setModal(prev => ({
                                                ...prev,
                                                collapsePermitsSpecials: !modal.collapsePermitsSpecials
                                            }))
                                        }
                                        disabled={props.disabled}
                                    >
                                        Permisos Especiales
                                    </Button>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={modal.collapsePermitsSpecials}>
                                        <Card>
                                            <CardBody>
                                                <PermitsSpecials disabled={props.disabled} />
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </FormGroup>
                            </div>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={() => { closeModal(0); }} color="danger" className="text-white">
                            Cancel
                            </Button>
                        {
                            !props.showHide &&
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                onClick={handleSaveUser}
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
                )
            }
        </Dialog>
    );
}

const mapStateToProps = state => ({
    users: state.users.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveUsersAction: (data, callback) => dispatch(saveUsersAction(data, callback)),
    updateUsersAction: (data, callback) => dispatch(updateUsersAction(data, callback)),
    selectRolFunction: (data) => dispatch(selectRolFunction(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);