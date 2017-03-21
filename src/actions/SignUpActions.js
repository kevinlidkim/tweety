import * as types from './actionTypes';  

export function signUpUser(username, password, email) {  
  return function(dispatch) {
    var payload = {
      username: username,
      password: password,
      email: email
    }
    return fetch('/adduser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    })
      .then(response => {
        return response.json()
          .then(res => {
            dispatch(signUpSuccess(res));
          })
      })
      .catch(err => {
        dispatch(signUpFail(err));
      })
  }
}

export function verifyUser(email, code) {
  return function(dispatch) {
    var payload = {
      email: email,
      key: code
    }
    return fetch('/verify', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    })
      .then(response => {
        return response.json();
      })
      .then(res => {
        dispatch(verifySuccess(res));
      })
      .catch(err => {
        dispatch(verifyFail(err));
      })
  }
}

// we register the action with an action type. in this case, we are registering it as "auth"
// it gets dispatched to a reducer
export function signUpSuccess(server_response) {  
  return ({type: types.SIGN_UP_FAIL, server_response})
}

export function signUpFail(server_response) {  
  return ({type: types.SIGN_UP_SUCCESS, server_response})
}

export function verifySuccess(server_response) {  
  return ({type: types.VERIFY_SUCCESS, server_response})
}

export function verifyFail(server_response) {  
  return ({type: types.VERIFY_FAIL, server_response})
}