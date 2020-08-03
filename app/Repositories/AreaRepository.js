const Area = use('App/Models/Area')
const BranchOffice = use('App/Models/BranchOffice')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const exception = use('App/Utils/ExceptionsHelper')

class AreaRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.areas().query()
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
    const area = await branchOffice.areas()
      .where('_id', _id)
      .where('enabled', enabled)
      .with('users')
      .with('goods')
      .with('discount')
      .with('tax')
      .with('penalties')
      .with('schedule')
      .first()

    if (!area) {
      throw new exception(
        'Area no encontrada',
      )
    }

    return area
  }

  /**
   * Busca todas las areas, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAll(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const areas = await branchOffice.areas()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()
    return areas
  }

  async findOneWithoutStatus(_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const area = await branchOffice.areas()
      .where('_id', _id)
      .with('users')
      .with('goods')
      .with('discount')
      .with('tax')
      .first()
    return area
  }

}

module.exports = new AreaRepository()