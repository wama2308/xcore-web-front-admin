import React, { Fragment, useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Alert,
} from "reactstrap";
import "../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import Select from "react-select";
import { NotificationManager } from 'react-notifications';

const ModalChangeBranchPerfil = props => {
    const [loading, setLoading] = useState("show");
    const [arrayBussines, setArrayBussines] = useState(null);
    const [arrayBranchOffices, setArrayBranchOffices] = useState(null);
    const [arrayOptionsBranchOffices, setArrayOptionsBranchOffices] = useState([]);
    const [arrayPerfil, setArrayPerfil] = useState(null);

    const closeModal = () => {
        setLoading("show");
        props.valorCloseModal(false);
    };

    const changeAction = () => {
        const message = {
            title: props.option === 0 ? "Cambio de Sucursal" : "Cambio de Perfil",
            info: props.option === 0 ? "¿Esta seguro que desea cambiar de sucursal?" :
                "¿Esta seguro que desea cambiar de perfil?"
        };
        props.confirm(message, res => {
            if (res) {
                props.option === 0 ?
                    props.changeBusinessBranchOfficesMenu(arrayBussines.value, arrayBranchOffices.value, 1) :
                    props.changePerfilMenu(arrayPerfil.clientDefault);
                closeModal();
            }
        });
    };

    const handleChangeSelect = (value, select) => {
        if (value && select === "arrayBussines" && value !== arrayBussines) {
            setArrayBussines(value)
            setArrayOptionsBranchOffices(value.branchOffices)
            setArrayBranchOffices(value.branchOffices[0]);
        }
        if (value && select === "arrayBranchOffices" && value !== arrayBranchOffices) {
            setArrayBranchOffices(value)
        }
        if (value && select === "arrayPerfil" && value !== arrayPerfil) {
            setArrayPerfil(value)
        }
    };

    useEffect(() => {
        if (props.modal) {
            setLoading("hide")
            let businessValue = props.business.find(data => data.value === localStorage.getItem("business_default"));
            let branchOfficesValue = businessValue.branchOffices.find(data => data.value === localStorage.getItem("branch_office_default"));
            setArrayBussines(businessValue);
            setArrayOptionsBranchOffices(businessValue.branchOffices);
            setArrayBranchOffices(branchOfficesValue);
            setArrayPerfil(props.carets.arrayPerfil.find(data => data.value === true));

        } else {
            setLoading("show")
        }
    }, [])

    //console.log(props)

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={props.modal}
            onClose={closeModal}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
            {loading === "hide" ? (
                <div>
                    <DialogTitle id="form-dialog-title">
                        <div style={{ display: 'flex' }}>
                            {
                                props.option === 0 ?
                                    <div>
                                        {props.carets.businessCaret} -  {props.carets.branchOfficeCaret}
                                    </div>
                                    :
                                    <div>
                                        {props.carets.perfilCaret}
                                    </div>
                            }
                            <div style={{ marginLeft: 'auto' }}>
                                <IconButton aria-label="Delete"
                                    className="iconButtons"
                                    onClick={closeModal}
                                >
                                    <Close className="iconTable" />
                                </IconButton>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent dividers>

                        {
                            props.option === 0 ?
                                <Form>
                                    <FormGroup className="top form-group col-sm-12">
                                        <div>
                                            <Alert color="secondary">
                                                Empresa: {props.carets.businessCaret}
                                            </Alert>
                                            <Alert color="secondary">
                                                Sucursal: {props.carets.branchOfficeCaret}
                                            </Alert>
                                        </div>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup className="top form-group col-sm-12">
                                        <div>
                                            <Label for="arrayBussines">Empresa</Label>
                                            <Select
                                                isClearable={false}
                                                isSearchable
                                                isDisabled={props.disabled}
                                                name="arrayBussines"
                                                id="arrayBussines"
                                                value={arrayBussines}
                                                onChange={event => handleChangeSelect(event, 'arrayBussines')}
                                                options={props.business}
                                            />
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-12">
                                        <div>
                                            <Label for="arrayBranchOffices">Sucursal</Label>
                                            <Select
                                                isClearable={false}
                                                isSearchable
                                                isDisabled={props.disabled}
                                                name="arrayBranchOffices"
                                                id="arrayBranchOffices"
                                                value={arrayBranchOffices}
                                                onChange={event => handleChangeSelect(event, 'arrayBranchOffices')}
                                                options={arrayOptionsBranchOffices}
                                            />
                                        </div>
                                    </FormGroup>
                                </Form>
                                :
                                <Form>
                                    <FormGroup className="top form-group col-sm-12">
                                        <div>
                                            <Alert color="secondary">
                                                Perfil: {props.carets.perfilCaret}
                                            </Alert>
                                        </div>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup className="top form-group col-sm-12">
                                        <div>
                                            <Label for="arrayPerfil">Perfil</Label>
                                            <Select
                                                isClearable={false}
                                                isSearchable
                                                isDisabled={props.disabled}
                                                name="arrayPerfil"
                                                id="arrayPerfil"
                                                value={arrayPerfil}
                                                onChange={event => handleChangeSelect(event, 'arrayPerfil')}
                                                options={props.carets.arrayPerfil}
                                            />
                                        </div>
                                    </FormGroup>
                                </Form>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={closeModal} color="danger" className="text-white">
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            className="text-white"
                            variant="contained"
                            onClick={changeAction}
                        >
                            Aceptar
                        </Button>
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
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    // saveCargosAction: (data, callback) => dispatch(saveCargosAction(data, callback)),
    // updateCargosAction: (data, callback) => dispatch(updateCargosAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalChangeBranchPerfil);