import React, { Component, Fragment } from 'react';
import { Button } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import { Check } from "@material-ui/icons";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pager from '../../../components/Pager';
import SearchInput from "../../../components/SearchInput";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GetDisabledPermits } from "../../../helpers/helpers";

class ListDisabled extends React.Component {
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

    activar(id) {
        const message = {
            title: "Activar Servicio",
            info: "¿Esta seguro que desea activar esta clase?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.changeEstatusServiceFunction(id);
            }
        });
    }

    render() {
        const { data, pagination } = this.props;
        return (
            <RctCollapsibleCard heading="Lista de Servicios Inactivos" fullBlock>
                <div className="table-responsive">
                    <div className="containerGeneral">
                        <div className="container-button" >

                        </div>
                        <div className="containerSearch">
                            <SearchInput allFunction={this.props.allServicesDisabledFunction} />
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
                                                                    title="Activar Servicio"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.activar(data._id); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Habilitar")}
                                                                >
                                                                    <Check className="iconTable" />
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
                                            allFunction={this.props.allServicesDisabledFunction}
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
export default ListDisabled;