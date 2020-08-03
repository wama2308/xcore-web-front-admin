import React, { useState, useEffect } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PaymentLocalPurchase from "./PaymentLocalPurchase";
import PaymentExchangePurchase from "./PaymentExchangePurchase";
import {
    addWayToPayFunction,
    deleteWayToPayFunction,
}
    from "../../../actions/PurchasesActions"
import { connect } from "react-redux";
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { openConfirmDialog } from "../../../actions/aplicantionActions"
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ListPaymentPurchase from "./ListPaymentPurchase";

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

const PaymentPurchase = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {

    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    return (
        <div>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="full width tabs example"
                >
                    <Tab label="Moneda Local" {...a11yProps(0)} />
                    <Tab label="Divisas" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel style={{ overflowX: 'hidden' }} value={value} index={0} dir={theme.direction}>
                    <PaymentLocalPurchase
                        wayToPayLocal={props.dataGeneral.countryConfiguration.wayToPays}
                        addWayToPayFunction={props.addWayToPayFunction}
                        purchase={props.purchase}
                    />
                </TabPanel>
                <TabPanel style={{ overflow: 'hidden' }} value={value} index={1} dir={theme.direction}>
                    <PaymentExchangePurchase
                        wayToPayExchange={props.dataGeneral.dataSelectExchange}
                        addWayToPayFunction={props.addWayToPayFunction}
                        purchase={props.purchase}
                    />
                </TabPanel>
            </SwipeableViews>
            {
                props.purchase.wayToPay.length > 0 && (
                    <ListPaymentPurchase
                        currency_symbol={props.dataGeneral.countryConfiguration.currency_symbol}
                        data={props.purchase.wayToPay}
                        deleteWayToPayFunction={props.deleteWayToPayFunction}
                        confirm={props.confirm}
                    />
                )
            }
        </div>
    );
}

const mapStateToProps = state => ({
    purchase: state.purchase.toJS(),
    dataGeneral: state.general.dataGeneral
});

const mapDispatchToProps = dispatch => ({
    addWayToPayFunction: (data, callBack) => dispatch(addWayToPayFunction(data, callBack)),
    deleteWayToPayFunction: (key, data) => dispatch(deleteWayToPayFunction(key, data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentPurchase);