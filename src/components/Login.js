import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
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
    store.dispatch(LoginActions.loginUser(this.state.username, this.state.password))
      .then(data => {

      })
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
              <button type="submit" className="btn btn-default" onClick={this.loginEvent.bind(this)}>Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {  
  login_response: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {  
  return {
    login_response: state.auth.login_response
  };
};

export default connect(mapStateToProps)(Login);