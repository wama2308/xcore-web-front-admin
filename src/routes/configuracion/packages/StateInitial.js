export const stateInitial = {
    loading: 'show',
    actionReducer: 0,

    name: "",
    nameError: false,
    nameTextError: '',
    nameHide: 'hide',

    description: "",
    descriptionError: false,
    descriptionTextError: '',
    descriptionHide: 'hide',

    amount: '0.00',
    amountError: false,
    amountTextError: '',
    amountHide: 'hide',

    arrayImpuesto: null,
    arrayImpuestoError: '',
    arrayImpuestoTextError: '',
    arrayImpuestoHide: 'hide',

    expirationDate: new Date(),
    expirationDateError: "",
    expirationDateTextError: '',
    expirationDateHide: 'hide',

    corporateGroup: false,

    imagen: '',
    imagenError: '',
    imagenTextError: '',
    imagenHide: 'hide',

    partialPayments: false,
    dayPartialPayments: '',
    dayPartialPaymentsError: false,
    dayPartialPaymentsTextError: '',
    dayPartialPaymentsHide: 'hide',

    collapsePenalizaciones: false,
    penalty: false,
    arrayPenalty: null,
    arrayPenaltyError: '',
    arrayPenaltyTextError: '',
    arrayPenaltyHide: 'hide',

    tableProductsTextError: '',
    collapseProducts: false,

    tableServicesTextError: '',
    collapseServices: false,

    collapseAreas: false,    
    arrayAreas: null,
    arrayAreasError: '',
    arrayAreasTextError: '',
    arrayAreasHide: 'hide',

    collapseClass: false,
    arrayClass: null,
    arrayClassError: '',
    arrayClassTextError: '',
    arrayClassHide: 'hide',

    collapsePlanes: false,
    arrayPlanes: null,
    arrayPlanesError: '',
    arrayPlanesTextError: '',
    arrayPlanesHide: 'hide',

    discountGeneral: false,
    discountIndividual: false,
    registerDiscount: false,

    arrayDescuentos: null,
    arrayDescuentosError: '',
    arrayDescuentosTextError: '',
    arrayDescuentosHide: 'hide',
}