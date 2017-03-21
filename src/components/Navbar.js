import React, {PropTypes} from 'react';  
import { Link } from 'react-router';
import * as ProfileActions from '../actions/ProfileActions';
import configureStore from '../store/configureStore';

const store = configureStore();

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false
    }
  }

  logoutEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.logoutUser())
      .then(data => {
        console.log(store.getState());
      })
  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li><Link to="/" activeClassName="active">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li onClick={this.logoutEvent.bind(this)}><Link>Logout</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
};

export default Navbar; 