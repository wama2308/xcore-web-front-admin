import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    Collapse,
} from "reactstrap";
import "../../../assets/css/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    saveCategoryAction,
    updateCategoryAction,
    addSettingsCategoryFunction,
    updateSettingsCategoryFunction,
    deleteSettingsCategoryFunction,
    addSettingsModuleFunction,
    updateSettingsModuleFunction,
    deleteSettingsModuleFunction,
    clenaSettingsModuleFunction,
} from "../../../actions/CategoryActions"
import { connect } from "react-redux";
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { NotificationManager } from 'react-notifications';
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormDatosCategoria from './FormDatosCategoria';
import FormSettingsCategory from './FormSettingsCategory';
import FormModuleCategory from './FormModuleCategory';
import { stateInitial } from './StateInitialCategories';
import { number_format, formatMonto, formatDateTime } from "../../../helpers/helpers";
import moment from "moment";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    }
}));

const ModalCategories = props => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const initialFormState = stateInitial;
    const [formDatosCategoria, setFormDatosCategoria] = useState(initialFormState)


    const handleChangeTabs = (event, newValue) => {
        setValue(newValue);
    };

    const handleNextTabsOne = () => {
        setValue(1);
    }

    const closeModal = (option) => {
        if (option === 0) {
            const message = {
                title: "Cerrar Ventana",
                info: "¿Esta seguro que desea cerrar la ventana?"
            };
            props.confirm(message, res => {
                if (res) {
                    setFormDatosCategoria(prev => ({ ...prev, loading: "show" }))
                    setFormDatosCategoria({
                        ...initialFormState
                    });
                    props.valorCloseModal(false);
                }
            });
        } else {
            setFormDatosCategoria(prev => ({ ...prev, loading: "show" }))
            setFormDatosCategoria({
                ...initialFormState
            });
            props.valorCloseModal(false);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormDatosCategoria(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handlekey = (campoError, campoErrorText, hide, type) => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [campoError]: type === 1 ? false : "",
            [campoErrorText]: "",
            [hide]: "hide",
        }));
    };

    const handleChangeSelect = (value, select, selectError, selectErrorText, selecthide) => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        }));

    };

    const handleChangeSwitch = (name, error, textError, hide, option) => event => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [name]: event.target.checked,
            [error]: option === 1 ? false : '',
            [textError]: '',
            [hide]: 'hide',
        }));
        if (name === 'test') {
            setFormDatosCategoria(prev => ({
                ...prev,
                test_end_date: new Date(),
            }));
        }
    };

    const handleChangeExpirationDate = (input, error, errorText, hide) => event => {
        setFormDatosCategoria(prev => ({
            ...prev,
            [input]: event,
            [error]: '',
            [errorText]: '',
            [hide]: 'hide',
        }));
    }

    const handlekeyMonto = (campo, campoError, campoErrorText, campohide) => {
        let monto = event.target.value.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        setFormDatosCategoria(prev => ({
            ...prev,
            [campo]: monto,
            [campoError]: false,
            [campoErrorText]: '',
            [campohide]: 'hide',
        }));
    };

    const eventoBlur = (e) => {
        if (formDatosCategoria.individual_amount === '' || formDatosCategoria.individual_amount === '0.0') {
            setFormDatosCategoria(prev => ({
                ...prev,
                individual_amount: '0'
            }));
        }
    }

    const eventoFocus = (e) => {
        if (formDatosCategoria.individual_amount === '0') {
            setFormDatosCategoria(prev => ({
                ...prev,
                individual_amount: ''
            }));
        }
    }

    const cleanFieldsSettings = () => {
        setFormDatosCategoria(prev => ({
            ...prev,
            xc_language_id: null,
            xc_language_id_error: '',
            xc_language_id_text_error: '',
            xc_language_id_hide: '',
            menu_title: '',
            menu_title_error: false,
            menu_title_text_error: '',
            menu_title_hide: 'hide',
            tooltips: '',
            tooltips_error: false,
            tooltips_text_error: '',
            tooltips_hide: 'hide',
            test_description: '',
            test_description_error: false,
            test_description_text_error: '',
            test_description_hide: 'hide',
            actionSettingsCategory: 0,
            keySettingsCategory: -1,
        }));
    }

    const validate = () => {
        let acum = "";
        if (formDatosCategoria.name === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                name_error: true,
                name_text_error: "Ingrese el nombre",
                name_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.menu_icon === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                menu_icon_error: 'borderColor',
                menu_icon_text_error: "Ingrese el nombre",
                menu_icon_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.type === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                type_error: 'borderColor',
                type_text_error: "Ingrese el nombre",
                type_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.position === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                position_error: true,
                position_text_error: "Ingrese el nombre",
                position_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.individual_amount === '0' || formDatosCategoria.individual_amount === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                individual_amount_error: true,
                individual_amount_text_error: "Ingrese el nombre",
                individual_amount_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.test && formDatosCategoria.test_end_date === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                test_end_date_error: 'borderColor',
                test_end_date_text_error: "Ingrese la fecha de culminacion de la prueba",
                test_end_date_hide: 'show',
            }))
            acum = 1;
        }

        if (acum > 0) {
            return false;
        }
        return true;
    }

    const handleDatosCategory = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            handleNextTabsOne();
        }
    }

    /////////////////////////////////////////////////////////CATEGORY SETTINGS

    const validateSettings = () => {
        let acum = "";
        if (formDatosCategoria.xc_language_id === null) {
            setFormDatosCategoria(prev => ({
                ...prev,
                xc_language_id_error: 'borderColor',
                xc_language_id_text_error: "Seleccione el lenguaje",
                xc_language_id_hide: 'show',
            }))
            acum = 1;
        }
        if (formDatosCategoria.menu_title === '') {
            setFormDatosCategoria(prev => ({
                ...prev,
                menu_title_error: true,
                menu_title_text_error: "Ingrese el titulo",
                menu_title_hide: 'show',
            }))
            acum = 1;
        }
        if (props.category.dataSettings.find(data => data.xc_language_id.value === formDatosCategoria.xc_language_id.value) &&
            (props.category.dataSettings.findIndex(data => data.xc_language_id.value === formDatosCategoria.xc_language_id.value) !== formDatosCategoria.keySettingsCategory)
        ) {
            setFormDatosCategoria(prev => ({
                ...prev,
                xc_language_id_error: 'borderColor',
                xc_language_id_text_error: "Este lenguaje ya esta registrado",
                xc_language_id_hide: 'show',
            }))
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    }

    const handleDatosSettingsCategory = event => {
        event.preventDefault();
        const isValid = validateSettings();
        if (isValid) {
            let data = {
                xc_language_id: formDatosCategoria.xc_language_id,
                menu_title: formDatosCategoria.menu_title,
                tooltips: formDatosCategoria.tooltips,
                test_description: formDatosCategoria.test_description,
            };
            if (formDatosCategoria.actionSettingsCategory === 0) {
                props.addSettingsCategoryFunction(data, () => { cleanFieldsSettings() });
            } else {
                props.updateSettingsCategoryFunction(formDatosCategoria.keySettingsCategory, data, () => { cleanFieldsSettings() });
            }
        }
    }

    const updateSetting = (key, data) => {
        const message = {
            title: "Editar Configuracion",
            info: "¿Esta seguro que desea editar esta configuracion?"
        };
        props.confirm(message, res => {
            if (res) {
                setFormDatosCategoria(prev => ({
                    ...prev,
                    xc_language_id: data.xc_language_id,
                    menu_title: data.menu_title,
                    tooltips: data.tooltips,
                    test_description: data.test_description,
                    actionSettingsCategory: 1,
                    keySettingsCategory: key
                }))
            }
        });
    }

    const deleteSetting = (key) => {
        if (formDatosCategoria.keySettingsCategory === key) {
            NotificationManager.warning("¡La configuracion esta en proceso de edicion, no puede ser eliminada!");
        } else {
            const message = {
                title: "Eliminar Configuracion",
                info: "¿Esta seguro que desea eliminar este configuracion?"
            };
            props.confirm(message, res => {
                if (res) {
                    props.deleteSettingsCategoryFunction(key);
                }
            });
        }
    }
    /////////////////////////////////////////////////////////CATEGORY SETTINGS

    const arraysSettings = (data) => {
        let settings = [];
        data.map((dataSettings, i) => {
            settings.push(
                {
                    xc_language_id: dataSettings.xc_language_id.value,
                    menu_title: dataSettings.menu_title,
                    tooltips: dataSettings.tooltips,
                    test_description: dataSettings.test_description,
                }
            );
        });
        return settings;
    }

    const handleActionCategories = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid && props.category.dataSettings.length > 0) {
            setFormDatosCategoria(prev => ({
                ...prev,
                loading: "show"
            }));
            let dataSend = {
                _id: props.data ? props.data.id : 0,
                name: formDatosCategoria.name,
                menu_icon: formDatosCategoria.menu_icon.value,
                description: formDatosCategoria.description,
                type: formDatosCategoria.type.value,
                new_item: formDatosCategoria.new_item,
                open: formDatosCategoria.open,
                position: formDatosCategoria.position,
                individual_amount: formatMonto(formDatosCategoria.individual_amount),
                test: formDatosCategoria.test,
                test_end_date: formatDateTime(formDatosCategoria.test_end_date),
                menu_settings: arraysSettings(props.category.dataSettings),
            }
            if (props.option === 1) {
                props.saveCategoryAction(dataSend, () => { closeModal(1); });
            }
            if (props.option === 3) {
                props.updateCategoryAction(dataSend, () => { closeModal(1); });
            }
        } else if (!isValid) {
            NotificationManager.warning("¡Verifique los campos de la pestaña datos de la categoria!");
        } else if (props.category.dataSettings.length === 0) {
            NotificationManager.warning("¡Debe agregar al menos una configuracion!");
        }
    }

    useEffect(() => {
        if (props.option === 1) {
            setFormDatosCategoria(prev => ({ ...prev, loading: "hide" }))
        }

    }, [props.category])
    //console.log("modal categoria ", props.category)
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={props.modal}
            onClose={() => { closeModal(0); }}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
            {formDatosCategoria.loading === "hide" ? (
                <div>
                    <DialogTitle id="form-dialog-title">
                        <div style={{ display: 'flex' }}>
                            <div>
                                {props.modalHeader}
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <IconButton aria-label="Delete"
                                    className="iconButtons"
                                    onClick={() => { closeModal(0); }}
                                >
                                    <Close className="iconTable" />
                                </IconButton>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent dividers>
                        <div className={classes.root}>
                            <AppBar position="static" color="default">
                                <Tabs
                                    indicatorColor="primary"
                                    value={value}
                                    onChange={handleChangeTabs}
                                    aria-label="simple tabs example"
                                >
                                    <Tab label="Datos de la categoria" {...a11yProps(0)} />
                                    <Tab label="Configuracion" {...a11yProps(1)} />
                                </Tabs>
                            </AppBar>
                            <TabPanel value={value} index={0}>
                                <FormDatosCategoria
                                    option={props.option}
                                    handleChange={handleChange}
                                    handlekey={handlekey}
                                    handleChangeSelect={handleChangeSelect}
                                    handleChangeSwitch={handleChangeSwitch}
                                    handleChangeExpirationDate={handleChangeExpirationDate}
                                    handlekeyMonto={handlekeyMonto}
                                    eventoBlur={eventoBlur}
                                    eventoFocus={eventoFocus}
                                    formDatosCategoria={formDatosCategoria}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <FormSettingsCategory
                                    handleChange={handleChange}
                                    handlekey={handlekey}
                                    handleChangeSelect={handleChangeSelect}
                                    handleDatosSettingsCategory={handleDatosSettingsCategory}
                                    updateSetting={updateSetting}
                                    deleteSetting={deleteSetting}
                                    dataLanguajes={props.dataGeneral.dataLanguajes}
                                    dataSettings={props.category.dataSettings}
                                    formDatosCategoria={formDatosCategoria}
                                    confirm={props.confirm}
                                    option={props.option}
                                />
                            </TabPanel>
                            {/* <TabPanel value={value} index={2}>
                                <FormModuleCategory
                                    handleChange={handleChange}
                                    handlekey={handlekey}
                                    handleChangeSelect={handleChangeSelect}
                                    handleChangeSwitch={handleChangeSwitch}
                                    handleChangeExpirationDate={handleChangeExpirationDate}
                                    handlekeyMonto={handlekeyMonto}
                                    eventoBlur={eventoBlur}
                                    eventoFocus={eventoFocus}
                                    handleDatosModulesSettings={handleDatosModulesSettings}
                                    updateModuleSetting={updateModuleSetting}
                                    deleteModuleSetting={deleteModuleSetting}
                                    collapseFunction={collapseFunction}
                                    dataSettingsModules={props.category.dataSettingsModules}
                                    formDatosCategoria={formDatosCategoria}
                                    confirm={props.confirm}
                                    option={props.option}
                                />
                            </TabPanel> */}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => { closeModal(0); }}
                            color="danger"
                            className="text-white"
                        >
                            Cancel
                        </Button>
                        {
                            !props.showHide &&
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                onClick={value === 0 ? handleDatosCategory : handleActionCategories}
                            >
                                {
                                    value === 0 ? 'Siguiente' : props.buttonFooter
                                }

                            </Button>
                        }

                    </DialogActions>
                </div>
            ) : (
                    <div style={{ height: "55vh" }}>
                        <CircularProgress
                            style={{
                                position: "fixed",
                                height: 40,
                                top: "45%",
                                right: "50%",
                                zIndex: 2
                            }}
                        />
                    </div>
                )
            }
            <style jsx=''>
                {
                    `.rct-title {
                            margin-left: -15%;              
                        }`
                }
            </style>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    category: state.category,
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    saveCategoryAction: (data, callback) => dispatch(saveCategoryAction(data, callback)),
    updateCategoryAction: (data, callback) => dispatch(updateCategoryAction(data, callback)),
    addSettingsCategoryFunction: (data, callback) => dispatch(addSettingsCategoryFunction(data, callback)),
    updateSettingsCategoryFunction: (key, data, callback) => dispatch(updateSettingsCategoryFunction(key, data, callback)),
    deleteSettingsCategoryFunction: (key) => dispatch(deleteSettingsCategoryFunction(key)),
    addSettingsModuleFunction: (data, callback) => dispatch(addSettingsModuleFunction(data, callback)),
    updateSettingsModuleFunction: (key, data, callback) => dispatch(updateSettingsModuleFunction(key, data, callback)),
    deleteSettingsModuleFunction: (key) => dispatch(deleteSettingsModuleFunction(key)),
    clenaSettingsModuleFunction: () => dispatch(clenaSettingsModuleFunction()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCategories);