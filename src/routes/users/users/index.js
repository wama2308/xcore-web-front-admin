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
    LoadUsersAction,
    allUsersFunction,
    allUsersDisabledFunction,
    loadUsersIdAction,
    changeEstatusUsersFunction,
    cleanStoreFunction,
}
    from "../../../actions/UsersActions"
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

const Users = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        props.LoadUsersAction();        
    }, [])

    const handleChange = (event, newValue) => {
        if (newValue === 1 && props.users.actionDisable === 0) {
            props.allUsersDisabledFunction(1, 10, "");
        }
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    
    const verEliminados = permitsMenu(props.dataGeneral.dataMenu, "Usuarios", "Usuarios")
    return (
        <div className="blank-wrapper">
            {
                props.users.data ?
                    <div>
                        <Helmet>
                            <title>XCORE - Usuarios</title>
                            <meta name="description" content="Reactify Blank Page" />
                        </Helmet>
                        <PageTitleBar title={<IntlMessages id="sidebar.configuracionUsers" />} match={props.match} />
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Usuarios Activos" {...a11yProps(0)} />
                                <Tab label="Usuarios Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <List
                                    data={props.users.data}
                                    pagination={props.users.pagination}
                                    allUsersFunction={props.allUsersFunction}
                                    confirm={props.confirm}
                                    changeEstatusUsersFunction={props.changeEstatusUsersFunction}
                                    loadUsersIdAction={props.loadUsersIdAction}
                                    cleanStoreFunction={props.cleanStoreFunction}
                                    loading={props.users.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Usuarios", "Usuarios")}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <ListDisabled
                                    data={props.users.dataDisabled}
                                    pagination={props.users.paginationDisabled}
                                    allUsersDisabledFunction={props.allUsersDisabledFunction}
                                    confirm={props.confirm}
                                    changeEstatusUsersFunction={props.changeEstatusUsersFunction}
                                    loading={props.users.loading}
                                    permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Usuarios", "Usuarios")}
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
    users: state.users.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadUsersAction: () => dispatch(LoadUsersAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadUsersIdAction: (id) => dispatch(loadUsersIdAction(id)),
    changeEstatusUsersFunction: (id) => dispatch(changeEstatusUsersFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allUsersFunction: (page, perPage, search) => dispatch(allUsersFunction(page, perPage, search)),
    allUsersDisabledFunction: (page, perPage, search) => dispatch(allUsersDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);