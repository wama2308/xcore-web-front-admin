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
import Select from "react-select";
// import { saveCargosAction, updateCargosAction } from "../../../actions/CargosActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import { NotificationManager } from 'react-notifications';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";

const ModalCredit = props => {
    const initialFormState = stateInitial;
    const [modal, setModal] = useState(initialFormState)

    const handleChange = e => {
        const { name, value } = e.target;
        console.log(value)
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
                    props.valorCloseModalCredit(false);
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
        if (modal.amountOffees === '' || modal.amountOffees === '0' || parseFloat(modal.amountOffees) < 0) {
            setModal(prev => ({
                ...prev,
                amountOffeesError: true,
                amountOffeesTextError: "¡Ingrese la cantidad de cuotas!",
                amountOffeesHide: 'show',
            }))
            acum = 1;
        }
        if (modal.arrayCycle === null) {
            setModal(prev => ({
                ...prev,
                arrayCycleError: 'borderColor',
                arrayCycleTextError: '¡Seleccione el ciclo de tiempo!',
                arrayCycleHide: 'show',
            }))
            acum = 1;
        }
        if (modal.timeCycle === '' || modal.timeCycle === '0' || parseFloat(modal.timeCycle) < 0) {
            setModal(prev => ({
                ...prev,
                timeCycleError: true,
                timeCycleTextError: '¡Ingrese la cantidad de tiempo!',
                timeCycleHide: 'show',
            }));
            acum = 1;
        }
        if (modal.interestPercentage === '' || modal.interestPercentage === '0' || parseFloat(modal.interestPercentage) < 0) {
            setModal(prev => ({
                ...prev,
                interestPercentageError: true,
                interestPercentageTextArea: '¡Ingrese la cantidad de tiempo!',
                interestPercentageHide: 'show',
            }));
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    const addCredit = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            setModal(prev => ({
                ...prev,
                loading: "show"
            }));
            console.log("ENTROOOOOOOOOOOO")
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
                            <div className="row">
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="amountOffees">Cantidad de Cuotas</Label>
                                        <Input
                                            invalid={modal.amountOffeesError}
                                            id="amountOffees"
                                            name="amountOffees"
                                            onKeyUp={event => handlekey(
                                                "amountOffeesError",
                                                "amountOffeesTextError",
                                                "amountOffeesHide",
                                                1
                                            )}
                                            onChange={handleChange}
                                            value={modal.amountOffees}
                                            type="number"
                                            min="0"
                                            disabled={props.disabled}
                                        />
                                        <div className={`${modal.amountOffeesHide} errorControl`}>
                                            {modal.amountOffeesTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="arrayCycle">Ciclo de Tiempo</Label>
                                        <div className={modal.arrayCycleError}>
                                            <Select
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={false}
                                                name="arrayCycle"
                                                id="arrayCycle"
                                                value={modal.arrayCycle}
                                                onChange={event => handleChangeSelect(
                                                    event,
                                                    "arrayCycle",
                                                    "arrayCycleError",
                                                    "arrayCycleTextError",
                                                    "arrayCycleHide"
                                                )}
                                                options={modal.arrayCycleOptions}
                                            />
                                        </div>
                                        <div className={`${modal.arrayCycleHide} errorControl`}>
                                            {modal.arrayCycleTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="timeCycle">Cantidad</Label>
                                        <Input
                                            invalid={modal.timeCycleError}
                                            id="timeCycle"
                                            name="timeCycle"
                                            onKeyUp={event => handlekey(
                                                "timeCycleError",
                                                "timeCycleTextError",
                                                "timeCycleHide",
                                                1
                                            )}
                                            onChange={handleChange}
                                            value={modal.timeCycle}
                                            type="number"
                                            min="0"
                                            disabled={false}
                                        />
                                        <div className={`${modal.timeCycleHide} errorControl`}>
                                            {modal.timeCycleTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="interestPercentage">Interes</Label>
                                        <Input
                                            invalid={modal.interestPercentageError}
                                            id="interestPercentage"
                                            name="interestPercentage"
                                            onKeyUp={event => handlekey(
                                                "interestPercentageError",
                                                "interestPercentageTextArea",
                                                "interestPercentageHide",
                                                1
                                            )}
                                            onChange={handleChange}
                                            value={modal.interestPercentage}
                                            type="number"
                                            min="0"
                                            disabled={false}
                                        />
                                        <div className={`${modal.interestPercentageHide} errorControl`}>
                                            {modal.interestPercentageTextArea}
                                        </div>
                                    </div>
                                </FormGroup>
                            </div>
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
                                onClick={addCredit}
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
)(ModalCredit);