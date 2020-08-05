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

    const initialState = {
        loading: 'show',
    }
    const [modal, setModal] = useState(initialState)

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
                    setModal({
                        ...initialState
                    });
                    props.valorCloseModal(false);
                }
            });
        } else {
            setModal({
                ...initialState
            });
            props.valorCloseModal(false);
        }
    };

    useEffect(() => {
        if (props.option === 1) {
            setModal(prev => ({ ...prev, loading: "hide" }))
        }
        // else if (props.option === 2 || props.option === 3) {
        //     if (Object.keys(props.provider.providerId).length > 0 && modal.actionReducer === 0) {
        //         cargarData(props.provider.providerId);
        //     }
        // }
    }, [props.category])
    console.log("value tab", props.category);
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={props.modal}
            onClose={() => { closeModal(0); }}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
            {modal.loading === "hide" ? (
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
                                    handleNextTabsOne={handleNextTabsOne}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <FormSettingsCategory />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                Item Three
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
                            //onClick={handleActionCategories}
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
    saveProviderAction: (data, callback) => dispatch(saveProviderAction(data, callback)),
    updateCategoryAction: (data, callback) => dispatch(updateCategoryAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCategories);