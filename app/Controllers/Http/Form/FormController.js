'use strict'

const FormRepository = use('App/Repositories/FormRepository')

const BranchOffice = use('App/Models/BranchOffice')

const Rule = use('App/Models/GeneralConfiguration/Rule')
const TypeBranch = use('App/Models/GeneralConfiguration/TypeBranch')
const PaymentType = use('App/Models/GeneralConfiguration/PaymentType')
const TypeShop = use('App/Models/GeneralConfiguration/TypeShop')
const TypeSupply = use('App/Models/GeneralConfiguration/TypeSupply')
const OutputSupply = use('App/Models/GeneralConfiguration/OutputSupply')
const Reason = use('App/Models/GeneralConfiguration/Reason')
const Language = use('App/Models/GeneralConfiguration/Language')
const Sex = use('App/Models/GeneralConfiguration/Sex')
const CivilState = use('App/Models/GeneralConfiguration/CivilState')

const Country = use('App/Models/Country')
const Province = use('App/Models/Province')
const District = use('App/Models/District')

class FormController {

  selectOnlyEnabled(obj) {
    return {
      "label": obj.name,
      "value": obj._id
    }
  }

  formatData(obj) {
    return {
      "label": obj.name,
      "value": obj._id,
      "default": obj.default
    }
  }

  async selectForm({ response }) {
    const secretQuestions = await FormRepository.secretQuestions()
    const secret = secretQuestions.rows.map(this.selectOnlyEnabled)

    return response.status(200).json(secret)
  }

  async selectLoad({ response }) {
    // const queryGeneral = await FormRepository.queryGeneral()

    // const profession = queryGeneral.profession.map(this.selectOnlyEnabled)
    // const specialization = queryGeneral.specialization.map(this.selectOnlyEnabled)
    // const typeStaff = queryGeneral.type_staff.map(this.selectOnlyEnabled)
    // const paymentModeCommission = queryGeneral.payment_mode_commission.map(this.selectOnlyEnabled)

    const civil_state = await FormRepository.queryCivilState()
    const civilState = civil_state.rows.map(this.selectOnlyEnabled)

    const sexs = await FormRepository.querySex()
    const sex = sexs.rows.map(this.selectOnlyEnabled)
    
    const lenguage = await FormRepository.queryLanguage()
    const lenguages = lenguage.rows.map(this.selectOnlyEnabled)

    const payment_type = await FormRepository.queryPaymentType()
    const paymentType = payment_type.rows.map(this.selectOnlyEnabled)

    const type_shop = await FormRepository.queryTypeShop()
    const typeShop = type_shop.rows.map(this.selectOnlyEnabled)

    const output_supplie = await FormRepository.queryOutputSupply()
    const outputSupplie = output_supplie.rows.map(this.selectOnlyEnabled)

    const reasons = await FormRepository.queryReason()
    const reason = reasons.rows.map(this.selectOnlyEnabled)

    const type_supplies = await FormRepository.queryTypeSupply()
    const typeSupplies = type_supplies.rows.map(this.selectOnlyEnabled)

    const typeBranch = await FormRepository.queryTypeBranch()
    const typeBranchOffice = typeBranch.rows.map(this.selectOnlyEnabled)

    const typefingers = await FormRepository.queryFinger()
    const fingers = typefingers.rows.map(this.selectOnlyEnabled)

    let selects = {
      sex,
      civilState,
      lenguages,
      typeShop,
      paymentType,
      typeSupplies,
      outputSupplie,
      reason,
      typeBranchOffice,
      fingers
    }

    return response.status(200).json(selects)
  }

  async selectCountries({ response }) {
    const countries = await FormRepository.queryCountries()
    const countriesFormat = countries.rows.map(country => {
      const provinces = country.$relations.provinces.rows.map(province => {
        const districts = province.$relations.districts.rows.map(district => {
          return {
            'label': district.name,
            'value': district._id
          }
        })
        return {
          'label': province.name,
          'value': province._id,
          'district': districts
        }
      })
      return {
        'label': country.name,
        'value': country._id,
        'province': provinces
      }
    })

    return response.status(200).json(countriesFormat)
  }

  async countryConfiguration({ request, response, auth }) {
    const branch_office_id = request.header('branch_office_id')
    const branchOffice = await BranchOffice.findOrFail(branch_office_id)
    const country_id = branchOffice.country_id

    const country = await Country.findOrFail(country_id)
    let tax = await country.taxes()
      .where('enabled', true)
      .select('name', 'amount', 'default')
      .fetch()

    tax = tax.rows.map(obj => {
      return {
        "label": obj.amount,
        "value": obj._id,
        "default": obj.default
      }
    })
    let banking = await country.benches()
      .where('enabled', true)
      .select('name', 'default')
      .fetch()

    banking = banking.rows.map(this.formatData)
    let typeIdentities = await country.typeIdentities()
      .where('enabled', true)
      .select('name', 'default')
      .fetch()

    typeIdentities = typeIdentities.rows.map(this.formatData)
    let wayToPays = await country.wayToPays()
      .where('enabled', true)
      .select('name', 'default')
      .fetch()

    wayToPays = wayToPays.rows.map(this.formatData)
    let data = {
      "name": country.name,
      "acronym": country.acronym,
      "coin": country.coin,
      "currency_symbol": country.currency_symbol,
      "telephone_prefix": country.telephone_prefix,
      "time_zone": country.time_zone,
      tax,
      banking,
      typeIdentities,
      wayToPays
    }

    return response.status(200).json(data)
  }

  async selectRule({ request, response, auth }) {
    let rules = await Rule
      .where('enabled', true)
      .fetch()

    rules = rules.rows.map(this.formatData)

    return response.status(200).json(rules)
  }

}

module.exports = FormController
