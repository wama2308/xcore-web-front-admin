"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with discounts
 */

const Discount = use("App/Models/Discount");
const Area = use("App/Models/Area");
const BranchOffice = use("App/Models/BranchOffice");
const discountRepository = use("App/Repositories/DiscountRepository");
const classRepository = use("App/Repositories/ClassRepository");
const packageRepository = use("App/Repositories/PackageRepository");
const planRepository = use("App/Repositories/PlanRepository");
const serviceRepository = use("App/Repositories/ServiceRepository");
const productRespository = use("App/Repositories/ProductRepository");
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class DiscountController {
  async index({ request, response }) {
    let discounts = await discountRepository.datatable(request);

    return response.status(200).json(discounts);
  }

  async indexDisabled({ request, response }) {
    let discounts = await discountRepository.datatable(request, false);

    return response.status(200).json(discounts);
  }

  async select({ request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    const discounts = await discountRepository.findAll(branch_office_id, true);
    const select =
      discounts && discounts.rows
        ? discounts.toJSON().map((item) => {
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
   * Create/save a new discount.
   * POST discounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const user = auth.user;
    let data = request.only([
      "name",
      "type",
      "value",
      "start_date",
      "final_date",
    ]);

    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id);
    const discount = await branch_offices.discounts().create({
      ...data,
      created_by: user._id,
    });

    await this.addToDiscounts(request, branch_offices, discount);

    return response.status(201).json({
      discount,
      ...new MessageFrontEnd('Descuento creado con éxito')
    });
  }

  /**
   * Display a single discount.
   * GET discounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    let discount;
    try {
      discount = await discountRepository.byId(params._id, branch_office_id);
      discount = discount.toJSON();
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      });
    }

    discount.clases = discount.clases.map((item) => {
      return {
        name: item.name,
        value: item._id,
        info: {
          ...item,
        },
      };
    });

    discount.areas = discount.areas.map((item) => {
      return {
        name: item.name,
        value: item._id,
        info: {
          ...item,
        },
      };
    });

    discount.plans = discount.plans.map((item) => {
      return {
        name: item.name,
        value: item._id,
        info: {
          ...item,
        },
      };
    });

    discount.services = discount.services.map((item) => {
      return {
        name: item.name,
        value: item._id,
        info: {
          ...item,
        },
      };
    });

    discount.products = discount.products.map((item) => {
      return {
        name: item.name,
        value: item._id,
        info: {
          ...item,
        },
      };
    });

    discount.packages = discount.packages.map((item) => {
      return {
        name: item.name,
        value: item._id,
        info: {
          ...item,
        },
      };
    });

    return response.status(200).json({
      message: "OK",
      discount,
    });
  }

  async isAll({ params, request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    const discount = await discountRepository.isAll(branch_office_id);

    return response.status(200).json({
      message: "OK",
      ...discount,
    });
  }

  /**
   * Update discount details.
   * PUT or PATCH discounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const user = auth.user;
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");
    let discount;
    try {
      discount = await discountRepository.byId(params._id, branch_office_id);
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      });
    }

    const data = request.only([
      "name",
      "type",
      "value",
      "start_date",
      "final_date",
    ]);

    discount.merge({
      ...data,
      updated_by: user._id,
    });
    await discount.save();

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id);

    await this.addToDiscounts(request, branch_offices, discount);

    return response.status(200).json({
      discount: discount,
      ...new MessageFrontEnd('Departamento editado con éxito')
    });
  }

  /**
   * Delete a discount with id.
   * DELETE discounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async changeStatus({ params, request, response, auth }) {
    const user = auth.user;
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id);
    if (business_id + "" !== branch_offices.business_id + "") {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      });
    }

    const discount = await discountRepository.findOneWithoutStatus(
      params._id,
      branch_office_id
    );
    if (!discount) {
      return response.status(404).json({
        ...new MessageFrontEnd('Departamento no encontrado', 'Alerta')
      });
    }

    let message = (discount.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    discount.merge({
      enabled: !discount.enabled,
      updated_by: user._id,
    });

    await discount.save();

    return response.status(200).json({
      discount,
      ...new MessageFrontEnd(message)
    });
  }

  async addToDiscounts(request, branch_offices, discount) {
    const dataArray = request.only([
      "class",
      "plans",
      "areas",
      "services",
      "products",
      "packages",
    ]);

    const all_areas = request.input("all_areas");
    const all_class = request.input("all_class");
    const all_plans = request.input("all_plans");
    const all_services = request.input("all_services");
    const all_products = request.input("all_products");
    const all_packages = request.input("all_packages");

    //Asociando a areas
    if (all_areas) {
      await branch_offices
        .areas()
        .where("enabled", true)
        .update({ discount_id: discount._id });

      await branch_offices
        .discounts()
        .where("all_areas", true)
        .update({ all_areas: false });
    } else if (dataArray.areas && dataArray.areas.length > 0) {
      for (let obj of dataArray.areas) {
        let area = await branch_offices
          .areas()
          .query()
          .where("_id", obj.areas_id)
          .first();
        if (area) {
          area.discount_id = discount._id;
          await area.save();
        }
      }
    }

    //Asociando a class
    if (all_class) {
      await branch_offices
        .class()
        .where("enabled", true)
        .update({ discount_id: discount._id });

      await branch_offices
        .discounts()
        .where("all_class", true)
        .update({ all_class: false });
    } else if (dataArray.class && dataArray.class.length > 0) {
      for (let obj of dataArray.class) {
        let $class = await branch_offices
          .class()
          .query()
          .where("_id", obj.class_id)
          .first();
        if ($class) {
          $class.discount_id = discount._id;
          await $class.save();
        }
      }
    }

    //Asociando a plans
    if (all_plans) {
      await branch_offices
        .plan()
        .where("enabled", true)
        .update({ discount_id: discount._id });

      await branch_offices
        .discounts()
        .where("all_plans", true)
        .update({ all_plans: false });
    } else if (dataArray.plans && dataArray.plans.length > 0) {
      for (let obj of dataArray.plans) {
        let $plans = await branch_offices
          .plan()
          .query()
          .where("_id", obj.plans_id)
          .first();
        if ($plans) {
          $plans.discount_id = discount._id;
          await $plans.save();
        }
      }
    }

    //Asociando a services
    if (all_services) {
      await branch_offices
        .services()
        .where("enabled", true)
        .update({ discount_id: discount._id });

      await branch_offices
        .discounts()
        .where("all_services", true)
        .update({ all_services: false });
    } else if (dataArray.services && dataArray.services.length > 0) {
      for (let obj of dataArray.services) {
        let $services = await branch_offices
          .services()
          .query()
          .where("_id", obj.services_id)
          .first();
        if ($services) {
          $services.discount_id = discount._id;
          await $services.save();
        }
      }
    }

    //Asociando a products
    if (all_products) {
      await branch_offices
        .products()
        .where("enabled", true)
        .update({ discount_id: discount._id });

      await branch_offices
        .discounts()
        .where("all_products", true)
        .update({ all_products: false });
    } else if (dataArray.products && dataArray.products.length > 0) {
      for (let obj of dataArray.products) {
        let $products = await branch_offices
          .products()
          .query()
          .where("_id", obj.products_id)
          .first();
        if ($products) {
          $products.discount_id = discount._id;
          await $products.save();
        }
      }
    }

    //Asociando a packages
    if (all_packages) {
      await branch_offices
        .packages()
        .where("enabled", true)
        .update({ discount_id: discount._id });

      await branch_offices
        .discounts()
        .where("all_packages", true)
        .update({ all_packages: false });
    } else if (dataArray.packages && dataArray.packages.length > 0) {
      for (let obj of dataArray.packages) {
        let $packages = await branch_offices
          .packages()
          .query()
          .where("_id", obj.packages_id)
          .first();
        if ($packages) {
          $packages.discount_id = discount._id;
          await $packages.save();
        }
      }
    }

    discount.merge({
      all_areas,
      all_class,
      all_plans,
      all_services,
      all_products,
      all_packages,
    });
    await discount.save();
  }
}

module.exports = DiscountController;
