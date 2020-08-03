module.exports = function searchRegex(search) {
  const gt = search.split(' ')
  let expresion = ""
  gt.map(datos => {
    expresion += `^(?=.*${datos})`
  })

  return new RegExp(expresion, "ims")
}