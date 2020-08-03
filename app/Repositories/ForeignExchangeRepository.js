const Business = use("App/Models/Business");
const BranchOffice = use("App/Models/BranchOffice");
const exception = use("App/Utils/ExceptionsHelper");
const regexHelper = use("App/Utils/RegexHelper");
const paginatorHelper = use("App/Utils/PaginatorHelper");

class ForeignExchangeRepository {
  async datatable(request, enabled = true) {
    const business = await Business.findOrFail(request.header("business_id"));
    let { search } = request.only(["search"]);
    let { page, perPage } = new paginatorHelper(
      request.get().page,
      request.get().perPage
    );

    const query = business
      .foreignExchanges()
      .query()
      .where(function () {
        this.where("enabled", enabled);
      });

    if (search) {
      search = new regexHelper(search);
      query.where(function () {
        this.where({ search: { $regex: search } });
      });
    }

    return await query.paginate(page, perPage);
  }

  async datatableBranchOffice(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(
      request.header("branch_office_id")
    );
    let { search } = request.only(["search"]);
    let { page, perPage } = new paginatorHelper(
      request.get().page,
      request.get().perPage
    );

    const query = branchOffice.foreignExchanges().query();

    if (search) {
      search = new regexHelper(search);
      query.where(function () {
        this.where({ search: { $regex: search } });
      });
    }

    return await query.paginate(page, perPage);
  }

  async findOneForeignExchange(business_id, foreign_id, enabled = true) {
    const business = await Business.findOrFail(business_id);
    const foreign = await business
      .foreignExchanges()
      .where("_id", foreign_id)
      .where("enabled", enabled)
      .first();

    if (!foreign) {
      throw new exception("Divisa no encontrada");
    }

    return foreign;
  }

  async findOneForeignExchangeWithoutStatus(business_id, foreign_id) {
    const business = await Business.findOrFail(business_id);
    const foreign = await business
      .foreignExchanges()
      .where("_id", foreign_id)
      .first();

    if (!foreign) {
      throw new exception("Divisa no encontrada");
    }

    return foreign;
  }

  async findAllForeignExchange(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id);
    const store = await branchOffice
      .store()
      .where("enabled", enabled)
      .select("name", "description")
      .fetch();

    return store;
  }
}

module.exports = new ForeignExchangeRepository();
