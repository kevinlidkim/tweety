import * as types from './actionTypes';  

export function makePost(content) {  
  return function(dispatch) {
    var payload = {
      content: content
    }
    return fetch('/additem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json()
          .then(res => {
            dispatch(makePostSuccess(res));
          })
      })
      .catch(err => {
        dispatch(makePostFail(err));
      })
  }
}

export function authUser() {  
  return function(dispatch) {
    return fetch('/auth', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then(response => {
        return response.json()
          .then(res => {
            if (res.status) {
              dispatch(authUserSuccess(res));
            } else {
              dispatch(authUserFail(err));
            }
          })
      })
      .catch(err => {
        dispatch(authUserFail(err));
      })
  }
}

export function makePostSuccess(server_response) {  
  return ({type: types.MAKE_POST_SUCCESS, server_response})
}

export function makePostFail(server_response) {  
  return ({type: types.MAKE_POST_FAIL, server_response})
}

export function authUserSuccess(server_response) {  
  return ({type: types.AUTH_USER_SUCCESS, server_response})
}

export function authUserFail(server_response) {  
  return ({type: types.AUTH_USER_FAIL, server_response})
}
