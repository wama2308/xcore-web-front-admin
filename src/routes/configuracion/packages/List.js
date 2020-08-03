import React, { Component, Fragment } from 'react';
import { Button } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Visibility, Delete } from "@material-ui/icons";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pager from '../../../components/Pager';
import SearchInput from "../../../components/SearchInput";
import "../../../assets/css/style.css";
import ModalPackage from "./ModalPackage";
import { number_format } from "../../../helpers/helpers";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GetDisabledPermits } from "../../../helpers/helpers";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalHeader: '',
            modalFooter: '',
            data: {},
            disabled: '',
            option: 0,
        };
    }

    valorCloseModal = (valor) => {        
        this.props.cleanStoreFunction();
    }

    openModal = (option, data) => {
        if(this.props.packages.actionDataExtra === 0){
            this.props.dataExtraPackages();
        }        
        if (option !== 1) {
            this.props.loadPackagesIdAction(data._id)
        }
        this.props.modalFunction(option, data);
    }

    desactivar(id) {
        const message = {
            title: "Inactivar Paquete",
            info: "¿Esta seguro que desea inactivar este paquete?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.changeEstatusPackagesFunction(id);
            }
        });
    }

    render() {
        const { data, pagination } = this.props;
        return (
            <RctCollapsibleCard heading="Lista de Paquetes Activos" fullBlock>
                {
                    this.props.packages.modal.modal &&
                    <ModalPackage
                        option={this.props.packages.modal.option}
                        modal={this.props.packages.modal.modal}
                        modalHeader={this.props.packages.modal.modalHeader}
                        buttonFooter={this.props.packages.modal.buttonFooter}
                        disabled={this.props.packages.modal.disabled}
                        showHide={this.props.packages.modal.showHide}
                        data={this.props.packages.modal.data}
                        valorCloseModal={this.valorCloseModal}
                        confirm={this.props.confirm}
                    />
                }
                <div className="table-responsive">
                    <div className="containerGeneral">
                        <div className="container-button" >
                            <Button
                                style={{ marginLeft: '3vh' }}
                                color="primary"
                                onClick={() => { this.openModal(1); }}
                                disabled={GetDisabledPermits(this.props.permitsModule, "Crear")}
                            >
                                Registrar
                            </Button>
                        </div>
                        <div className="containerSearch">
                            <SearchInput allFunction={this.props.allPackagesFunction} />
                        </div>
                    </div>
                    <br />
                    {
                        !this.props.loading ?
                            <div>
                                <Table aria-label="a dense table">
                                    <TableHead className="">
                                        <TableRow hover>
                                            <TableCell style={{ width: '20%' }} align="left">Nro</TableCell>
                                            <TableCell style={{ width: '30%' }} align="left">Nombre</TableCell>
                                            <TableCell style={{ width: '30%' }} align="left">Monto</TableCell>
                                            <TableCell style={{ width: '20%' }} align="left">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <Fragment>
                                            {data ? data.map((data, i) => {
                                                let num = (((pagination.page * pagination.perPage) - pagination.perPage) + (i + 1));
                                                return (
                                                    <TableRow hover key={i}>
                                                        <TableCell style={{ width: '20%' }} align="left">{num}</TableCell>
                                                        <TableCell style={{ width: '30%' }} align="left">{data.name}</TableCell>
                                                        <TableCell style={{ width: '30%' }} align="left">{number_format(data.amount, 2)}</TableCell>
                                                        <TableCell style={{ width: '20%', minWidth: '200px' }} align="left">
                                                            <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                                <IconButton aria-label="Delete"
                                                                    title="Ver Paquete"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.openModal(2, data); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Crear")}
                                                                >
                                                                    <Visibility className="iconTable" />
                                                                </IconButton>
                                                                <IconButton aria-label="Delete"
                                                                    title="Editar Paquete"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.openModal(3, data); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Crear")}
                                                                >
                                                                    <Edit className="iconTable" />
                                                                </IconButton>
                                                                <IconButton aria-label="Delete"
                                                                    title="Inactivar Paquete"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.desactivar(data._id); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Crear")}
                                                                >
                                                                    <Delete className="iconTable" />
                                                                </IconButton>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                                :
                                                null
                                            }
                                        </Fragment>
                                    </TableBody>
                                </Table>
                                {
                                    data.length > 0 &&
                                    <div>
                                        <br />
                                        <Pager
                                            dataPagination={this.props.pagination}
                                            allFunction={this.props.allPackagesFunction}
                                        />
                                    </div>
                                }
                            </div>
                            :
                            <div style={{ height: "60vh" }}>
                                <CircularProgress style={{ position: " absolute", height: 40, top: "45%", right: "50%", zIndex: 2 }} />
                            </div>
                    }
                </div>
            </RctCollapsibleCard>
        );
    }
}

const mapStateToProps = state => ({
    packages: state.packages.toJS(),
    dataGeneral: state.general.dataGeneral
});
export default connect(
    mapStateToProps,
    null
)(List);