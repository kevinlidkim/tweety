import * as types from './actionTypes';  

export function loadCats() {  
  return function(dispatch) {
    return fetch('/yo', {
      method: 'POST'
    })
      .then(response => {
        dispatch(loadCatsSuccess(response.json()));
      }).catch(err => {
        throw(error);
      })
  }
}


export function loadCatsSuccess(cats) {  
  return {type: types.LOAD_CATS_SUCCESS, cats};
}