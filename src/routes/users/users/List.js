import React, { Fragment, useState, useEffect } from 'react';
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
import Modal from "./Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GetDisabledPermits } from "../../../helpers/helpers";

const List = props => {
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

    const valorCloseModal = valor => {
        setList({ modal: false })
        props.cleanStoreFunction();
    }

    const openModal = (option, data) => {
        if (option === 1) {
            setList({
                option: option,
                modal: true,
                modalHeader: 'Registrar Usuario',
                buttonFooter: 'Guardar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
        else if (option === 2) {
            props.loadUsersIdAction(data._id)
            setList({
                option: option,
                modal: true,
                modalHeader: 'Ver Usuario',
                buttonFooter: 'Editar',
                disabled: true,
                showHide: true,
                data: data,
            })
        }
        else if (option === 3) {
            props.loadUsersIdAction(data._id)
            setList({
                option: option,
                modal: true,
                modalHeader: 'Editar Usuario',
                buttonFooter: 'Editar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
    }

    const desactivar = (id) => {
        const message = {
            title: "Inactivar Usuario",
            info: "¿Esta seguro que desea inactivar este usuario?"
        };
        props.confirm(message, res => {
            if (res) {
                props.changeEstatusUsersFunction(id);
            }
        });
    }

    const { data, pagination } = props;
    return (
        <RctCollapsibleCard heading="Lista de Usuarios Activos" fullBlock>
            {
                list.modal &&
                <Modal
                    option={list.option}
                    modal={list.modal}
                    modalHeader={list.modalHeader}
                    buttonFooter={list.buttonFooter}
                    disabled={list.disabled}
                    showHide={list.showHide}
                    data={list.data}
                    valorCloseModal={valorCloseModal}
                    confirm={props.confirm}
                />
            }
            <div className="table-responsive">
                <div className="containerGeneral">
                    <div className="container-button" >
                        <Button
                            style={{ marginLeft: '3vh' }}
                            color="primary"
                            onClick={() => { openModal(1); }}
                            disabled={GetDisabledPermits(props.permitsModule, "Crear")}
                        >
                            Registrar
                    </Button>
                    </div>
                    <div className="containerSearch">
                        <SearchInput allFunction={props.allUsersFunction} />
                    </div>
                </div>
                <br />
                {
                    !props.loading ?
                        <div>

                            <Table aria-label="a dense table">
                                <TableHead className="">
                                    <TableRow hover>
                                        <TableCell style={{ width: '20%' }} align="left">Nro</TableCell>
                                        {/* <TableCell style={{ width: '20%' }} align="left">Nombres</TableCell>
                                        <TableCell style={{ width: '20%' }} align="left">Apellidos</TableCell> */}
                                        <TableCell style={{ width: '60%' }} align="left">Email</TableCell>
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
                                                    {/* <TableCell style={{ width: '20%' }} align="left">{data.names}</TableCell>
                                                    <TableCell style={{ width: '20%' }} align="left">{data.surnames}</TableCell> */}
                                                    <TableCell style={{ width: '60%' }} align="left">{data.email}</TableCell>
                                                    <TableCell style={{ width: '20%', minWidth: '200px' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Ver Usuario"
                                                                className="iconButtons"
                                                                onClick={() => { openModal(2, data); }}
                                                                disabled={GetDisabledPermits(props.permitsModule, "Ver")}
                                                            >
                                                                <Visibility className="iconTable" />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete"
                                                                title="Editar Usuario"
                                                                className="iconButtons"
                                                                onClick={() => { openModal(3, data); }}
                                                                disabled={GetDisabledPermits(props.permitsModule, "Editar")}
                                                            >
                                                                <Edit className="iconTable" />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete"
                                                                title="Inactivar Usuario"
                                                                className="iconButtons"
                                                                onClick={() => { desactivar(data._id); }}
                                                                disabled={GetDisabledPermits(props.permitsModule, "Eliminar")}
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
                                        dataPagination={props.pagination}
                                        allFunction={props.allUsersFunction}
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

export default List