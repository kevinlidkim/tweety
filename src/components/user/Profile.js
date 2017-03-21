import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';

const store = configureStore();


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      current_post: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentWillMount() {
    store.dispatch(ProfileActions.authUser())
      .then(data => {
        // console.log("authorizing user first");
        // console.log(store.getState());
      })
  }

  postEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.makePost(this.state.current_post))
      .then(data => {
        console.log(store.getState());
      })
  }


  render() {
    return (
      <div>
        <div className='col-md-4'>
        </div>
        <div className='col-md-4'>
          <div className="form-container">
            <form className="form">
              <div className="form-group">
                <label htmlFor="current_post">Write a message</label>
                <textarea placeholder="Type here" id="current_post" className="form-control" maxLength={140}
                  value={this.state.current_post}
                  onChange={e => this.setState({ current_post:e.target.value })}/>
              </div>
              <button type="submit" className="btn btn-default" onClick={this.postEvent.bind(this)}>Post</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {  
  auth_user: PropTypes.object.isRequired,
  current_post: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    auth_user: state.rootReducer.auth.current_user,
    current_post: state.rootReducer.user.profile.current_post
  };
};

export default connect(mapStateToProps)(Profile);