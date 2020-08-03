import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import ListSucursales from "./ListSucursales";
import ListDisabled from "./ListDisabled";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    LoadSucursalesAction,
    limpiarContactosFunction,
    loadBranchOfficesIdAction,
    allBranchOfficesFunction,
    allBranchOfficesDisabledFunction,
}
    from "../../../actions/SucursalActions"
import { openConfirmDialog } from "../../../actions/aplicantionActions"
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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

class Empresa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if(newValue === 1 && this.props.sucursal.actionDisable === 0){
            this.props.allBranchOfficesDisabledFunction(1, 10, "");
        }
        this.setState({
            value: newValue
        });
    }

    handleChangeIndex = (newValue) => {
        console.log("aqui index")
        this.setState({
            value: newValue
        });
    }

    componentDidMount = () => {
        this.props.LoadSucursalesAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        //console.log(this.props.sucursal)
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Sucursales")
        return (
            <div className="blank-wrapper">
                {
                    this.props.sucursal.data && this.props.dataGeneral ?
                        <div>
                            <Helmet>
                                <title>XCORE - Sucursales</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionSucursal" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Sucursales Activas" {...a11yProps(0)} />
                                    <Tab label="Sucursales Inactivas" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <ListSucursales
                                        data={this.props.sucursal.data}
                                        pagination={this.props.sucursal.pagination}
                                        allBranchOfficesFunction={this.props.allBranchOfficesFunction}
                                        dataGeneral={this.props.dataGeneral}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        limpiarContactosFunction={this.props.limpiarContactosFunction}
                                        loadBranchOfficesIdAction={this.props.loadBranchOfficesIdAction}
                                        loading={this.props.sucursal.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Sucursales")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.sucursal.dataDisabled}
                                        pagination={this.props.sucursal.paginationDisabled}
                                        allBranchOfficesDisabledFunction={this.props.allBranchOfficesDisabledFunction}
                                        loading={this.props.sucursal.loading}                                        
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
    sucursal: state.sucursal.toJS(),
    searchData: state.general.search,
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadSucursalesAction: () => dispatch(LoadSucursalesAction()),
    limpiarContactosFunction: () => dispatch(limpiarContactosFunction()),
    loadBranchOfficesIdAction: (id) => dispatch(loadBranchOfficesIdAction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allBranchOfficesFunction: (page, perPage, search) => dispatch(allBranchOfficesFunction(page, perPage, search)),
    allBranchOfficesDisabledFunction: (page, perPage, search) => dispatch(allBranchOfficesDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Empresa);