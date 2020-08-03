import React from "react";
import {
    Button,
    Input,
    Form,
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
import { connect } from "react-redux";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
import Checkbox from '@material-ui/core/Checkbox';

class PermitsSpecials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchModules: '',
            checkedAll: false,
        };
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
        if (name === 'searchModules') {
            this.props.searchModulesRolsFunction(value, 1);
        }
    };

    cleanForm = () => {
        this.setState({
            searchModules: '',
            checkedAll: false,
        });
        this.props.cleanStoreNewRolUSerFunction(1);
    };

    checkedTree = (checked) => {
        this.props.checkedTreeFunction(checked, 1);
    }

    expandedTree = (expanded) => {
        this.props.expandedTreeFunction(expanded, 1);
    }

    handleChangeCheckAll = (event) => {
        this.props.checkedAllTreeFunction(event.target.checked, 1);
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
                            <div className="">
                                <CheckboxTree
                                    nodes={this.props.dataGeneral.dataModulesPermitsSpecials}
                                    checked={this.props.dataGeneral.checkedSpecials}
                                    expanded={this.props.dataGeneral.expandedSpecials}
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
                                disabled={this.props.disabled}   
                            >
                                Limpiar
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
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    checkedTreeFunction: (data, option) => dispatch(checkedTreeFunction(data, option)),
    expandedTreeFunction: (data, option) => dispatch(expandedTreeFunction(data, option)),
    checkedAllTreeFunction: (data, option) => dispatch(checkedAllTreeFunction(data, option)),
    searchModulesRolsFunction: (data, option) => dispatch(searchModulesRolsFunction(data, option)),
    cleanStoreNewRolUSerFunction: (option) => dispatch(cleanStoreNewRolUSerFunction(option)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PermitsSpecials);