import React, {PropTypes} from 'react';  
import { Link } from 'react-router';

const Navbar = () => {  
  return (
    <nav>
      <Link to="/" activeClassName="active">Home</Link>
      <Link to="/cats" activeClassName="active">Cats</Link>
      <Link to="/login">LOGIN</Link>
    </nav>
  );
};

export default Navbar; 