import React, {PropTypes} from 'react';  
import { Link } from 'react-router';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li><Link to="/" activeClassName="active">Home</Link></li>
            <li><Link to="/cats">Cats</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
};

export default Navbar; 