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
    LoadPackagesAction,
    allPackagesFunction,
    allPackagesDisabledFunction,
    loadPackagesIdAction,
    changeEstatusPackagesFunction,
    cleanStoreFunction,
    modalFunction,
    dataExtraPackages
}
    from "../../../actions/PackagesActions"
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

class Packages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.packages.actionDisable === 0) {
            this.props.allPackagesDisabledFunction(1, 10, "");
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
        this.props.LoadPackagesAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Paquetes")
        // console.log("packages ", this.props.packages)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.packages.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Paquetes</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionPackages" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Paquetes Activos" {...a11yProps(0)} />
                                    <Tab label="Paquetes Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.packages.data}
                                        pagination={this.props.packages.pagination}
                                        allPackagesFunction={this.props.allPackagesFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusPackagesFunction={this.props.changeEstatusPackagesFunction}
                                        loadPackagesIdAction={this.props.loadPackagesIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.packages.loading}
                                        modalFunction={this.props.modalFunction}                                        
                                        dataExtraPackages={this.props.dataExtraPackages}     
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Paquetes")}                                   
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.packages.dataDisabled}
                                        pagination={this.props.packages.paginationDisabled}
                                        allPackagesDisabledFunction={this.props.allPackagesDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusPackagesFunction={this.props.changeEstatusPackagesFunction}
                                        loading={this.props.packages.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Paquetes")}
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
    packages: state.packages.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadPackagesAction: () => dispatch(LoadPackagesAction()),
    dataExtraPackages: () => dispatch(dataExtraPackages()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadPackagesIdAction: (id) => dispatch(loadPackagesIdAction(id)),
    changeEstatusPackagesFunction: (id) => dispatch(changeEstatusPackagesFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    modalFunction: (option, data) => dispatch(modalFunction(option, data)),
    allPackagesFunction: (page, perPage, search) => dispatch(allPackagesFunction(page, perPage, search)),
    allPackagesDisabledFunction: (page, perPage, search) => dispatch(allPackagesDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Packages);