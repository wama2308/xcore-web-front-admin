'use strict'

const Tax = use('App/Models/Country/Tax')
const Lot = use('App/Models/Product/Lot')
const Movement = use('App/Models/Product/Movement')
const Discount = use('App/Models/Discount')
const BranchOffice = use('App/Models/BranchOffice')
const Product = use('App/Models/Product')
const lotRespository = use('App/Repositories/LotRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class LotController {

  async index({ request, response }) {
    let lots = await lotRespository.datatable(request)

    return response.status(200).json(lots)
  }

  async indexDisabled({ request, response }) {
    let lots = await lotRespository.datatable(request, false)

    return response.status(200).json(lots)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const product_id = request.header('product_id')

    let lot
    try {
      lot = await lotRespository.findOneLot(product_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      lot
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const product_id = request.header('product_id')

    const data = request.only([
      'quantity',
      'limit_stock',
      'price_shop',
      'price_sale',
    ])

    const idsRules = request.only([
      'tax_id',
      'discount_id',
    ])

    const tax = await Tax.findOrFail(idsRules.tax_id)
    let discount = null
    if (idsRules.discount_id) {
      discount = await Discount.findOrFail(idsRules.discount_id)
    }

    let product = await Product.findOrFail(product_id)
    let number_lot = await lotRespository.findAllLotSum(product)
    let lot = await product
      .lots()
      .create({
        'number': number_lot,
        ...data,
        'quantity_stock': data.quantity,
        'created_by': auth.user._id
      })

    await lot.tax().associate(tax)
    
    if (discount != null) {
      await lot.discount().associate(discount)
    }

    let movement = await product
      .movements()
      .create({
        'quantity': data.quantity,
        'type_entry': true,
        'created_by': auth.user._id
      })

    await movement.lot().associate(lot)

    return response.status(201).json({
      lot,
      ...new MessageFrontEnd('Lote creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const product_id = request.header('product_id')

    const data = request.only([
      'quantity',
      'limit_stock',
      'price_shop',
      'price_sale',
    ])

    const idsRules = request.only([
      'tax_id',
      'discount_id',
    ])

    const tax = await Tax.findOrFail(idsRules.tax_id)
    let discount = null
    if (idsRules.discount_id) {
      discount = await Discount.findOrFail(idsRules.discount_id)
    }

    let lot = await Lot.findOrFail(params._id)

    if (lot.quantity_stock < lot.quantity) {
      return response.status(304).json({
        ...new MessageFrontEnd('El lote no se puede editar, ya se está usando', 'Alerta')
      })
    } else {
      if (lot.quantity !== data.quantity) {
        const move = await lot.movements().first()
        let moven = await Movement.findOrFail(move._id)

        lot.merge({
          ...data,
          'quantity_stock': data.quantity,
          'updated_by': auth.user._id
        })

        moven.merge({
          'quantity': data.quantity,
          'updated_by': auth.user._id
        })

        if (discount != null) {
          await lot.discount().associate(discount)
        } else {
          lot.merge({
            ...data,
            'discount_id': null
          })
        }

        await lot.save()
        await moven.save()
      } else {
        lot.merge({
          ...data,
          'updated_by': auth.user._id
        })

        if (discount != null) {
          await lot.discount().associate(discount)
        } else {
          lot.merge({
            ...data,
            'discount_id': null
          })
        }

        await lot.save()
      }
    }

    await lot.tax().associate(tax)

    return response.status(200).json({
      lot,
      ...new MessageFrontEnd('Lote editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const product_id = request.header('product_id')

    try {
      await lotRespository.findOneLotWithoutStatus(product_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const lot = await Lot.findOrFail(params._id)
    let message = (lot.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'
    
    lot.enabled = !lot.enabled
    lot.updated_by = auth.user._id

    await lot.save()

    return response.status(200).json({
      lot,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = LotController
