import * as types from '../actions/actionTypes';  
import initialState from './initialState';
import {browserHistory} from 'react-router';
import {LOCATION_CHANGE} from 'react-router-redux'

// we are going in the auth branch of the initial state
export default function userReducer(state = initialState.user, action) {

  // matches the action and dispatches the information we got from server into store
  switch(action.type) {

    case types.AUTH_USER_SUCCESS:
      return Object.assign({}, state, {
        logged_in: action.server_response.status
      })

    case types.AUTH_USER_FAIL:
      browserHistory.push('/login');
      return Object.assign({}, state, {
        logged_in: action.server_response.status
      })

    case types.MAKE_POST_SUCCESS:
      return Object.assign({}, state, {
        profile: {
          current_post: action.server_response.id,
          posts: state.profile.posts
        }
      })

    case types.MAKE_POST_FAIL:
      return Object.assign({}, state, {
        profile: {
          current_post: action.server_response.message
        }
      })

    default: 
      return state;
  }
}