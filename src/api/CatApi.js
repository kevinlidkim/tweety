
class CatApi {  
  // static getAllCats() {
  //   return fetch('http://localhost:5000/api/v1/cats').then(response => {
  //     return response.json();
  //   }).catch(error => {
  //     return error;
  //   });
  // }
  static getAllCats() {
    return fetch('http://localhost:3000/yo', {
      method: 'POST'
    })
      .then(response => {
        return response.json();
      }).catch(err => {
        return err;
      })
  }
}

export default CatApi;