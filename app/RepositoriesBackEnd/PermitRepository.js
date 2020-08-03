const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const Permit = use('App/Models/GeneralConfiguration/Permit')

class PermitRepository {

  async datatable(request, enabled = true) {
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = Permit.query()
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
  
  async findOnePermit(permit_id, enabled = true) {
    const permit = await Permit
      .where('_id', permit_id)
      .where('enabled', enabled)
      .first()

    if (!permit) {
      throw new exception(
        'Permiso no encontrado',
      )
    }

    return permit
  }

  async findOnePermitWithoutStatus(permit_id) {
    const permit = await Permit
      .where('_id', permit_id)
      .first()

    if (!permit) {
      throw new exception(
        'Permiso no encontrado',
      )
    }

    return permit
  }
}

module.exports = new PermitRepository()