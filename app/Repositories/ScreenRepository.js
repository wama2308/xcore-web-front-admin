const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class ScreenRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.screens().query()
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

  async findOneScreen(branch_id, _id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const screen = await branchOffice.screens()
      .where('_id', _id)
      .where('enabled', enabled)
      .first()

    if (!screen) {
      throw new exception(
        'Pantalla no encontrada',
      )
    }

    return screen
  }

  async byIds(_ids, branch_id) {
    let screensIds = []
    for (let item of _ids) {
      let screens = await this.findOneScreen(branch_id, item)
      screensIds.push(screens._id)
    }

    return screensIds
  }

  async findAllScreen(branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const screen = await branchOffice.screens()
      .where('enabled', enabled)
      .select('name', 'description', 'brand', 'mac')
      .fetch()

    return screen
  }

  async findAllScreenInClass(branch_id, class_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    let screens = await branchOffice.screens()
      .where('class_id', class_id)
      .where('enabled', enabled)
      .fetch()

    screens = screens.toJSON()

    let array_ids = []
    for (let screen of screens) {
      array_ids.push(screen._id)
    }

    return array_ids
  }

  async findAllScreenInService(branch_id, service_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    let screens = await branchOffice.screens()
      .where('service_id', service_id)
      .where('enabled', enabled)
      .fetch()

    screens = screens.toJSON()

    let array_ids = []
    for (let screen of screens) {
      array_ids.push(screen._id)
    }

    return array_ids
  }

}

module.exports = new ScreenRepository()