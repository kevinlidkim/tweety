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
              dispatch(authUserFail(res));
            }
          })
      })
      .catch(err => {
        dispatch(authUserFail(err));
      })
  }
}

export function logoutUser() {  
  return function(dispatch) {
    return fetch('/logout', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
    })
      .then(response => {
        return response.json()
          .then(res => {
            dispatch(logoutSuccess(res));
          })
      })
      .catch(err => {
        dispatch(logoutFail(err));
      })
  }
}

export function searchFor(query, limit) {  
  return function(dispatch) {
    var payload = {
      timestamp: query,
      limit: limit
    }
    return fetch('/search', {
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
            dispatch(searchSuccess(res));
          })
      })
      .catch(err => {
        dispatch(searchFail(err));
      })
  }
}

export function getItem(query) {  
  return function(dispatch) {
    return fetch('/item/' + query, {
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
            dispatch(getItemSuccess(res));
          })
      })
      .catch(err => {
        dispatch(getItemFail(err));
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

export function logoutSuccess(server_response) {  
  return ({type: types.LOGOUT_SUCCESS, server_response})
}

export function logoutFail(server_response) {  
  return ({type: types.LOGOUT_FAIL, server_response})
}

export function searchSuccess(server_response) {  
  return ({type: types.SEARCH_SUCCESS, server_response})
}

export function searchFail(server_response) {  
  return ({type: types.SEARCH_FAIL, server_response})
}

export function getItemSuccess(server_response) {  
  return ({type: types.GET_ITEM_SUCCESS, server_response})
}

export function getItemFail(server_response) {  
  return ({type: types.GET_ITEM_FAIL, server_response})
}
