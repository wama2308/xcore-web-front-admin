'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const geoip = require('geoip-lite')
const getMAC = require('getmac').default
const isMAC = require('getmac').isMAC

class CustomerInformation {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // const ip = request.ip()
    // const mac = getMAC()
    // const resp = geoip.lookup(ip)
    // let frequent_device = {}
    // if (resp && resp.country) {
    //   frequent_device.country = resp.country
    // }
    // if(isMAC(mac)) {
    //   console.log({ip, mac})
    //   frequent_device.mac = mac
    //   frequent_device.ip = ip
    // }
    // request.frequent_device = frequent_device
    await next()
  }
}

module.exports = CustomerInformation
