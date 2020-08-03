import React, { Component } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import ListAreas from "./ListAreas";
import ListAreasDisabled from "./ListAreasDisabled";
import {
  LoadAreasAction,
  limpiarStoreForm,
  loadAreaIdAction,
  cambiarEstatusAreaFunction,
  allAreasFunction,
  allAreasDisabledFunction,
} from "../../../actions/AreasActions";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SwipeableViews from "react-swipeable-views";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { openConfirmDialog } from "../../../actions/aplicantionActions";
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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

class Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (event, newValue) => {
    if (newValue === 1 && this.props.area.actionDisable === 0) {
      this.props.allAreasDisabledFunction(1, 10, "");
    }
    this.setState({
      value: newValue
    });
  };

  handleChangeIndex = (newValue) => {
    this.setState({
      value: newValue,
    });
  };

  componentDidMount = () => {
    this.props.LoadAreasAction();
  };

  componentWillReceiveProps = (props) => { };

  render() {
    const verEliminados = permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Areas")
    // console.log("Area ", this.props.area)
    // console.log("General ", this.props.dataGeneral)
    //console.log(this.props.countryConfiguration)
    return (
      <div className="blank-wrapper">
        {this.props.area.data ? (
          <div>
            <Helmet>
              <title>XCORE - Areas</title>
              <meta name="description" content="Reactify Blank Page" />
            </Helmet>
            <PageTitleBar
              title={<IntlMessages id="sidebar.configuracionAreas" />}
              match={this.props.match}
            />
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.value}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Areas Activas" {...a11yProps(0)} />
                <Tab label="Areas Inactivas" {...a11yProps(1)} disabled={GetDisabledPermits(verEliminados, "Ver Eliminados")} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              //axis='x-reverse'
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabPanel value={this.state.value} index={0} dir="">
                <ListAreas
                  data={this.props.area.data}
                  pagination={this.props.area.pagination}
                  paginationInactivate={this.props.area.paginationDisabled}
                  allAreasFunction={this.props.allAreasFunction}
                  allAreasDisabledFunction={this.props.allAreasDisabledFunction}
                  dataUsers={this.props.area.dataUsers}
                  dataPenalties={this.props.area.dataPenalties}
                  countryConfiguration={
                    this.props.dataGeneral.countryConfiguration
                  }
                  dataDiscount={this.props.dataGeneral.dataDiscount}
                  dataGeneral={this.props.dataGeneral}
                  search={this.props.searchData}
                  confirm={this.props.confirm}
                  limpiarStoreForm={this.props.limpiarStoreForm}
                  loadAreaIdAction={this.props.loadAreaIdAction}
                  cambiarEstatusAreaFunction={
                    this.props.cambiarEstatusAreaFunction
                  }
                  loading={this.props.area.loading}
                  permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Areas")}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={1} dir="">
                <ListAreasDisabled
                  data={this.props.area.dataDisabled}
                  pagination={this.props.area.paginationDisabled}
                  paginationActivate={this.props.area.pagination}
                  allAreasFunction={this.props.allAreasFunction}
                  allAreasDisabledFunction={this.props.allAreasDisabledFunction}
                  search={this.props.searchData}
                  confirm={this.props.confirm}
                  cambiarEstatusAreaFunction={
                    this.props.cambiarEstatusAreaFunction
                  }
                  loading={this.props.area.loading}
                  permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Areas")}
                />
              </TabPanel>
            </SwipeableViews>
          </div>
        ) : (
            <div style={{ height: "60vh" }}>
              <CircularProgress
                style={{
                  position: " absolute",
                  height: 40,
                  top: "45%",
                  right: "50%",
                  zIndex: 2,
                }}
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  area: state.area.toJS(),
  searchData: state.general.search,
  dataGeneral: state.general.dataGeneral,  
});

const mapDispatchToProps = (dispatch) => ({
  LoadAreasAction: () => dispatch(LoadAreasAction()),
  limpiarStoreForm: () => dispatch(limpiarStoreForm()),
  confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
  loadAreaIdAction: (id) => dispatch(loadAreaIdAction(id)),
  cambiarEstatusAreaFunction: (id, option, callback) => dispatch(cambiarEstatusAreaFunction(id, option, callback)),
  allAreasFunction: (page, perPage, search) => dispatch(allAreasFunction(page, perPage, search)),
  allAreasDisabledFunction: (page, perPage, search) => dispatch(allAreasDisabledFunction(page, perPage, search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Area);
