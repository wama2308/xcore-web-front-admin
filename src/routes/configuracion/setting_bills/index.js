import React, { useState } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SwipeableViews from "react-swipeable-views";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "./List";
import ListDisabled from "./ListDisabled";
import { openConfirmDialog } from "../../../actions/aplicantionActions";
import { loadSettingBillIdAction, cleanStoreFunction } from "../../../actions/SettingBillsActions";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

const SettingBills = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const { confirm } = props;
  const verEliminados = permitsMenu(
    props.dataGeneral.dataMenu,
    "Configuraciones",
    "Facturas"
  );
  return (
    <div className="blank-wrapper">
      <div>
        <Helmet>
          <title>XCORE - Configuración de facturas</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <PageTitleBar
          title={<IntlMessages id="sidebar.setting_bills" />}
          match={props.match}
        />
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="full width tabs example"
          >
            <Tab label="Configuración de facturas Activas" {...a11yProps(0)} />
            <Tab
              label="Configuración de facturas Inactivas"
              {...a11yProps(1)}
              disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")}
            />
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <List
              loadSettingBillIdAction={props.loadSettingBillIdAction}
              cleanStoreFunction={props.cleanStoreFunction}
              confirm={confirm}
              permitsModule={permitsMenu(
                props.dataGeneral.dataMenu,
                "Configuraciones",
                "Facturas"
              )}
            />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ListDisabled
              confirm={confirm}
              permitsModule={permitsMenu(
                props.dataGeneral.dataMenu,
                "Configuraciones",
                "Facturas"
              )}
            />
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dataGeneral: state.general.dataGeneral,
});
const mapDispatchToProps = (dispatch) => ({
  confirm: (message, callback) =>
    dispatch(openConfirmDialog(message, callback)),
  loadSettingBillIdAction: (id) => dispatch(loadSettingBillIdAction(id)),
  cleanStoreFunction: () => dispatch(cleanStoreFunction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingBills);
