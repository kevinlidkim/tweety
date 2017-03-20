import * as types from './actionTypes';  

export function loginUser(username, password) {  
  return function(dispatch) {
    var payload = {
      username: username,
      password: password
    }
    return fetch('/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json();
      }).then(function(res) {
        dispatch(loginSuccess(res));
      })
      .catch(err => {
        throw(err);
      })
  }
}

export function loginSuccess(login) {  
  return ({type: types.LOGIN_SUCCESS, login})
}
