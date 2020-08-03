const BranchOffice = use('App/Models/BranchOffice')
const Term = use('App/Models/Term')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class TermRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.terms().query()
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

  /**
   * Busca una condicion habilitada dentro de una sucursal
   */
  async findOneTerm(branch_id, term_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const term = await branchOffice.terms()
      .where('_id', term_id)
      .where('enabled', true)
      .first()

    return term
  }

  /**
   * Busca todas las condiciones, habilitados o deshabilitados,
   * dependiendo del parametro enviado
   */
  async findAllTerm(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const terms = await branchOffice.terms()
      .where('enabled', enabled)
      .fetch()

    return terms
  }

}

module.exports = new TermRepository()