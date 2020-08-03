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
import InputMask from "react-input-mask";

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

const FormDevices = props => {
    return (
        <div>
            <div className="row">
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="nameDevices">Nombre</Label>
                        <Input
                            invalid={props.modal.nameDevicesError}
                            id="nameDevices"
                            name="nameDevices"
                            onKeyUp={event => props.handlekey(
                                "nameDevicesError",
                                "nameDevicesTextError",
                                "nameDevicesHide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.modal.nameDevices}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.modal.nameDevicesHide} errorControl`}>
                            {props.modal.nameDevicesTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="ipDevices">IP</Label>
                        <div className={props.modal.ipDevicesError}>
                            <InputMask
                                id="ipDevices"
                                name="ipDevices"
                                onKeyUp={event => props.handlekey(
                                    "ipDevicesError",
                                    "ipDevicesTextError",
                                    "ipDevicesHide",
                                    2
                                )}
                                onChange={props.handleChange}
                                value={props.modal.ipDevices}
                                className='form-control'
                                mask="999.999.999.999"
                                disabled={props.disabled}
                            />
                        </div>
                        <div className={`${props.modal.ipDevicesHide} errorControl`}>
                            {props.modal.ipDevicesTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="macDevices">MAC</Label>
                        <Input
                            invalid={props.modal.macDevicesError}
                            id="macDevices"
                            name="macDevices"
                            onKeyUp={event => props.handlekey(
                                "macDevicesError",
                                "macDevicesTextError",
                                "macDevicesHide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.modal.macDevices}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.modal.macDevicesHide} errorControl`}>
                            {props.modal.macDevicesTextError}
                        </div>
                    </div>
                </FormGroup>
                <FormGroup className="top form-group col-sm-6">
                    <div>
                        <Label for="serialPrintDevices">Serial</Label>
                        <Input
                            invalid={props.modal.serialPrintDevicesError}
                            id="serialPrintDevices"
                            name="serialPrintDevices"
                            onKeyUp={event => props.handlekey(
                                "serialPrintDevicesError",
                                "serialPrintDevicesTextError",
                                "serialPrintDevicesHide",
                                1
                            )}
                            onChange={props.handleChange}
                            value={props.modal.serialPrintDevices}
                            type="text"
                            disabled={props.disabled}
                        />
                        <div className={`${props.modal.serialPrintDevicesHide} errorControl`}>
                            {props.modal.serialPrintDevicesTextError}
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
                                onClick={props.cleanFormDevices}
                                disabled={props.disabled}
                            >
                                Limpiar
                            </Button>
                            {
                                props.modal.actionDevices !== 'Ver' && (
                                    <Button
                                        color="primary"
                                        className="text-white"
                                        variant="contained"
                                        onClick={props.addDevices}
                                        disabled={props.disabled}
                                    >
                                        {props.modal.actionDevices}
                                    </Button>
                                )
                            }
                        </div>
                    }
                </FormGroup>
            </div>
        </div >
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
)(FormDevices);