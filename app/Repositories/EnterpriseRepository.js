const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class EnterpriseRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.enterprises().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({ search: { $regex: search } })
      })
    }

    return await query.paginate(page, perPage)
  }

  async findOneEnterprise(branch_id, enterprise_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const enterprise = await branchOffice.enterprises()
      .where('_id', enterprise_id)
      .where('enabled', enabled)
      .with('typeIdentity')
      .with('person', (builder) => {
        builder.with('typeIdentity')
      })
      .with('addresses', (builder) => {
        builder.where('enabled', true)
      })
      .with('emails', (builder) => {
        builder.where('enabled', true)
      })
      .with('phones', (builder) => {
        builder.where('enabled', true)
      })
      .first()

    if (!enterprise) {
      throw new exception(
        'groupo no encontrado',
      )
    }

    return enterprise
  }

  async findAllEnterprise(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const groups = await branchOffice.groups()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()

    return groups
  }

  async findOneEnterpriseWithoutStatus(branch_id, enterprise_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const enterprise = await branchOffice.enterprises()
      .where('_id', enterprise_id)
      .first()

    if (!enterprise) {
      throw new exception(
        'Empresa no encontrada',
      )
    }

    return enterprise
  }
}

module.exports = new EnterpriseRepository()