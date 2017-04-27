import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';
import Search from './Search';

const store = configureStore();


class OtherUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      follow: true,
      user_result: {
        email: '',
        followers: 0,
        following: 0,
        username: ''
      },
      followers_result: [],
      following_result: []
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentWillMount() {
    store.dispatch(ProfileActions.authUser())
      .then(data => {
      })
  }

  searchUserEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.searchUser(this.state.username))
      .then(data => {
        // console.log(store.getState());
        this.setState({user_result: store.getState().rootReducer.user.profile.search_user});
        // console.log(this.state);
      })
      .catch(err => {
        this.setState({user_result: {} });
      })
  }

  followUserEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.followUser(this.state.username, this.state.follow))
      .then(data => {
      })
  }

  getFollowerEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.getFollowers(this.state.username))
      .then(data => {
        // console.log(store.getState());
        this.setState({followers_result: store.getState().rootReducer.user.profile.search_user_followers});
      })
  }

  getFollowingEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.getFollowing(this.state.username))
      .then(data => {
        // console.log(store.getState());
        this.setState({following_result: store.getState().rootReducer.user.profile.search_user_following});
      })
  }


  render() {

    var displayResult = null;
    if (this.state.user_result.email) {
      displayResult = (
        <div>
          <ul>
            <li>Email: {this.state.user_result.email}</li>
            <li>Followers: {this.state.user_result.followers}</li>
            <li>Following: {this.state.user_result.following}</li>
          </ul>
        </div>
      )
    }

    var displayFollowersResult = this.state.followers_result.map(function(item) {
      return (
        <li key={item}>{item}</li>
        );
    });

    var displayFollowingResult = this.state.following_result.map(function(item) {
      return (
        <li key={item}>{item}</li>
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
                <label htmlFor="username">Username Filter</label>
                <input type="text" placeholder="Username" id="username" className="form-control"
                  value={this.state.username}
                  onChange={e => this.setState({ username:e.target.value })}/>

                <label htmlFor="follow">Follow Filter</label>
                <input type="checkbox" name="follow" id="follow" className="form-control"
                  checked={this.state.follow}
                  onChange={e => this.setState({ follow: !this.state.follow })}/>
              </div>
              <button type="submit" className="btn btn-default" onClick={this.searchUserEvent.bind(this)}>Search User</button>
              <button type="submit" className="btn btn-default" onClick={this.followUserEvent.bind(this)}>Follow</button>
              <button type="submit" className="btn btn-default" onClick={this.getFollowerEvent.bind(this)}>Get Followers</button>
              <button type="submit" className="btn btn-default" onClick={this.getFollowingEvent.bind(this)}>Get Following</button>
            </form>
          </div>
          <div>{displayResult}</div>
          <br />
          <br />
          <div>
            <h3>Follower Results</h3>
            <ul>{displayFollowersResult}</ul>
          </div>
          <br />
          <br />
          <div>
            <h3>Following Results</h3>
            <ul>{displayFollowingResult}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default OtherUsers;