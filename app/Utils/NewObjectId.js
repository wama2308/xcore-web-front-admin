const os = require('os');
const crypto = require('crypto');

class NewObjectId {

  /**
   * Funcion para Generar manualmente un ObjectId
   */
  generate() {
    const secondInHex = Math.floor(new Date()/1000).toString(16)
    const machineId = crypto.createHash('md5').update(os.hostname()).digest('hex').slice(0, 6)
    const processId = process.pid.toString(16).slice(0, 4).padStart(4, '0')
    const counter = process.hrtime()[1].toString(16).slice(0, 6).padStart(6, '0')
  
    return secondInHex + machineId + processId + counter
  }
}

module.exports = NewObjectId