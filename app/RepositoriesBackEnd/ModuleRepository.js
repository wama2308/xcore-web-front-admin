const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const Module = use('App/Models/GeneralConfiguration/Module')

class ModuleRepository {

  async datatable(request, enabled = true) {
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = Module.query()
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

  async findOneModule(module_id, enabled = true) {
    const modul = await Module
      .where('_id', module_id)
      .where('enabled', enabled)
      .with('category')
      .first()

    if (!modul) {
      throw new exception(
        'Modulo no encontrado',
      )
    }

    return modul
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