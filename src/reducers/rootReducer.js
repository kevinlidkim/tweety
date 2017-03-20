import {combineReducers} from 'redux';  
import cats from './catReducer';
import login from './loginReducer';

const rootReducer = combineReducers({  
  // short hand property names
  cats,
  login
})

export default rootReducer;  