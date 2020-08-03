import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import ListPurchasesEnabled from "./ListPurchasesEnabled";
import ListPurchasesDisabled from "./ListPurchasesDisabled";
import {
    LoadPurchasesAction,
    allPurchasesFunction,
    allPurchasesDisabledFunction,
    loadPurchasesIdAction,
    changeEstatusPurchasesFunction,
    cleanStoreFunction,
}
    from "../../../actions/PurchasesActions"
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

const Purchase = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        // if (Object.keys(props.cargos).length === 0) {}
        props.LoadPurchasesAction();        
    }, [])

    const handleChange = (event, newValue) => {
        if (newValue === 1 && props.purchase.actionDisable === 0) {
            props.allPurchasesDisabledFunction(1, 10, "");
        }
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const verEliminados = permitsMenu(props.dataGeneral.dataMenu, "Administracion", "Compras")
    return (
        <div className="blank-wrapper">
            {
                props.purchase.data ?
                    <div>
                        <Helmet>
                            <title>XCORE - Compras</title>
                            <meta name="description" content="Reactify Blank Page" />
                        </Helmet>
                        <PageTitleBar title={<IntlMessages id="sidebar.purchases" />} match={props.match} />
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Compras Activas" {...a11yProps(0)} />
                                <Tab label="Compras Inactivas" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <ListPurchasesEnabled
                                    data={props.purchase.data}
                                    pagination={props.purchase.pagination}
                                    allPurchasesFunction={props.allPurchasesFunction}
                                    confirm={props.confirm}
                                    changeEstatusPurchasesFunction={props.changeEstatusPurchasesFunction}
                                    loadPurchasesIdAction={props.loadPurchasesIdAction}
                                    cleanStoreFunction={props.cleanStoreFunction}
                                    loading={props.purchase.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Administracion", "Compras")}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <ListPurchasesDisabled
                                    data={props.purchase.dataDisabled}
                                    pagination={props.purchase.paginationDisabled}
                                    allPurchasesDisabledFunction={props.allPurchasesDisabledFunction}
                                    confirm={props.confirm}
                                    changeEstatusPurchasesFunction={props.changeEstatusPurchasesFunction}
                                    loading={props.purchase.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Administracion", "Compras")}
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
    purchase: state.purchase.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadPurchasesAction: () => dispatch(LoadPurchasesAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadPurchasesIdAction: (id) => dispatch(loadPurchasesIdAction(id)),
    changeEstatusPurchasesFunction: (id) => dispatch(changeEstatusPurchasesFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allPurchasesFunction: (page, perPage, search) => dispatch(allPurchasesFunction(page, perPage, search)),
    allPurchasesDisabledFunction: (page, perPage, search) => dispatch(allPurchasesDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Purchase);