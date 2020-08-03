/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup } from 'reactstrap';
import CircularProgress from "@material-ui/core/CircularProgress";
import QueueAnim from 'rc-queue-anim';
import "../assets/css/style.css";
import { SessionSlider } from 'Components/Widgets';
import TextField from '@material-ui/core/TextField';
import AppConfig from 'Constants/AppConfig';
import { changePassword } from "../actions/AuthActions";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordError: false,
            passwordTextError: '',
            confirmPassword: '',
            confirmPasswordError: false,
            confirmPasswordTextError: '',
            disabled: false,
            loading: false
        };
    }

    componentDidMount() {
        let params = new URLSearchParams(location.search);
        var emailUrl = params.get('email');
        this.setState({
            email: emailUrl
        });
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekeyPassword = event => {
        this.setState({
            passwordError: false,
            passwordTextError: ""
        });
    };

    handlekeyconfirmPassword = event => {
        this.setState({
            confirmPasswordError: false,
            confirmPasswordTextError: ""
        });
    };

    loading() {
        this.setState({
            loading: false
        });
    }

    previous() {
        this.props.history.push(`/code/forgot/password/?email=${this.state.email}`);
    }

    next() {
        this.setState({
            loading: false
        });
        this.props.history.push(`/signin`);
    }

    validarClave(contrasenna) {
        if (contrasenna.length >= 8) {
            var mayuscula = false;
            var minuscula = false;
            var numero = false;
            var caracter_raro = false;

            for (var i = 0; i < contrasenna.length; i++) {
                if (contrasenna.charCodeAt(i) >= 65 && contrasenna.charCodeAt(i) <= 90) {
                    mayuscula = true;
                }
                else if (contrasenna.charCodeAt(i) >= 97 && contrasenna.charCodeAt(i) <= 122) {
                    minuscula = true;
                }
                else if (contrasenna.charCodeAt(i) >= 48 && contrasenna.charCodeAt(i) <= 57) {
                    numero = true;
                }
                else {
                    caracter_raro = true;
                }
            }
            if (mayuscula == true && minuscula == true && caracter_raro == true && numero == true) {
                return true;
            }
        }
        return false;
    }

    validate = () => {
        let acum = "";
        if (!this.state.password) {
            this.setState({
                passwordTextError: "¡Ingrese la contraseña!",
                passwordError: true,
            });
            acum = 1;
        }
        if (this.state.password && !this.validarClave(this.state.password)) {
            this.setState({
                passwordError: true,
                passwordTextError: "La contraseña debe contener al menos ocho caracteres, una mayuscula, un numero, un caracter especial",
            });
            acum = 1;
        }
        if (!this.state.confirmPassword) {
            this.setState({
                confirmPasswordTextError: "¡Ingrese la confirmacion de la contraseña!",
                confirmPasswordError: true,
            });
            acum = 1;
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                confirmPasswordError: true,
                confirmPasswordTextError: "La contraseña y la confirmacion deben ser iguales",
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    };

    handleChangePassword = event => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.setState({
                loading: true,
            });
            this.props.changePassword(
                {
                    email: this.state.email,
                    password: this.state.password,
                    password_confirmation: this.state.confirmPassword
                },
                () => {
                    this.loading();
                },
                () => {
                    this.next();
                }
            );
        }
    };

    render() {

        return (

            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <Link to="/">
                                            <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>

                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-7 col-md-7 col-lg-8">
                                    <div className="session-body text-center">
                                        <div className="session-head mb-30">
                                            <h2 className="font-weight-bold">Cambiar Contraseña</h2>
                                        </div>
                                        {
                                            !this.state.loading ?
                                                <Form onSubmit={this.handleChangePassword.bind(this)}>
                                                    <FormGroup className="mb-15">
                                                        <TextField
                                                            error={this.state.passwordError}
                                                            label="Nueva Contraseña"
                                                            disabled={this.props.disabled}
                                                            name="password"
                                                            id="password"
                                                            onKeyUp={this.handlekeyPassword}
                                                            onChange={this.handleChange}
                                                            value={this.state.password}
                                                            type="password"
                                                            margin="dense"
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <div className="errorControl">
                                                            {this.state.passwordTextError}
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="mb-15">
                                                        <TextField
                                                            error={this.state.confirmPasswordError}
                                                            label="Confirmar Contraseña"
                                                            disabled={this.props.disabled}
                                                            name="confirmPassword"
                                                            id="confirmPassword"
                                                            onKeyUp={this.handlekeyconfirmPassword}
                                                            onChange={this.handleChange}
                                                            value={this.state.confirmPassword}
                                                            type="password"
                                                            margin="dense"
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <div className="errorControl">
                                                            {this.state.confirmPasswordTextError}
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="mb-15">
                                                        <Button
                                                            disabled={this.state.disabled}
                                                            color="primary"
                                                            className="btn-block text-white w-100"
                                                            variant="contained"
                                                            size="large"
                                                            onClick={this.handleChangePassword}
                                                        >
                                                            Cambiar
                                                        </Button>
                                                    </FormGroup>
                                                    <FormGroup className="mb-15">
                                                        <Button
                                                            style={{ backgroundColor: "#DC2D08" }}
                                                            className="btn-block text-white w-100"
                                                            variant="contained"
                                                            size="large"
                                                            onClick={() => this.previous()}
                                                        >
                                                            Regresar
                                                        </Button>
                                                    </FormGroup>
                                                </Form>
                                                :
                                                <div style={{ height: "10vh" }}>
                                                    <CircularProgress style={{ position: " absolute", height: 40, top: "45%", right: "50%", zIndex: 2 }} />
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-4">
                                    <SessionSlider />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </QueueAnim>
        );
    }
}

// map state to props
const mapDispatchToProps = dispatch => ({
    changePassword: (data, loading, next) => dispatch(changePassword(data, loading, next)),
});
export default connect(null, mapDispatchToProps)(ChangePassword);
