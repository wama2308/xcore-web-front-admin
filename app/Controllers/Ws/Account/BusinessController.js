'use strict'


const Business = use('App/Models/Business')
const businessRepository = use('App/Repositories/BusinessRepository')

class BusinessController {

  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.auth = auth
  }

  async onBusiness ({ branch_office_id, business_id }) {
    const user = await this.auth.getUser()
    if (user) {
      const business = await businessRepository.datatable(this.request, user._id)
      this.socket.broadcastToAll('business', business) //broadcastToAll
    }
  }

}

module.exports = BusinessController
