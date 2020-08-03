const DataGrid = use('DataGrid')
const User = use('App/Models/User')
const BranchOffice = use('App/Models/BranchOffice')
const businessRepository = use('App/Repositories/BusinessRepository')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class UserRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.users().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({
          $or: [
            { username: { $regex: search } },
            { email: { $regex: search } },
            { names: { $regex: search } },
            { surnames: { $regex: search } }
          ]
        })
      })
    }

    return await query.paginate(page, perPage)
  }

  async datatableUserBranchOffice(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.users().query()
      .where('enabled', true)

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({
          $or: [
            { username: { $regex: search } },
            { email: { $regex: search } },
            { names: { $regex: search } },
            { surnames: { $regex: search } }
          ]
        })
      })
    }

    return await query.paginate(page, perPage)
  }

  async allEnabled(business_id) {
    const business = await businessRepository.byId(business_id)
    if (business) {
      const users = await business.users().query()
        .where('enabled', true)
        .fetch()
      return users
    } else {
      return []
    }
  }

  async allDisabled() {
    const business = await businessRepository.byId(business_id)
    if (business) {
      const users = await business.users().query()
        .where('enabled', false)
        .fetch()
      return users
    } else {
      return []
    }
  }

  async byEmail(email) {
    const user = await User.where('email', email)
      .first()

    if (!user) {
      throw new exception(
        'Email no encontrado',
      )
    }

    return user
  }

  async byEmailExists(branch_id, email, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const user = await branchOffice.users()
      .where('email', email)
      .where('enabled', enabled)
      .fetch()

    if (user) {
      throw new exception(
        'Email Registrado',
      )
    }

    return user
  }

  async byEmailOnlyExists(email) {
    const user = await User
      .where('email', email)
      .first()

    return user
  }

  async findOneUser(branch_id, _id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const user = await branchOffice.users()
      .where('_id', _id)
      .where('enabled', true)
      .with('branchOffices', (builder) => {
        builder.where('_id', branch_id)
        builder.select('pivot')
      })
      .first()

    if (!user) {
      throw new exception(
        'Usuario no registrado',
      )
    }

    return user
  }

  async findOneUserWithoutStatus(branch_id, _id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const user = await branchOffice.users()
      .where('_id', _id)
      .first()

    if (!user) {
      throw new exception(
        'Usuario no registrado',
      )
    }

    return user
  }

  async byId(_id) {
    const user = await User.where('enabled', true)
      .where('_id', _id)
      .first()
    return user
  }

  async update(by, value, data) {
    await User.where(by, value)
      .where('enabled', true)
      .update(data)
  }

  async is_master(business_id, user) {
    let business = await user.business()
      .where('_id', business_id)
      .first()

    return business
  }

}

module.exports = new UserRepository()