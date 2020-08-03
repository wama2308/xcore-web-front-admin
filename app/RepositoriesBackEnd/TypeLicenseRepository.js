const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const TypeLicense = use('App/Models/GeneralConfiguration/TypeLicense')

class TypeLicenseRepository {

  async datatable(request, enabled = true) {
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = TypeLicense.query()
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

  async findOneTypeLicense(typeLicense_id, enabled = true) {
    const typeLicense = await TypeLicense
      .where('_id', typeLicense_id)
      .where('enabled', enabled)
      .first()

    if (!typeLicense) {
      throw new exception(
        'Tipo de licencia no encontrada',
      )
    }

    return typeLicense
  }

  async findOneTypeLicenseWithoutStatus(typeLicense_id) {
    const typeLicense = await TypeLicense
      .where('_id', typeLicense_id)
      .first()

    if (!typeLicense) {
      throw new exception(
        'Tipo de licencia no encontrada',
      )
    }

    return typeLicense
  }
}

module.exports = new TypeLicenseRepository()