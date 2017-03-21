import React, {PropTypes} from 'react';  
import Navbar from './Navbar';

class App extends React.Component {  
  render() {
    return (
      <div className="container-fluid">
        <Navbar history={this.props.history} />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {  
  children: PropTypes.object.isRequired
};

export default App;  