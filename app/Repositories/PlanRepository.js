const Plan = use('App/Models/Plan')
const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class PlanRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.plan().query()
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
   * Busca un plan habilitado dentro de una sucursal
   */
  async findOnePlan(branch_id, plan_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const plan = await branchOffice.plan()
      .where('_id', plan_id)
      .where('enabled', enabled)
      .with('tax')
      .with('discount')
      .with('penalties')
      .with('schedule')
      .first()

    if (!plan) {
      throw new exception(
        'Plan no encontrado',
      )
    }

    return plan
  }

  /**
   * Busca un plan dentro de la sucursal actual
   * independientemente de si esta o no habilitada
   */
  async findOnePlanWithoutStatus(branch_id, plan_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const plan = await branchOffice.plan()
      .where('_id', plan_id)
      .first()

    if (!plan) {
      throw new exception(
        'Plan no encontrado',
      )
    }

    return plan
  }

  /**
   * Busca todos los planes, habilitados o deshabilitados,
   * dependiendo del parametro enviado
   */
  async findAllPlan(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const plans = await branchOffice.plan()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()

    return plans
  }

}

module.exports = new PlanRepository()