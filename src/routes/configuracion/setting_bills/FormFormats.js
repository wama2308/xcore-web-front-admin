import React, { useState, useEffect, Fragment } from "react";
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    Collapse,
    FormFeedback,
} from "reactstrap";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { stateInitial } from './StateInitial';
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import {
    type_setting_bills,
    getTypeSettingBill,
} from "../../../helpers/helpers";

import { getServerErrors } from "../../../factorys/validations";
import {
    storeSettingBillAction,
    loadSettingBillIdAction,
    updateSettingBillAction,
} from "../../../actions/SettingBillsActions";

const FormFormats = props => {
    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="type">Tipo</Label>
                        <Input
                            invalid={props.modal.typeFormatError}
                            type="select"
                            name="typeFormat"
                            id="typeFormat"
                            value={props.modal.typeFormat}
                            onChange={event => props.handleChangeSelectSimple(event.target.value)}
                            disabled={props.disabled}
                        >
                            <option value='0' >Seleccione...</option>
                            {
                                props.modal.optionsTypeFormat.map((data, i) => {
                                    return (
                                        <option key={i} value={data.value} >{data.label}</option>
                                    )
                                })
                            }
                        </Input>
                        <div className={`${props.modal.typeFormatHide} errorControl`}>
                            {props.modal.typeFormatTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    <div>
                        <Label for="formato">Formato</Label>
                        <div className={props.modal.formatTemplateError}>
                            <Editor
                                value={props.modal.formatTemplate}
                                init={{
                                    height: 350,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help | table'
                                }}
                                onEditorChange={event => props.handleEditorChange(event)}
                                name="formatTemplate"
                                id="formatTemplate"
                                disabled={props.disabled}                                
                            />
                        </div>
                        <div className={`${props.modal.formatTemplateHide} errorControl`}>
                            {props.modal.formatTemplateTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-12">
                    {
                        <div className="" style={{ marginLeft: 'auto' }}>
                            <Button
                                style={{ marginRight: '5px' }}
                                color="danger"
                                className="text-white"
                                variant="contained"
                                onClick={props.cleanFormFormat}
                                disabled={props.disabled}
                            >
                                Limpiar
                            </Button>
                            {
                                props.modal.actionFormat !== 'Ver' && (
                                    <Button
                                        color="primary"
                                        className="text-white"
                                        variant="contained"
                                        onClick={props.addFormat}
                                        disabled={props.disabled}
                                    >
                                        {props.modal.actionFormat}
                                    </Button>
                                )
                            }
                        </div>
                    }
                </FormGroup>
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
)(FormFormats);