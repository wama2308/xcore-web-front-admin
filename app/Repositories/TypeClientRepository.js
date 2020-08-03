const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class TypeClientRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.typeClients().query()
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

  async findOneTypeClient(branch_id, _id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const typeClient = await branchOffice.typeClients()
      .where('_id', _id)
      .where('enabled', enabled)
      .with('areas')
      .with('classes')
      .with('packages')
      .with('plans')
      .with('services')
      .first()

    if (!typeClient) {
      throw new exception(
        'Tipo de cliente no encontrado',
      )
    }

    return typeClient
  }

  async findOneTypeClientWithoutStatus(branch_id, _id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const typeClient = await branchOffice.typeClients()
      .where('_id', _id)
      .first()

    if (!typeClient) {
      throw new exception(
        'Tipo de cliente no encontrado',
      )
    }

    return typeClient
  }

  async findAllTypeClient(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const typeClient = await branchOffice.typeClients()
      .where('enabled', enabled)
      .select('name', 'description', 'stars')
      .fetch()

    return typeClient
  }
  
}

module.exports = new TypeClientRepository()