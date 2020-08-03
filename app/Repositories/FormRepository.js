const generalConfiguration = use('App/Models/GeneralConfiguration')

const TypeBranch = use('App/Models/GeneralConfiguration/TypeBranch')
const PaymentType = use('App/Models/GeneralConfiguration/PaymentType')
const TypeShop = use('App/Models/GeneralConfiguration/TypeShop')
const TypeSupply = use('App/Models/GeneralConfiguration/TypeSupply')
const OutputSupply = use('App/Models/GeneralConfiguration/OutputSupply')
const Reason = use('App/Models/GeneralConfiguration/Reason')
const Language = use('App/Models/GeneralConfiguration/Language')
const Sex = use('App/Models/GeneralConfiguration/Sex')
const SecretQuestion = use('App/Models/GeneralConfiguration/SecretQuestion')
const Finger = use('App/Models/GeneralConfiguration/Finger')
const CivilState = use('App/Models/GeneralConfiguration/CivilState')

const Country = use('App/Models/Country')

class FormRepository {

  async secretQuestions() {
    const secretQuestions = await SecretQuestion
      .where('enabled', true)
      .fetch()

    return secretQuestions
  }

  async queryGeneral() {
    const queryGeneral = await generalConfiguration
      .where('enabled', true)
      .first()

    return queryGeneral
  }

  async queryTypeBranch() {
    const typeBranch = await TypeBranch
      .where('enabled', true)
      .fetch()

    return typeBranch
  }

  async queryPaymentType() {
    const paymentType = await PaymentType
      .where('enabled', true)
      .fetch()

    return paymentType
  }

  async queryTypeShop() {
    const typeShop = await TypeShop
      .where('enabled', true)
      .fetch()

    return typeShop
  }

  async queryTypeSupply() {
    const typeSupply = await TypeSupply
      .where('enabled', true)
      .fetch()

    return typeSupply
  }

  async queryOutputSupply() {
    const outputSupply = await OutputSupply
      .where('enabled', true)
      .fetch()

    return outputSupply
  }

  async queryReason() {
    const reason = await Reason
      .where('enabled', true)
      .fetch()

    return reason
  }

  async queryLanguage() {
    const language = await Language
      .where('enabled', true)
      .fetch()

    return language
  }

  async querySex() {
    const sex = await Sex
      .where('enabled', true)
      .fetch()

    return sex
  }

  async queryCivilState() {
    const civil_state = await CivilState
      .where('enabled', true)
      .fetch()

    return civil_state
  }

  async queryCountries() {
    const countries = await Country
      .where('enabled', true)
      .with('provinces', (builder) => {
        builder.where('enabled', true)
        builder.with('districts', (builder) => {
          builder.where('enabled', true)
        })
      })
      .fetch()

    return countries
  }

  async queryFinger() {
    const fingers = await Finger
      .where('enabled', true)
      .fetch()

    return fingers
  }

  async typeBranchOffice(id, enabled = true) {
    const typeBranchOffice = await TypeBranch
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return typeBranchOffice
  }

  async paymentType(id, enabled = true) {
    const paymentType = await PaymentType
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return paymentType
  }

  async typeShop(id, enabled = true) {
    const typeShop = await TypeShop
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return typeShop
  }

  async typeSupply(id, enabled = true) {
    const typeSupply = await TypeSupply
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return typeSupply
  }

  async outputSupply(id, enabled = true) {
    const outputSupply = await OutputSupply
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return outputSupply
  }

  async reason(id, enabled = true) {
    const reason = await Reason
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return reason
  }

  async language(id, enabled = true) {
    const language = await Language
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return language
  }

  async sex(id, enabled = true) {
    const sex = await Sex
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return sex
  }

  async civilState(id, enabled = true) {
    const civil_state = await CivilState
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return civil_state
  }

  async finger(id, enabled = true) {
    const finger = await Finger
      .where('_id', id)
      .where('enabled', enabled)
      .first()
    
    return sex
  }
}

module.exports = new FormRepository()