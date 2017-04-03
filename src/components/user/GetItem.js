import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';

const store = configureStore();


class GetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      result: {
        id: '',
        username: '',
        content: '',
        timestamp: ''
      }
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  getItemEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.getItem(this.state.query))
      .then(data => {
        // console.log(store.getState());
        this.setState({query: '', result: store.getState().rootReducer.user.profile.get_item_result});
      })
  }

  deleteItemEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.deleteItem(this.state.result.id))
      .then(data => {
        // console.log(store.getState());
        this.setState({result: {} });
      })
  }

  render() {

    var displayResult = null;
    if (this.state.result.id) {
      displayResult = (
        <div>
          <ul>
            <li>ID: {this.state.result.id}</li>
            <li>Content: {this.state.result.content}</li>
            <li>Timestamp: {this.state.result.timestamp}</li>
            <li>Username: {this.state.result.username}</li>
          </ul>
          <button type="submit" className="btn btn-default" onClick={this.deleteItemEvent.bind(this)}>Delete</button>
        </div>
      )
    }

    return (
      <div>
        <div className="form-container">
          <form className="form">
            <div className="form-group">
              <label htmlFor="query">Get item by ID</label>
              <input type="text" placeholder="Type query here" id="query" className="form-control"
                value={this.state.query}
                onChange={e => this.setState({ query:e.target.value })}/>
            </div>
            <button type="submit" className="btn btn-default" onClick={this.getItemEvent.bind(this)}>Search</button>
          </form>
          <h4>Get Item Result</h4>
          <div>{displayResult}</div>
        </div>
      </div>
    );
  }
}

GetItem.propTypes = {  
  result: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    result: state.rootReducer.user.profile.get_item_result
  };
};

export default connect(mapStateToProps)(GetItem);