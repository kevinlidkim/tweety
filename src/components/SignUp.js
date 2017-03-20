import React, {PropTypes} from 'react';  
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
      email: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  signUpEvent(event) {
    event.preventDefault();
    console.log("signing up with following info");
    console.log(this.state);
    store.dispatch(SignUpActions.signUpUser(this.state.username, this.state.password, this.state.email))
      .then(function(data) {
        console.log("after signing up");
        var yo = store.getState();
        console.log(yo);
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
  console.log("THE STATE");
  console.log(state);
  return {
    server_response: state.auth.register_response
  };
};

export default connect(mapStateToProps)(SignUp);