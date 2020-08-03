const BranchOffice = use('App/Models/BranchOffice')
const exception = use('App/Utils/ExceptionsHelper')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')
const Category = use('App/Models/GeneralConfiguration/Category')

class CategoryRepository {

  async datatable(request, enabled = true) {
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = Category.query()
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

  async findOneCategory(category_id, enabled = true) {
    const category = await Category
      .where('_id', category_id)
      .where('enabled', enabled)
      .with('modules')
      .first()

    if (!category) {
      throw new exception(
        'Categoria no encontrada',
      )
    }

    return category
  }

  async findOneCategoryWithoutStatus(category_id) {
    const category = await Category
      .where('_id', category_id)
      .first()

    if (!category) {
      throw new exception(
        'Categoria no encontrada',
      )
    }

    return category
  }
}

module.exports = new CategoryRepository()