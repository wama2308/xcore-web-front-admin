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
import { recoveryPassword } from "../actions/AuthActions";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailTextError: '',
            emailError: false,
            disabled: false,
            loading: false
        };
    }

    componentDidMount() {}

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekeyEmail = event => {
        this.setState({
            emailError: false,
            emailTextError: ""
        });
    };

    loading() {
        this.setState({
            loading: false
        });
    }

    previous() {
        this.props.history.push(`/signin`);
    }

    next() {
        this.setState({
            loading: false
        });        
        this.props.history.push(`/code/forgot/password/?email=${this.state.email}`);
    }

    validate = () => {
        let acum = "";
        if (!this.state.email) {
            this.setState({
                emailTextError: "¡Ingrese el email!",
                emailError: true,
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    };

    handleValidateEmail = event => {       
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.setState({
                loading: true,
            });
            this.props.recoveryPassword(
                {
                    email: this.state.email                    
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
                                            <h2 className="font-weight-bold">Recuperar Contraseña</h2>
                                        </div>
                                        {
                                            !this.state.loading ?
                                                <Form onSubmit={this.handleValidateEmail.bind(this)}>
                                                    <FormGroup className="mb-15">                                                      
                                                        <TextField
                                                            error={this.state.emailError}
                                                            label="Email"
                                                            disabled={this.props.disabled}
                                                            name="email"
                                                            id="email"
                                                            onKeyUp={this.handlekeyEmail}
                                                            onChange={this.handleChange}
                                                            value={this.state.email}
                                                            type="text"
                                                            margin="dense"
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <div className="errorControl">
                                                            {this.state.emailTextError}
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="mb-15">
                                                        <Button
                                                            disabled={this.state.disabled}
                                                            color="primary"
                                                            className="btn-block text-white w-100"
                                                            variant="contained"
                                                            size="large"
                                                            onClick={this.handleValidateEmail}
                                                        >
                                                            Enviar
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
    recoveryPassword: (data, loading, next) => dispatch(recoveryPassword(data, loading, next)),
});
export default connect(null, mapDispatchToProps)(ForgotPassword);
