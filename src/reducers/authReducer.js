import * as types from '../actions/actionTypes';  
import initialState from './initialState';
import {browserHistory} from 'react-router';
import {LOCATION_CHANGE} from 'react-router-redux'

// we are going in the auth branch of the initial state
export default function authReducer(state = initialState.auth, action) {

  // matches the action and dispatches the information we got from server into store
  switch(action.type) {

    case types.LOGIN_SUCCESS:
      browserHistory.push('/profile');
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
      browserHistory.push('/login');
      return Object.assign({}, state, {
        register_response: action.server_response
      })

    case types.VERIFY_FAIL:
      return Object.assign({}, state, {
        register_response: action.server_response
      })

    case types.LOGOUT_SUCCESS:
      browserHistory.push('/login');

    case types.LOGOUT_FAIL:
      browserHistory.push('/login');

    case LOCATION_CHANGE:
      // console.log("LOCATION CHANGED");
      // console.log(state);

    default: 
      return state;
  }
}