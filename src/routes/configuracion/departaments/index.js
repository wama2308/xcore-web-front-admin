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
    LoadDepartamentsAction,
    allDepartamentsFunction,
    allDepartamentsDisabledFunction,
    loadDepartamentsIdAction,
    changeEstatusDepartamentsFunction,
    cleanStoreFunction,
}
    from "../../../actions/DepartamentsActions"
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

class Departaments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.departaments.actionDisable === 0) {
            this.props.allDepartamentsDisabledFunction(1, 10, "");
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
        this.props.LoadDepartamentsAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Departamentos")
        // console.log("departaments ", this.props.departaments)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.departaments.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Departamentos</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionDepartaments" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Departamentos Activos" {...a11yProps(0)} />
                                    <Tab label="Departamentos Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.departaments.data}
                                        pagination={this.props.departaments.pagination}
                                        allDepartamentsFunction={this.props.allDepartamentsFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusDepartamentsFunction={this.props.changeEstatusDepartamentsFunction}
                                        loadDepartamentsIdAction={this.props.loadDepartamentsIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.departaments.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Departamentos")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.departaments.dataDisabled}
                                        pagination={this.props.departaments.paginationDisabled}
                                        allDepartamentsDisabledFunction={this.props.allDepartamentsDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusDepartamentsFunction={this.props.changeEstatusDepartamentsFunction}
                                        loading={this.props.departaments.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Departamentos")}
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
    departaments: state.departaments.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadDepartamentsAction: () => dispatch(LoadDepartamentsAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadDepartamentsIdAction: (id) => dispatch(loadDepartamentsIdAction(id)),
    changeEstatusDepartamentsFunction: (id) => dispatch(changeEstatusDepartamentsFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allDepartamentsFunction: (page, perPage, search) => dispatch(allDepartamentsFunction(page, perPage, search)),
    allDepartamentsDisabledFunction: (page, perPage, search) => dispatch(allDepartamentsDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Departaments);