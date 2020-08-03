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
import {
    saveRolsAction,
    updateRolsAction,
} from "../../../actions/RolsActions"
import {
    checkedTreeFunction,
    expandedTreeFunction,
    checkedAllTreeFunction,
    searchModulesRolsFunction,
} from "../../../actions/aplicantionActions"
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
import Checkbox from '@material-ui/core/Checkbox';
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
        if (name === 'searchModules') {
            this.props.searchModulesRolsFunction(value, 0);
        }
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
            acum = 1;
        }
        if (this.state.description.length < 16) {
            this.setState({
                descriptionError: true,
                descriptionTextError: 'Descripcion debe tener al menos 15 caracteres',
                descriptionHide: 'show',
            });
            acum = 1;
        }
        if (this.props.dataGeneral.checked.length === 0) {
            this.setState({
                modulosPermisosError: 'borderColor',
                modulosPermisosTextError: 'Debe seleccionar modulos y permisos',
                modulosPermisosHide: 'show',
            });
            acum = 1;
        }

        if (acum > 0) {
            NotificationManager.warning("¡Verifique los campos del formulario!");
            return false;
        }
        return true;
    };

    handleSaveRol = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.setState({ loading: "show" });
            if (this.props.option === 1) {
                this.props.saveRolsAction(
                    {
                        name: this.state.name,
                        description: this.state.description,
                        modules: this.props.dataGeneral.checked,
                    },
                    () => {
                        this.closeModal(1);
                    },
                    0
                );
            }
            if (this.props.option === 3) {
                this.props.updateRolsAction(
                    {
                        id: this.props.data._id,
                        name: this.state.name,
                        description: this.state.description,
                        modules: this.props.dataGeneral.checked,
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

    checkedTree = (checked) => {
        this.props.checkedTreeFunction(checked, 0);
        this.setState({
            modulosPermisosError: '',
            modulosPermisosTextError: '',
            modulosPermisosHide: 'hide'
        })
    }

    expandedTree = (expanded) => {
        this.props.expandedTreeFunction(expanded, 0);
    }

    handleChangeCheckAll = (event) => {
        this.props.checkedAllTreeFunction(event.target.checked, 0);
        this.setState({
            checkedAll: event.target.checked
        });
    };

    cargarData(data) {
        //console.log(data)
        this.setState({
            name: data.name,
            description: data.description,
            checked: data.modules,
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
            if (props.rols.rolId && this.state.actionReducer === 0) {
                this.cargarData(props.rols.rolId);
            }
        }
    }

    render() {
        // console.log(this.state.checked);
        // console.log(this.state.expanded);        
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
                                <FormGroup className="top form-group col-sm-12">
                                    <div>
                                        <Label for="checked">Modulos - Permisos</Label>
                                        <Input
                                            id="searchModules"
                                            name="searchModules"
                                            onChange={this.handleChange}
                                            value={this.state.searchModules}
                                            type="text"
                                            disabled={this.props.disabled}
                                            placeholder='Buscar...'
                                        />
                                        <br />
                                        <div className={this.state.modulosPermisosError}>
                                            <CheckboxTree
                                                nodes={this.props.dataGeneral.dataModulesPermits}
                                                checked={this.props.dataGeneral.checked}
                                                expanded={this.props.dataGeneral.expanded}
                                                onCheck={checked => this.checkedTree(checked)}
                                                onExpand={expanded => this.expandedTree(expanded)}
                                                icons={{
                                                    check: <span className="rct-icon rct-icon-check" />,
                                                    uncheck: <span className="rct-icon rct-icon-uncheck" />,
                                                    halfCheck: <span className="rct-icon rct-icon-half-check" />,
                                                    expandClose: <span className="rct-icon rct-icon-expand-close" />,
                                                    expandOpen: <span className="rct-icon rct-icon-expand-open" />,
                                                    expandAll: <span className="rct-icon rct-icon-expand-all" />,
                                                    collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
                                                    parentClose: <span className="" />,
                                                    parentOpen: <span className="" />,
                                                    leaf: <span className="" />,
                                                }}
                                                disabled={this.props.disabled}
                                            />
                                        </div>
                                        <div className={`${this.state.modulosPermisosHide} errorControl`}>
                                            {this.state.modulosPermisosTextError}
                                        </div>
                                        <div>
                                            <Label for="checkedAll">Todos</Label>
                                            <Checkbox
                                                checked={this.state.checkedAll}
                                                onChange={this.handleChangeCheckAll}
                                                inputProps={{ 'aria-label': 'checkbox with default color' }}
                                            />
                                        </div>
                                    </div>
                                </FormGroup>
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
                                    onClick={this.handleSaveRol}
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
                    {
                        `.rct-title {
                            margin-left: -15px;              
                            padding: 0 5px;
                        }`
                    }
                    {
                        `.MuiCheckbox-colorSecondary.Mui-checked {
                            color: #3674f7;
                        }`
                    }
                </style>
            </Dialog >
        );
    }
}
const mapStateToProps = state => ({
    rols: state.rols.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveRolsAction: (data, callback, option) => dispatch(saveRolsAction(data, callback, option)),
    updateRolsAction: (data, callback) => dispatch(updateRolsAction(data, callback)),
    checkedTreeFunction: (data, option) => dispatch(checkedTreeFunction(data, option)),
    expandedTreeFunction: (data, option) => dispatch(expandedTreeFunction(data, option)),
    checkedAllTreeFunction: (data, option) => dispatch(checkedAllTreeFunction(data, option)),
    searchModulesRolsFunction: (data, option) => dispatch(searchModulesRolsFunction(data, option)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);