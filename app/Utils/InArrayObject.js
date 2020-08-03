
class InArrayObject {

  /**
   * Funcion para la busqueda objetos dentro de un array plano 
   */
  search(array, search, key = '_id') {
    let results = array.filter(function(item) {
      return item[key] + '' === search + ''
    })
    return (results.length > 0) ? results[0] : null
  }

}

module.exports = InArrayObject