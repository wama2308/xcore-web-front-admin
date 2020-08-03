module.exports = function messageFrontEnd(message, title = 'Éxito', interceptor = true, plugin = 'notification') {
  return {
    // obj,
    title,
    message,
    interceptor,
    plugin
  }
}