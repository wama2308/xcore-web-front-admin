/**
 * Signin Firebase
 */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, FormFeedback } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import "../assets/css/style.css";
import { getServerErrors } from './../factorys/validations'

// components
import { SessionSlider } from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import { loginAction } from "../actions/AuthActions";

const SigninHooks = (props) => {

  const [loadingForm, setLoadingForm] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    email: 'master@xcore.com',
    password: 'qwerty',
  });

  const { loading, loginAction } = props;

  const handleChange = event => {
    const value = (event.target.type !== "checkbox")? event.target.value : event.target.checked;
	  const name = [event.target.name];
    setForm({
      ...form,
      [name]: value
    })
    setErrors({
      ...errors,
      [name]: ''
    })
  }

  const handleSubmit = (formData, event) => {
    event.preventDefault();
    setLoadingForm(true);
    loginAction(formData)
      .then(response => {})
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

  const linkForgotPassword = () => {
    props.history.push('/forgot/password');
  }

  const { email, password } = form;

  const olvidoContraseña = {
    textAlign: "left"
  };

  return (
    <QueueAnim type="bottom" duration={2000}>
      <div className="rct-session-wrapper">
        {loading &&
        <LinearProgress />
        }
        <AppBar position="static" className="session-header">
          <Toolbar>
            <div className="container">
              <div className="d-flex justify-content-between">
                <div className="">
                  <Link to="/">
                  <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="70" height="15" />
                  </Link>
                </div>
                {/* <div>
                  <a className="mr-15" onClick={()=> this.onUserSignUp()}>Create New account?</a>
                  <Button variant="contained" className="btn-light" onClick={()=> this.onUserSignUp()}>Sign Up</Button>
                </div> */}
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
                    <h1 className="" style={{fontSize: '30px'}}>XCORE</h1>
                    <p className="mb-0">¡Ingresa a tu cuenta!</p>
                  </div>
                  <Form name="form-login" onSubmit={ handleSubmit.bind(this, form) }>
                    <FormGroup className="has-wrapper">
                      <div>
                        <Input
                          type="mail"
                          invalid={(errors['email'])? true: false}
                          value={email}
                          name="email"
                          id="email"
                          className="has-input input-lg"
                          placeholder="Email"
                          autoFocus
                          onChange={handleChange} />
                        <span className="has-icon"><i className="ti-email"></i></span>
                        <FormFeedback>{errors['email']}</FormFeedback>
                      </div>
                    </FormGroup>
                    <FormGroup className="has-wrapper">
                      <div>
                        <Input
                          value={password}
                          invalid={(errors['password'])? true: false}
                          type="Password"
                          name="password"
                          id="password"
                          className="has-input input-lg"
                          placeholder="Contraseña"
                          onChange={handleChange}/>
                        <span className="has-icon"><i className="ti-lock"></i></span>
                        <FormFeedback>{errors['password']}</FormFeedback>
                      </div>
                    </FormGroup>
                    <FormGroup className="mb-15">
                      <Button type="submit" color="primary" className="btn-block text-white w-100" variant="contained" size="large" disabled={loadingForm}>
                        Ingresar
                      </Button>
                    </FormGroup>
                    <div style={olvidoContraseña}>
                      <a onClick={()=> linkForgotPassword()}>¿Olvido su contraseña?</a>
                    </div>
                  </Form>
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
  )

}

const mapStateToProps = state => ({
  secretQuestion: state.authUser.get("secretQuestion"),
});

const mapDispatchToProps = dispatch => ({
  loginAction: (data) => dispatch(loginAction(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninHooks);