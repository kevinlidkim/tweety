import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';
import Search from './Search';
import GetItem from './GetItem';
import Media from './Media';

const store = configureStore();


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      current_post: '',
      post_parent: '',
      post_media: ''
    }
    this.onChange = this.onChange.bind(this);
    // store.subscribe(function() {
    //   console.log('new data?');
    //   console.log(store.getState());
    // })
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
    store.dispatch(ProfileActions.makePost(this.state.current_post, this.state.post_parent, this.state.post_media))
      .then(data => {
        // console.log(store.getState());
        this.setState({current_post: '', post_parent: '', post_media: ''});
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

                <label htmlFor="post_parent">Parent ID</label>
                <input type="number" placeholder="Reply to tweet" id="post_parent" className="form-control"
                  value={this.state.post_parent}
                  onChange={e => this.setState({ post_parent:e.target.value })}/>

                <label htmlFor="post_media">Media ID</label>
                <input type="number" placeholder="Attach media to tweet" id="post_media" className="form-control"
                  value={this.state.post_media}
                  onChange={e => this.setState({ post_media:e.target.value })}/>
              </div>
              <button type="submit" className="btn btn-default" onClick={this.postEvent.bind(this)}>Post</button>
            </form>
          </div>
          <br />
          <br />
          <Media />
          <br />
          <br />
          <Search />
          <br />
          <br />
          <GetItem />
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
  // console.log(state);
  return {
    auth_user: state.rootReducer.auth.current_user,
    current_post: state.rootReducer.user.profile.current_post
  };
};

export default connect(mapStateToProps)(Profile);