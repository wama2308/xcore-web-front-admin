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
import ModalCategories from "./ModalCategories";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GetDisabledPermits, formatDateDateTables } from "../../../helpers/helpers";

const ListCategoriesEnabled = props => {
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
                modalHeader: 'Registrar Categoria',
                buttonFooter: 'Guardar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
        else if (option === 2) {
            props.loadCategoryIdAction(data._id)
            setList({
                option: option,
                modal: true,
                modalHeader: 'Ver Categoria',
                buttonFooter: 'Editar',
                disabled: true,
                showHide: true,
                data: data,
            })
        }
        else if (option === 3) {
            props.loadCategoryIdAction(data._id)
            setList({
                option: option,
                modal: true,
                modalHeader: 'Editar Categoria',
                buttonFooter: 'Editar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
    }

    const desactivar = (id) => {
        const message = {
            title: "Inactivar Categoria",
            info: "¿Esta seguro que desea inactivar esta categoria?"
        };
        props.confirm(message, res => {
            if (res) {
                props.changeEstatusCategoryFunction(id);
            }
        });
    }

    const { data, pagination } = props;
    return (
        <RctCollapsibleCard heading="Lista de Categorias Activas" fullBlock>
            {
                list.modal &&
                <ModalCategories
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
                        //disabled={GetDisabledPermits(props.permitsModule, "Crear")}
                        >
                            Registrar
                    </Button>
                    </div>
                    <div className="containerSearch">
                        <SearchInput allFunction={props.allCategoryFunction} />
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
                                                    <TableCell style={{ width: '10%', minWidth: '200px' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton aria-label="Delete"
                                                                title="Ver Categoria"
                                                                className="iconButtons"
                                                                onClick={() => { openModal(2, data); }}
                                                            //disabled={GetDisabledPermits(props.permitsModule, "Ver")}
                                                            >
                                                                <Visibility className="iconTable" />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete"
                                                                title="Editar Categoria"
                                                                className="iconButtons"
                                                                onClick={() => { openModal(3, data); }}
                                                            //disabled={GetDisabledPermits(props.permitsModule, "Editar")}
                                                            >
                                                                <Edit className="iconTable" />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete"
                                                                title="Inactivar Categoria"
                                                                className="iconButtons"
                                                                onClick={() => { desactivar(data.id); }}
                                                            //disabled={GetDisabledPermits(props.permitsModule, "Eliminar")}
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
                                        allFunction={props.allCategoryFunction}
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

export default ListCategoriesEnabled