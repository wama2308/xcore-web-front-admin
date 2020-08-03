const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class BillingRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.products().query()
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

  async findOneProduct(branch_id, products_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const products = await branchOffice.products()
      .where('_id', products_id)
      .where('enabled', enabled)
      .with('lots', (builder) => {
        builder.where('enabled', true)
        builder.with('discount')
      })
      .first()

    if (!products) {
      throw new exception(
        'Producto no encontrado',
      )
    }

    return products
  }

  async findAllProduct(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const products = await branchOffice.products()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()

    return products
  }

  async findOneProductWithoutStatus(branch_id, products_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const products = await branchOffice.products()
      .where('_id', products_id)
      .first()

    if (!products) {
      throw new exception(
        'Producto no encontrado',
      )
    }

    return products
  }
}

module.exports = new BillingRepository()