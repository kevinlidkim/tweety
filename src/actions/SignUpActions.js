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
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json();
      }).then(function(res) {
        dispatch(signUpSuccess(res));
      })
      .catch(err => {
        throw(err);
      })
  }
}

// we register the action with an action type. in this case, we are registering it as "auth"
// it gets dispatched to a reducer
export function signUpSuccess(server_response) {  
  return ({type: types.SIGN_UP_SUCCESS, server_response})
}
