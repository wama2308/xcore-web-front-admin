import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import ListProviderEnabled from "./ListProviderEnabled";
import ListProviderDisabled from "./ListProviderDisabled";
import {
    LoadProviderAction,
    allProviderFunction,
    allProviderDisabledFunction,
    loadProviderIdAction,
    changeEstatusProviderFunction,
    cleanStoreFunction,
}
    from "../../../actions/ProviderActions"
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

const Provider = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        // if (Object.keys(props.cargos).length === 0) {}
        props.LoadProviderAction();        
    }, [])

    const handleChange = (event, newValue) => {
        if (newValue === 1 && props.provider.actionDisable === 0) {
            props.allProviderDisabledFunction(1, 10, "");
        }
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const verEliminados = permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Proveedores")
    return (
        <div className="blank-wrapper">
            {
                props.provider.data ?
                    <div>
                        <Helmet>
                            <title>XCORE - Proveedores</title>
                            <meta name="description" content="Reactify Blank Page" />
                        </Helmet>
                        <PageTitleBar title={<IntlMessages id="sidebar.provider" />} match={props.match} />
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Proveedores Activos" {...a11yProps(0)} />
                                <Tab label="Proveedores Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <ListProviderEnabled
                                    data={props.provider.data}
                                    pagination={props.provider.pagination}
                                    allProviderFunction={props.allProviderFunction}
                                    confirm={props.confirm}
                                    changeEstatusProviderFunction={props.changeEstatusProviderFunction}
                                    loadProviderIdAction={props.loadProviderIdAction}
                                    cleanStoreFunction={props.cleanStoreFunction}
                                    loading={props.provider.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Proveedores")}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <ListProviderDisabled
                                    data={props.provider.dataDisabled}
                                    pagination={props.provider.paginationDisabled}
                                    allProviderDisabledFunction={props.allProviderDisabledFunction}
                                    confirm={props.confirm}
                                    changeEstatusProviderFunction={props.changeEstatusProviderFunction}
                                    loading={props.provider.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Proveedores")}
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
    provider: state.provider.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadProviderAction: () => dispatch(LoadProviderAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadProviderIdAction: (id) => dispatch(loadProviderIdAction(id)),
    changeEstatusProviderFunction: (id) => dispatch(changeEstatusProviderFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allProviderFunction: (page, perPage, search) => dispatch(allProviderFunction(page, perPage, search)),
    allProviderDisabledFunction: (page, perPage, search) => dispatch(allProviderDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Provider);