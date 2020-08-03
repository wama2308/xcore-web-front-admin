const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class RolRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.roles().query()
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

  async allRol(branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const roles = await branchOffice.roles()
      .where('enabled', true)
      .with('modules')
      .fetch()

    return roles
  }

  async findOneRol(branch_id, rol_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const rol = await branchOffice.roles()
      .where('_id', rol_id)
      .where('enabled', enabled)
      .with('modules')
      .first()

    if (!rol) {
      throw new exception(
        'Rol no encontrado',
      )
    }

    return rol
  }

  async findOneRolWithoutStatus(branch_id, rol_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const rol = await branchOffice.roles()
      .where('_id', rol_id)
      .first()

    if (!rol) {
      throw new exception(
        'Rol no encontrado',
      )
    }

    return rol
  }

  async oneRol(branch_id, rol_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const rol = await branchOffice.roles()
      .where('_id', rol_id)
      .where('enabled', enabled)
      .first()

    if (!rol) {
      throw new exception(
        'Rol no encontrado',
      )
    }

    return rol
  }

}

module.exports = new RolRepository()