import {combineReducers} from 'redux';  
import auth from './authReducer';

const rootReducer = combineReducers({  
  // short hand property names
  auth
})

export default rootReducer;  