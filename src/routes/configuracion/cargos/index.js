import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import List from "./List";
import ListDisabled from "./ListDisabled";
import {
    LoadCargosAction,
    allCargosFunction,
    allCargosDisabledFunction,
    loadCargosIdAction,
    changeEstatusCargosFunction,
    cleanStoreFunction,
}
    from "../../../actions/CargosActions"
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { openConfirmDialog } from "../../../actions/aplicantionActions"
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
}));

const Cargos = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        // if (Object.keys(props.cargos).length === 0) {}
        props.LoadCargosAction();        
    }, [])

    const handleChange = (event, newValue) => {
        if (newValue === 1 && props.cargos.actionDisable === 0) {
            props.allCargosDisabledFunction(1, 10, "");
        }
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const verEliminados = permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Posiciones")
    return (
        <div className="blank-wrapper">
            {
                props.cargos.data ?
                    <div>
                        <Helmet>
                            <title>XCORE - Cargos</title>
                            <meta name="description" content="Reactify Blank Page" />
                        </Helmet>
                        <PageTitleBar title={<IntlMessages id="sidebar.configuracionPositions" />} match={props.match} />
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Cargos Activos" {...a11yProps(0)} />
                                <Tab label="Cargos Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <List
                                    data={props.cargos.data}
                                    pagination={props.cargos.pagination}
                                    allCargosFunction={props.allCargosFunction}
                                    confirm={props.confirm}
                                    changeEstatusCargosFunction={props.changeEstatusCargosFunction}
                                    loadCargosIdAction={props.loadCargosIdAction}
                                    cleanStoreFunction={props.cleanStoreFunction}
                                    loading={props.cargos.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Posiciones")}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <ListDisabled
                                    data={props.cargos.dataDisabled}
                                    pagination={props.cargos.paginationDisabled}
                                    allCargosDisabledFunction={props.allCargosDisabledFunction}
                                    confirm={props.confirm}
                                    changeEstatusCargosFunction={props.changeEstatusCargosFunction}
                                    loading={props.cargos.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Posiciones")}
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

const mapStateToProps = state => ({
    cargos: state.cargos.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadCargosAction: () => dispatch(LoadCargosAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadCargosIdAction: (id) => dispatch(loadCargosIdAction(id)),
    changeEstatusCargosFunction: (id) => dispatch(changeEstatusCargosFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allCargosFunction: (page, perPage, search) => dispatch(allCargosFunction(page, perPage, search)),
    allCargosDisabledFunction: (page, perPage, search) => dispatch(allCargosDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cargos);