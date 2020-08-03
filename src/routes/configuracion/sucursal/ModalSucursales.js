import React, { useState, useEffect } from "react";
import {
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    FormFeedback,
    FormText,
    Card,
    CardBody,
    Collapse,
} from "reactstrap";
import "../../../assets/css/style.css";
import "../../../assets/css/geo.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveBranchOfficesAction, updateBranchOfficesAction } from "../../../actions/SucursalActions"
import { connect } from "react-redux";
import Select from "react-select";
import Switch from '@material-ui/core/Switch';
import Geosuggest from "react-geosuggest";
import MapComponent from "./Map";
import {
    uuidv4,
} from './../../../components/utils'
import ListContactos from "./ListContactos";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import { getServerErrors } from './../../../factorys/validations'

const newContact = () => {
    return {
        uuidv4: uuidv4(),
        name: "",
        surname: "",
        email: "",
        phone: ""
    }
}

const ModalSucursalesHooks = (props) => {

    const isEditOrView = props.option === 2 || props.option === 3

    let {
        option,
        modal,
        modalHeader,
        buttonFooter,
        disabled,
        showHide,
        data,
        dataGeneral,
        valorCloseModal,
        confirm,
        sucursal,
        saveBranchOfficesAction,
        updateBranchOfficesAction,
        loadBranchOfficesIdAction
    } = props

    const [form, setForm] = useState({
        name: "",
        logo: "",
        address: "",
        contacts: [newContact()],
        center: false,
        code: "",
        location: {
            lat: '',
            lng: ''
        },
        type_id: "",
        country_id: "",
        province_id: "",
        district_id: "",
        photos: [],
        social_network: {
            instagram: "",
            facebook: "",
            twitter: "",
            web: ""
        },
        multi_branch: false,
    });
    const [loading, setLoading] = useState('hide');
    const [loadingForm, setLoadingForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [contactos, setContactos] = useState(false);
    const [sociales, setSociales] = useState(false);
    const [multimedia, setMultimedia] = useState(false);
    const [localizacion, setLocal] = useState(false);
    const [initialLocation, setInitialLocation] = useState({
        lat: '',
        lng: ''
    });
    const [zoom, setZoom] = useState(13);
    const [isMarkerShown, setIsMarkerShown] = useState(true);

    useEffect(() => {
        getGeolocation()
    }, []);

    if (isEditOrView && props.data && props.data._id) {
        useEffect(() => {
            getSucursal(props.data._id)
        }, []);
    }

    const addContact = () => {
        const contact = newContact()
        form.contacts.push(contact)
        setForm(form)
    }

    const getGeolocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            setInitialLocation(location)
            setForm({
                ...form,
                location
            })
        });
    }

    const getSucursal = (_id) => {
        setLoading('show')
        loadBranchOfficesIdAction(_id)
            .then(response => {
                setLoading('hide')
                let sucursal = response.data
                if (sucursal.type && sucursal.type.value) {
                    sucursal.type_id_object = sucursal.type
                    sucursal.type_id = sucursal.type.value
                }
                if (sucursal.country) {
                    const {
                        country,
                        province,
                        district
                    } = sucursal.country
                    sucursal.country_id = country.value;
                    sucursal.country_id_object = country;

                    sucursal.province_id = province.value;
                    sucursal.province_id_object = province;

                    sucursal.district_id = district.value;
                    sucursal.district_id_object = district;
                }
                if (sucursal.location && Array.isArray(sucursal.location) && sucursal.location.length > 1) {
                    sucursal.location = {
                        lat: sucursal.location[0],
                        lng: sucursal.location[1]
                    }
                    setForm(sucursal)
                }
            })
            .catch(error => {
                setLoading('hide')
            });
    }

    const refrescarMapa = () => {
        const location = initialLocation;
        setForm({
            ...form,
            location
        })
        setZoom(13);
    };

    const closeModal = (option) => {
        if (option === 0) {
            const message = {
                title: "Cerrar Ventana",
                info: "¿Esta seguro que desea cerrar la ventana?"
            };
            props.confirm(message, res => {
                if (res) {
                    valorCloseModal(false);
                }
            });
        } else {
            valorCloseModal(false);
        }
    };

    const handleChange = event => {
        const value = (event.target.type !== "checkbox") ? event.target.value : event.target.checked;
        const name = event.target.name;
        setForm({
            ...form,
            [name]: value
        })
        setErrors({
            ...errors,
            [name]: ''
        })
    }

    const handleChangeSocial = event => {
        const value = (event.target.type !== "checkbox") ? event.target.value : event.target.checked;
        const name = event.target.name;
        setForm({
            ...form,
            social_network: {
                ...form.social_network,
                [name]: value
            }
        })
        setErrors({
            ...errors,
            [name]: ''
        })
    }

    const handleChangeContact = event => {
        const value = event.target.value;
        const name = event.target.name;
        const uuidv4 = event.target.dataset.uuidv4
        setForm({
            ...form,
            contacts: form.contacts.map((item, index) => {
                if (item.uuidv4 === uuidv4) {
                    item[name] = value
                    setErrors({
                        ...errors,
                        [`contacts.${index}.${name}`]: ''
                    })
                }
                return item
            })
        })
    }

    const handleChangeSelect = (options, key) => {
        setForm({
            ...form,
            [`${key}_object`]: options,
            [key]: options.value
        })
        setErrors({
            ...errors,
            [key]: ''
        })
    }

    const handleChangeSelectCountry = (options, key) => {
        setForm({
            ...form,
            [`${key}_object`]: options,
            [key]: options.value,
            province_id_object: null,
            province_id: '',
            district_id_object: null,
            district_id: '',
        })
        setErrors({
            ...errors,
            [key]: ''
        })
        const selectCountry = dataGeneral.dataPaises.find(item => (item.value === options.value && item.province) ? item : null);
        dataGeneral.dataProvincia = (selectCountry && selectCountry.province) ? selectCountry.province : []
    }

    const handleChangeSelectProvince = (options, key) => {
        setForm({
            ...form,
            [`${key}_object`]: options,
            [key]: options.value,
            district_id_object: null,
            district_id: '',
        })
        setErrors({
            ...errors,
            [key]: ''
        })
        const selectProvince = dataGeneral.dataProvincia.find(item => (item.value === options.value && item.district) ? item : null);
        dataGeneral.dataDiscount = (selectProvince && selectProvince.district) ? selectProvince.district : []
    }

    const handleSaveSucursal = event => {
        event.preventDefault();
        setLoadingForm(true);
        let dataForm = { ...form }
        let { lat, lng } = form.location
        dataForm.location = [lat, lng]
        if (option === 1) {
            saveBranchOfficesAction(dataForm)
                .then(res => {
                    closeModal(1);
                })
                .catch(error => {
                    const { status, data } = error.response
                    let serverErrors = {}
                    if (status && status === 422) {
                        serverErrors = getServerErrors(data)
                    }
                    setLoadingForm(false);
                    setErrors(serverErrors)
                });
        }
        if (option === 3) {
            updateBranchOfficesAction(dataForm)
                .then(res => {
                    closeModal(1);
                })
                .catch(error => {
                    const { status, data } = error.response
                    let serverErrors = {}
                    if (status && status === 422) {
                        serverErrors = getServerErrors(data)
                    }
                    setLoadingForm(false);
                    setErrors(serverErrors)
                });
        }
    };

    const onSuggestSelect = suggest => {
        if (!suggest || disabled) {
            return;
        }
        let location = {
            lat: suggest.location.latitude,
            lng: suggest.location.longitude
        }
        setForm({
            ...form,
            location
        })
        setIsMarkerShown(false)
        let i = 6;
        let mapzoom = setInterval(() => {
            if (zoom === 15) {
                clearInterval(mapzoom);
            } else {
                i = i + 1;
                setZoom(i);
            }
        }, 200);
    };

    const handleClickmap = event => {
        if (disabled) {
            return;
        }
        const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }
        setForm({
            ...form,
            location
        })
        setIsMarkerShown(true)
    };

    const handleMarkerClick = marker => {
        console.log(marker)
    }

    const fileHandler = event => {
        const data = event.currentTarget.files[0]
        const name = event.currentTarget.name
        if (data.size && (data.size) / 1024 > 1024) {
            setErrors({
                ...errors,
                [name]: 'Tamaño de la imagen no permitido'
            })
        } else {
            const file = data;
            if (!file) { return; }
            let reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = () => {
                setForm({
                    ...form,
                    [name]: reader.result
                })

                setErrors({
                    ...errors,
                    [name]: ''
                })
            };
        }
    };

    const fileHandlerPhotos = event => {
        let photos = []
        const files = event.currentTarget.files
        const name = event.currentTarget.name
        if (files && files.length > 3) {
            setErrors({
                ...errors,
                [name]: 'Seleccione un máximo de 3 imágenes'
            })
            return false
        }
        for (const data of files) {
            console.log(data.size, (data.size) / 1024)
            if (data.size && (data.size) / 1024 > 1024) {
                setErrors({
                    ...errors,
                    [name]: 'Tamaño de la imagen no permitido'
                })
            } else {
                const file = data;
                if (!file) { return; }
                let reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onloadend = () => {
                    photos.push(reader.result)
                    setForm({
                        ...form,
                        photos
                    })
                    setErrors({
                        ...errors,
                        [name]: ''
                    })
                };
            }
        }
    };

    let googleMaps = {}
    if (form.location) {
        googleMaps = (window.google && window.google.maps) ? new window.google.maps.LatLng(form.location.lat, form.location.lng) : {}
    }

    const { lat, lng } = form.location

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
                                {modalHeader}
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
                        <Form name="form-sucursal" onSubmit={handleSaveSucursal}>
                            <div className="row">
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="name">Nombre</Label>
                                        <Input
                                            label="Nombre"
                                            invalid={(errors['name']) ? true : false}
                                            id="name"
                                            name="name"
                                            onChange={handleChange}
                                            value={form.name}
                                            type="text"
                                            disabled={disabled}
                                        />
                                        <FormFeedback>{errors['name']}</FormFeedback>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="code">Codigo</Label>
                                        <Input
                                            label="Codigo"
                                            invalid={(errors['code']) ? true : false}
                                            id="code"
                                            name="code"
                                            onChange={handleChange}
                                            value={form.code}
                                            type="text"
                                            disabled={disabled}
                                        />
                                        <FormFeedback>{errors['code']}</FormFeedback>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div className={(errors['type_id']) ? 'is-invalid' : ''}>
                                        <Label for="type_id">Tipo</Label>
                                        <Select
                                            isSearchable="true"
                                            isDisabled={disabled}
                                            name="type_id"
                                            id="type_id"
                                            value={form.type_id_object}
                                            onChange={(option) => handleChangeSelect(option, 'type_id')}
                                            options={dataGeneral.dataGeneral.typeBranchOffice}
                                        />
                                        <FormFeedback>{errors['type_id']}</FormFeedback>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="country_id">Pais</Label>
                                        <div className={(errors['country_id']) ? 'is-invalid' : ''}>
                                            <Select
                                                isSearchable="true"
                                                isDisabled={disabled}
                                                name="country_id"
                                                id="country_id"
                                                value={form.country_id_object}
                                                onChange={(option) => handleChangeSelectCountry(option, 'country_id')}
                                                options={dataGeneral.dataPaises}
                                            />
                                            <FormFeedback>{errors['country_id']}</FormFeedback>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="province_id">Provincia</Label>
                                        <div className={(errors['province_id']) ? 'is-invalid' : ''}>
                                            <Select
                                                isSearchable="true"
                                                isDisabled={disabled}
                                                name="province_id"
                                                id="province_id"
                                                value={form.province_id_object}
                                                onChange={(option) => handleChangeSelectProvince(option, 'province_id')}
                                                options={dataGeneral.dataProvincia}
                                            />
                                            <FormFeedback>{errors['province_id']}</FormFeedback>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="district_id">Distrito</Label>
                                        <div className={(errors['district_id']) ? 'is-invalid' : ''}>
                                            <Select
                                                isSearchable="true"
                                                isDisabled={disabled}
                                                name="district_id"
                                                id="district_id"
                                                value={form.district_id_object}
                                                onChange={(option) => handleChangeSelect(
                                                    option,
                                                    'district_id'
                                                )}
                                                options={dataGeneral.dataDiscount}
                                            />
                                            <FormFeedback>{errors['district_id']}</FormFeedback>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="address">Dirección</Label>
                                        <Input
                                            name="address"
                                            invalid={(errors['address']) ? true : false}
                                            id="address"
                                            onChange={handleChange}
                                            value={form.address}
                                            type="textarea"
                                            disabled={disabled}
                                            placeholder="address"
                                        />
                                        <FormFeedback>{errors['address']}</FormFeedback>
                                    </div>
                                </FormGroup>
                                <FormGroup check className="top form-group col-sm-6">
                                    <Label for="center">center</Label>
                                    <Switch
                                        name="center"
                                        checked={form.center ? form.center : false}
                                        onChange={handleChange}
                                        id="center"
                                        value={form.center}
                                        color="primary"
                                        disabled={disabled}
                                    />
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <div>
                                        <Label for="central">Logo</Label>
                                        <div style={{ height: '39px' }}>
                                            <Label
                                                color="primary"
                                                className="btn"
                                                variant="contained"
                                                style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                            >
                                                <span style={{ fontWeight: '500' }}>Cargar Logo</span>
                                                <Input
                                                    style={{ width: 0, height: 0, opacity: 0 }}
                                                    className="top"
                                                    invalid={(errors['logo']) ? true : false}
                                                    type="file"
                                                    name="logo"
                                                    accept="image/*"
                                                    onChange={event => fileHandler(event)}
                                                    valid={true}
                                                    disabled={disabled}
                                                />
                                                <FormFeedback>{errors['logo']}</FormFeedback>
                                            </Label>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-6">
                                    <Label for="central">
                                        <div>
                                            {form.logo && (
                                                <img
                                                    style={{ width: '100%', height: 'auto' }}
                                                    className="image"
                                                    src={form.logo}
                                                />
                                            )}
                                        </div>
                                    </Label>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            setContactos(!contactos)
                                        }
                                        disabled={disabled}
                                    >
                                        Contactos
                                    </Button>
                                </FormGroup>
                                <div data-validate="contacts"></div>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={contactos}>
                                        {form.contacts.map((contact, index) => {
                                            return (
                                                <div key={index}>
                                                    <Card>
                                                        <CardBody>
                                                            <div className="row">
                                                                <FormGroup className="top form-group col-sm-6">
                                                                    <div>
                                                                        <Label for="nombre">Nombre</Label>
                                                                        <Input
                                                                            label="Nombre"
                                                                            invalid={(errors[`contacts.${index}.name`]) ? true : false}
                                                                            id={`contacts.${index}.name`}
                                                                            name={`name`}
                                                                            data-uuidv4={contact.uuidv4}
                                                                            onChange={handleChangeContact}
                                                                            value={contact.name}
                                                                            type="text"
                                                                            disabled={disabled}
                                                                        />
                                                                        <FormFeedback>{errors[`contacts.${index}.name`]}</FormFeedback>
                                                                    </div>
                                                                </FormGroup>
                                                                <FormGroup className="top form-group col-sm-6">
                                                                    <div>
                                                                        <Label for="surname">Apellido</Label>
                                                                        <Input
                                                                            label="Apellido"
                                                                            invalid={(errors[`contacts.${index}.surname`]) ? true : false}
                                                                            id={`contacts.${index}.surname`}
                                                                            name={`surname`}
                                                                            data-uuidv4={contact.uuidv4}
                                                                            onChange={handleChangeContact}
                                                                            value={contact.surname}
                                                                            type="text"
                                                                            disabled={disabled}
                                                                        />
                                                                        <FormFeedback>{errors[`contacts.${index}.surname`]}</FormFeedback>
                                                                    </div>
                                                                </FormGroup>
                                                                <FormGroup className="top form-group col-sm-6">
                                                                    <div>
                                                                        <Label for="email">Email</Label>
                                                                        <Input
                                                                            label="Email"
                                                                            invalid={(errors[`contacts.${index}.email`]) ? true : false}
                                                                            id={`contacts.${index}.email`}
                                                                            name={`email`}
                                                                            data-uuidv4={contact.uuidv4}
                                                                            onChange={handleChangeContact}
                                                                            value={contact.email}
                                                                            type="email"
                                                                            disabled={disabled}
                                                                        />
                                                                        <FormFeedback>{errors[`contacts.${index}.email`]}</FormFeedback>
                                                                    </div>
                                                                </FormGroup>
                                                                <FormGroup className="top form-group col-sm-6">
                                                                    <div>
                                                                        <Label for="phone">Telefono</Label>
                                                                        <Input
                                                                            label="Telefono"
                                                                            invalid={(errors[`contacts.${index}.phone`]) ? true : false}
                                                                            id={`contacts.${index}.phone`}
                                                                            name={`phone`}
                                                                            data-uuidv4={contact.uuidv4}
                                                                            onChange={handleChangeContact}
                                                                            value={contact.phone}
                                                                            type="text"
                                                                            disabled={disabled}
                                                                        />
                                                                        <FormFeedback>{errors[`contacts.${index}.phone`]}</FormFeedback>
                                                                    </div>
                                                                </FormGroup>
                                                            </div>
                                                            {/* {(index !== 0)? <Button color="danger">Elimnar</Button>: null} */}
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            )
                                        })}
                                        {/* <div style={{marginTop: '10px'}}>
                                            <Button onClick={addContact} color="info">Agregar contacto <i className="fa fa-plus"></i></Button>
                                        </div> */}
                                    </Collapse>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() => setSociales(!sociales)}
                                        disabled={disabled}
                                    >
                                        Sociales
                                    </Button>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={sociales}>
                                        <Card>
                                            <CardBody>
                                                <div className="row">
                                                    <FormGroup className="top form-group col-sm-6">
                                                        <div>
                                                            <Label for="twitter">Twitter</Label>
                                                            <Input
                                                                label="Twitter"
                                                                id="twitter"
                                                                name="twitter"
                                                                onChange={handleChangeSocial}
                                                                value={form.social_network.twitter}
                                                                type="text"
                                                                disabled={disabled}
                                                            />
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="top form-group col-sm-6">
                                                        <div>
                                                            <Label for="instagram">Instagram</Label>
                                                            <Input
                                                                label="Instagram"
                                                                id="instagram"
                                                                name="instagram"
                                                                onChange={handleChangeSocial}
                                                                value={form.social_network.instagram}
                                                                disabled={disabled}
                                                            />
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="top form-group col-sm-6">
                                                        <div>
                                                            <Label for="facebook">Facebook</Label>
                                                            <Input
                                                                label="Facebook"
                                                                id="facebook"
                                                                name="facebook"
                                                                onChange={handleChangeSocial}
                                                                value={form.social_network.facebook}
                                                                type="text"
                                                                disabled={disabled}
                                                            />
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="top form-group col-sm-6">
                                                        <div>
                                                            <Label for="web">Web</Label>
                                                            <Input
                                                                label="Web"
                                                                id="web"
                                                                name="web"
                                                                onChange={handleChangeSocial}
                                                                value={form.social_network.web}
                                                                type="text"
                                                                disabled={disabled}
                                                            />
                                                        </div>
                                                    </FormGroup>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() => setMultimedia(!multimedia)}
                                        disabled={disabled}
                                    >
                                        Multimedia
                                    </Button>
                                </FormGroup>
                                <FormGroup className="top form-group col-sm-12">
                                    <Collapse isOpen={multimedia}>
                                        <Card>
                                            <CardBody>
                                                <div className="row">
                                                    <FormGroup className="top form-group col-sm-4">
                                                        <div>
                                                            <Label
                                                                color="primary"
                                                                className="btn"
                                                                variant="contained"
                                                                style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                            >
                                                                <span style={{ fontWeight: '500' }}>Cargar Imagenes</span>
                                                                <Input
                                                                    style={{ width: 0, height: 0, opacity: 0 }}
                                                                    className="top"
                                                                    invalid={(errors['photos']) ? true : false}
                                                                    type="file"
                                                                    name='photos'
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={event => fileHandlerPhotos(event)}
                                                                    valid={true}
                                                                    disabled={disabled}
                                                                />
                                                                <FormFeedback>{errors['photos']}</FormFeedback>
                                                            </Label>
                                                        </div>
                                                    </FormGroup>
                                                </div>
                                                <div className="row">
                                                    {(form.photos.map((photo, index) => {
                                                        return (
                                                            <FormGroup key={index} className="top form-group col-sm-4">
                                                                <div>
                                                                    {photo && (
                                                                        <img
                                                                            style={{ width: '100%', height: 'auto' }}
                                                                            className="image"
                                                                            src={photo}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </FormGroup>
                                                        )
                                                    }))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </FormGroup>

                                <FormGroup className="top form-group col-sm-4">
                                    <Button
                                        color="primary"
                                        onClick={() => setLocal(!localizacion)}
                                        disabled={disabled}
                                    >
                                        Localizacion
                                    </Button>
                                </FormGroup>
                                <div className="form-group col-lg-12 Widht">
                                    <Collapse isOpen={localizacion}>
                                        <Card>
                                            {lat && (
                                                <CardBody>
                                                    <div>
                                                        {!disabled && (
                                                            <Geosuggest
                                                                placeholder="Buscar en el mapa"
                                                                onSuggestSelect={onSuggestSelect}
                                                                location={googleMaps}
                                                                radius="20"
                                                            />
                                                        )}
                                                    </div>
                                                    <MapComponent
                                                        lat={lat}
                                                        lng={lng}
                                                        onMarkerClick={handleMarkerClick}
                                                        isMarkerShown={isMarkerShown}
                                                        initialLocation={initialLocation}
                                                        // currentLocation={currentLatLng}
                                                        handleClickmap={handleClickmap}
                                                        zoom={zoom}
                                                    />
                                                    <br />
                                                    {
                                                        !disabled &&
                                                        <Button
                                                            color="primary"
                                                            onClick={refrescarMapa}
                                                        >
                                                            Refrescar
                                                    </Button>
                                                    }
                                                </CardBody>
                                            )}
                                        </Card>
                                    </Collapse>
                                </div>

                            </div>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={() => { closeModal(0); }} color="danger" className="text-white">
                            Cancel
                        </Button>
                        {
                            !showHide &&
                            <Button
                                color="primary"
                                className="text-white"
                                variant="contained"
                                disabled={loadingForm}
                                onClick={handleSaveSucursal}
                            >
                                {buttonFooter}
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
                )}
        </Dialog>
    );
}

const mapStateToProps = state => ({
    sucursal: state.sucursal.toJS(),
});

const mapDispatchToProps = dispatch => ({
    saveBranchOfficesAction: (data, callback) => dispatch(saveBranchOfficesAction(data, callback)),
    updateBranchOfficesAction: (data, callback) => dispatch(updateBranchOfficesAction(data, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalSucursalesHooks);