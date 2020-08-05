import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import ListCategoriesEnabled from "./ListCategoriesEnabled";
import ListCategoriesDisabled from "./ListCategoriesDisabled";
import {
    LoadCategoryAction,
    allCategoryFunction,
    allCategoryDisabledFunction,
    loadCategoryIdAction,
    changeEstatusCategoryFunction,
    cleanStoreFunction,
}
    from "../../../actions/CategoryActions"
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { openConfirmDialog } from "../../../actions/aplicantionActions"
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
//import { permitsMenu, GetDisabledPermits } from "../../../helpers/helpers";

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

const Categories = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        props.LoadCategoryAction();
    }, [])

    const handleChange = (event, newValue) => {
        if (newValue === 1 && props.category.actionDisable === 0) {
            props.allCategoryDisabledFunction(1, 10, "");
        }
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    //const verEliminados = permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Posiciones")
    return (
        <div className="blank-wrapper">
            {
                props.category.data ?
                    <div>
                        <Helmet>
                            <title>XCORE - Categorias</title>
                            <meta name="description" content="Reactify Blank Page" />
                        </Helmet>
                        <PageTitleBar title={<IntlMessages id="sidebar.categories" />} match={props.match} />
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="full width tabs example"
                            >
                                <Tab 
                                    label={<IntlMessages id="sidebar.categoriesEnabled" />} {...a11yProps(0)} 
                                />
                                <Tab 
                                    label={<IntlMessages id="sidebar.categoriesDisabled" />} {...a11yProps(1)} 
                                    //disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} 
                                />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <ListCategoriesEnabled
                                    data={props.category.data}
                                    pagination={props.category.pagination}
                                    allCategoryFunction={props.allCategoryFunction}
                                    confirm={props.confirm}
                                    changeEstatusCategoryFunction={props.changeEstatusCategoryFunction}
                                    loadCategoryIdAction={props.loadCategoryIdAction}
                                    cleanStoreFunction={props.cleanStoreFunction}
                                    loading={props.category.loading}
                                    //permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Posiciones")}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <ListCategoriesDisabled
                                    data={props.category.dataDisabled}
                                    pagination={props.category.paginationDisabled}
                                    allCategoryDisabledFunction={props.allCategoryDisabledFunction}
                                    confirm={props.confirm}
                                    changeEstatusCategoryFunction={props.changeEstatusCategoryFunction}
                                    loading={props.category.loading}
                                    //permitsModule={permitsMenu(props.dataGeneral.dataMenu, "Configuraciones", "Posiciones")}
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
    category: state.category,
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadCategoryAction: () => dispatch(LoadCategoryAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadCategoryIdAction: (id) => dispatch(loadCategoryIdAction(id)),
    changeEstatusCategoryFunction: (id) => dispatch(changeEstatusCategoryFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allCategoryFunction: (page, perPage, search) => dispatch(allCategoryFunction(page, perPage, search)),
    allCategoryDisabledFunction: (page, perPage, search) => dispatch(allCategoryDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Categories);