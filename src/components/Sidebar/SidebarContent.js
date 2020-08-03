/**
 * Sidebar Content
 */
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import navLinks from './NavLinks';

import IntlMessages from 'Util/IntlMessages';

import NavMenuItem from './NavMenuItem';

// redux actions
import { onToggleMenu } from 'Actions';

class SidebarContent extends Component {

	toggleMenu(menu, stateCategory, menuAll) {
		menu.open = !menu.open;
		let data = {
			menu,
			stateCategory,
			menuAll
		}
		this.props.onToggleMenu(data);
	}

	render() {
		//const { sidebarMenus } = this.props.sidebar;
		//const menuDynamic = { category1: this.props.dataGeneral.dataMenu };	

		return (
			<div className="rct-sidebar-nav">
				<nav className="navigation">
					<List
						className="rct-mainMenu p-0 m-0 list-unstyled"
					// subheader={
					// 	<ListSubheader className="side-title" component="li">
					// 		<IntlMessages id="sidebar.setting" />
					// 	</ListSubheader>}
					>
						{
							Object.keys(navLinks).length > 0 &&
							navLinks.category1.map((menu, key) => (
								<NavMenuItem
									menu={menu}
									key={key}
									onToggleMenu={() => this.toggleMenu(menu, 'category1', navLinks)}
								/>
							))
						}

					</List>
				</nav>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ sidebar, settings, state }) => {
	return { sidebar, settings, state };
};

export default withRouter(connect(mapStateToProps, {
	onToggleMenu
})(SidebarContent));
