const Rule = use('App/Models/GeneralConfiguration/Rule')
const Business = use('App/Models/Business')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class RuleRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.persons().query()
      .where(function () {
        this.where('enabled', enabled)
        this.with('sex')
        this.with('civilState')
        this.with('typeIdentity')
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({ search: { $regex: search } })
      })
    }

    return await query.paginate(page, perPage)
  }

  async findOneRule(_id, enabled = true) {
    const rule = await Rule.query()
      .where('_id', _id)
      .where('enabled', enabled)
      .first()

    if (!rule) {
      throw new exception(
        'Regla no encontrada',
      )
    }

    return rule
  }

  async findAllPerson(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const person = await branchOffice.persons()
      .where('enabled', enabled)
      .select('names', 'surnames')
      .fetch()

    return person
  }

  async findOnePersonWithoutStatus(branch_id, person_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const person = await branchOffice.persons()
      .where('_id', person_id)
      .first()

    if (!person) {
      throw new exception(
        'Persona no encontrada',
      )
    }

    return person
  }
}

module.exports = new RuleRepository()