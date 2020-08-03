const Schedule = use('App/Models/Schedule')
const BranchOffice = use('App/Models/BranchOffice')
const businessRepository = use('App/Repositories/BusinessRepository')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class ScheduleRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.schedules().query()
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
    const schedule = await branchOffice.schedules()
      .where('_id', _id)
      .where('enabled', enabled)
      .first()
    return schedule
  }

  async findAll(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const schedules = await branchOffice.schedules()
      .where('enabled', enabled)
      .fetch()
    return schedules
  }

  async findOneWithoutStatus (_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const schedule = await branchOffice.schedules()
      .where('_id', _id)
      .first()
    return schedule
  }

}

module.exports = new ScheduleRepository()