const Department = use('App/Models/Department')
const BranchOffice = use('App/Models/BranchOffice')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const exception = use('App/Utils/ExceptionsHelper')

class DepartmentRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.departments().query()
      .where(function () {
        this.where('enabled', enabled)
        .with('positions')
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
    const department = await branchOffice.departments()
      .where('_id', _id)
      .where('enabled', enabled)
      .with('positions')
      .with('parent')
      .first()

    if (!department) {
      throw new exception(
        'Departamento no encontrada',
      )
    }

    return department
  }

  /**
   * Busca todas las departments, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAll(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const departments = await branchOffice.departments()
      .where('enabled', enabled)
      .with('positions')
      .fetch()
    return departments
  }

  async findOneWithoutStatus(_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const department = await branchOffice.departments()
      .where('_id', _id)
      .with('positions')
      .first()
    return department
  }

}

module.exports = new DepartmentRepository()