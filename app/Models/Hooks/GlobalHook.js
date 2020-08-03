'use strict'

const GlobalHook = exports = module.exports = {}

/**
 * Se instancia el campo de enabled en true, cada que
 * se cree un documento nuevo
 */
GlobalHook.enabledField = async (Instance) => {
  Instance.enabled = true
}

/**
 * Se convierten los campos entrantes en tipo numerico
 * independientemente si llegan los datos numericos de tipo string
 * son convertidos en tipo numerico unicamente
 */

GlobalHook.amountField = async (Instance) => {
  Instance.amount = Number(Instance.amount)
}

GlobalHook.quantityField = async (Instance) => {
  Instance.quantity = Number(Instance.quantity)
}

GlobalHook.capacityField = async (Instance) => {
  Instance.capacity = Number(Instance.capacity)
}

GlobalHook.giftAreasField = async (Instance) => {
  Instance.gift_areas = Number(Instance.gift_areas)
}

GlobalHook.giftedClassField = async (Instance) => {
  Instance.gifted_class = Number(Instance.gifted_class)
}

GlobalHook.numberDaysField = async (Instance) => {
  Instance.number_days = Number(Instance.number_days)
}

GlobalHook.cumulativeClassField = async (Instance) => {
  Instance.cumulative_class = Number(Instance.cumulative_class)
}

GlobalHook.quotasField = async (Instance) => {
  Instance.quotas = Number(Instance.quotas)
}

GlobalHook.numberClassField = async (Instance) => {
  Instance.number_class = Number(Instance.number_class)
}

GlobalHook.timeCycleField = async (Instance) => {
  Instance.time_cycle = Number(Instance.time_cycle)
}

GlobalHook.amountAdditionalDayField = async (Instance) => {
  Instance.amount_additional_day = Number(Instance.amount_additional_day)
}

GlobalHook.flexibilityDayField = async (Instance) => {
  Instance.flexibility_day = Number(Instance.flexibility_day)
}

GlobalHook.amountLockerField = async (Instance) => {
  Instance.amount_locker = Number(Instance.amount_locker)
}

GlobalHook.limitAmountField = async (Instance) => {
  Instance.limit_amount = Number(Instance.limit_amount)
}

GlobalHook.amountInscriptionField = async (Instance) => {
  Instance.amount_inscription = Number(Instance.amount_inscription)
}

GlobalHook.daysPartialPaymentsField = async (Instance) => {
  Instance.days_partial_payments = Number(Instance.days_partial_payments)
}

GlobalHook.giftedServiceField = async (Instance) => {
  Instance.gifted_service = Number(Instance.gifted_service)
}

GlobalHook.cumulativeServiceField = async (Instance) => {
  Instance.cumulative_service = Number(Instance.cumulative_service)
}