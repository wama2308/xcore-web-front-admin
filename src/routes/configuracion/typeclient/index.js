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
    LoadTypeClientAction,
    allTypeClientFunction,
    allTypeClientDisabledFunction,
    loadTypeClientIdAction,
    changeEstatusTypeClientFunction,
    cleanStoreFunction,
}
    from "../../../actions/TypeClientActions"
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

class TypeClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.typeClients.actionDisable === 0) {
            this.props.allTypeClientDisabledFunction(1, 10, "");
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
        this.props.LoadTypeClientAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Tipo de Cliente")
        // console.log("typeClients ", this.props.typeClients)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.typeClients.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Tipos de Clientes</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionTypeclient" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Tipos de Clientes Activos" {...a11yProps(0)} />
                                    <Tab label="Tipos de Clientes Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.typeClients.data}
                                        pagination={this.props.typeClients.pagination}
                                        allTypeClientFunction={this.props.allTypeClientFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusTypeClientFunction={this.props.changeEstatusTypeClientFunction}
                                        loadTypeClientIdAction={this.props.loadTypeClientIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.typeClients.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Tipo de Cliente")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.typeClients.dataDisabled}
                                        pagination={this.props.typeClients.paginationDisabled}
                                        allTypeClientDisabledFunction={this.props.allTypeClientDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusTypeClientFunction={this.props.changeEstatusTypeClientFunction}
                                        loading={this.props.typeClients.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Tipo de Cliente")}
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
    typeClients: state.typeClients.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadTypeClientAction: () => dispatch(LoadTypeClientAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadTypeClientIdAction: (id) => dispatch(loadTypeClientIdAction(id)),
    changeEstatusTypeClientFunction: (id) => dispatch(changeEstatusTypeClientFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allTypeClientFunction: (page, perPage, search) => dispatch(allTypeClientFunction(page, perPage, search)),
    allTypeClientDisabledFunction: (page, perPage, search) => dispatch(allTypeClientDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TypeClient);