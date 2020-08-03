import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveCargosAction, updateCargosAction } from "../../../actions/CargosActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';

const Modal = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const cargarData = (data) => {
        setModal(prev => ({
            ...prev,
            name: data.name,
            description: data.description,
            arrayDepartaments: data.department,
            arrayUsers: data.user,
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
        let acum = "";
        if (modal.name === '') {
            setModal(prev => ({
                ...prev,
                nameError: true,
                nameTextError: "Ingrese el cargo",
                nameHide: 'show',
            }))
            acum = 1;
        }
        if (modal.description === '') {
            setModal(prev => ({
                ...prev,
                descriptionError: true,
                descriptionTextError: 'Ingrese la descripcion',
                descriptionHide: 'show',
            }))
            acum = 1;
        }
        if (modal.description !== '' && modal.description.length < 16) {
            setModal(prev => ({
                ...prev,
                descriptionError: true,
                descriptionTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionHide: 'show',
            }));
            acum = 1;
        }
        if (modal.arrayDepartaments === null) {
            setModal(prev => ({
                ...prev,
                arrayDepartamentsError: "borderColor",
                arrayDepartamentsTextError: 'Seleccione un departamento',
                arrayDepartamentsHide: 'show',
            }));
            acum = 1;
        }
        if (modal.arrayUsers === null) {
            setModal(prev => ({
                ...prev,
                arrayUsersError: "borderColor",
                arrayUsersTextError: 'Seleccione un usuario',
                arrayUsersHide: 'show',
            }));
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    const handleSaveCargo = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));
            if (props.option === 1) {
                props.saveCargosAction(
                    {
                        name: modal.name,
                        description: modal.description,
                        department_id: modal.arrayDepartaments.value,
                        user_id: modal.arrayUsers.value,
                    },
                    () => {
                        closeModal(1);
                    }
                );
            }
            if (props.option === 3) {
                props.updateCargosAction(
                    {
                        id: props.data._id,
                        name: modal.name,
                        description: modal.description,
                        department_id: modal.arrayDepartaments.value,
                        user_id: modal.arrayUsers.value,
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
            if (Object.keys(props.cargos.cargoId).length > 0 && modal.actionReducer === 0) {
                cargarData(props.cargos.cargoId);
            }
        }
    }, [props.cargos])

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
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
                            <FormGroup className="top form-group col-sm-12">
                                <div>
                                    <Label for="name">Nombre</Label>
                                    <Input
                                        invalid={modal.nameError}
                                        id="name"
                                        name="name"
                                        onKeyUp={event => handlekey(
                                            "nameError",
                                            "nameTextError",
                                            "nameHide",
                                            1
                                        )}
                                        onChange={handleChange}
                                        value={modal.name}
                                        type="text"
                                        disabled={props.disabled}
                                    />
                                    <div className={`${modal.nameHide} errorControl`}>
                                        {modal.nameTextError}
                                    </div>
                                </div>
                            </FormGroup>
                            <FormGroup className="top form-group col-sm-12">
                                <div>
                                    <Label for="description">Descripcion</Label>
                                    <Input
                                        invalid={modal.descriptionError}
                                        id="description"
                                        name="description"
                                        onKeyUp={event => handlekey(
                                            "descriptionError",
                                            "descriptionTextError",
                                            "descriptionHide",
                                            1
                                        )}
                                        onChange={handleChange}
                                        value={modal.description}
                                        type="textarea"
                                        disabled={props.disabled}
                                    />
                                    <div className={`${modal.descriptionHide} errorControl`}>
                                        {modal.descriptionTextError}
                                    </div>
                                </div>
                            </FormGroup>
                            <FormGroup className="top form-group col-sm-12">
                                <div>
                                    <Label for="arrayDepartaments">Departamento</Label>
                                    <div className={modal.arrayDepartamentsError}>
                                        <Select
                                            isClearable
                                            isSearchable
                                            isDisabled={props.disabled}
                                            name="arrayDepartaments"
                                            id="arrayDepartaments"
                                            value={modal.arrayDepartaments}
                                            onChange={event => handleChangeSelect(
                                                event,
                                                "arrayDepartaments",
                                                "arrayDepartamentsError",
                                                "arrayDepartamentsTextError",
                                                "arrayDepartamentsHide"
                                            )}
                                            options={props.dataGeneral.dataDepartaments}
                                        />
                                    </div>
                                    <div className={`${modal.arrayDepartamentsHide} errorControl`}>
                                        {modal.arrayDepartamentsTextError}
                                    </div>
                                </div>
                            </FormGroup>
                            <FormGroup className="top form-group col-sm-12">
                                <div>
                                    <Label for="arrayUsers">Usuario</Label>
                                    <div className={modal.arrayUsersError}>
                                        <Select
                                            isClearable
                                            isSearchable
                                            isDisabled={props.disabled}
                                            name="arrayUsers"
                                            id="arrayUsers"
                                            value={modal.arrayUsers}
                                            onChange={event => handleChangeSelect(
                                                event,
                                                "arrayUsers",
                                                "arrayUsersError",
                                                "arrayUsersTextError",
                                                "arrayUsersHide"
                                            )}
                                            options={props.dataGeneral.dataUsers}
                                        />
                                    </div>
                                    <div className={`${modal.arrayUsersHide} errorControl`}>
                                        {modal.arrayUsersTextError}
                                    </div>
                                </div>
                            </FormGroup>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => { closeModal(0); }}
                            color="danger"
                            className="text-white"
                        >
                            Cancel
                        </Button>
                        {
                            !props.showHide &&
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                onClick={handleSaveCargo}
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
            <style jsx=''>
                {
                    `.rct-title {
                            margin-left: -15%;              
                        }`
                }
            </style>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    cargos: state.cargos.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveCargosAction: (data, callback) => dispatch(saveCargosAction(data, callback)),
    updateCargosAction: (data, callback) => dispatch(updateCargosAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);