const Discount = use('App/Models/Discount')
const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class DiscountRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.discounts().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({
          $or: [
            { name: { $regex: search } }
          ]
        })
      })
    }

    return await query.paginate(page, perPage)
  }

  async byId(_id, branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const discount = await branchOffice.discounts()
      .where('_id', _id)
      .where('enabled', enabled)
      .with('clases')
      .with('areas')
      .with('plans')
      .with('services')
      .with('products')
      .with('packages')
      .first()

    if (!discount) {
      throw new exception(
        'Descuento no encontrado',
      )
    }

    return discount
  }

  /**
   * Busca todos los descuentos, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAll(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const discounts = await branchOffice.discounts().query()
      .where('enabled', enabled)
      .where('branch_office_id', branch_id)
      .fetch()
    return discounts
  }

  async isAll (branch_id) {

    const branchOffice = await BranchOffice.findOrFail(branch_id)

    const all_class = await branchOffice.discounts()
      .where('enabled', true)
      .where('all_class', true)
      .first()

    const all_plans = await branchOffice.discounts()
      .where('enabled', true)
      .where('all_plans', true)
      .first()

    const all_areas = await branchOffice.discounts()
      .where('enabled', true)
      .where('all_areas', true)
      .first()

    const all_services = await branchOffice.discounts()
      .where('enabled', true)
      .where('all_services', true)
      .first()

    const all_products = await branchOffice.discounts()
      .where('enabled', true)
      .where('all_products', true)
      .first()

    const all_packages = await branchOffice.discounts()
      .where('enabled', true)
      .where('all_packages', true)
      .first()

    return {
      all_class,
      all_plans,
      all_areas,
      all_services,
      all_products,
      all_packages
    }

  }

  async findOneWithoutStatus(_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const discount = await branchOffice.discounts()
      .where('_id', _id)
      .first()
    return discount
  }

}

module.exports = new DiscountRepository()