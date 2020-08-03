const Store = use('App/Models/Store')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class ShelfRepository {

  async datatable(request, enabled = true) {
    const store = await Store.findOrFail(request.header('store_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = store.shelf().query()
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
   * Busca un estante habilitado dentro de la sucursal actual
   */
  async findOneShelf(store_id, shelf_id) {
    const store = await Store.findOrFail(store_id)
    const shelf = await store.shelfs()
      .where('_id', shelf_id)
      .where('enabled', true)
      .first()

    return shelf
  }

  /**
   * Busca un estante dentro de la sucursal actual
   * independientemente de si esta o no habilitado
   */
  async findOneShelfWithoutStatus(store_id, shelf_id) {
    const store = await Store.findOrFail(store_id)
    const shelf = await store.shelfs()
      .where('_id', shelf_id)
      .first()

    return shelf
  }

  /**
   * Busca todos los estantes, habilitados o deshabilitados,
   * dependiendo del parametro enviado
   */
  async findAllShelf(store_id, enabled) {
    const store = await Store.findOrFail(store_id)
    const shelf = await store.shelfs()
      .where('enabled', enabled)
      .select('name', 'description', )
      .fetch()

    return shelf
  }

}

module.exports = new ShelfRepository()