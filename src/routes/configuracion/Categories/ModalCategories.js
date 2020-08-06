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
    const [loading, setLoading] = React.useState('show');
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
                    setLoading('show');
                    setFormDatosCategoria({
                        ...initialFormState
                    });
                    props.valorCloseModal(false);
                }
            });
        } else {
            setLoading('show');
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

    const handleChangeExpirationDate = date => {
        setFormDatosCategoria(prev => ({
            ...prev,
            test_end_date: date,
            test_end_date_error: "",
            test_end_date_text_error: '',
            test_end_date_hide: 'hide',
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

    const cleanFields = () => {
        setFormDatosCategoria({
            ...initialFormState
        });
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
            console.log(1111);
            handleNextTabsOne();
        }
    }

    const handleActionCategories = () => {
        console.log(777)
    }

    useEffect(() => {
        if (props.option === 1) {
            //setFormDatosCategoria(prev => ({ ...prev, loading: "hide" }))
            setLoading('hide');
        }

    }, [props.category])
    console.log("modal categoria ", props.category)
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={props.modal}
            onClose={() => { closeModal(0); }}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
            {loading === "hide" ? (
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
                                    <Tab label="Datos" {...a11yProps(0)} />
                                    <Tab label="Configuracion" {...a11yProps(1)} />
                                    <Tab label="Modulos" {...a11yProps(2)} />
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
                                    cleanFields={cleanFields}
                                    handleDatosCategory={handleDatosCategory}
                                    formDatosCategoria={formDatosCategoria}

                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <FormSettingsCategory
                                    addSettingsCategoryFunction={props.addSettingsCategoryFunction}
                                    updateSettingsCategoryFunction={props.updateSettingsCategoryFunction}
                                    deleteSettingsCategoryFunction={props.deleteSettingsCategoryFunction}
                                    dataSettings={props.category.dataSettings}
                                    confirm={props.confirm}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <FormModuleCategory 
                                    addSettingsModuleFunction={props.addSettingsModuleFunction}
                                    updateSettingsModuleFunction={props.updateSettingsModuleFunction}
                                    deleteSettingsModuleFunction={props.deleteSettingsModuleFunction}
                                    clenaSettingsModuleFunction={props.clenaSettingsModuleFunction}
                                    dataSettingsModules={props.category.dataSettingsModules}
                                    confirm={props.confirm}
                                />
                            </TabPanel>
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
                                onClick={handleActionCategories}
                            >
                                {props.buttonFooter}
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