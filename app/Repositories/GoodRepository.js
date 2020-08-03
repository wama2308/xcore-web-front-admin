const Good = use('App/Models/Good')
const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class GoodRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.goods().query()
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

  async findAll(branch_id, enabled, search = '') {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const query = Good.query()
    if (search) {
      const gt = search.split(' ')
      let expresion = ""
      gt.map(datos => {
        expresion += `^(?=.*${datos})`
      })
      search = new RegExp(expresion, "ims")
      query.where('name').regex(search)
    }
    const goods = await query.where('enabled', enabled)
      .where('branch_office_id', branchOffice._id)
      .limit(5)
      .fetch()
    return goods
  }

  async byId(_id, branch_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const good = await branchOffice.goods()
      .where('_id', _id)
      .where('enabled', enabled)
      .first()
      
    if (!good) {
      throw new exception(
        'Bien no encontrado',
      )
    }

    return good
  }

  async byIds(_ids, branch_id) {
    let goods_ids = []
    for (let item of _ids) {
      
      let good = await this.byId(item._id, branch_id)
      goods_ids.push(good._id)
    }

    return goods_ids
  }

}

module.exports = new GoodRepository()