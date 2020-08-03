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
// import { saveCargosAction, updateCargosAction } from "../../../actions/CargosActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import { NotificationManager } from 'react-notifications';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";

const ModalCourtesy = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const handleChangeExpirationDate = date => {
        setModal(prev => ({
            ...prev,
            expirationDate: date,
            expirationDateError: "",
            expirationDateTextError: '',
            expirationDateHide: 'hide',
        }))
    }  

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
                    props.valorCloseModalCourtesy(false);
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

    const addCourtesy = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));

        }
    }

    useEffect(() => {
        if (props.modal) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        }
    }, [props])

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
                    <DialogContent dividers style={{ minHeight: '45vh', maxHeight: '45vh' }}>
                        <Form>
                            <FormGroup className="top form-group col-sm-12">
                                <div>
                                    <Label for="expirationDate">Fecha de Finalizacion</Label>
                                    <div className={modal.expirationDateError}>
                                        <DatePicker
                                            selected={modal.expirationDate}
                                            onChange={handleChangeExpirationDate}
                                            dateFormat="dd-MM-yyyy"
                                            isClearable={false}
                                            showYearDropdown
                                            dateFormatCalendar="MMMM"
                                            className="form-control"
                                            disabled={false}
                                            locale="es"
                                        />
                                    </div>
                                    <div className={`${modal.expirationDateHide} errorControl`}>
                                        {modal.expirationDateTextError}
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
                                onClick={addCourtesy}
                            >
                                Agregar
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
    // cargos: state.cargos.toJS(),
    // dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    // saveCargosAction: (data, callback) => dispatch(saveCargosAction(data, callback)),
    // updateCargosAction: (data, callback) => dispatch(updateCargosAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCourtesy);