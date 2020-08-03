/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import CircularProgress from "@material-ui/core/CircularProgress";
import QueueAnim from 'rc-queue-anim';
import "../assets/css/style.css";
import { SessionSlider } from 'Components/Widgets';
import AppConfig from 'Constants/AppConfig';
import { registerUser, loadSelect } from "../actions/AuthActions";

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            names: '',
            namesTextError: '',
            namesError: false,
            surnames: '',
            surnamesTextError: '',
            surnamesError: false,
            username: '',
            usernameTextError: '',
            usernameError: false,
            password: '',
            passwordTextError: '',
            passwordError: false,
            passwordConfirm: '',
            passwordConfirmTextError: '',
            passwordConfirmError: false,
            questionOne: null,
            questionOneTextError: '',
            questionOneError: '',
            questionTwo: null,
            questionTwoTextError: '',
            questionTwoError: '',
            questionThree: null,
            questionThreeTextError: '',
            questionThreeError: '',
            answerOne: '',
            answerOneTextError: '',
            answerOneError: false,
            answerTwo: '',
            answerTwoTextError: '',
            answerTwoError: false,
            answerThree: '',
            answerThreeTextError: '',
            answerThreeError: false,
            disabled: false,
            loading: false,
            steps: ['Datos', 'Seguridad'],
            activeStep: 0,
            setActiveStep: 0,
        };
    }

    componentDidMount() {
        let params = new URLSearchParams(location.search);
        var emailUrl = params.get('email');
        this.setState({
            email: emailUrl
        });
        this.props.loadSelect();
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekeyNames = event => {
        this.setState({
            namesError: false,
            namesTextError: ""
        });
    };

    handlekeySurnames = event => {
        this.setState({
            surnamesError: false,
            surnamesTextError: ""
        });
    };

    handlekeyUsername = event => {
        this.setState({
            usernameError: false,
            usernameTextError: ""
        });
    };

    handlekeyPassword = event => {
        this.setState({
            passwordError: false,
            passwordTextError: ""
        });
    };

    handlekeyPasswordConfirm = event => {
        this.setState({
            passwordConfirmError: false,
            passwordConfirmTextError: ""
        });
    };

    handlekeyAnswerOne = event => {
        this.setState({
            answerOneError: false,
            answerOneTextError: ""
        });
    };

    handlekeyAnswerTwo = event => {
        this.setState({
            answerTwoError: false,
            answerTwoTextError: ""
        });
    };

    handlekeyAnswerThree = event => {
        this.setState({
            answerThreeError: false,
            answerThreeTextError: ""
        });
    };


    handleChangeQuestionOne = event => {
        this.setState({
            questionOne: event.target.value,
            questionOneTextError: "",
            questionOneError: ""
        });
    };

    handleChangeQuestionTwo = event => {
        this.setState({
            questionTwo: event.target.value,
            questionTwoTextError: "",
            questionTwoError: ""
        });
    };

    handleChangeQuestionThree = event => {
        this.setState({
            questionThree: event.target.value,
            questionThreeTextError: "",
            questionThreeError: ""
        });
    };

    previous() {
        this.props.history.push(`/validate/code/?email=${this.state.email}`);
    }

    next() {
        this.setState({
            loading: false
        });
        this.props.history.push(`/signin`);
    }

    validate = () => {
        let acum = "";        
        if (this.state.names === "") {
            this.setState({
                namesError: true,
                namesTextError: "Ingrese nombres",
            });
            acum = 1;
        }
        if (this.state.surnames === "") {
            this.setState({
                surnamesError: true,
                surnamesTextError: "Ingrese apellidos",
            });
            acum = 1;
        }
        if (this.state.username === "") {
            this.setState({
                usernameError: true,
                usernameTextError: "Ingrese el usuario",
            });
            acum = 1;
        }
        if (this.state.password === "") {
            this.setState({
                passwordError: true,
                passwordTextError: "Ingrese la contraseña",
            });
            acum = 1;
        }
        if (this.state.password !== "" && this.state.password.length < 6) {
            this.setState({
                passwordError: true,
                passwordTextError: "La contraseña debe contener al menos 6 caracteres",
            });
            acum = 1;
        }
        if (this.state.passwordConfirm === "") {
            this.setState({
                passwordConfirmError: true,
                passwordConfirmTextError: "Ingrese la confirmacion de la contraseña",
            });
            acum = 1;
        }
        if (this.state.password !== this.state.passwordConfirm) {
            this.setState({
                passwordConfirmError: true,
                passwordConfirmTextError: "La contraseña y la confirmacion deben ser iguales",
            });
            acum = 1;
        }
        if(!this.validarClave(this.state.password)){
            this.setState({
                passwordError: true,
                passwordTextError: "La contraseña debe contener al menos ocho caracteres, una mayuscula, un numero, un caracter especial",
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    };

    validateEnd = () => {
        let acum = 0;
        if (!this.state.questionOne) {
            this.setState({
                questionOneError: "borderColor",
                questionOneTextError: "Seleccione la pregunta uno",
            });
            acum = 1;
        }
        if (this.state.answerOne === "") {
            this.setState({
                answerOneError: true,
                answerOneTextError: "Ingrese la respuesta uno",
            });
            acum = 1;
        }
        if (!this.state.questionTwo) {
            this.setState({
                questionTwoError: "borderColor",
                questionTwoTextError: "Seleccione la pregunta dos",
            });
            acum = 1;
        }
        if (this.state.answerTwo === "") {
            this.setState({
                answerTwoError: true,
                answerTwoTextError: "Ingrese la respuesta dos",
            });
            acum = 1;
        }
        if (!this.state.questionThree) {
            this.setState({
                questionThreeError: "borderColor",
                questionThreeTextError: "Seleccione la pregunta tres",
            });
            acum = 1;
        }
        if (this.state.answerThree === "") {
            this.setState({
                answerThreeError: true,
                answerThreeTextError: "Ingrese la respuesta tres",
            });
            acum = 1;
        }
        if (this.state.questionOne === this.state.questionTwo || this.state.questionOne === this.state.questionThree) {
            this.setState({
                questionOneError: "borderColor",
                questionOneTextError: "Las preguntas no pueden ser iguales",
                questionTwoError: "borderColor",
                questionTwoTextError: "Las preguntas no pueden ser iguales",
                questionThreeError: "borderColor",
                questionThreeTextError: "Las preguntas no pueden ser iguales",
            });
            acum = 1;
        }
        if (acum > 0) {
            return false;
        }
        return true;
    }

    handleSaveUser = event => {
        event.preventDefault();
        const isValid = this.validateEnd();
        if (isValid) {
            let secret = [
                {
                    answer: this.state.answerOne,
                    question_id: this.state.questionOne
                },
                {
                    answer: this.state.answerTwo,
                    question_id: this.state.questionTwo
                },
                {
                    answer: this.state.answerThree,
                    question_id: this.state.questionThree
                }
            ];
            this.props.registerUser(
                {
                    names: this.state.names,
                    surnames: this.state.surnames,
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password,
                    password_confirmation: this.state.passwordConfirm,
                    secret: secret,
                },
                () => {
                    this.next();
                }
            );
        }
    };

    handleNext = () => {
        const isValid = this.validate();
        if (isValid) {
            this.setState({
                activeStep: this.state.activeStep + 1,
            });
        }
    };

    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

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

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return 'Select campaign settings...';
            case 1:
                return 'What is an ad group anyways?';
            default:
                return '';
        }
    }

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
                                            <h2 className="font-weight-bold">Registrar Usuario</h2>
                                        </div>
                                        {
                                            !this.state.loading ?
                                                <Form onSubmit={this.handleSaveUser.bind(this)}>
                                                    <Stepper activeStep={this.state.activeStep} alternativeLabel>
                                                        {this.state.steps.map((label, i) => (
                                                            <Step key={label}>
                                                                <StepLabel>{label}</StepLabel>
                                                            </Step>
                                                        ))}
                                                    </Stepper>
                                                    <div>
                                                        {this.state.activeStep === this.state.steps.length ? (
                                                            <div>
                                                                <Typography >All steps completed</Typography>
                                                                <Button onClick={this.handleReset}>Limpiar</Button>
                                                            </div>
                                                        ) : (
                                                                <div>
                                                                    {
                                                                        this.state.activeStep === 0 &&
                                                                        <div>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.namesError}
                                                                                    label="Nombres"
                                                                                    disabled={this.props.disabled}
                                                                                    name="names"
                                                                                    id="names"
                                                                                    onKeyUp={this.handlekeyNames}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.names}
                                                                                    type="text"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.namesTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.surnamesError}
                                                                                    label="Apellidos"
                                                                                    disabled={this.props.disabled}
                                                                                    name="surnames"
                                                                                    id="surnames"
                                                                                    onKeyUp={this.handlekeySurnames}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.surnames}
                                                                                    type="text"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.surnamesTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.usernameError}
                                                                                    label="Usuario"
                                                                                    disabled={this.props.disabled}
                                                                                    name="username"
                                                                                    id="username"
                                                                                    onKeyUp={this.handlekeyUsername}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.username}
                                                                                    type="text"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.usernameTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.passwordError}
                                                                                    label="Contraseña"
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
                                                                                    error={this.state.passwordConfirmError}
                                                                                    label="Confirmar Contraseña"
                                                                                    disabled={this.props.disabled}
                                                                                    name="passwordConfirm"
                                                                                    id="passwordConfirm"
                                                                                    onKeyUp={this.handlekeyPasswordConfirm}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.passwordConfirm}
                                                                                    type="password"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.passwordConfirmTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        this.state.activeStep === 1 &&
                                                                        <div>
                                                                            <FormGroup className="mb-15">
                                                                                <div className={this.state.questionOneError}>
                                                                                    <Input
                                                                                        disabled={this.props.disabled}
                                                                                        value={this.state.questionOne || ''}
                                                                                        type="select"
                                                                                        name="questionOne"
                                                                                        id="questionOne"
                                                                                        multiple={false}
                                                                                        onChange={event => this.handleChangeQuestionOne(event)}
                                                                                    >
                                                                                        <option value="0">Preguntas de Seguridad</option>
                                                                                        {
                                                                                            this.props.secretQuestion &&
                                                                                            this.props.secretQuestion.map((data, i) => {
                                                                                                return (
                                                                                                    <option key={i} value={data.value} >{data.label}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </Input>
                                                                                </div>
                                                                                <div className="errorControl">
                                                                                    {this.state.questionOneTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.answerOneError}
                                                                                    label="Respuesta Uno"
                                                                                    disabled={this.props.disabled}
                                                                                    name="answerOne"
                                                                                    id="answerOne"
                                                                                    onKeyUp={this.handlekeyAnswerOne}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.answerOne}
                                                                                    type="text"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.answerOneTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <div className={this.state.questionTwoError}>
                                                                                    <Input
                                                                                        disabled={this.props.disabled}
                                                                                        value={this.state.questionTwo || ''}
                                                                                        type="select"
                                                                                        name="questionTwo"
                                                                                        id="questionTwo"
                                                                                        multiple={false}
                                                                                        onChange={event => this.handleChangeQuestionTwo(event)}
                                                                                    >
                                                                                        <option value="0">Preguntas de Seguridad</option>
                                                                                        {
                                                                                            this.props.secretQuestion &&
                                                                                            this.props.secretQuestion.map((data, i) => {
                                                                                                return (
                                                                                                    <option key={i} value={data.value} >{data.label}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </Input>
                                                                                </div>
                                                                                <div className="errorControl">
                                                                                    {this.state.questionTwoTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.answerTwoError}
                                                                                    label="Respuesta Dos"
                                                                                    disabled={this.props.disabled}
                                                                                    name="answerTwo"
                                                                                    id="answerTwo"
                                                                                    onKeyUp={this.handlekeyAnswerTwo}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.answerTwo}
                                                                                    type="text"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.answerTwoTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <div className={this.state.questionThreeError}>
                                                                                    <Input
                                                                                        disabled={this.props.disabled}
                                                                                        value={this.state.questionThree || ''}
                                                                                        type="select"
                                                                                        name="questionThree"
                                                                                        id="questionThree"
                                                                                        multiple={false}
                                                                                        onChange={event => this.handleChangeQuestionThree(event)}
                                                                                    >
                                                                                        <option value="0">Preguntas de Seguridad</option>
                                                                                        {
                                                                                            this.props.secretQuestion &&
                                                                                            this.props.secretQuestion.map((data, i) => {
                                                                                                return (
                                                                                                    <option key={i} value={data.value} >{data.label}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </Input>
                                                                                </div>
                                                                                <div className="errorControl">
                                                                                    {this.state.questionThreeTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <TextField
                                                                                    error={this.state.answerThreeError}
                                                                                    label="Respuesta Tres"
                                                                                    disabled={this.props.disabled}
                                                                                    name="answerThree"
                                                                                    id="answerThree"
                                                                                    onKeyUp={this.handlekeyAnswerThree}
                                                                                    onChange={this.handleChange}
                                                                                    value={this.state.answerThree}
                                                                                    type="text"
                                                                                    margin="dense"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                />
                                                                                <div className="errorControl">
                                                                                    {this.state.answerThreeTextError}
                                                                                </div>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-15">
                                                                                <Button
                                                                                    disabled={this.state.disabled}
                                                                                    color="primary"
                                                                                    className="btn-block text-white w-100"
                                                                                    variant="contained"
                                                                                    size="large"
                                                                                    onClick={this.handleSaveUser}
                                                                                >
                                                                                    Registrar
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
                                                                        </div>
                                                                    }
                                                                    <div>
                                                                        <Button
                                                                            disabled={this.state.activeStep === 0}
                                                                            onClick={this.handleBack}
                                                                            style={{ marginRight: "8px" }}
                                                                        >
                                                                            Atras
                                                                        </Button>
                                                                        <Button variant="contained" color="primary" onClick={this.handleNext}>
                                                                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </Form>
                                                :
                                                <div style={{ height: "60vh" }}>
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

const mapStateToProps = state => ({
    secretQuestion: state.authUser.get("secretQuestion"),
});

const mapDispatchToProps = dispatch => ({
    registerUser: (data, next) => dispatch(registerUser(data, next)),
    loadSelect: () => dispatch(loadSelect()),
});
export default connect(mapStateToProps, mapDispatchToProps)(RegisterUser);