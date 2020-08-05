import React, { Fragment, useState, useEffect } from 'react';
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
import { GetDisabledPermits, formatDateDateTables } from "../../../helpers/helpers";

const ListCategoriesDisabled = props => {
    const initialState = {
        modal: false,
        modalHeader: '',
        modalFooter: '',
        buttonFooter: '',
        data: {},
        disabled: '',
        showHide: false,
        option: 0,
    }
    const [list, setList] = useState(initialState)

    const activar = (id) => {
        const message = {
            title: "Activar Categoria",
            info: "¿Esta seguro que desea activar este categoria?"
        };
        props.confirm(message, res => {
            if (res) {
                props.changeEstatusCategoryFunction(id);
            }
        });
    }

    const { data, pagination } = props;
    return (
        <RctCollapsibleCard heading="Lista de Categorias Inactivas" fullBlock>
            <div className="table-responsive">
                <div className="containerGeneral">
                    <div className="container-button" >

                    </div>
                    <div className="containerSearch">
                        <SearchInput allFunction={props.allCategoryDisabledFunction} />
                    </div>
                </div>
                <br />
                {
                    !props.loading ?
                        <div>
                            <Table aria-label="a dense table">
                                <TableHead className="">
                                    <TableRow hover>
                                        <TableCell style={{ width: '10%' }} align="left">Nro</TableCell>
                                        <TableCell style={{ width: '20%' }} align="left">Nombre</TableCell>
                                        <TableCell style={{ width: '20%' }} align="left">Tipo</TableCell>
                                        <TableCell style={{ width: '20%' }} align="left">Creado por</TableCell>
                                        <TableCell style={{ width: '20%' }} align="left">Creacion</TableCell>
                                        <TableCell style={{ width: '10%' }} align="left">Accion</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <Fragment>
                                        {data ? data.map((data, i) => {
                                            let num = (((pagination.page * pagination.perPage) - pagination.perPage) + (i + 1));
                                            return (
                                                <TableRow hover key={i}>
                                                    <TableCell style={{ width: '10%' }} align="left">{num}</TableCell>
                                                    <TableCell style={{ width: '20%' }} align="left">{data.name}</TableCell>
                                                    <TableCell style={{ width: '20%' }} align="left">{data.type}</TableCell>
                                                    <TableCell style={{ width: '20%' }} align="left">
                                                        {data.createdBy.names} {data.createdBy.surnames}
                                                    </TableCell>
                                                    <TableCell style={{ width: '20%' }} align="left">{formatDateDateTables(data.created_at)}</TableCell>
                                                    <TableCell style={{ width: '10%', minWidth: '130px' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Activar Proveedor"
                                                                className="iconButtons"
                                                                onClick={() => { activar(data.id); }}
                                                            //disabled={GetDisabledPermits(props.permitsModule, "Habilitar")}
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
                                        dataPagination={props.pagination}
                                        allFunction={props.allCategoryDisabledFunction}
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
    )
}

export default ListCategoriesDisabled