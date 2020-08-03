import React, { Component, Fragment } from 'react';
import { Badge, Input } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Visibility } from "@material-ui/icons";
import MatButton from '@material-ui/core/Button';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pager from '../../../components/Pager';
import SearchInput from "../../../components/SearchInput";
import "../../../assets/css/style.css";
import ModalEmpresa from "./ModalEmpresa";
import { GetDisabledPermits } from "../../../helpers/helpers";

class ListEmpresas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalHeader: '',
            modalFooter: '',
            data: {},
            disabled: '',
            option: 0,
            page: 0,
            rowsPerPage: 10,
        };
    }

    valorCloseModal = (valor) => {
        this.setState({
            modal: valor,
        });
    }

    openModal = (option, data) => {
        if (option === 1) {
            this.setState({
                option: option,
                modal: true,
                modalHeader: 'Ver Empresa',
                buttonFooter: 'Guardar',
                disabled: true,
                showHide: true,
                data: data,
            })
        }
        else if (option === 2) {
            this.setState({
                option: option,
                modal: true,
                modalHeader: 'Editar Empresa',
                buttonFooter: 'Editar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
    }

    render() {
        const { data, pagination, loadEmpresas } = this.props;
        return (
            <RctCollapsibleCard heading="Lista de Empresas" fullBlock>
                {
                    this.state.modal &&
                    <ModalEmpresa
                        option={this.state.option}
                        modal={this.state.modal}
                        modalHeader={this.state.modalHeader}
                        buttonFooter={this.state.buttonFooter}
                        disabled={this.state.disabled}
                        showHide={this.state.showHide}
                        data={this.state.data}
                        loadEmpresas={loadEmpresas}
                        valorCloseModal={this.valorCloseModal}
                        confirm={this.props.confirm}
                    />
                }

                <div className="table-responsive">
                    <div className="containerGeneral">
                        <div className="container-button" >

                        </div>
                        <div className="containerSearch">
                            <SearchInput allFunction={this.props.allBusinessFunction} />
                        </div>
                    </div>
                    <br />
                    <Table aria-label="a dense table">
                        <TableHead className="">
                            <TableRow hover>
                                <TableCell style={{ width: '20%' }} align="left">Nro</TableCell>
                                <TableCell style={{ width: '60%' }} align="left">Nombre</TableCell>
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
                                            <TableCell style={{ width: '60%' }} align="left">{data.name}</TableCell>
                                            <TableCell style={{ width: '20%', minWidth: '130px' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Ver Empresa"
                                                        className="iconButtons"
                                                        onClick={() => { this.openModal(1, data); }}
                                                        disabled={GetDisabledPermits(this.props.permitsModule, "Editar")}
                                                    >
                                                        <Visibility className="iconTable" />
                                                    </IconButton>
                                                    <IconButton aria-label="Delete"
                                                        title="Editar Empresa"
                                                        className="iconButtons"
                                                        onClick={() => { this.openModal(2, data); }}
                                                        disabled={GetDisabledPermits(this.props.permitsModule, "Eliminar")}
                                                    >
                                                        <Edit className="iconTable" />
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
                                allFunction={this.props.allBusinessFunction}
                            />
                        </div>
                    }
                </div>
            </RctCollapsibleCard>
        );
    }
}
export default ListEmpresas;