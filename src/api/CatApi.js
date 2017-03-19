
class CatApi {  
  // static getAllCats() {
  //   return fetch('http://localhost:5000/api/v1/cats').then(response => {
  //     return response.json();
  //   }).catch(error => {
  //     return error;
  //   });
  // }
  getAllCats() {
    $.ajax({
      url: '/yo',
      type: 'POST'
    })
      .done((data) => {
        console.log(data);
      })
      .fail((err) => {
        console.log(err);
      })
  }
}

export default CatApi;