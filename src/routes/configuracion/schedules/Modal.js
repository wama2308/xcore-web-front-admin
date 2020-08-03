import React from "react";
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
import { saveScheduleAction, updateScheduleAction } from "../../../actions/ScheduleActions"
import { connect } from "react-redux";
import ScheduleComponent from "../../../components/IS7Schedule";
import { stateInitial } from './StateInitial';
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...stateInitial
        };
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekey(campoError, campoErrorText, hide, type) {
        this.setState({
            [campoError]: false,
            [campoErrorText]: "",
            [hide]: "hide",
        });
    };

    handleChangeSchedule = (items, item) => {
        this.setState({
            selectionsSchedule: items,
            scheduleTextError: ''
        });
    }

    validateSchedule = () => {
        let acum = "";
        if (this.state.nameSchedule === '') {
            this.setState({
                nameScheduleError: true,
                nameScheduleTextError: 'Ingrese el nombre del horario',
                nameScheduleHide: 'show'
            });
            acum = 1;
        }
        if (this.state.selectionsSchedule === null || this.state.selectionsSchedule.length === 0) {
            this.setState({
                scheduleTextError: "¡Debe seleccionar un horario!",
            });
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveSchedule = event => {
        event.preventDefault();
        const isValid = this.validateSchedule();
        if (isValid) {
            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveScheduleAction(
                    {
                        name: this.state.nameSchedule,
                        items: this.state.selectionsSchedule,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateScheduleAction(
                    {
                        id: this.props.data._id,
                        name: this.state.nameSchedule,
                        items: this.state.selectionsSchedule,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
        }
    }

    closeModal = (option) => {
        if (option === 0) {
            const message = {
                title: "Cerrar Ventana",
                info: "¿Esta seguro que desea cerrar la ventana?"
            };
            this.props.confirm(message, res => {
                if (res) {
                    this.setState({
                        ...stateInitial
                    });
                    this.props.valorCloseModal();
                }
            });
        } else {
            this.setState({
                ...stateInitial
            });
            this.props.valorCloseModal();
        }
    };

    componentDidMount() {
        if (this.props.option === 1) {
            this.setState({
                loading: "hide",
            });
        }
    }

    componentWillReceiveProps = props => {
        if (props.option === 2 || props.option === 3) {
            if (props.schedules.scheduleId && this.state.actionReducer === 0) {
                this.cargarData(props.schedules.scheduleId);
            }
        }
    }

    cargarData(data) {
        this.setState({
            nameSchedule: data.name,
            selectionsSchedule: data.items,
            loading: 'hide',
            actionReducer: 1,
        });
    }


    render() {
        //console.log("modal ", this.state.selectionsSchedule)
        return (
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={this.props.modal}
                onClose={() => { this.closeModal(0); }}
                aria-labelledby="responsive-dialog-title"
                scroll="paper"
            >
                {this.state.loading === "hide" ? (
                    <div>
                        <DialogTitle id="form-dialog-title">
                            <div style={{ display: 'flex' }}>
                                <div>
                                    {this.props.modalHeader}
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <IconButton aria-label="Delete"
                                        className="iconButtons"
                                        onClick={() => { this.closeModal(0); }}
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
                                            <Label for="icono">Nombre del Horario</Label>
                                            <Input
                                                invalid={this.state.nameScheduleError}
                                                id="nameSchedule"
                                                name="nameSchedule"
                                                onKeyUp={event => this.handlekey(
                                                    "nameScheduleError",
                                                    "nameScheduleTextError",
                                                    "nameScheduleHide"
                                                )}
                                                onChange={this.handleChange}
                                                value={this.state.nameSchedule}
                                                type="text"
                                                disabled={this.props.disabled}
                                            />
                                            <div className={`${this.state.nameScheduleHide} errorControl`}>
                                                {this.state.nameScheduleTextError}
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="top form-group col-sm-12">
                                        <div style={{ width: '100%' }} className={`errorControl`}>
                                            {this.state.scheduleTextError}
                                        </div>
                                        <ScheduleComponent
                                            selections={this.state.selectionsSchedule}
                                            intervalsMinute={this.state.intervalsMinute}
                                            hoursStart={this.state.hoursStart}
                                            hoursEnd={this.state.hoursEnd}
                                            handleChange={this.handleChangeSchedule}
                                            disabled={false}
                                        />
                                    </FormGroup>
                                </div>
                            </Form>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => { this.closeModal(0); }} color="danger" className="text-white">
                                Cancel
                            </Button>
                            {
                                !this.props.showHide &&
                                <Button
                                    color="primary"
                                    className="text-white"
                                    variant="contained"
                                    onClick={this.handleSaveSchedule}
                                >
                                    {this.props.buttonFooter}
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
                    {/* {`
                    .schedule {
                        max-height: 400px;
                        overflow-y: auto;
                    }
                    .schedule .title {
                        background-color: #6a9af4;
                        color: #fff;
                        border-color: #6a9af4!important;
                        font-size: 14px;
                    }`} */}
                </style>
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    schedules: state.schedules.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveScheduleAction: (data, callback) => dispatch(saveScheduleAction(data, callback)),
    updateScheduleAction: (data, callback) => dispatch(updateScheduleAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);