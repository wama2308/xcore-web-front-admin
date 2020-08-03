"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with packages
 */
const Package = use("App/Models/Package");
const Tax = use("App/Models/Country/Tax");
const Area = use("App/Models/Area");
const Product = use("App/Models/Product");
const Discount = use("App/Models/Discount");
const Class = use("App/Models/Class");
const Plan = use("App/Models/Plan");
const Service = use("App/Models/Service");
const BranchOffice = use("App/Models/BranchOffice");
const packageRepository = use("App/Repositories/PackageRepository");
const penaltyRepository = use("App/Repositories/PenaltyRepository");
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

const getPivotDiscount = async (discount_id) => {
  let discount = await Discount.find(discount_id);
  if (discount) {
    discount = discount.toJSON();
    discount = {
      label: discount.name,
      value: discount._id,
      info: discount,
    };
  }
  return discount;
};

class PackageController {
  async index({ request, response }) {
    let packages = await packageRepository.datatable(request);

    return response.status(200).json(packages);
  }

  async indexDisabled({ request, response }) {
    let packages = await packageRepository.datatable(request, false);

    return response.status(200).json(packages);
  }

  async select({ request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    const packages = await packageRepository.findAll(branch_office_id, true);
    const select =
      packages && packages.rows
        ? packages.toJSON().map((item) => {
            return {
              label: item.name,
              value: item._id,
              info: item,
            };
          })
        : [];
    return response.status(200).json(select);
  }

  /**
   * Create/save a new package.
   * POST packages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    let aux,
      obj,
      discount = null,
      discountAux,
      arrayAux = [],
      areas_ids = [],
      class_ids = [],
      services_ids = [],
      plans_ids = [],
      products_ids = [];

    let data = request.only([
      "name",
      "description",
      "image",
      "amount",
      "penalty",
      "expiration_date",
      "corporate_group",
      "partial_payment",
      "number_days",
      "discount_individual",
      "discount_general",
    ]);

    let idsRules = request.only([
      "tax_id",
      "discount_id",
      "type_penalties",
      "areas",
      "class",
      "services",
      "plans",
      "products",
    ]);

    const branch_offices = await BranchOffice.findOrFail(branch_office_id);
    const tax = await Tax.findOrFail(idsRules.tax_id);

    if (data.discount_general) {
      discount = await Discount.findOrFail(idsRules.discount_id);
    }

    let penaltyIds = [];
    if (data.penalty) {
      try {
        penaltyIds = await penaltyRepository.byIds(
          idsRules.type_penalties,
          branch_office_id
        );
      } catch (error) {
        return response.status(error.status).json({
          code: error.code,
          message: error.message,
        });
      }
    }

    if (idsRules.areas && idsRules.areas.length > 0) {
      arrayAux = [];
      for (const element of idsRules.areas) {
        discountAux = null;
        obj = await Area.findOrFail(element.areas_id);
        areas_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          areas_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.areas = arrayAux;
    }

    if (idsRules.class && idsRules.class.length > 0) {
      arrayAux = [];
      for (const element of idsRules.class) {
        discountAux = null;
        obj = await Class.findOrFail(element.class_id);
        class_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          class_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.class = arrayAux;
    }

    if (idsRules.services && idsRules.services.length > 0) {
      arrayAux = [];
      for (const element of idsRules.services) {
        discountAux = null;
        obj = await Service.findOrFail(element.services_id);
        services_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          services_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.services = arrayAux;
    }

    if (idsRules.plans && idsRules.plans.length > 0) {
      arrayAux = [];
      for (const element of idsRules.plans) {
        discountAux = null;
        obj = await Plan.findOrFail(element.plans_id);
        plans_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          plans_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.plans = arrayAux;
    }

    if (idsRules.products && idsRules.products.length > 0) {
      arrayAux = [];
      for (const element of idsRules.products) {
        discountAux = null;
        obj = await Product.findOrFail(element.products_id);
        products_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          products_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.products = arrayAux;
    }

    const $package = await branch_offices.packages().create({
      ...data,
      created_by: auth.user._id,
    });

    await $package.tax().associate(tax);

    if (discount != null) {
      await $package.discount().associate(discount);
    }

    if (penaltyIds.length > 0) {
      await $package.penalties().sync(penaltyIds);
    }

    if (areas_ids.length > 0) {
      await $package.areas().sync(areas_ids, (row) => {
        let element = idsRules.areas.find(
          (item) => `${item.areas_id}` === `${row.area_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (class_ids.length > 0) {
      await $package.class().sync(class_ids, (row) => {
        let element = idsRules.class.find(
          (item) => `${item.class_id}` === `${row.class_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (services_ids.length > 0) {
      await $package.services().sync(services_ids, (row) => {
        let element = idsRules.services.find(
          (item) => `${item.services_id}` === `${row.service_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (plans_ids.length > 0) {
      await $package.plans().sync(plans_ids, (row) => {
        let element = idsRules.plans.find(
          (item) => `${item.plans_id}` === `${row.plan_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (products_ids.length > 0) {
      await $package.products().sync(products_ids, (row) => {
        let element = idsRules.products.find(
          (item) => `${item.products_id}` === `${row.product_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    return response.status(201).json({
      package: $package,
      ...new MessageFrontEnd('Paquete creada con éxito')
    });
  }

  /**
   * Display a single package.
   * GET packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    let $package;

    try {
      $package = await packageRepository.findOnePackage(
        branch_office_id,
        params._id
      );
    } catch (error) {
      return response.status(error.status).json({
        code: error.code,
        message: error.message,
      });
    }

    $package = $package.toJSON();

    if ($package.tax) {
      $package.tax = {
        label: $package.tax.amount,
        value: $package.tax._id,
        info: $package.tax,
      };
    }

    if ($package.discount) {
      $package.discount = {
        label: $package.discount.name,
        value: $package.discount._id,
        info: $package.discount,
      };
    }

    for (const element of $package.areas) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id);
      }
    }

    for (const element of $package.class) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id);
      }
    }

    for (const element of $package.services) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id);
      }
    }

    for (const element of $package.plans) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id);
      }
    }

    for (const element of $package.products) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id);
      }
    }

    if ($package.penalties && Array.isArray($package.penalties)) {
      $package.penalties = $package.penalties.map((element) => {
        return {
          label: element.name,
          value: element._id,
          info: element,
        };
      });
    }

    return response.status(200).json({
      package: $package,
    });
  }

  /**
   * Update package details.
   * PUT or PATCH packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    let aux,
      obj,
      discount = null,
      discountAux,
      arrayAux = [],
      areas_ids = [],
      class_ids = [],
      services_ids = [],
      plans_ids = [],
      products_ids = [];

    let data = request.only([
      "name",
      "description",
      "image",
      "amount",
      "penalty",
      "expiration_date",
      "corporate_group",
      "partial_payment",
      "number_days",
      "discount_individual",
      "discount_general",
    ]);

    let idsRules = request.only([
      "tax_id",
      "discount_id",
      "type_penalties",
      "areas",
      "class",
      "services",
      "plans",
      "products",
    ]);

    const tax = await Tax.findOrFail(idsRules.tax_id);

    if (data.discount_general) {
      discount = await Discount.findOrFail(idsRules.discount_id);
    }

    let penaltyIds = [];
    if (data.penalty) {
      try {
        penaltyIds = await penaltyRepository.byIds(
          idsRules.type_penalties,
          branch_office_id
        );
      } catch (error) {
        return response.status(error.status).json({
          code: error.code,
          message: error.message,
        });
      }
    }

    if (idsRules.areas && idsRules.areas.length > 0) {
      arrayAux = [];
      for (const element of idsRules.areas) {
        discountAux = null;
        obj = await Area.findOrFail(element.areas_id);
        areas_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          areas_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.areas = arrayAux;
    }

    if (idsRules.class && idsRules.class.length > 0) {
      arrayAux = [];
      for (const element of idsRules.class) {
        discountAux = null;
        obj = await Class.findOrFail(element.class_id);
        class_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          class_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.class = arrayAux;
    }

    if (idsRules.services && idsRules.services.length > 0) {
      arrayAux = [];
      for (const element of idsRules.services) {
        discountAux = null;
        obj = await Service.findOrFail(element.services_id);
        services_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          services_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.services = arrayAux;
    }

    if (idsRules.plans && idsRules.plans.length > 0) {
      arrayAux = [];
      for (const element of idsRules.plans) {
        discountAux = null;
        obj = await Plan.findOrFail(element.plans_id);
        plans_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          plans_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.plans = arrayAux;
    }

    if (idsRules.products && idsRules.products.length > 0) {
      arrayAux = [];
      for (const element of idsRules.products) {
        discountAux = null;
        obj = await Product.findOrFail(element.products_id);
        products_ids.push(obj._id);

        if (data.discount_individual) {
          aux = await Discount.findOrFail(element.discount_id);
          discountAux = aux._id;
        } else if (data.discount_general) {
          discountAux = discount._id;
        }

        arrayAux.push({
          products_id: obj._id,
          discount_id: discountAux,
        });
      }

      idsRules.products = arrayAux;
    }

    let $package = await Package.findOrFail(params._id);
    $package.merge({
      ...data,
      updated_by: auth.user._id,
    });

    await $package.save();

    await $package.tax().associate(tax);

    if (discount != null) {
      await $package.discount().associate(discount);
    } else {
      await $package.discount().dissociate();
    }

    await $package.penalties().detach();
    await $package.areas().detach();
    await $package.class().detach();
    await $package.services().detach();
    await $package.plans().detach();
    await $package.products().detach();

    if (penaltyIds.length > 0) {
      await $package.penalties().sync(penaltyIds);
    }

    if (areas_ids.length > 0) {
      await $package.areas().sync(areas_ids, (row) => {
        let element = idsRules.areas.find(
          (item) => `${item.areas_id}` === `${row.area_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (class_ids.length > 0) {
      await $package.class().sync(class_ids, (row) => {
        let element = idsRules.class.find(
          (item) => `${item.class_id}` === `${row.class_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (services_ids.length > 0) {
      await $package.services().sync(services_ids, (row) => {
        let element = idsRules.services.find(
          (item) => `${item.services_id}` === `${row.service_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (plans_ids.length > 0) {
      await $package.plans().sync(plans_ids, (row) => {
        let element = idsRules.plans.find(
          (item) => `${item.plans_id}` === `${row.plan_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    if (products_ids.length > 0) {
      await $package.products().sync(products_ids, (row) => {
        let element = idsRules.products.find(
          (item) => `${item.products_id}` === `${row.product_id}`
        );

        if (data.discount_individual) {
          row.discount_id = element.discount_id;
        } else if (data.discount_general) {
          row.discount_id = discount._id;
        }
      });
    }

    return response.status(200).json({
      package: $package,
      ...new MessageFrontEnd('Paquete editado con éxito')
    });
  }

  /**
   * Display a single package.
   * GET packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id);
    if (business_id + "" !== branch_offices.business_id + "") {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      });
    }

    const result = await packageRepository.findOneWithoutStatus(params._id);

    if (!result.data) {
      return response.status(404).json({
        ...new MessageFrontEnd('Paquete no encontrado', 'Alerta')
      });
    }

    const $package = result.data;

    $package.merge({
      enabled: !$package.enabled,
      updated_by: auth.user._id,
    });

    await $package.save();

    return response.status(200).json({
      package: result.data,
      ...new MessageFrontEnd(result.message)
    });
  }
}

module.exports = PackageController;
