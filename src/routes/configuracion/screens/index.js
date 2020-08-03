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
    LoadScreensAction,
    allScreenFunction,
    allScreenDisabledFunction,
    loadScreenIdAction,
    changeEstatusScreenFunction,
    cleanStoreFunction,
}
    from "../../../actions/ScreensActions"
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

class Screens extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.screens.actionDisable === 0) {
            this.props.allScreenDisabledFunction(1, 10, "");
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
        this.props.LoadScreensAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Pantallas")
        //console.log("screens ", this.props.screens)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.screens.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Monitores</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionScreens" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Monitores Activos" {...a11yProps(0)} />
                                    <Tab label="Monitores Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.screens.data}
                                        pagination={this.props.screens.pagination}
                                        allScreenFunction={this.props.allScreenFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusScreenFunction={this.props.changeEstatusScreenFunction}
                                        loadScreenIdAction={this.props.loadScreenIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.screens.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Pantallas")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.screens.dataDisabled}
                                        pagination={this.props.screens.paginationDisabled}
                                        allScreenDisabledFunction={this.props.allScreenDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusScreenFunction={this.props.changeEstatusScreenFunction}
                                        loading={this.props.screens.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Pantallas")}
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
    screens: state.screens.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadScreensAction: () => dispatch(LoadScreensAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadScreenIdAction: (id) => dispatch(loadScreenIdAction(id)),
    changeEstatusScreenFunction: (id) => dispatch(changeEstatusScreenFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allScreenFunction: (page, perPage, search) => dispatch(allScreenFunction(page, perPage, search)),
    allScreenDisabledFunction: (page, perPage, search) => dispatch(allScreenDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Screens);