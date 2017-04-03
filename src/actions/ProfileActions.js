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


export function searchUser(query) {  
  return function(dispatch) {
    return fetch('/user/' + query, {
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
            dispatch(searchUserSuccess(res));
          })
      })
      .catch(err => {
        dispatch(searchUserFail(err));
      })
  }
}

export function getFollowers(query) {  
  return function(dispatch) {
    return fetch('/user/' + query + '/followers', {
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
            dispatch(getFollowersSuccess(res));
          })
      })
      .catch(err => {
        dispatch(getFollowersFail(err));
      })
  }
}

export function getFollowering(query) {  
  return function(dispatch) {
    return fetch('/user/' + query + '/following', {
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
            dispatch(getFollowingSuccess(res));
          })
      })
      .catch(err => {
        dispatch(getFollowingFail(err));
      })
  }
}

export function followUser(username, follow) {  
  return function(dispatch) {
    var payload = {
      username: username,
      follow: follow
    }
    return fetch('/follow', {
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
            dispatch(followUserSuccess(res));
          })
      })
      .catch(err => {
        dispatch(followUserFail(err));
      })
  }
}

export function searchFor(timestamp, limit, query, username, following) {  
  return function(dispatch) {
    var payload = {
      timestamp: timestamp,
      limit: limit,
      q: query,
      username: username,
      following:following
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

export function deleteItem(query) {
  return function(dispatch) {
    return fetch('/item/' + query, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then(response => {
        return response.json()
          .then(res => {
            dispatch(deleteItemSuccess(res));
          })
      })
      .catch(err => {
        dispatch(deleteItemFail(err));
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

export function searchUserSuccess(server_response) {  
  return ({type: types.SEARCH_USER_SUCCESS, server_response})
}

export function searchUserFail(server_response) {  
  return ({type: types.SEARCH_USER_FAIL, server_response})
}

export function getFollowersSuccess(server_response) {  
  return ({type: types.GET_FOLLOWERS_SUCCESS, server_response})
}

export function getFollowersFail(server_response) {  
  return ({type: types.GET_FOLLOWERS_FAIL, server_response})
}

export function getFollowingSuccess(server_response) {  
  return ({type: types.GET_FOLLOWING_SUCCESS, server_response})
}

export function getFollowingFail(server_response) {  
  return ({type: types.GET_FOLLOWING_FAIL, server_response})
}

export function followUserSuccess(server_response) {  
  return ({type: types.FOLLOW_USER_SUCCESS, server_response})
}

export function followUserFail(server_response) {  
  return ({type: types.FOLLOW_USER_FAIL, server_response})
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

export function deleteItemSuccess(server_response) {  
  return ({type: types.DELETE_ITEM_SUCCESS, server_response})
}

export function deleteItemFail(server_response) {  
  return ({type: types.DELETE_ITEM_FAIL, server_response})
}