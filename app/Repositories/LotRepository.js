const Product = use('App/Models/Product')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class LotRepository {

  async datatable(request, enabled = true) {
    const product = await Product.findOrFail(request.header('product_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = product.lots().query()
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

  async findOneLot(product_id, lot_id, enabled = true) {
    const product = await Product.findOrFail(product_id)
    const lot = await product.lots()
      .where('_id', lot_id)
      .where('enabled', enabled)
      .first()

    if (!lot) {
      throw new exception(
        'Producto no encontrado',
      )
    }

    return lot
  }

  async findAllLotSum(product, enabled = true) {
    const lots = await product.lots()
      .where('enabled', enabled)
      .select('number')
      .fetch()

    if (!lots) {
      throw new exception(
        'No hay lotes registrados',
      )
    }

    let sum = 0
    for (let lot of lots.rows) {
      sum = lot.number
    }

    return sum + 1
  }

  async findOneLotWithoutStatus(product_id, lot_id) {
    let product = await Product.findOrFail(product_id)
    const lot = await product.lots()
      .where('_id', lot_id)
      .first()

    if (!lot) {
      throw new exception(
        'El lotes no está registrado',
      )
    }

    return lot
  }
}

module.exports = new LotRepository()