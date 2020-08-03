/**
 * View Cart Page
 */
import React, { useState } from 'react';
import { connect } from "react-redux";
import { Table, Input, Dropdown, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import ModalCourtesy from "./ModalCourtesy";
import ModalCredit from "./ModalCredit";

// Card Component
import { RctCard, RctCardContent } from "Components/RctCard";
import ModalAreas from "../../configuracion/area/ModalArea";
import ModalPlanes from "../../configuracion/planes/ModalPlanes";
import ModalLessons from "../../configuracion/lessons/ModalLessons";
import ModalService from "../../configuracion/services/ModalService";
import ModalPackage from "../../configuracion/packages/ModalPackage";


//Actions
import { deleteItemFromCart, onChangeProductQuantity, skipRegistrationAction } from "Actions";
import { openConfirmDialog } from "../../../actions/aplicantionActions"
import { loadAreaIdAction } from "../../../actions/AreasActions"
import { loadClassIdAction } from "../../../actions/LessonsActions"
import { loadPlanIdAction } from "../../../actions/PlanesActions"
import { loadPackagesIdAction } from "../../../actions/PackagesActions"
import { loadServiceIdAction } from "../../../actions/ServicesConfigurationActions"

import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Fade from '@material-ui/core/Fade';

//Helper
import { textTruncate, number_format } from "Helpers/helpers";

// intl messages
import IntlMessages from "Util/IntlMessages";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

const Carts = (props) => {
  const [modalDetails, setModalDetails] = useState(false);
  const [itemType, setItemType] = useState('');
  const [dropDownLeft, setDropDownLeft] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSkip, setAnchorElSkip] = useState(null);
  const open = Boolean(anchorEl);
  const openSkip = Boolean(anchorElSkip);
  const [modalCourtesy, setModalCourtesy] = useState(false);
  const [modalHeaderCourtesy, setModalHeaderCourtesy] = useState('');
  const [modalCredit, setModalCredit] = useState(false);
  const [modalHeaderCredit, setModalHeaderCredit] = useState('');
  const [creditAll, setCreditAll] = useState(false);
  const [courtesyAll, setCourtesyAll] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickSkip = (event) => {
    setAnchorElSkip(event.currentTarget);
  };

  const handleCloseSkip = () => {
    setAnchorElSkip(null);
  };

  const handleChangeSwitchCredit = event => {
    setCreditAll(event.target.checked);
    if (event.target.checked) {
      openModalCredit(null, 'all')
    }
  };

  const handleChangeSwitchCourtesy = event => {
    setCourtesyAll(event.target.checked);
    if (event.target.checked) {
      openModalCourtesy(null, 'all')
    }
  };

  const openModalCourtesy = (cart, option) => {
    if (option === 'item') {
      cart.registry_price === 0 ? setAnchorEl(null) : setAnchorElSkip(null);
    }
    setModalCourtesy(true);
    option === 'item' ?
      setModalHeaderCourtesy('Cortesia: ' + ' ' + cart.name) :
      setModalHeaderCourtesy('Cortesia a todos los items');
  }

  const openModalCredit = (cart, option) => {
    if (option === 'item') {
      cart.registry_price === 0 ? setAnchorEl(null) : setAnchorElSkip(null);
    }
    setModalCredit(true);
    option === 'item' ?
      setModalHeaderCredit('Credito: ' + ' ' + cart.name) :
      setModalHeaderCredit('Credito a todos los items');
  }

  const onChangeQuantity = (quantity, cartItem) => {
    if (quantity > 0) {
      props.onChangeProductQuantity(quantity, cartItem);
    }
  };

  const getTotalPrice = () => {
    const { cart } = props;
    let subTotal = 0;
    let impuesto = 0;
    let totalPrice = 0;
    for (const item of cart) {
      subTotal += item.importe;
      impuesto += (item.tax._amount * item.productQuantity);
      totalPrice += item.totalPrice;
    }
    return {
      subTotal: number_format(subTotal, 2),
      impuesto: number_format(impuesto, 2),
      totalPrice: number_format(totalPrice, 2),
    };
  };

  const isCartEmpty = () => {
    const { cart } = props;
    if (cart.length === 0) {
      return true;
    }
  };

  const { cart, deleteItemFromCart, match, client, dataGeneral } = props;
  const { countryConfiguration } = dataGeneral;
  const { currency_symbol } = countryConfiguration;
  const isEmpty = isCartEmpty();

  const deleteItemCart = (cart) => {
    const message = {
      title: "Eliminar Item",
      info: "¿Esta seguro que desea eliminar este item?"
    };
    props.openConfirmDialog(message, res => {
      if (res) {
        deleteItemFromCart(cart)
      }
    });
  }

  const skipRegistration = (cart, option) => {
    setAnchorElSkip(null);
    const message = {
      title: option === 'omitir' ? "Omitir Inscripcion" : "Agregar Inscripcion",
      info: option === 'omitir' ?
        `Valor de la inscripcion a omitir: ${number_format(cart.amount_inscription, 2)} ${currency_symbol}` :
        `Valor de la inscripcion a agregar: ${number_format(cart.amount_inscription, 2)} ${currency_symbol}`
    };
    props.openConfirmDialog(message, res => {
      if (res) {
        let newPrice = option === 'omitir' ? cart.price - cart.amount_inscription : cart.price + cart.amount_inscription;
        props.skipRegistrationAction(newPrice, cart, option)
      }
    });
  }

  const valorCloseModal = valor => {
    setModalDetails(false);
  }

  const valorCloseModalCourtesy = valor => {
    setModalCourtesy(false);
    setCourtesyAll(false);
  }

  const valorCloseModalCredit = valor => {
    setModalCredit(false);
    setCreditAll(false);
  }

  const viewDetails = (cart) => {
    if (cart.typeItem === 'areas') {
      props.loadAreaIdAction(cart._id)
      setModalDetails(true)
      setItemType('areas');
    }
    if (cart.typeItem === 'plans') {
      props.loadPlanIdAction(cart._id)
      setModalDetails(true)
      setItemType('plans');
    }
    if (cart.typeItem === 'classs') {
      props.loadClassIdAction(cart._id)
      setModalDetails(true)
      setItemType('classs');
    }
    if (cart.typeItem === 'services') {
      props.loadServiceIdAction(cart._id)
      setModalDetails(true)
      setItemType('services');
    }
    if (cart.typeItem === 'packages') {
      props.loadPackagesIdAction(cart._id)
      setModalDetails(true)
      setItemType('packages');
    }
  }
  console.log(props.cart)
  return (
    <div className="cart-wrapper">
      {
        modalDetails && itemType === 'areas' && (
          <ModalAreas
            option={2}
            modal={modalDetails}
            modalHeader="Ver Area"
            buttonFooter=""
            disabled={true}
            showHide={true}
            dataUsers={props.dataGeneral.dataUsers}
            dataPenalties={props.dataGeneral.dataPenalties}
            countryConfiguration={props.dataGeneral.countryConfiguration}
            dataDiscount={props.dataGeneral.dataDiscount}
            confirm={props.openConfirmDialog}
            valorCloseModal={valorCloseModal}
          />
        )
      }
      {
        modalDetails && itemType === 'plans' && (
          <ModalPlanes
            option={2}
            modal={modalDetails}
            modalHeader="Ver Plan"
            buttonFooter=""
            disabled={true}
            showHide={true}
            dataPenalties={props.dataGeneral.dataPenalties}
            countryConfiguration={props.dataGeneral.countryConfiguration}
            confirm={props.openConfirmDialog}
            valorCloseModal={valorCloseModal}
          />
        )
      }
      {
        modalDetails && itemType === 'classs' && (
          <ModalLessons
            option={2}
            modal={modalDetails}
            modalHeader="Ver Clase"
            buttonFooter=""
            disabled={true}
            showHide={true}
            dataPenalties={props.dataGeneral.dataPenalties}
            countryConfiguration={props.dataGeneral.countryConfiguration}
            confirm={props.openConfirmDialog}
            valorCloseModal={valorCloseModal}
          />
        )
      }
      {
        modalDetails && itemType === 'services' && (
          <ModalService
            option={2}
            modal={modalDetails}
            modalHeader="Ver Servicio"
            buttonFooter=""
            disabled={true}
            showHide={true}
            dataPenalties={props.dataGeneral.dataPenalties}
            countryConfiguration={props.dataGeneral.countryConfiguration}
            confirm={props.openConfirmDialog}
            valorCloseModal={valorCloseModal}
          />
        )
      }
      {
        modalDetails && itemType === 'packages' && (
          <ModalPackage
            option={2}
            modal={modalDetails}
            modalHeader="Ver Servicio"
            buttonFooter=""
            disabled={true}
            showHide={true}
            dataPenalties={props.dataGeneral.dataPenalties}
            countryConfiguration={props.dataGeneral.countryConfiguration}
            confirm={props.openConfirmDialog}
            valorCloseModal={valorCloseModal}
          />
        )
      }
      {
        modalCourtesy &&
        <ModalCourtesy
          modal={modalCourtesy}
          modalHeader={modalHeaderCourtesy}
          valorCloseModalCourtesy={valorCloseModalCourtesy}
          confirm={props.openConfirmDialog}
        />
      }
      {
        modalCredit &&
        <ModalCredit
          modal={modalCredit}
          modalHeader={modalHeaderCredit}
          valorCloseModalCredit={valorCloseModalCredit}
          confirm={props.openConfirmDialog}
        />
      }
      <PageTitleBar title={<IntlMessages id="sidebar.cart" />} match={match} />
      <RctCard>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item className="font-weight-bold text-muted">Aplicar a todos:</Grid>
              <Grid item>
                <Switch
                  checked={creditAll ? creditAll : false}
                  onChange={handleChangeSwitchCredit}
                  value={false}
                  color="primary"
                  disabled={false}
                />
              </Grid>
              <Grid item className="font-weight-bold text-muted">Credito</Grid>
              <Grid item>
                <Switch
                  checked={courtesyAll ? courtesyAll : false}
                  onChange={handleChangeSwitchCourtesy}
                  value={false}
                  color="primary"
                  disabled={false}
                />
              </Grid>
              <Grid item className="font-weight-bold text-muted">Cortesia</Grid>
            </Grid>
          </div>
        </div>
        <RctCardContent noPadding>
          <Table hover responsive className="mb-0" style={{ overflowX: 'hidden' }}>
            <thead>
              <tr>
                <th className="w-5"></th>
                <th className="w-15">
                  <IntlMessages id="components.product" />
                </th>
                <th className="w-10 text-center">
                  <IntlMessages id="components.quantityProductCart" />
                </th>
                <th className="w-15 text-center">
                  <IntlMessages id="widgets.price" />
                </th>
                <th className="w-15 text-center">
                  <IntlMessages id="components.importProduct" />
                </th>
                <th className="w-15 text-center">
                  <IntlMessages id="components.taxProduct" />
                </th>
                <th className="w-15 text-center">
                  <IntlMessages id="components.totalPriceProduct" />
                </th>
                <th className="w-15 text-center">
                  <IntlMessages id="components.actionCartProduct" />
                </th>
              </tr>
            </thead>
            <tbody>
              {!isEmpty ? (
                cart.map((cart, key) => (
                  <tr key={key}>
                    <td className="w-5 text-center">
                      <img
                        src={cart.image}
                        alt="products"
                        className="media-object"
                        width="100"
                        height="100"
                      />
                    </td>
                    <td className="w-15">
                      <h3>{textTruncate(cart.name, 40)}</h3>
                      <span className="fs-14 d-block text-muted">
                        {textTruncate(cart.description, 80)}
                      </span>
                      <span className="fs-14 d-block text-muted">
                        {cart.brand}
                      </span>
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={cart.productQuantity}
                        onChange={(e) => onChangeQuantity(e.target.value, cart)}
                      />
                    </td>
                    <td className="text-bold text-center">
                      {number_format(cart.price, 2)}
                    </td>
                    <td className="text-bold text-center">
                      {number_format(cart.importe, 2)}
                    </td>
                    <td className="text-bold text-center">
                      {cart.tax ?
                        `${number_format(cart.tax._amount * cart.productQuantity, 2)} (${cart.tax.amount}%)` :
                        `${number_format(0, 2)}-(${0}%)`
                      }
                    </td>
                    <td className="font-weight-bold text-center">
                      {number_format(cart.totalPrice, 2)}
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <div>
                          <Tooltip title="Eliminar Item" placement="bottom">
                            <IconButton onClick={() => deleteItemCart(cart)}>
                              <i className="zmdi zmdi-close"></i>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Ver Detalles" placement="bottom">
                            <IconButton onClick={() => viewDetails(cart)}>
                              <i className="zmdi zmdi-eye"></i>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          {
                            cart.registry_price === 0 ?
                              <div>
                                <Tooltip title="Opciones de Venta" placement="bottom">
                                  <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                  >
                                    <i className="zmdi zmdi-more-vert"></i>
                                  </IconButton>
                                </Tooltip>
                                <Menu
                                  id="fade-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={open}
                                  onClose={handleClose}
                                  TransitionComponent={Fade}
                                >
                                  <MenuItem onClick={() => { openModalCredit(cart, 'item'); }}>Credito</MenuItem>
                                  <MenuItem onClick={() => { openModalCourtesy(cart, 'item'); }}>Cortesia</MenuItem>
                                </Menu>
                              </div>
                              :
                              <div>
                                <Tooltip title="Opciones de Venta" placement="bottom">
                                  <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleClickSkip}
                                  >
                                    <i className="zmdi zmdi-more-vert"></i>
                                  </IconButton>
                                </Tooltip>
                                <Menu
                                  id="fade-menu"
                                  anchorEl={anchorElSkip}
                                  keepMounted
                                  open={openSkip}
                                  onClose={handleCloseSkip}
                                  TransitionComponent={Fade}
                                >
                                  <MenuItem onClick={() => skipRegistration(cart, !cart.skip_registration ? 'omitir' : 'agregar')}>
                                    {!cart.skip_registration ? 'Omitir Inscripcion' : 'Agregar Inscripcion'}
                                  </MenuItem>
                                  <MenuItem onClick={() => { openModalCredit(cart, 'item'); }}>Credito</MenuItem>
                                  <MenuItem onClick={() => { openModalCourtesy(cart, 'item'); }}>Cortesia</MenuItem>
                                </Menu>
                              </div>
                          }

                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan="8" className="text-center h-25">
                      <span className="d-block font-5x mb-30 text-danger">
                        <i className="zmdi zmdi-shopping-cart"></i>
                      </span>
                      <span className="mb-20 font-3x">
                        <IntlMessages id="components.CartEmptyText" />
                        <br />
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to="/app/sales/point-of-sale"
                          className="text-white"
                        >
                          <IntlMessages id="components.goToShop" />
                        </Button>
                      </span>
                    </td>
                  </tr>
                )}
            </tbody>
            <tfoot>
              <tr className="text-center">
                <td style={{ textAlign: 'left' }}>
                  <Tooltip title="Regresar a la tienda" placement="top">
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/app/sales/point-of-sale"
                        className="text-white"
                      >
                        Atras
                      </Button>
                    </div>
                  </Tooltip>
                </td>
                <td colSpan="4"></td>
                <td>
                  <span className="font-weight-bold">
                    <IntlMessages id="widgets.total" />
                  </span>
                </td>
                <td>
                  <span className="font-weight-bold">
                    {getTotalPrice().totalPrice} {currency_symbol}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    className="text-white"
                    component={Link}
                    to="/app/sales/checkout"
                    disabled={isEmpty || !client}
                  >
                    <IntlMessages id="components.checkout" />
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        </RctCardContent>
      </RctCard>
    </div >
  );
};

const mapStateToProps = ({ ecommerce, general }) => {
  const { cart, client } = ecommerce;
  const { dataGeneral } = general;
  return { cart, client, dataGeneral };
};

export default connect(mapStateToProps, {
  deleteItemFromCart,
  onChangeProductQuantity,
  skipRegistrationAction,
  openConfirmDialog,
  loadAreaIdAction,
  loadClassIdAction,
  loadPackagesIdAction,
  loadServiceIdAction,
  loadPlanIdAction,
})(Carts);
