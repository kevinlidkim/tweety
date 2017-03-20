import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import linkState from 'react-link-state';
import * as LoginActions from '../actions/LoginActions';
import configureStore from '../store/configureStore';

const store = configureStore();


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  loginEvent(event) {
    event.preventDefault();
    console.log("LOGGING IN ON FRONTEND");
    console.log(this.state);
    store.dispatch(LoginActions.loginUser(this.state.username, this.state.password));
  }


  render() {
    return (
      <div>
        <div className='col-md-4'>
        </div>
        <div className='col-md-4'>
          <div className="form-container">
            <form className="form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" valueLink={linkState(this, 'username')}placeholder="Username" id="username" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" valueLink={linkState(this, 'password')} placeholder="Password" id="password" className="form-control" />
              </div>
              <button type="submit" className="btn btn-default" onClick={this.loginEvent.bind(this)}>Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {  
  login: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {  
  console.log('this is the state');
  console.log(state);
  return {
    login: state.login
  };
};

export default connect(mapStateToProps)(Login);