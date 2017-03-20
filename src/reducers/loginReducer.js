import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function loginReducer(state = initialState.login, action) {  
  switch(action.type) {
    case types.LOGIN_SUCCESS:
      return action.login
    default: 
      return state;
  }
}