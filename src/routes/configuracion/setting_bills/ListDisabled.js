import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";

import { Button } from "reactstrap";
import { Check } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Visibility, Delete } from "@material-ui/icons";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pager from "../../../components/Pager";
import SearchInput from "../../../components/SearchInput";
import ModalSettingBills from "./ModalSettingBills";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  disabledSettingBillsFunction,
  changeStatusSettingBillAction,
} from "./../../../actions/SettingBillsActions";
import { getLabelTypeSettingBill, GetDisabledPermits } from "./../../../helpers/helpers";

const ListDisabled = (props) => {
  const { confirm, disabledSettingBillsFunction, settingBills } = props;

  // States and States
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalFooter, setModalFooter] = useState("");
  const [buttonFooter, setButtonFooter] = useState("");
  const [data, setData] = useState({});
  const [disabled, setDisabled] = useState("");
  const [showHide, setShowHide] = useState("");
  const [option, setOption] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getSettingBills();
  }, []);

  const getSettingBills = () => {
    setLoading(true);
    disabledSettingBillsFunction()
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const valorCloseModal = (valor) => {
    setModal(valor);
  };

  const openModal = (option, data) => {
    if (option === 1) {
      setOption(option);
      setModalHeader("Registrar configuración de factura");
      setButtonFooter("Guardar");
      setDisabled(false);
      setShowHide(false);
      setData(data);
      setModal(true);
    } else if (option === 2) {
      setOption(option);
      setModalHeader("Ver configuración de factura");
      setButtonFooter("Editar");
      setDisabled(true);
      setShowHide(true);
      setData(data);
      setModal(true);
    } else if (option === 3) {
      setOption(option);
      setModalHeader("Editar configuración de factura");
      setButtonFooter("Editar");
      setDisabled(false);
      setShowHide(false);
      setData(data);
      setModal(true);
    }
  };

  const activar = (data) => {
    const message = {
      title: "Inactivar configuración de factura",
      info: `¿Esta seguro que desea activar la configuración de factura ${data.name}?`,
    };
    confirm(message, (res) => {
      if (res) {
        changeStatusSettingBillAction(data)
          .then((res) => {})
          .catch((error) => {});
      }
    });
  };

  return (
    <RctCollapsibleCard
      heading="Lista de Configuración de factura Inactivas"
      fullBlock
    >
      <div className="table-responsive">
        <div className="containerGeneral">
          <div className="container-button"></div>
          <div className="containerSearch">
            <SearchInput allFunction={disabledSettingBillsFunction} />
          </div>
        </div>
        <br />
        {!loading ? (
          <div>
            <Table aria-label="a dense table">
              <TableHead className="">
                <TableRow hover>
                  <TableCell style={{ width: "5%" }} align="left">
                    Nro
                  </TableCell>
                  <TableCell style={{ width: "15%" }} align="left">
                    Tipo
                  </TableCell>
                  <TableCell style={{ width: "15%" }} align="left">
                    Nombre
                  </TableCell>
                  <TableCell style={{ width: "15%" }} align="left">
                    Mac
                  </TableCell>
                  <TableCell style={{ width: "20%" }} align="left">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Fragment>
                  {settingBills.dataDisabled && settingBills.pagination
                    ? settingBills.dataDisabled.map((data, i) => {
                        let num =
                          settingBills.pagination.page *
                            settingBills.pagination.perPage -
                          settingBills.pagination.perPage +
                          (i + 1);
                        return (
                          <TableRow hover key={i}>
                            <TableCell style={{ width: "5%" }} align="left">
                              {num}
                            </TableCell>
                            <TableCell style={{ width: "15%" }} align="left">
                              {getLabelTypeSettingBill(data.type)}
                            </TableCell>
                            <TableCell style={{ width: "15%" }} align="left">
                              {data.name}
                            </TableCell>
                            <TableCell style={{ width: "15%" }} align="left">
                              {data.mac}
                            </TableCell>
                            <TableCell
                              style={{ width: "20%", minWidth: "200px" }}
                              align="left"
                            >
                              <div
                                className=""
                                style={{ marginTop: "-24px", height: "10px" }}
                              >
                                <IconButton
                                  aria-label="Delete"
                                  title="Activar configuración de factura"
                                  className="iconButtons"
                                  onClick={() => {
                                    activar(data);
                                  }}
                                  disabled={GetDisabledPermits(props.permitsModule, "Habilitar")}
                                >
                                  <Check className="iconTable" />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </Fragment>
              </TableBody>
            </Table>
            {settingBills.dataDisabled &&
              settingBills.pagination &&
              settingBills.dataDisabled.length > 0 && (
                <div>
                  <br />
                  <Pager
                    dataPagination={settingBills.pagination}
                    allFunction={disabledSettingBillsFunction}
                  />
                </div>
              )}
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
    </RctCollapsibleCard>
  );
};

const mapStateToProps = (state) => {
  return {
    settingBills: state.settingBills.toJS(),
    dataGeneral: state.general.dataGeneral,
  };
};

const mapDispatchToProps = (dispatch) => ({
  disabledSettingBillsFunction: (page, perPage, search) =>
    dispatch(disabledSettingBillsFunction(page, perPage, search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDisabled);
