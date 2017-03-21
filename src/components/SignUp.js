import React, {PropTypes} from 'react';  
import { Link } from 'react-router';
import {connect} from 'react-redux';
import * as SignUpActions from '../actions/SignUpActions';
import configureStore from '../store/configureStore';

const store = configureStore();


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      verify_email: '',
      verify_code: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  signUpEvent(event) {
    event.preventDefault();
    store.dispatch(SignUpActions.signUpUser(this.state.username, this.state.password, this.state.email))
      .then(data => {
        this.setState({verify_email: this.state.email});
        this.setState({username: '', email: '', password: ''});
        console.log(store.getState());
      })
  }

  verifyEvent(event) {
    event.preventDefault();
    store.dispatch(SignUpActions.verifyUser(this.state.verify_email, this.state.verify_code))
      .then(data => {
        this.setState({verify_email: '', verify_code: ''});
        console.log(store.getState());
      })
  }


  render() {
    return (
      <div>
        <div className='col-md-4'>
        </div>
        <div className='col-md-4'>
          <div className="form-container">
            <h3>Sign Up</h3>
            <form className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" placeholder="Email" id="email" className="form-control" 
                  value={this.state.email}
                  onChange={e => this.setState({ email:e.target.value })}/>
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" id="username" className="form-control" 
                  value={this.state.username}
                  onChange={e => this.setState({ username:e.target.value })}/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" id="password" className="form-control" 
                  value={this.state.password}
                  onChange={e => this.setState({ password:e.target.value })}/>
              </div>
              <button type="submit" className="btn btn-default" onClick={this.signUpEvent.bind(this)}>Sign Up</button>
            </form>
          </div>
          <div className="form-container">
            <h3>Verify Account</h3>
            <form className="form">
              <div className="form-group">
                <label htmlFor="verify_email">Verify Email</label>
                <input type="text" placeholder="Verify Email" id="verify_email" className="form-control" 
                  value={this.state.verify_email}
                  onChange={e => this.setState({ verify_email:e.target.value })}/>
              </div>
              <div className="form-group">
                <label htmlFor="verify_code">Verification Code</label>
                <input type="text" placeholder="Verification Code" id="verify_code" className="form-control" 
                  value={this.state.verify_code}
                  onChange={e => this.setState({ verify_code:e.target.value })}/>
              </div>
              <button type="submit" className="btn btn-default" onClick={this.verifyEvent.bind(this)}>Verify</button>
            </form>
          </div>
          <div>
            <h5>Have an account?  </h5><Link to="/login">Login</Link>
          </div>
        </div>
      </div>

    );
  }
}

// this means that the SignUp component will have a property called "server_response"
SignUp.propTypes = {  
  server_response: PropTypes.object.isRequired
};

// we are setting the property "server_response" as object from state.auth.register_response. 
// auth is the reducer, register_response is the state
function mapStateToProps(state, ownProps) {
  return {
    server_response: state.rootReducer.auth.register_response
  };
};

export default connect(mapStateToProps)(SignUp);