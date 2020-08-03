import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import ListPlanes from "./ListPlanes";
import ListPlanesDisabled from "./ListPlanesDisabled";
import {
    LoadPlanesAction,
    cambiarEstatusPlanFunction,
    loadPlanIdAction,
    cleanStoreFunction,
    allPlanesFunction,
    allPlanesDisabledFunction,
}
    from "../../../actions/PlanesActions"
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, useTheme } from '@material-ui/core/styles';
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

class Planes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.plan.actionDisable === 0) {
            this.props.allPlanesDisabledFunction(1, 10, "");
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
        this.props.LoadPlanesAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Planes")
        // console.log(this.props.plan)
        // console.log(this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.plan.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Planes</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionPlanes" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Planes Activos" {...a11yProps(0)} />
                                    <Tab label="Planes Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <ListPlanes
                                        data={this.props.plan.data}
                                        pagination={this.props.plan.pagination}
                                        allPlanesFunction={this.props.allPlanesFunction}
                                        dataPenalties={this.props.plan.dataPenalties}
                                        countryConfiguration={this.props.dataGeneral.countryConfiguration}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        cambiarEstatusPlanFunction={this.props.cambiarEstatusPlanFunction}
                                        loadPlanIdAction={this.props.loadPlanIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.plan.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Planes")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListPlanesDisabled
                                        data={this.props.plan.dataDisabled}
                                        pagination={this.props.plan.paginationDisabled}
                                        allPlanesDisabledFunction={this.props.allPlanesDisabledFunction}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        cambiarEstatusPlanFunction={this.props.cambiarEstatusPlanFunction}
                                        loading={this.props.plan.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Planes")}
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
    plan: state.plan.toJS(),
    searchData: state.general.search,
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadPlanesAction: () => dispatch(LoadPlanesAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadPlanIdAction: (id) => dispatch(loadPlanIdAction(id)),
    cambiarEstatusPlanFunction: (id) => dispatch(cambiarEstatusPlanFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allPlanesFunction: (page, perPage, search) => dispatch(allPlanesFunction(page, perPage, search)),
    allPlanesDisabledFunction: (page, perPage, search) => dispatch(allPlanesDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Planes);