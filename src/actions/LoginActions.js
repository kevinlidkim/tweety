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
        return response.json()
          .then(res => {
            dispatch(loginSuccess(res));
          })
      })
      .catch(err => {
        dispatch(loginFail(err));
      })
  }
}

export function loginSuccess(server_response) {  
  return ({type: types.LOGIN_SUCCESS, server_response})
}

export function loginFail(server_response) {  
  return ({type: types.LOGIN_FAIL, server_response})
}
