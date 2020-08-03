const DepartmentPosition = use('App/Models/DepartmentPosition')
const BranchOffice = use('App/Models/BranchOffice')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const exception = use('App/Utils/ExceptionsHelper')

class DepartmentPositionRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.departmentPositions().query()
      .where(function () {
        this.where('enabled', enabled)
        .with('department')
        // .with('branchOffice')
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
    const departmentPosition = await branchOffice.departmentPositions()
      .where('_id', _id)
      .where('enabled', enabled)
      .with('department')
      .with('user')
      // .with('branchOffice')
      .first()

    if (!departmentPosition) {
      throw new exception(
        'Departamento no encontrada',
      )
    }

    return departmentPosition
  }

  /**
   * Busca todas las departments, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAll(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const departmentPositions = await branchOffice.departmentPositions()
      .where('enabled', enabled)
      .with('department')
      // .with('branchOffice')
      .fetch()
    return departmentPositions
  }

  async findOneWithoutStatus(_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const departmentPosition = await branchOffice.departmentPositions()
      .where('_id', _id)
      .with('department')
      // .with('branchOffice')
      .first()
    return departmentPosition
  }

}

module.exports = new DepartmentPositionRepository()