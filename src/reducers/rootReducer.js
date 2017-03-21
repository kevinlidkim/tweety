import {combineReducers} from 'redux';  
import auth from './authReducer';
import user from './userReducer'

const rootReducer = combineReducers({  
  // short hand property names
  auth,
  user
})

export default rootReducer;  