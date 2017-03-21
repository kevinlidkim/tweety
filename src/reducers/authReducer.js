import * as types from '../actions/actionTypes';  
import initialState from './initialState';
// import {Map} from 'immutable';


// we are going in the auth branch of the initial state
export default function authReducer(state = initialState, action) {

  // matches the action and dispatches the information we got from server into store
  switch(action.type) {
    case types.LOGIN_SUCCESS:
      return action.login

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

    default: 
      return state;
  }
}