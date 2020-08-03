const Service = use('App/Models/Service')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class SpaceRepository {

  async datatable(request, enabled = true) {
    const service = await Service.findOrFail(request.header('service_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = service.spaces().query()
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
   * Busca un espacio habilitado dentro del servicio
   */
  async findOneSpace(service_id, space_id) {
    const service = await Service.findOrFail(service_id)
    const Space = await service.spaces()
      .where('_id', space_id)
      .where('enabled', true)
      .first()

    return Space
  }

  /**
   * Busca todas los espacios, habilitados o deshabilitados,
   * dependiendo del parametro enviado
   */
  async findAllSpace(service_id, enabled) {
    const service = await Service.findOrFail(service_id)
    const Space = await service.spaces()
      .where('enabled', enabled)
      .fetch()

    return Space
  }

  /**
   * Busca un espacio dentro del servicio actual
   * independientemente de si esta o no habilitado
   */
  async findOneSpaceWithoutStatus(branch_id, service_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Service = await branchOffice.services()
      .where('_id', service_id)
      .first()

    return Service
  }
}

module.exports = new SpaceRepository()