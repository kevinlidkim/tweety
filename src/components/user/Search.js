import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';

const store = configureStore();


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: '',
      limit: '',
      q: '',
      username: '',
      following: true,
      results: []
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  searchEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.searchFor(this.state.timestamp, this.state.limit, this.state.q, this.state.username, this.state.following))
      .then(data => {
        // console.log(store.getState());
        this.setState({timestamp: '', limit: '', results: store.getState().rootReducer.user.profile.search_results});
      })
  }

  render() {

    var displayResults = this.state.results.map(function(item) {
      return (
        <li key={item.id}>ID: {item.id}, content: {item.content}, timestamp: {item.timestamp}</li>
        );
    });

    return (
      <div>
        <div className="form-container">
          <form className="form">
            <div className="form-group">
              <label htmlFor="timestamp">Search by timestamp</label>
              <input type="number" placeholder="Type timestamp here" id="timestamp" className="form-control"
                value={this.state.timestamp}
                onChange={e => this.setState({ timestamp:e.target.value })}/>

              <label htmlFor="limit">Limit Search</label>
              <input type="number" placeholder="limit" id="limit" className="form-control"
                value={this.state.limit}
                onChange={e => this.setState({ limit:e.target.value })}/>

              <label htmlFor="query">Query Search</label>
              <input type="text" placeholder="query" id="query" className="form-control"
                value={this.state.q}
                onChange={e => this.setState({ q:e.target.value })}/>

              <label htmlFor="username">Username Filter</label>
              <input type="text" placeholder="username" id="username" className="form-control"
                value={this.state.username}
                onChange={e => this.setState({ username:e.target.value })}/>

              <label htmlFor="following">Follow Filter</label>
              <input type="checkbox" name="following" id="following" className="form-control"
                checked={this.state.following}
                onChange={e => this.setState({ following: !this.state.following })}/>
            </div>
            <button type="submit" className="btn btn-default" onClick={this.searchEvent.bind(this)}>Search</button>
          </form>
          <ol>
            <h4>Search Results</h4>
            {displayResults}
          </ol>
        </div>
      </div>
    );
  }
}

Search.propTypes = {  
  results: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    results: state.rootReducer.user.profile.search_results
  };
};

export default connect(mapStateToProps)(Search);