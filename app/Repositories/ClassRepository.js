const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class ClassRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.class().query()
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
   * Busca una clase habilitada dentro de la sucursal actual
   */
  async findOneClass(branch_id, class_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Class = await branchOffice.class()
      .where('_id', class_id)
      .where('enabled', enabled)
      .with('screens')
      .with('tax')
      .with('discount')
      .with('penalties')
      .with('schedule')
      .first()

    if (!Class) {
      throw new exception(
        'Clase no encontrada',
      )
    }

    return Class
  }

  /**
   * Busca todas las clases, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAllClass(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Classes = await branchOffice.class()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()

    return Classes
  }

  /**
   * Busca una clase dentro de la sucursal actual
   * independientemente de si esta o no habilitada
   */
  async findOneClassWithoutStatus(branch_id, class_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Class = await branchOffice.class()
      .where('_id', class_id)
      .first()

    if (!Class) {
      throw new exception(
        'Clase no encontrada',
      )
    }

    return Class
  }
}

module.exports = new ClassRepository()