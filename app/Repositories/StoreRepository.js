const BranchOffice = use('App/Models/BranchOffice')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class StoreRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.store().query()
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
   * Busca una almacen habilitado dentro de la sucursal actual
   */
  async findOneStore(branch_id, store_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const store = await branchOffice.store()
      .where('_id', store_id)
      .where('enabled', true)
      .with('shelfs', (builder) => {
        builder.where('enabled', true)
      })
      .first()

    return store
  }

  /**
   * Busca un almacen dentro de la sucursal actual
   * independientemente de si esta o no habilitado
   */
  async findOneStoreWithoutStatus(branch_id, store_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const store = await branchOffice.store()
      .where('_id', store_id)
      .first()

    return store
  }

  /**
   * Busca todos los almacenes, habilitados o deshabilitados,
   * dependiendo del parametro enviado
   */
  async findAllStore(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const store = await branchOffice.store()
      .where('enabled', enabled)
      .select('name', 'description', )
      .fetch()

    return store
  }

}

module.exports = new StoreRepository()