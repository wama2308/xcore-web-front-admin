const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class ServiceRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.services().query()
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
   * Busca un servicio habilitado dentro de la sucursal actual
   */
  async findOneService(branch_id, service_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Service = await branchOffice.services()
      .where('_id', service_id)
      .where('enabled', enabled)
      .with('screens')
      .with('tax')
      .with('discount')
      .with('penalties')
      .with('schedule')
      .first()

    if (!Service) {
      throw new exception(
        'Servicio no encontrado',
      )
    }

    return Service
  }

  /**
   * Busca todas los servicios, habilitados o deshabilitados,
   * dependiendo del parametro enviado
   */
  async findAllService(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Service = await branchOffice.services()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()

    return Service
  }

  /**
   * Busca un servicio dentro de la sucursal actual
   * independientemente de si esta o no habilitado
   */
  async findOneServiceWithoutStatus(branch_id, service_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Service = await branchOffice.services()
      .where('_id', service_id)
      .first()

    if (!Service) {
      throw new exception(
        'Servicio no encontrado',
      )
    }

    return Service
  }
}

module.exports = new ServiceRepository()