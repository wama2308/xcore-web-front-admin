const BranchOffice = use('App/Models/BranchOffice')
const Goal = use('App/Models/Goal')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class GoalRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.goals().query()
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

  /**
   * Busca una meta habilitada dentro de una sucursal
   */
  async findOneGoal(branch_id, goal_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const goal = await branchOffice.goals()
      .where('_id', goal_id)
      .where('enabled', true)
      .first()

    return goal
  }

  /**
   * Busca todas las metas, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAllGoal(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const goals = await branchOffice.goals()
      .where('enabled', enabled)
      .fetch()

    return goals
  }

  /**
   * Busca una meta dentro de una sucursal actual
   * independientemente de si esta o no habilitada
   */
  async findOneGoalWithoutStatus(branch_id, goal_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Service = await branchOffice.services()
      .where('_id', goal_id)
      .first()

    return Service
  }
}

module.exports = new GoalRepository()