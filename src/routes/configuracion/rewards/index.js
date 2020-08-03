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
    LoadRewardsAction,
    allRewardsFunction,
    allRewardsDisabledFunction,
    loadRewardIdAction,
    changeEstatusRewardFunction,
    cleanStoreFunction,
}
    from "../../../actions/RewardsActions"
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

class Rewards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.rewards.actionDisable === 0) {
            this.props.allRewardsDisabledFunction(1, 10, "");
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
        this.props.LoadRewardsAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Recompenzas")
        // console.log("rewards ", this.props.rewards)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.rewards.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Recompensas</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionRewards" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Recompensas Activas" {...a11yProps(0)} />
                                    <Tab label="Recompensas Inactivas" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.rewards.data}
                                        pagination={this.props.rewards.pagination}
                                        allRewardsFunction={this.props.allRewardsFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusRewardFunction={this.props.changeEstatusRewardFunction}
                                        loadRewardIdAction={this.props.loadRewardIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.rewards.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Recompenzas")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.rewards.dataDisabled}
                                        pagination={this.props.rewards.paginationDisabled}
                                        allRewardsDisabledFunction={this.props.allRewardsDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusRewardFunction={this.props.changeEstatusRewardFunction}
                                        loading={this.props.rewards.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Recompenzas")}
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
    rewards: state.rewards.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadRewardsAction: () => dispatch(LoadRewardsAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadRewardIdAction: (id) => dispatch(loadRewardIdAction(id)),
    changeEstatusRewardFunction: (id) => dispatch(changeEstatusRewardFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allRewardsFunction: (page, perPage, search) => dispatch(allRewardsFunction(page, perPage, search)),
    allRewardsDisabledFunction: (page, perPage, search) => dispatch(allRewardsDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Rewards);