const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class GroupRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.groups().query()
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

  async findOneGroup(branch_id, groups_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const groups = await branchOffice.groups()
      .where('_id', groups_id)
      .where('enabled', enabled)
      .with('person', (builder) => {
        builder.with('typeIdentity')
      })
      .with('schedule')
      .with('discount')
      .with('enterprise', (builder) => {
        builder.with('typeIdentity')
      })
      .with('class', (builder) => {
        builder.select('name', 'description')
      })
      .with('plans', (builder) => {
        builder.select('name', 'description')
      })
      .with('areas', (builder) => {
        builder.select('name', 'description')
      })
      .with('products')
      .with('packages', (builder) => {
        builder.select('name', 'description')
      })
      .with('services', (builder) => {
        builder.select('name', 'description')
      })
      .with('people', (builder) => {
        builder.with('typeIdentity')
      })
      .first()

    if (!groups) {
      throw new exception(
        'groupo no encontrado',
      )
    }

    return groups
  }

  async findAllGroup(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const groups = await branchOffice.groups()
      .where('enabled', enabled)
      .with('discount', (builder) => {
        builder.where('enabled', true)
      })
      .fetch()

    return groups
  }

  async findOneGroupWithoutStatus(branch_id, groups_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const groups = await branchOffice.groups()
      .where('_id', groups_id)
      .first()

    if (!groups) {
      throw new exception(
        'groupo no encontrado',
      )
    }

    return groups
  }
}

module.exports = new GroupRepository()