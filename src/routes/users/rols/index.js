import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import List from "./List";
import ListDisabled from "./ListDisabled";
import {
    LoadRolsAction,
    allRolsFunction,
    allRolsDisabledFunction,
    loadRolsIdAction,
    changeEstatusRolsFunction,
    cleanStoreFunction,
}
    from "../../../actions/RolsActions"
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { openConfirmDialog } from "../../../actions/aplicantionActions"
import { permitsMenu, GetDisabledPermits } from "../../../helpers/helpers";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

class Rols extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.rols.actionDisable === 0) {
            this.props.allRolsDisabledFunction(1, 10, "");
        }
        this.setState({
            value: newValue
        });
    }

    handleChangeIndex = (newValue) => {
        this.setState({
            value: newValue
        });
    }

    componentDidMount = () => {
        this.props.LoadRolsAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Usuarios", "Roles")
        //console.log("rols ", this.props.rols)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.rols.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Roles</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionRols" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Roles Activos" {...a11yProps(0)} />
                                    <Tab label="Roles Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.rols.data}
                                        pagination={this.props.rols.pagination}
                                        allRolsFunction={this.props.allRolsFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusRolsFunction={this.props.changeEstatusRolsFunction}
                                        loadRolsIdAction={this.props.loadRolsIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.rols.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Usuarios", "Roles")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.rols.dataDisabled}
                                        pagination={this.props.rols.paginationDisabled}
                                        allRolsDisabledFunction={this.props.allRolsDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusRolsFunction={this.props.changeEstatusRolsFunction}
                                        loading={this.props.rols.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Usuarios", "Roles")}
                                    />
                                </TabPanel>
                            </SwipeableViews>
                        </div>
                        :
                        <div style={{ height: "60vh" }}>
                            <CircularProgress style={{ position: " absolute", height: 40, top: "45%", right: "50%", zIndex: 2 }} />
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rols: state.rols.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadRolsAction: () => dispatch(LoadRolsAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadRolsIdAction: (id) => dispatch(loadRolsIdAction(id)),
    changeEstatusRolsFunction: (id) => dispatch(changeEstatusRolsFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allRolsFunction: (page, perPage, search) => dispatch(allRolsFunction(page, perPage, search)),
    allRolsDisabledFunction: (page, perPage, search) => dispatch(allRolsDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Rols);