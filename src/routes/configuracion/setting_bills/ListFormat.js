import React, { useState, useEffect, Fragment } from "react";
import {
    Label,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Visibility, Delete } from "@material-ui/icons";

const ListFormat = props => {

    const viewFormat = (data, option, index) => {
        props.setModal(prev => ({
            ...prev,
            typeFormat: data.typeFormato,
            formatTemplate: data.formatTemplate,
            actionFormat: option,
            indexArrayFormat: index,
        }));
    }

    const deleteFormat = (key) => {
        const message = {
            title: "Eliminar Formato",
            info: "¿Esta seguro que desea eliminar este formato?"
        };
        props.confirm(message, res => {
            if (res) {
                props.deleteFormatFunction(key);
                props.setModal(prev => ({
                    ...prev,
                    typeFormat: '0',
                    formatTemplate: '',
                    actionFormat: 'Agregar',
                    typeFormat: '0',
                    typeFormatError: false,
                    typeFormatTextError: '',
                    typeFormatHide: 'hide',
                    formatTemplate: "",
                    formatTemplateError: '',
                    formatTemplateTextError: '',
                    formatTemplateHide: 'hide',
                    indexArrayFormat: 0,
                }));
            }
        });
    }

    return (
        <div>
            <hr />
            <div>
                <Label>Lista de Formatos</Label>
                <br />
                <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                    <thead>
                        <tr>
                            <td style={{ width: '30%' }} align="left">Nro</td>
                            <td style={{ width: '40%' }} align="left">Nombre</td>
                            {
                                !props.disabled &&
                                <td style={{ width: '30%' }} align="left">Accion</td>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((data, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ width: '30%' }} align="left">{i + 1}</td>
                                        <td style={{ width: '40%' }} align="left">{data.typeFormato}</td>
                                        {
                                            !props.disabled &&
                                            <td style={{ width: '30%' }} align="left">
                                                <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                    <IconButton aria-label="Delete"
                                                        title="Ver Formato"
                                                        className="iconButtons"
                                                        onClick={() => { viewFormat(data, 'Ver', i); }}
                                                    // disabled={this.props.disabled}
                                                    >
                                                        <Visibility className="iconTable" />
                                                    </IconButton>
                                                    <IconButton aria-label="Delete"
                                                        title="Editar Formato"
                                                        className="iconButtons"
                                                        onClick={() => { viewFormat(data, 'Editar', i); }}
                                                    // disabled={this.props.disabled}
                                                    >
                                                        <Edit className="iconTable" />
                                                    </IconButton>
                                                    <IconButton aria-label="Delete"
                                                        title="Eliminar Formato"
                                                        className="iconButtons"
                                                        onClick={() => { deleteFormat(i); }}

                                                    // disabled={this.props.disabled}
                                                    >
                                                        <Delete className="iconTable" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    settingBills: state.settingBills.toJS(),
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveCargosAction: (data, callback) => dispatch(saveCargosAction(data, callback)),
    updateCargosAction: (data, callback) => dispatch(updateCargosAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListFormat);