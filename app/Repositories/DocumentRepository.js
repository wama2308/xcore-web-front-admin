const Document = use('App/Models/Document')
const BranchOffice = use('App/Models/BranchOffice')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class DocumentRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.documents().query()
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

  async byId(_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const $document = await branchOffice.documents().query()
      .where('enabled', true)
      .where('_id', _id)
      .where('branch_office_id', branch_id)
      .first()
    return $document
  }

  /**
   * Busca todas los documentos, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAll(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const documents = await branchOffice.documents().query()
      .where('enabled', enabled)
      .where('branch_office_id', branch_id)
      .fetch()
    return documents
  }

  async findOneWithoutStatus (_id, branch_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const $document = await branchOffice.documents().query()
      .where('_id', _id)
      .where('branch_office_id', branch_id)
      .first()
    return $document
  }

}

module.exports = new DocumentRepository()