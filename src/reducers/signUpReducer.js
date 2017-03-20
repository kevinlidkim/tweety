import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function signUpReducer(state = initialState.auth, action) {  
  switch(action.type) {
    case types.SIGN_UP_SUCCESS:
      return action.auth
    default: 
      return state;
  }
}