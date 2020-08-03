const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const Module = use('App/Models/GeneralConfiguration/Module')

class ModuleRepository {

  async datatable(request, enabled = true) {
    const business = await Business.findOrFail(request.header('business_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    return await business.licenses().query()
      .with('modules')
      .select('modules')
      .fetch()

    const query = await business.licenses().query()

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

  async list(request, enabled = true) {

    const business = await Business.findOrFail(request.header('business_id'))
    const license = await business.licenses().query()
      .with('modules')
      .select('modules')
      .first()

    return license
  }

  async findOneModule(request, module_id, enabled = true) {
    const business = await Business.findOrFail(request.header('business_id'))
    const license = await business.licenses().query()
      .with('modules', (builder) => {
        builder.where('_id', module_id)
      })
      .select('modules')
      .first()

    return license
  }

  async findOneModuleWithoutStatus(module_id) {
    const modul = await Module
      .where('_id', module_id)
      .first()

    if (!modul) {
      throw new exception(
        'Modulo no encontrado',
      )
    }

    return modul
  }
}

module.exports = new ModuleRepository()