import React, {PropTypes} from 'react';  
import { Link } from 'react-router';

const Navbar = () => {  
  return (
    <nav>
      <Link to="/" activeClassName="active">Home</Link>
      <Link to="/cats" activeClassName="active">Cats</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
};

export default Navbar; 