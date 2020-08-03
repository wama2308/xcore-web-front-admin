const Package = use("App/Models/Package");
const BranchOffice = use("App/Models/BranchOffice");
const regexHelper = use("App/Utils/RegexHelper");
const paginatorHelper = use("App/Utils/PaginatorHelper");
const exception = use("App/Utils/ExceptionsHelper");

class PackageRepository {
  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(
      request.header("branch_office_id")
    );
    let { search } = request.only(["search"]);
    let { page, perPage } = new paginatorHelper(
      request.get().page,
      request.get().perPage
    );

    const query = branchOffice
      .packages()
      .query()
      .where(function () {
        this.where("enabled", enabled);
      });

    if (search) {
      search = new regexHelper(search);
      query.where(function () {
        this.where({
          $or: [
            { name: { $regex: search } },
            { description: { $regex: search } },
          ],
        });
      });
    }

    return await query.paginate(page, perPage);
  }

  /**
   * Busca todas los packages, habilitadas o deshabilitadas,
   * dependiendo del parametro enviado
   */
  async findAll(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id);
    const packages = await branchOffice
      .packages()
      .query()
      .where("enabled", enabled)
      .with("discount", (builder) => {
        builder.where("enabled", true);
      })
      .fetch();
    return packages;
  }

  async findOnePackage(branch_id, package_id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id);
    const $package = await branchOffice
      .packages()
      .where("_id", package_id)
      .where("enabled", enabled)
      .first();

    if (!$package) {
      throw new exception("Paquete no encontrado");
    }

    return $package;
  }

  async findOnePackage(branch_id, _id, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(branch_id);
    const $package = await branchOffice
      .packages()
      .where("_id", _id)
      .where("enabled", enabled)
      .where("enabled", true)
      .with("tax")
      .with("discount")
      .with("penalties", (builder) => {
        builder.where("enabled", true);
      })
      .with("areas")
      .with("class")
      .with("services")
      .with("plans")
      .with("products")
      .first();

    if (!$package) {
      throw new exception("Paquete no encontrado");
    }

    return $package;
  }

  async byId(_id) {
    let status = 200;
    let message = "Ok";
    let $package = await Package.where(function () {
      this.where("_id", _id)
        .where("enabled", true)
        .with("tax")
        .with("discount")
        .with("penalties", (builder) => {
          builder.where("enabled", true);
        })
        .with("areas")
        .with("class")
        .with("services")
        .with("plans")
        .with("products");
    }).first();

    return {
      status,
      data: $package,
      message,
    };
  }

  async findOneWithoutStatus(_id) {
    let status = 200;
    let message = "Ok";
    let $package = await Package.where(function () {
      this.where("_id", _id)
        .with("areas")
        .with("class")
        .with("plans")
        .with("products")
        .with("penalties")
        .with("tax")
        .with("services");
    }).first();

    return {
      status,
      data: $package,
      message,
    };
  }
}

module.exports = new PackageRepository();
