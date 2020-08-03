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
    LoadDiscountsAction,
    allDiscountsFunction,
    allDiscountsDisabledFunction,
    loadDiscountsIdAction,
    changeEstatusDiscountsFunction,
    cleanStoreFunction,
}
    from "../../../actions/DiscountsActions"
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

class Discounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        if (newValue === 1 && this.props.discounts.actionDisable === 0) {
            this.props.allDiscountsDisabledFunction(1, 10, "");
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
        this.props.LoadDiscountsAction();
    };

    componentWillReceiveProps = props => { }

    render() {
        const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Descuentos")
        // console.log("discounts ", this.props.discounts)
        // console.log("general ", this.props.dataGeneral)
        return (
            <div className="blank-wrapper">
                {
                    this.props.discounts.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Descuentos</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionDiscounts" />} match={this.props.match} />
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab label="Descuentos Activos" {...a11yProps(0)} />
                                    <Tab label="Descuentos Inactivos" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                //axis='x-reverse'
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <TabPanel value={this.state.value} index={0} dir="">
                                    <List
                                        data={this.props.discounts.data}
                                        pagination={this.props.discounts.pagination}
                                        allDiscountsFunction={this.props.allDiscountsFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusDiscountsFunction={this.props.changeEstatusDiscountsFunction}
                                        loadDiscountsIdAction={this.props.loadDiscountsIdAction}
                                        cleanStoreFunction={this.props.cleanStoreFunction}
                                        loading={this.props.discounts.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Descuentos")}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1} dir="">
                                    <ListDisabled
                                        data={this.props.discounts.dataDisabled}
                                        pagination={this.props.discounts.paginationDisabled}
                                        allDiscountsDisabledFunction={this.props.allDiscountsDisabledFunction}
                                        confirm={this.props.confirm}
                                        changeEstatusDiscountsFunction={this.props.changeEstatusDiscountsFunction}
                                        loading={this.props.discounts.loading}
                                        permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Descuentos")}
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
    discounts: state.discounts.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    LoadDiscountsAction: () => dispatch(LoadDiscountsAction()),
    cleanStoreFunction: () => dispatch(cleanStoreFunction()),
    loadDiscountsIdAction: (id) => dispatch(loadDiscountsIdAction(id)),
    changeEstatusDiscountsFunction: (id) => dispatch(changeEstatusDiscountsFunction(id)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
    allDiscountsFunction: (page, perPage, search) => dispatch(allDiscountsFunction(page, perPage, search)),
    allDiscountsDisabledFunction: (page, perPage, search) => dispatch(allDiscountsDisabledFunction(page, perPage, search)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Discounts);