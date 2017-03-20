import * as types from '../actions/actionTypes';  
import initialState from './initialState';

// we are going in the auth branch of the initial state
export default function authReducer(state = initialState.auth, action) {

  // matches the action and dispatches the information we got from server into store
  switch(action.type) {
    case types.LOGIN_SUCCESS:
      return action.login
    case types.SIGN_UP_SUCCESS:
      return action.auth
    default: 
      return state;
  }
}