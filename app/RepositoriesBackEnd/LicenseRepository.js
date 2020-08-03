const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const License = use('App/Models/License')

class LicenseRepository {

  async datatable(request, enabled = true) {
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = License.query()
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

  async findOneLicense(license_id, enabled = true) {
    const license = await License
      .where('_id', license_id)
      .where('enabled', enabled)
      .with('countries')
      .with('typeLicense')
      .with('modules')
      .first()

    if (!license) {
      throw new exception(
        'Licencia no encontrada',
      )
    }

    return license
  }

  async findOneLicenseWithoutStatus(license_id) {
    const license = await License
      .where('_id', license_id)
      .first()

    if (!license) {
      throw new exception(
        'Licencia no encontrada',
      )
    }

    return license
  }
}

module.exports = new LicenseRepository()