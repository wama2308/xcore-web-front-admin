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
import { SessionSlider } from 'Components/Widgets';
import AppConfig from 'Constants/AppConfig';
import { requestCode } from "../actions/AuthActions";

class RequestCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
           email: '',
           disabled: false,
           loading: false
        };
    }

   componentDidMount() {
      let params = new URLSearchParams(location.search);
      var emailUrl = params.get('email');
      this.setState({
         email:emailUrl
      });
    }

   requestCodeBtn(){
      this.setState({
         loading: true,
      });
      this.props.requestCode(
         {
           email: this.state.email,           
         },
         () => {
           this.loading();
         },
         () => {
            this.next();
          }
       );
    }

    loading(){
      this.setState({
         loading: false
      });
    }

    next(){ 
      this.setState({
         loading: false
      });     
      this.props.history.push(`/validate/code/?email=${this.state.email}`);      
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
                                    <h2 className="font-weight-bold">{this.state.email}</h2>                                 
                                 </div>
                                 {
                                    !this.state.loading?
                                    <Form>
                                       <FormGroup className="mb-15">                                    
                                          <Button
                                             disabled={this.state.disabled}
                                             color="primary"
                                             className="btn-block text-white w-100"
                                             variant="contained"
                                             size="large"
                                             onClick={() => this.requestCodeBtn()}
                                          >
                                             Solicitar Codigo
                                          </Button>
                                       </FormGroup>                                 
                                    </Form> 
                                    :
                                    <div style={{height: "10vh"}}>
                                       <CircularProgress style={{position: " absolute", height: 40, top: "45%", right: "50%",zIndex: 2}} />
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
   requestCode: (data, loading, next) => dispatch(requestCode(data, loading, next)),    
});
export default connect(null, mapDispatchToProps)(RequestCode);
