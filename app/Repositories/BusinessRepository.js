const Business = use('App/Models/Business')
const User = use('App/Models/User')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class BusinessRepository {

  async datatable(request, user_id, enabled = true) {
    let user = await User.findOrFail(user_id)
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = user.business().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({ name: { $regex: search } })
      })
    }

    const data = await query.fetch()

    return {
      data,
      total: 0,
      page: 1,
      perPage: 10,
      lastPage: 0,
    }

    //return await query.paginate(page, perPage) //.fetch()
  }

  async allEnabled(user) {
    let business = await user.business()
      .where('enabled', true)
      .with('branchOffices', (builder) => {
        builder.where('enabled', true)
        builder.with('areas', (sub_builder) => {
          sub_builder.where('enabled', true)
        })
      })
      .fetch()
    return business
  }

  async allDisabled(user) {
    let business = await user.business()
      .where('enabled', false)
      .with('branchOffices.areas')
      .fetch()
    return business
  }

  async byId(_id) {
    const business = await Business.query()
      .where('enabled', true)
      .where('_id', _id)
      .first()

    if (!business) {
      throw new exception(
        'Empresa no encontrada',
      )
    }

    return business
  }

}

module.exports = new BusinessRepository()