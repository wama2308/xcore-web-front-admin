import React from "react";
import {
    Button,
    Input,    
    FormGroup,
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import {
    checkedTreeFunction,
    expandedTreeFunction,
    checkedAllTreeFunction,
    searchModulesRolsFunction,
    cleanStoreNewRolUSerFunction,
} from "../../../actions/aplicantionActions"
import { saveRolsAction } from "../../../actions/RolsActions"
import { connect } from "react-redux";
import { stateInitial } from '../rols/StateInitial';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
import Checkbox from '@material-ui/core/Checkbox';

class NewRol extends React.Component {
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
            return false;
        }
        return true;
    };

    handleSaveRol = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.setState({ loading: "show" });
            this.props.saveRolsAction(
                {
                    name: this.state.name,
                    description: this.state.description,
                    modules: this.props.dataGeneral.checked,
                },
                () => {
                    this.cleanForm();
                },
                1
            );
        }
    }

    cleanForm = () => {
        this.setState({
            ...stateInitial
        });
        this.props.cleanStoreNewRolUSerFunction(0);
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

    render() {
        // console.log(this.state.checked);
        // console.log(this.state.expanded);
        return (
            <div>
                <div className='row'>
                    <FormGroup className="top form-group col-sm-6">
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
                    <FormGroup className="top form-group col-sm-6">
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
                    <FormGroup className="top form-group col-sm-6">
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
                                    disabled={this.props.disabled}   
                                    checked={this.state.checkedAll}
                                    onChange={this.handleChangeCheckAll}
                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                />
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup className="top form-group col-sm-12">
                        <div style={{ marginLeft: 'auto' }}>
                            <Button
                                variant="contained"
                                onClick={this.cleanForm}
                                color="danger"
                                className="text-white"
                                style={{ marginRight: '5px' }}
                                disabled={this.props.disabled}   
                            >
                                Limpiar
                            </Button>
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                onClick={this.handleSaveRol}
                                disabled={this.props.disabled}   
                            >
                                Guardar
                            </Button>
                        </div>
                    </FormGroup>
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
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    users: state.users.toJS(),
    rols: state.rols.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveRolsAction: (data, callback, option) => dispatch(saveRolsAction(data, callback, option)),
    checkedTreeFunction: (data, option) => dispatch(checkedTreeFunction(data, option)),
    expandedTreeFunction: (data, option) => dispatch(expandedTreeFunction(data, option)),
    checkedAllTreeFunction: (data, option) => dispatch(checkedAllTreeFunction(data, option)),
    searchModulesRolsFunction: (data, option) => dispatch(searchModulesRolsFunction(data, option)),
    cleanStoreNewRolUSerFunction: (option) => dispatch(cleanStoreNewRolUSerFunction(option)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewRol);