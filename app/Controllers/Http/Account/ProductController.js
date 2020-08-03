'use strict'

const Tax = use('App/Models/Country/Tax')
const TypeSupply = use('App/Models/GeneralConfiguration/TypeSupply')
const Lot = use('App/Models/Product/Lot')
const Movement = use('App/Models/Product/Movement')
const Discount = use('App/Models/Discount')
const BranchOffice = use('App/Models/BranchOffice')
const Product = use('App/Models/Product')
const productRepository = use('App/Repositories/ProductRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ProductController {

  async index({ request, response }) {
    let products = await productRepository.datatable(request)

    return response.status(200).json(products)
  }

  async indexDisabled({ request, response }) {
    let products = await productRepository.datatable(request, false)

    return response.status(200).json(products)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const products = await productRepository.findAllProduct(branch_office_id, true)
    const select = (products && products.rows) ? products.toJSON().map(item => {
      return {
        label: item.name,
        value: item._id,
        info: item
      }
    }) : []
    return response.status(200).json(select)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let product,
      lots = [];
    try {
      product = await productRepository.findOneProduct(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    product = product.toJSON()
    for (let obj of product.lots) {
      if (obj.discount) {
        lots.push({
          ...obj,
          discount: {
            'label': obj.discount.name,
            'value': obj.discount._id,
            'info': {
              ...obj.discount
            }
          }
        })
      } else {
        lots.push(obj)
      }
    }

    product.lots = lots

    return response.status(200).json({
      message: 'Ok',
      product
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'code',
      'photo',
    ])

    const lot_entry = request.only([
      'quantity',
      'limit_stock',
      'price_shop',
      'price_sale',
    ])

    const idsRules = request.only([
      'tax_id',
      'type_supply_id',
      'discount_id',
    ])

    const tax = await Tax.findOrFail(idsRules.tax_id)
    const typeSupply = await TypeSupply.findOrFail(idsRules.type_supply_id)

    let discount = null
    if (idsRules.discount_id) {
      discount = await Discount.findOrFail(idsRules.discount_id)
    }

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let product = await branch_office
      .products()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    await product.typeSupply().associate(typeSupply)

    let lot = await product
      .lots()
      .create({
        'number': 1,
        ...lot_entry,
        'quantity_stock': lot_entry.quantity,
        'created_by': auth.user._id
      })

    if (discount != null) {
      await lot.discount().associate(discount)
    }

    await lot.tax().associate(tax)

    let movement = await product
      .movements()
      .create({
        'quantity': lot_entry.quantity,
        'type_entry': true,
        'created_by': auth.user._id
      })

    await movement.lot().associate(lot)

    return response.status(201).json({
      product,
      ...new MessageFrontEnd('Producto creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'code',
      'photo',
    ])

    const idsRules = request.only([
      'type_supply_id',
    ])

    const typeSupply = await TypeSupply.findOrFail(idsRules.type_supply_id)

    let product = await Product.findOrFail(params._id)
    product.merge({
      ...data,
      'updated_by': auth.user._id
    })
    await product.typeSupply().associate(typeSupply)
    await product.save()

    return response.status(200).json({
      product,
      ...new MessageFrontEnd('Producto editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await productRepository.findOneProductWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const product = await Product.findOrFail(params._id)
    let message = (product.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    product.enabled = !product.enabled
    product.updated_by = auth.user._id

    await product.save()

    return response.status(200).json({
      product,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = ProductController
