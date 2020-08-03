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
import { saveDepartamentsAction, updateDepartamentsAction } from "../../../actions/DepartamentsActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
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
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        });
    };

    handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        this.setState({
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        });
    };

    handleChangeSwitch = (name, error, textError, hide, option) => event => {
        this.setState({
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',

        });
    };

    validate = () => {
        let acum = "";
        if (this.state.name === '') {
            this.setState({
                nameError: true,
                nameTextError: 'Ingrese el nombre',
                nameHide: 'show'
            });
            acum = 1;
        }
        if (!this.state.description) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Ingrese la descripcion',
                descriptionHide: 'show',
            });
        }
        if (this.state.description.length < 16) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionHide: 'show',
            });
            acum = 1;
        }
        if ((this.state.belongsDepartament) && (this.state.arrayDepartaments === null)) {
            this.setState({
                arrayDepartamentsError: "borderColor",
                arrayDepartamentsTextError: 'Seleccione un departamento',
                arrayDepartamentsHide: 'show',
            });
            acum = 1;
        }
        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveDepartament = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveDepartamentsAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        department_id: this.state.arrayDepartaments ? this.state.arrayDepartaments.value : null,
                    },
                    () => {
                        this.closeModal(1);
                    }
                );
            }
            if (this.props.option === 3) {
                this.props.updateDepartamentsAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        department_id: this.state.arrayDepartaments ? this.state.arrayDepartaments.value : null,
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
                    this.props.valorCloseModal(false);
                }
            });
        } else {
            this.setState({
                ...stateInitial
            });
            this.props.valorCloseModal(false);
        }
    };

    cargarData(data) {
        this.setState({
            name: data.name,
            description: data.description,
            belongsDepartament: data.parent ? true : false,
            arrayDepartaments: data.parent,
            loading: 'hide',
            actionReducer: 1,
        });
    }

    componentDidMount() {
        if (this.props.option === 1) {
            this.setState({
                loading: "hide",
            });
        }
    }

    componentWillReceiveProps = props => {
        if (props.option === 2 || props.option === 3) {
            if (props.departaments.departamentId && this.state.actionReducer === 0) {
                this.cargarData(props.departaments.departamentId);
            }
        }
    }

    render() {

        return (
            <Dialog
                fullWidth={true}
                maxWidth="sm"
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
                                <FormGroup className="top form-group col-sm-12">
                                    <div>
                                        <Label for="name">Nombre</Label>
                                        <Input
                                            invalid={this.state.nameError}
                                            id="name"
                                            name="name"
                                            onKeyUp={event => this.handlekey(
                                                "nameError",
                                                "nameTextError",
                                                "nameHide",
                                                1
                                            )}
                                            onChange={this.handleChange}
                                            value={this.state.name}
                                            type="text"
                                            disabled={this.props.disabled}
                                        />
                                        <div className={`${this.state.nameHide} errorControl`}>
                                            {this.state.nameTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <div>
                                        <Label for="description">Descripcion</Label>
                                        <Input
                                            invalid={this.state.descriptionError}
                                            id="description"
                                            name="description"
                                            onKeyUp={event => this.handlekey(
                                                "descriptionError",
                                                "descriptionTextError",
                                                "descriptionHide",
                                                1
                                            )}
                                            onChange={this.handleChange}
                                            value={this.state.description}
                                            type="textarea"
                                            disabled={this.props.disabled}
                                        />
                                        <div className={`${this.state.descriptionHide} errorControl`}>
                                            {this.state.descriptionTextError}
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup check className="top form-group col-sm-12">
                                    <Label for="gerente">¿Pertenece a un departamento?</Label>
                                    <Switch
                                        checked={this.state.belongsDepartament ? this.state.belongsDepartament : false}
                                        onChange={this.handleChangeSwitch(
                                            "belongsDepartament",
                                            "arrayDepartamentsError",
                                            "arrayDepartamentsTextError",
                                            "arrayDepartamentsHide",
                                            2,
                                        )}
                                        value={this.state.belongsDepartament}
                                        color="primary"
                                        disabled={this.props.disabled}
                                    />
                                </FormGroup>
                                {
                                    this.state.belongsDepartament && (
                                        <FormGroup className="top form-group col-sm-12">
                                            <div>
                                                <Label for="arrayDepartaments">Departamento</Label>
                                                <div className={this.state.arrayDepartamentsError}>
                                                    <Select
                                                        isClearable
                                                        isSearchable
                                                        isDisabled={this.props.disabled}
                                                        name="arrayDepartaments"
                                                        id="arrayDepartaments"
                                                        value={this.state.arrayDepartaments}
                                                        onChange={event => this.handleChangeSelect(
                                                            event,
                                                            "arrayDepartaments",
                                                            "arrayDepartamentsError",
                                                            "arrayDepartamentsTextError",
                                                            "arrayDepartamentsHide"
                                                        )}
                                                        options={this.props.dataGeneral.dataDepartaments}
                                                    />
                                                </div>
                                                <div className={`${this.state.arrayDepartamentsHide} errorControl`}>
                                                    {this.state.arrayDepartamentsTextError}
                                                </div>
                                            </div>
                                        </FormGroup>
                                    )
                                }
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
                                    onClick={this.handleSaveDepartament}
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
                    )}
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    departaments: state.departaments.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveDepartamentsAction: (data, callback) => dispatch(saveDepartamentsAction(data, callback)),
    updateDepartamentsAction: (data, callback) => dispatch(updateDepartamentsAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);