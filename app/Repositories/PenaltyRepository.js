const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class PenaltyRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.penalties().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({
          $or: [
            { name: { $regex: search } },
            { description: { $regex: search } }
          ]
        })
      })
    }

    return await query.paginate(page, perPage)
  }

  async byId(_id, branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const penalty = await branchOffice.penalties()
      .where('_id', _id)
      .where('enabled', enabled)
      .first()

    if (!penalty) {
      throw new exception(
        'Penalización no encontrada',
      )
    }

    return penalty
  }

  async byIds(_ids, branch_id) {
    let penaltyIds = []
    for (let item of _ids) {
      let penalty = await this.byId(item, branch_id)
      penaltyIds.push(penalty._id)
    }

    return penaltyIds
  }

  async findAllPenalty(branch_id, enabled = true) {
    let branchOffice = await BranchOffice.findOrFail(branch_id)
    let penalties = await branchOffice.penalties()
      .where('enabled', enabled)
      .fetch()

    return penalties
  }

}

module.exports = new PenaltyRepository()