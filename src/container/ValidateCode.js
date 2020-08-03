/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import CircularProgress from "@material-ui/core/CircularProgress";
import QueueAnim from 'rc-queue-anim';
import "../assets/css/style.css";
import { SessionSlider } from 'Components/Widgets';
import TextField from '@material-ui/core/TextField';
import AppConfig from 'Constants/AppConfig';
import { validateCode } from "../actions/AuthActions";

class RequestCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            codigo: '',
            codigoInvalid: '',
            error: false,
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

    handlekeyCodigo = event => {
        this.setState({
            codigoError: "",
            codigoInvalid: ""
        });
    };

    loading() {
        this.setState({
            loading: false
        });
    }

    previous() {
        this.props.history.push(`/request/code/?email=${this.state.email}`);
    }

    next() {
        this.setState({
            loading: false
        });
        this.props.history.push(`/register/user/?email=${this.state.email}`);
    }

    validate = () => {
        let acum = "";
        if (this.state.codigo === "") {
            this.setState({
                codigoError: "¡Ingrese el codigo!",
                error: true,
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    };

    handleValidateCode = event => {
        this.setState({
            loading: true,
         });
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            this.props.validateCode(
                {
                    email: this.state.email,
                    code: this.state.codigo,
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
                                            <h2 className="font-weight-bold">Validar Codigo</h2>
                                        </div>
                                        {
                                            !this.state.loading ?
                                                <Form onSubmit={this.handleValidateCode.bind(this)}>
                                                    <FormGroup className="mb-15">
                                                        {/* <Input
                                                                disabled={this.props.disabled}
                                                                name="codigo"
                                                                id="codigo"
                                                                onKeyUp={this.handlekeyCodigo}
                                                                onChange={this.handleChange}
                                                                value={this.state.codigo}
                                                                type="password"
                                                                placeholder="Codigo"
                                                            /> */}
                                                        <TextField
                                                            error={this.state.error}
                                                            label="Codigo"
                                                            disabled={this.props.disabled}
                                                            name="codigo"
                                                            id="codigo"
                                                            onKeyUp={this.handlekeyCodigo}
                                                            onChange={this.handleChange}
                                                            value={this.state.codigo}
                                                            type="password"
                                                            margin="dense"
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <div className="errorControl">
                                                            {this.state.codigoError}
                                                        </div>
                                                    </FormGroup>
                                                    <FormGroup className="mb-15">
                                                        <Button
                                                            disabled={this.state.disabled}
                                                            color="primary"
                                                            className="btn-block text-white w-100"
                                                            variant="contained"
                                                            size="large"
                                                            onClick={this.handleValidateCode}
                                                        >
                                                            Validar
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
    validateCode: (data, loading, next) => dispatch(validateCode(data, loading, next)),
});
export default connect(null, mapDispatchToProps)(RequestCode);
