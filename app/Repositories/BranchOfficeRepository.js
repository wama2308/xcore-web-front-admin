const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class BranchOfficeRepository {

  async datatable(request, enabled = true) {
    const business = await Business.findOrFail(request.header('business_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = business.branchOffices().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({ name: { $regex: search } })
      })
    }

    return await query.paginate(page, perPage)
  }

  async findOneBranchOffice(request, enabled = true) {
    const business = await Business.findOrFail(request.header('business_id'))
    const branchoffices = await business.branchOffices()
      .where('_id', request.header('branch_office_id'))
      .where('enabled', enabled)
      .with('areas')
      .with('contacts')
      .first()

    if (!branchoffices) {
      throw new exception(
        'Sucursal no encontrada',
      )
    }

    return branchoffices
  }

  async byId(_id, request, enabled = true) {
    const business = await Business.findOrFail(request.header('business_id'))
    const branchoffices = await business.branchOffices()
      .where('_id', _id)
      .where('enabled', enabled)
      .with('areas')
      .with('contacts')
      .first()
    
    if (!branchoffices) {
      throw new exception(
        'Sucursal no encontrada',
      )
    }

    return branchoffices

  }

  async findAllBranchOffice(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const Classes = await branchOffice.class()
      .where('enabled', enabled)
      .select('name', 'description')
      .fetch()

    return Classes
  }
}

module.exports = new BranchOfficeRepository()