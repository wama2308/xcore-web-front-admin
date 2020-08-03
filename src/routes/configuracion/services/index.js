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
    LoadServicesAction,
    allServicesFunction,
    allServicesDisabledFunction,
    loadServiceIdAction,
    changeEstatusServiceFunction,
    cleanStoreFunction,
}
    from "../../../actions/ServicesConfigurationActions"
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

class ServicesConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.services.actionDisable === 0) {
            this.props.allServicesDisabledFunction(1, 10, "");
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
        this.props.LoadServicesAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Servicios")
        // console.log("servicios ", this.props.services)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.services.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Servicios</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionServices" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Servicios Activos" {...a11yProps(0)} />
                                    <Tab label="Servicios Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.services.data}
                                        pagination={this.props.services.pagination}
                                        allServicesFunction={this.props.allServicesFunction}
                                        dataPenalties={this.props.dataGeneral.dataPenalties}
                                        countryConfiguration={this.props.dataGeneral.countryConfiguration}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        changeEstatusServiceFunction={this.props.changeEstatusServiceFunction}
                                        loadServiceIdAction={this.props.loadServiceIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.services.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Servicios")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.services.dataDisabled}
                                        pagination={this.props.services.paginationDisabled}
                                        allServicesDisabledFunction={this.props.allServicesDisabledFunction}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        changeEstatusServiceFunction={this.props.changeEstatusServiceFunction}
                                        loading={this.props.services.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Servicios")}
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
    services: state.services.toJS(),
    searchData: state.general.search,
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadServicesAction: () => dispatch(LoadServicesAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadServiceIdAction: (id) => dispatch(loadServiceIdAction(id)),
    changeEstatusServiceFunction: (id) => dispatch(changeEstatusServiceFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allServicesFunction: (page, perPage, search) => dispatch(allServicesFunction(page, perPage, search)),
    allServicesDisabledFunction: (page, perPage, search) => dispatch(allServicesDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ServicesConfiguration);