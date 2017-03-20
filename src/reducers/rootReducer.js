import {combineReducers} from 'redux';  
import cats from './catReducer';
import login from './loginReducer';
import user from './signUpReducer';
import auth from './authReducer';

const rootReducer = combineReducers({  
  // short hand property names
  cats,
  // login,
  // user,
  auth
})

export default rootReducer;  