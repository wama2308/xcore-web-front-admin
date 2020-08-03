import React, { Component, Fragment } from 'react';
import { Badge, Button } from "reactstrap";
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

class ListDisabled extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { data, pagination } = this.props;

        return (
            <RctCollapsibleCard heading="Lista de Sucursales Inactivas" fullBlock>

                <div className="table-responsive">
                    <div className="containerGeneral">
                        <div className="container-button" ></div>
                        <div className="containerSearch">
                            <SearchInput allFunction={this.props.allBranchOfficesDisabledFunction} />
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
                                            <TableCell style={{ width: '30%' }} align="left">Codigo</TableCell>
                                            <TableCell style={{ width: '20%' }} align="left">Central</TableCell>
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
                                                        <TableCell style={{ width: '30%' }} align="left">{data.code}</TableCell>
                                                        <TableCell style={{ width: '20%' }} align="left">
                                                            {data.center ?
                                                                <Badge color="info">SI</Badge>
                                                                : <Badge color="warning">NO</Badge>
                                                            }
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
                                            allFunction={this.props.allBranchOfficesDisabledFunction}
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