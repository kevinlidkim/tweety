import * as types from '../actions/actionTypes';  
import initialState from './initialState';
import {browserHistory} from 'react-router';
import {LOCATION_CHANGE} from 'react-router-redux'

// we are going in the auth branch of the initial state
export default function authReducer(state = initialState, action) {

  // console.log('how many times does the state change?');
  // console.log(state);
  // console.log(action);

  // matches the action and dispatches the information we got from server into store
  switch(action.type) {

    case types.LOGIN_SUCCESS:
      // browserHistory.push('/signup');
      return Object.assign({}, state, {
        login_response: action.server_response,
        current_user: action.server_response.user
      });

    case types.LOGIN_FAIL:
      return Object.assign({}, state, {
        login_response: action.server_response
      });

    case types.SIGN_UP_SUCCESS:
      return Object.assign({}, state, {
        register_response: action.server_response
      });

    case types.SIGN_UP_FAIL:
      return Object.assign({}, state, {
        register_response: action.server_response
      });

    case types.VERIFY_SUCCESS:
      return Object.assign({}, state, {
        register_response: action.server_response
      })

    case types.VERIFY_FAIL:
      return Object.assign({}, state, {
        register_response: action.server_response
      })




    case types.AUTH_USER_SUCCESS:
      return Object.assign({}, state, {
        current_user: action.server_response
      })

    case types.AUTH_USER_FAIL:
      return Object.assign({}, state, {
        current_user: action.server_response
      })

    case types.MAKE_POST_SUCCESS:
      console.log(action);
      return Object.assign({}, state.profile, {
        current_post: action.server_response
      })

    case types.MAKE_POST_FAIL:
      return Object.assign({}, state.profile, {
        current_post: action.server_response
      })


    case LOCATION_CHANGE:
      // console.log("LOCATION CHANGED");
      // console.log(state);

    default: 
      return state;
  }
}