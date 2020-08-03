/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import "../../assets/css/style.css";
import ModalChangeBranchPerfil from "../../components/ModalChangeBranchPerfil";
import { changeBusinessBranchOfficesMenu, changePerfilMenu } from "../../actions/AuthActions"
import { openConfirmDialog } from "../../actions/aplicantionActions"

// components
import SupportPage from '../Support/Support';

// redux action
import { logout } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class UserBlock extends Component {
	state = {
		userDropdownMenu: false,
		isSupportModal: false,
		arrayBusiness: [],
		arrayBranchOffices: [],
		dropdownOpenBusiness: false,
		dropdownOpenBranchOffices: false,
		dropdownOpenPerfil: false,
		modal: false,
		option: 0,
	}

	/**
	 * Logout User
	 */
	logoutUser(e) {
		e.preventDefault();
		this.props.logout();
	}

	toggleBusiness() {
		this.setState({ dropdownOpenBusiness: !this.state.dropdownOpenBusiness });
	}

	toggleBranchOffices() {
		this.setState({ dropdownOpenBranchOffices: !this.state.dropdownOpenBranchOffices });
	}

	toggleBranchPerfil() {
		this.setState({ dropdownOpenPerfil: !this.state.dropdownOpenPerfil });
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}

	/**
	 * Open Support Modal
	 */
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}

	/**
	 * On Close Support Page
	 */
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}

	/**
	 * On Submit Support Page
	 */
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
	}

	caretDropDown(data) {
		let businessCaret = "";
		let branchOfficeCaret = "";
		let perfilCaret = "";
		let arrayPerfil = [];
		let clientDefault = localStorage.getItem("client_default") === 'false' ? false : true;

		let findBusinessCaret = data.find(data => data.value === localStorage.getItem("business_default"));

		let isMaster = findBusinessCaret.is_master;
		let isStaff;
		let isClient;

		let branchOfficesBusinessDefault = data.filter(data => data.value === localStorage.getItem("business_default"));
		let findBranchOfficesCaret = branchOfficesBusinessDefault[0].branchOffices.find(data => data.value === localStorage.getItem("branch_office_default"));

		isClient = findBranchOfficesCaret.is_client;
		isMaster ? isStaff = false : isStaff = findBranchOfficesCaret.is_staff;

		if (isMaster && isClient && clientDefault) {
			perfilCaret = "Cliente";
			arrayPerfil = [
				{
					label: "Master",
					value: false,
					clientDefault: false,
				},
				{
					label: "Cliente",
					value: true,
					clientDefault: true,
				}
			]
		} else if (isMaster && isClient && !clientDefault) {
			perfilCaret = "Master";
			arrayPerfil = [
				{
					label: "Cliente",
					value: false,
					clientDefault: true,
				},
				{
					label: "Master",
					value: true,
					clientDefault: false,
				}
			]
		} else if (isMaster && !isClient && !clientDefault) {
			perfilCaret = "Master";
			arrayPerfil = [
				{
					label: "Master",
					value: true,
					clientDefault: false,
				}
			]
		} else if (!isMaster && isStaff && isClient && clientDefault) {
			perfilCaret = "Cliente";
			arrayPerfil = [
				{
					label: "Usuario",
					value: false,
					clientDefault: false,
				},
				{
					label: "Cliente",
					value: true,
					clientDefault: true,
				}
			]
		} else if (!isMaster && isStaff && isClient && !clientDefault) {
			perfilCaret = "Usuario";
			arrayPerfil = [
				{
					label: "Cliente",
					value: false,
					clientDefault: true,
				},
				{
					label: "Usuario",
					value: true,
					clientDefault: false,
				}
			]
		} else if (!isMaster && isStaff && !isClient && !clientDefault) {
			perfilCaret = "Usuario";
			arrayPerfil = [
				{
					label: "Usuario",
					value: true,
					clientDefault: false,
				}
			]
		}

		findBusinessCaret.label.length > 17 ?
			businessCaret = findBusinessCaret.label.substr(0, 17) + "..." :
			businessCaret = findBusinessCaret.label;

		findBranchOfficesCaret.label.length > 17 ?
			branchOfficeCaret = findBranchOfficesCaret.label.substr(0, 17) + "..." :
			branchOfficeCaret = findBranchOfficesCaret.label;

		let caret = {
			businessCaret: businessCaret,
			branchOfficeCaret: branchOfficeCaret,
			perfilCaret: perfilCaret,
			arrayPerfil: arrayPerfil,
		}

		return caret;
	}

	updateLabel(data) {
		let labelShow = '';
		if (data.length > 17) {
			labelShow = data.substr(0, 17) + "...";
		} else {
			labelShow = data;
		}
		return labelShow;
	}

	cargarBusinessBranchOffices(data) {
		this.setState({
			arrayBranchOffices: data.filter(data => data.value === localStorage.getItem("business_default")),
		});
	}

	dropItemBusiness() {
		this.setState({ modal: true, option: 0 });
	}

	dropItemPerfil() {
		this.setState({ modal: true, option: 1 });
	}

	handleChange = (event) => {
		this.setState({
			age: event.target.value
		});
	};

	valorCloseModal = valor => {
		this.setState({
			modal: valor,
			option: 0,
		});
	}


	render() {
		//console.log("user block authUser ", this.props.authUser)
		//let carets = this.caretDropDown(this.props.authUser.business);

		return (
			<div className="top-sidebar">
				{/* {
					this.state.modal && (
						<ModalChangeBranchPerfil
							modal={this.state.modal}
							option={this.state.option}
							carets={carets}
							business={this.props.authUser.business}
							valorCloseModal={this.valorCloseModal}
							changeBusinessBranchOfficesMenu={this.props.changeBusinessBranchOfficesMenu}
							changePerfilMenu={this.props.changePerfilMenu}
							confirm={this.props.confirm}
						/>
					)
				} */}
				<div className="sidebar-user-block">
					<Dropdown
						isOpen={this.state.userDropdownMenu}
						toggle={() => this.toggleUserDropdownMenu()}
						className="rct-dropdown"
					>
						<DropdownToggle
							tag="div"
							className="d-flex align-items-center"
						>
							<div className="user-profile">
								<img
									src={require('Assets/avatars/user-15.jpg')}
									alt="user profile"
									className="img-fluid rounded-circle"
									width="50"
									height="100"
								/>
							</div>
							<div className="user-info">
								<span className="user-name ml-3">{localStorage.getItem("names")}</span>
								<i className="zmdi zmdi-chevron-down dropdown-icon mx-3"></i>
							</div>
						</DropdownToggle>
						<DropdownMenu>
							<ul className="list-unstyled mb-0">
								<li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
									<p className="text-white mb-0 fs-14">{localStorage.getItem("names")} {localStorage.getItem("surnames")}</p>
									<span className="" style={{ fontSize: '13px' }}>{localStorage.getItem("email")}</span>
								</li>
								{/* <li className="border-top">
									<a href="#" onClick={() => this.dropItemBusiness()} title={`${carets.businessCaret} - ${carets.branchOfficeCaret}`}>
										<div style={{ display: 'flex' }}>
											<div>
												<i className="zmdi zmdi-home text-primary mr-3"></i>
											</div>
											<div><p className='marquee'>
												<span>{carets.businessCaret} - {carets.branchOfficeCaret}</span></p>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a href="#" onClick={() => this.dropItemPerfil()} title={carets.perfilCaret} >
										<i className="zmdi zmdi-account text-primary mr-3"></i>
										<span>{this.updateLabel(carets.perfilCaret)}</span>
									</a>
								</li> */}
								<li className="border-top">
									<a href="#" onClick={(e) => this.logoutUser(e)}>
										<i className="zmdi zmdi-power text-danger mr-3"></i>
										<span>Cerrar Sesion</span>
									</a>
								</li>
							</ul>
						</DropdownMenu>
					</Dropdown>
				</div>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = state => ({
	authUser: state.authUser.toJS(),

});

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch(logout()),
	confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
	changePerfilMenu: (data) => dispatch(changePerfilMenu(data)),
	changeBusinessBranchOfficesMenu: (businessId, branchOfficesId, option) =>
		dispatch(changeBusinessBranchOfficesMenu(businessId, branchOfficesId, option)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserBlock);
