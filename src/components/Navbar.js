import React, {PropTypes} from 'react';  
import { Link } from 'react-router';
import {connect} from 'react-redux';
import * as ProfileActions from '../actions/ProfileActions';
import configureStore from '../store/configureStore';

const store = configureStore();

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false
    }
    // store.subscribe(function() {
    //   console.log('new data?');
    //   console.log(store.getState());
    // })
  }

  logoutEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.logoutUser())
      .then(data => {
        // console.log(store.getState());
        // this.setState({logged_in: store.getState().rootReducer.auth.current_user})
        this.setState({logged_in: false})
      })
  }

  render() {

    // var displayLogin = null;
    // if (this.state.logged_in) {
    //   displayLogin = (
    //     <ul className='nav navbar-nav'>
    //       <li><Link to="/" activeClassName="active">Home</Link></li>
    //       <li><Link to="/login">Login</Link></li>
    //       <li><Link to="/signup">Sign Up</Link></li>
    //       <li><Link to="/profile">Profile</Link></li>
    //       <li onClick={this.logoutEvent.bind(this)}><Link to="">Logout</Link></li>
    //     </ul>
    //   )
    // } else {
    //   displayLogin = (
    //     <ul className='nav navbar-nav'>
    //       <li><Link to="/" activeClassName="active">Home</Link></li>
    //       <li><Link to="/login">Login</Link></li>
    //       <li><Link to="/signup">Sign Up</Link></li>
    //     </ul>
    //   )
    // }

    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li><Link to="/" activeClassName="active">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/user">Other Users</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li onClick={this.logoutEvent.bind(this)}><Link to="">Logout</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
};

Navbar.propTypes = {  
  logged_in: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  // doesn't work because authreducer loses state the moment it reroutes to /profile. 
  // this is why navbar will never know who's logged in?
  return {
    logged_in: state.rootReducer.user.logged_in
  };
};

export default connect(mapStateToProps)(Navbar); 