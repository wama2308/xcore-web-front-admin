'use strict'

class AccountScheduleStore {
  get validateAll () {
    return true
  }
  
  get rules () {
    return {
    }
  }

  get messages () {
    return {
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountScheduleStore
