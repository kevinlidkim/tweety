import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <div className='col-md-4'>
        </div>
        <div>
          <div className='col-md-4'>
            <div className='alert alert-info text-center'>
              <h3>Welcome to Tweety</h3>
            </div>
            <div className='text-center'>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;