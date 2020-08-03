module.exports = function exception(message, code = 'E_MISSING_DATABASE_ROW', status = 404) {
  this.message = message
  this.status = status
  this.code = code
}
