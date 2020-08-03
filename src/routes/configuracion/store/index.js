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
    LoadStoreAction,
    allStoreFunction,
    allStoreDisabledFunction,
    loadStoreIdAction,
    changeEstatusStoreFunction,
    cleanStoreFunction,
}
    from "../../../actions/StoreActions"
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

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.store.actionDisable === 0) {
            this.props.allStoreDisabledFunction(1, 10, "");
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
        this.props.LoadStoreAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Almacen")
        // console.log("store ", this.props.store)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.store.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Almacenes</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionStore" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Almacenes Activos" {...a11yProps(0)} />
                                    <Tab label="Almacenes Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.store.data}
                                        pagination={this.props.store.pagination}
                                        allStoreFunction={this.props.allStoreFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusStoreFunction={this.props.changeEstatusStoreFunction}
                                        loadStoreIdAction={this.props.loadStoreIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.store.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Almacen")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.store.dataDisabled}
                                        pagination={this.props.store.paginationDisabled}
                                        allStoreDisabledFunction={this.props.allStoreDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusStoreFunction={this.props.changeEstatusStoreFunction}
                                        loading={this.props.store.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Almacen")}
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
    store: state.store.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadStoreAction: () => dispatch(LoadStoreAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadStoreIdAction: (id) => dispatch(loadStoreIdAction(id)),
    changeEstatusStoreFunction: (id) => dispatch(changeEstatusStoreFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allStoreFunction: (page, perPage, search) => dispatch(allStoreFunction(page, perPage, search)),
    allStoreDisabledFunction: (page, perPage, search) => dispatch(allStoreDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Store);