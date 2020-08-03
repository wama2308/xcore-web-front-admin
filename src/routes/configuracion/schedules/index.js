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
    LoadSchedulesAction,
    allSchedulesFunction,
    allSchedulesDisabledFunction,
    loadScheduleIdAction,
    changeEstatusScheduleFunction,
    cleanStoreFunction,
}
    from "../../../actions/ScheduleActions"
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

class Schedules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.schedules.actionDisable === 0) {
            this.props.allSchedulesDisabledFunction(1, 10, "");
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
        this.props.LoadSchedulesAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Horarios")
        // console.log("schedules ", this.props.schedules)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.schedules.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Horarios</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionSchedules" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Horarios Activos" {...a11yProps(0)} />
                                    <Tab label="Horarios Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.schedules.data}
                                        pagination={this.props.schedules.pagination}
                                        allSchedulesFunction={this.props.allSchedulesFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusScheduleFunction={this.props.changeEstatusScheduleFunction}
                                        loadScheduleIdAction={this.props.loadScheduleIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.schedules.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Horarios")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.schedules.dataDisabled}
                                        pagination={this.props.schedules.paginationDisabled}
                                        allSchedulesDisabledFunction={this.props.allSchedulesDisabledFunction}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        changeEstatusScheduleFunction={this.props.changeEstatusScheduleFunction}
                                        loading={this.props.schedules.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Horarios")}
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
    schedules: state.schedules.toJS(),
    searchData: state.general.search,
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadSchedulesAction: () => dispatch(LoadSchedulesAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadScheduleIdAction: (id) => dispatch(loadScheduleIdAction(id)),
    changeEstatusScheduleFunction: (id) => dispatch(changeEstatusScheduleFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allSchedulesFunction: (page, perPage, search) => dispatch(allSchedulesFunction(page, perPage, search)),
    allSchedulesDisabledFunction: (page, perPage, search) => dispatch(allSchedulesDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Schedules);