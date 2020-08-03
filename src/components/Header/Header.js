/**
 * App Header
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import screenfull from "screenfull";
import Tooltip from "@material-ui/core/Tooltip";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter } from "react-router-dom";
import QuickLinks from "./QuickLinks";
// actions
import { collapsedSidebarAction, miniSidebarAction } from "Actions";

// helpers
import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from "./Notifications";
import ChatSidebar from "./ChatSidebar";
import DashboardOverlay from "../DashboardOverlay/DashboardOverlay";
import LanguageProvider from "./LanguageProvider";
import SearchForm from "./SearchForm";
import MobileSearchForm from "./MobileSearchForm";
import Cart from "./Cart";

// intl messages
import IntlMessages from "Util/IntlMessages";

class Header extends Component {
  state = {
    customizer: false,
    isMobileSearchFormVisible: false,
  };

  UNSAFE_componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    const { windowWidth } = this.state;
    window.addEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  miniSidebarHanlder(isTrue) {
    if (isTrue) {
      document.body.classList.add("mini-sidebar");
    } else {
      document.body.classList.remove("mini-sidebar");
    }
    setTimeout(() => {
      this.props.miniSidebarAction(isTrue);
    }, 100);
  }

  // function to change the state of collapsed sidebar
  onToggleNavCollapsed = (event) => {
    if (this.state.windowWidth <= 1199) {
      const val = !this.props.navCollapsed;
      this.props.collapsedSidebarAction(val);
    } else {
      this.miniSidebarHanlder(!this.props.miniSidebar);
    }
  };

  // open dashboard overlay
  openDashboardOverlay(e) {
    var el = document.getElementsByClassName("dashboard-overlay")[0];
    el.classList.toggle("d-none");
    el.classList.toggle("show");
    if (el.classList.contains("show")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    e.preventDefault();
  }

  // close dashboard overlay
  closeDashboardOverlay() {
    var e = document.getElementsByClassName("dashboard-overlay")[0];
    e.classList.remove("show");
    e.classList.add("d-none");
    document.body.style.overflow = "";
  }

  // toggle screen full
  toggleScreenFull() {
    screenfull.toggle();
  }

  // mobile search form
  openMobileSearchForm() {
    this.setState({ isMobileSearchFormVisible: true });
  }

  render() {
    const { isMobileSearchFormVisible } = this.state;
    const { horizontalMenu, agencyMenu, location } = this.props;
    return (
      <AppBar position="static" className="rct-header">
        <Toolbar className="d-flex justify-content-between w-100 pl-0">
          {/* <div style={{ display: 'flex', flexDirection: 'row' }}> */}
          <ul className="list-inline mb-0 navbar-left">
            <li
              className="list-inline-item"
              onClick={(e) => this.onToggleNavCollapsed(e)}
            >
              <Tooltip title="Sidebar Toggle" placement="bottom">
                <IconButton
                  color="inherit"
                  mini="true"
                  aria-label="Menu"
                  className="humburger p-0"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            </li>
            <li className="list-inline-item search-icon d-inline-block">
              <SearchForm />
            </li>
            <QuickLinks />
          </ul>
          <ul className="list-inline mb-0">
            <li className="list-inline-item summary-icon">
              <Tooltip title="Summary" placement="bottom">
                <a
                  href="#"
                  className="header-icon tour-step-3"
                  onClick={(e) => this.openDashboardOverlay(e)}
                >
                  <i className="zmdi zmdi-info-outline"></i>
                </a>
              </Tooltip>
            </li>
            {/* <LanguageProvider /> */}
            <Notifications />
            <Cart />
            <li className="list-inline-item setting-icon">
              <Tooltip title="Chat" placement="bottom">
                <IconButton
                  aria-label="settings"
                  onClick={() => this.setState({ customizer: true })}
                >
                  <i className="zmdi zmdi-comment"></i>
                </IconButton>
              </Tooltip>
            </li>
          </ul>
          <Drawer
            anchor={"right"}
            open={this.state.customizer}
            onClose={() => this.setState({ customizer: false })}
          >
            <ChatSidebar />
          </Drawer>
          {/* </div> */}
        </Toolbar>
        <DashboardOverlay onClose={() => this.closeDashboardOverlay()} />
      </AppBar>
    );
  }
}

// map state to props
const mapStateToProps = ({ settings }) => {
  return settings;
};

export default withRouter(
  connect(mapStateToProps, {
    collapsedSidebarAction,
    miniSidebarAction,
  })(Header)
);
