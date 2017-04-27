import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';

import GetItem from './GetItem';

const store = configureStore();


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: '',
      limit: '',
      q: '',
      username: '',
      rank: '',
      parent: '',
      following: true,
      replies: true,
      results: []
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  searchEvent(event) {
    event.preventDefault();
    var obj = {
      timestamp: this.state.timestamp,
      limit: this.state.limit,
      q: this.state.q,
      username: this.state.username,
      following: this.state.following,
      rank: this.state.rank,
      parent: this.state.parent,
      replies: this.state.replies
    }
    store.dispatch(ProfileActions.searchFor(obj))
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
        <div className='col-md-4'>
        </div>
        <div className='col-md-4'>
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

                <label htmlFor="rank">Rank Filter</label>
                <input type="text" placeholder="rank" id="rank" className="form-control"
                  value={this.state.rank}
                  onChange={e => this.setState({ rank:e.target.value })}/>

                <label htmlFor="parent">Parent Filter</label>
                <input type="text" placeholder="parent" id="parent" className="form-control"
                  value={this.state.parent}
                  onChange={e => this.setState({ parent:e.target.value })}/>

                <label htmlFor="following">Follow Filter</label>
                <input type="checkbox" name="following" id="following" className="form-control"
                  checked={this.state.following}
                  onChange={e => this.setState({ following: !this.state.following })}/>

                <label htmlFor="replies">Replies Filter</label>
                <input type="checkbox" name="replies" id="replies" className="form-control"
                  checked={this.state.replies}
                  onChange={e => this.setState({ replies: !this.state.replies })}/>

              </div>
              <button type="submit" className="btn btn-default" onClick={this.searchEvent.bind(this)}>Search</button>
            </form>
            <ol>
              <h4>Search Results</h4>
              {displayResults}
            </ol>
          </div>
          <br />
          <br />
          <GetItem />
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