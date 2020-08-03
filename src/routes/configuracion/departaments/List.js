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
import Modal from "./Modal";
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
            page: 0,
            rowsPerPage: 10,
        };
    }

    valorCloseModal = (valor) => {
        this.setState({
            modal: valor,
        });
        this.props.cleanStoreFunction();
    }

    openModal = (option, data) => {
        if (option === 1) {
            this.setState({
                option: option,
                modal: true,
                modalHeader: 'Registrar Departamento',
                buttonFooter: 'Guardar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
        else if (option === 2) {
            this.props.loadDepartamentsIdAction(data._id)
            this.setState({
                option: option,
                modal: true,
                modalHeader: 'Ver Departamento',
                buttonFooter: 'Editar',
                disabled: true,
                showHide: true,
                data: data,
            })
        }
        else if (option === 3) {
            this.props.loadDepartamentsIdAction(data._id)
            this.setState({
                option: option,
                modal: true,
                modalHeader: 'Editar Departamento',
                buttonFooter: 'Editar',
                disabled: false,
                showHide: false,
                data: data,
            })
        }
    }

    desactivar(id) {
        const message = {
            title: "Inactivar Departamento",
            info: "¿Esta seguro que desea inactivar este departamento?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.changeEstatusDepartamentsFunction(id);
            }
        });
    }

    render() {
        const { data, pagination } = this.props;
        return (
            <RctCollapsibleCard heading="Lista de Departamentos Activos" fullBlock>
                {
                    this.state.modal &&
                    <Modal
                        option={this.state.option}
                        modal={this.state.modal}
                        modalHeader={this.state.modalHeader}
                        buttonFooter={this.state.buttonFooter}
                        disabled={this.state.disabled}
                        showHide={this.state.showHide}
                        data={this.state.data}
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
                            <SearchInput allFunction={this.props.allDepartamentsFunction} />
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
                                                        <TableCell style={{ width: '20%', minWidth: '200px' }} align="left">
                                                            <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                                <IconButton aria-label="Delete"
                                                                    title="Ver Departamento"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.openModal(2, data); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Ver")}
                                                                >
                                                                    <Visibility className="iconTable" />
                                                                </IconButton>
                                                                <IconButton aria-label="Delete"
                                                                    title="Editar Departamento"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.openModal(3, data); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Editar")}
                                                                >
                                                                    <Edit className="iconTable" />
                                                                </IconButton>
                                                                <IconButton aria-label="Delete"
                                                                    title="Inactivar Departamento"
                                                                    className="iconButtons"
                                                                    onClick={() => { this.desactivar(data._id); }}
                                                                    disabled={GetDisabledPermits(this.props.permitsModule, "Eliminar")}
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
                                            allFunction={this.props.allDepartamentsFunction}
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
export default List;