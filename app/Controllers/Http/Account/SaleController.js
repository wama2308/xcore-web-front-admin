"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BranchOffice = use("App/Models/BranchOffice");
const Area = use("App/Models/Area");
const Class = use("App/Models/Class");
const Plan = use("App/Models/Plan");
const Product = use("App/Models/Product");
const Package = use("App/Models/Package");
const Service = use("App/Models/Service");
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * Resourceful controller for interacting with sales
 */
class SaleController {
  /**
   * Show a list of all sales.
   * GET sales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response }) {}

  /**
   * Show a search of all sales.
   * POST sales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async search({ params, request, response }) {
    const business_id = request.header("business_id");
    const branch_office_id = request.header("branch_office_id");

    const branchOffice = await BranchOffice.findOrFail(branch_office_id);

    let search = request.input("search");
    const gt = search.split(" ");
    let expresion = "";
    gt.map((datos) => {
      expresion += `^(?=.*${datos})`;
    });
    search = new RegExp(expresion, "ims");

    //Busqueda de areas
    const queryArea = Area.query();
    queryArea.where(function () {
      this.where({
        $or: [{ name: { $regex: search } }],
      });
    });
    const areas = await queryArea
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .select(["name", "amount", "description"])
      .with("discount")
      .limit(10)
      .fetch();

    //Busqueda de clases
    const queryClass = Class.query();
    queryClass.where(function () {
      this.where({
        $or: [{ name: { $regex: search } }],
      });
    });
    const classs = await queryClass
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .select(["name", "amount", "description"])
      .with("discount")
      .limit(10)
      .fetch();

    //Busqueda de planes
    const queryPlan = Plan.query();
    queryPlan.where(function () {
      this.where({
        $or: [{ name: { $regex: search } }],
      });
    });
    const plans = await queryPlan
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .select(["name", "amount", "description"])
      .with("discount")
      .limit(10)
      .fetch();

    //Busqueda de productos
    const queryProduct = Product.query();
    queryProduct.where(function () {
      this.where({
        $or: [{ name: { $regex: search } }],
      });
    });
    const products = await queryProduct
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .select(["name", "amount", "description"])
      .with("discount")
      .limit(10)
      .fetch();

    //Busqueda de paquetes
    const queryPackage = Package.query();
    queryPackage.where(function () {
      this.where({
        $or: [{ name: { $regex: search } }],
      });
    });
    const packages = await queryPackage
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .select(["name", "amount", "description"])
      .with("discount")
      .limit(10)
      .fetch();

    //Busqueda de servicios
    const queryService = Service.query();
    queryService.where(function () {
      this.where({
        $or: [{ name: { $regex: search } }],
      });
    });
    const services = await queryService
      .where("enabled", true)
      .where("branch_office_id", branchOffice._id)
      .select(["name", "amount", "description"])
      .with("discount")
      .limit(10)
      .fetch();

    const result = {
      areas,
      classs,
      plans,
      products,
      packages,
      services,
    };

    let items = [];

    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        const element = result[key];
        if (element.toJSON) {
          const elementJSON = element.toJSON();
          elementJSON.map((item) => {
            item.typeItem = key;
            items.push(item);
          });
        }
      }
    }

    return response.status(200).json({
      message: "Ok",
      items,
    });
  }

  /**
   * Create/save a new sale.
   * POST sales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single sale.
   * GET sales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {}

  /**
   * Update sale details.
   * PUT or PATCH sales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a sale with id.
   * DELETE sales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = SaleController;
