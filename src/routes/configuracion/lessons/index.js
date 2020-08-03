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
    LoadClassAction,
    changeEstatusClassFunction,
    loadClassIdAction,
    cleanStoreFunction,
    allClassFunction,
    allClassDisabledFunction,
}
    from "../../../actions/LessonsActions"
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

class Lessons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.lessons.actionDisable === 0) {
            this.props.allClassDisabledFunction(1, 10, "");
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
        this.props.LoadClassAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Lecciones")
        //console.log(this.props.lessons)
        //console.log(this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.lessons.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Clases</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionLessons" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Clases Activas" {...a11yProps(0)} />
                                    <Tab label="Clases Inactivas" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.lessons.data}
                                        pagination={this.props.lessons.pagination}
                                        allClassFunction={this.props.allClassFunction}
                                        dataPenalties={this.props.dataGeneral.dataPenalties}
                                        countryConfiguration={this.props.dataGeneral.countryConfiguration}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        changeEstatusClassFunction={this.props.changeEstatusClassFunction}
                                        loadClassIdAction={this.props.loadClassIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.lessons.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Lecciones")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.lessons.dataDisabled}
                                        pagination={this.props.lessons.paginationDisabled}
                                        allClassDisabledFunction={this.props.allClassDisabledFunction}
                                        search={this.props.searchData}
                                        confirm={this.props.confirm}
                                        changeEstatusClassFunction={this.props.changeEstatusClassFunction}
                                        loading={this.props.lessons.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Lecciones")}
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
    lessons: state.lessons.toJS(),
    searchData: state.general.search,
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadClassAction: () => dispatch(LoadClassAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadClassIdAction: (id) => dispatch(loadClassIdAction(id)),
    changeEstatusClassFunction: (id) => dispatch(changeEstatusClassFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allClassFunction: (page, perPage, search) => dispatch(allClassFunction(page, perPage, search)),
    allClassDisabledFunction: (page, perPage, search) => dispatch(allClassDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lessons);