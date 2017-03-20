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
      password: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  signUpEvent(event) {
    event.preventDefault();
    store.dispatch(SignUpActions.signUpUser(this.state.username, this.state.password))
      .then(function(data) {
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
              <button type="submit" className="btn btn-default" onClick={this.signUpEvent.bind(this)}>Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

// this means that the SignUp component will have a property called "auth"
SignUp.propTypes = {  
  auth: PropTypes.object.isRequired
};

// we are setting the property "auth" as object from state.auth (from store's state)
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(SignUp);