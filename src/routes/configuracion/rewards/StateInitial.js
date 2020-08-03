export const stateInitial = {
    loading: 'show',
    actionReducer: 0,
    name: "",
    name_error: false,
    name_text_error: '',
    name_hide: 'hide',

    description: "",
    description_error: false,
    description_text_error: '',
    description_hide: 'hide',

    type_person: null,
    type_person_error: '',
    type_person_text_error: '',
    type_person_hide: 'hide',

    group_or_individual: false,
    disabledGroupIndividual: true,

    rule: null,
    rule_error: '',
    rule_text_error: '',
    rule_hide: 'hide',

    amount: '0.00',
    amount_error: false,
    amount_text_error: '',
    amount_hide: 'hide',
    disabled_amount: true,

    specify: '',
    specify_error: false,
    specify_text_error: '',
    specify_hide: 'hide',
    disabled_specify: true,

    discount_all: false,
    disabled_discount_all: true,

    registerDiscount: false,
    disabledRegisterDiscount: false,

    arrayDescuentos: null,
    arrayDescuentosError: '',
    arrayDescuentosTextError: '',
    arrayDescuentosHide: 'hide',
    disabled_discount: true,

    type_person_options: [
        { label: 'Clientes', value: 0 },
        { label: 'Empleados', value: 1 },
        { label: 'Todos', value: 2 }
    ],

    rule_options: [
        { label: 'Descuentos', value: 0 },
        { label: 'Monetario', value: 1 },
        { label: 'Productos', value: 2 },
        { label: 'Servicios', value: 3 },
        { label: 'Paquetes', value: 4 },
        { label: 'Clases', value: 5 },
        { label: 'Planes', value: 6 },
        { label: 'Otros', value: 7 },
    ],

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

    collapsePackages: false,
    arrayPackages: null,
    arrayPackagesError: '',
    arrayPackagesTextError: '',
    arrayPackagesHide: 'hide',

    tableProductsTextError: '',
    collapseProducts: false,

    tableServicesTextError: '',
    collapseServices: false,

}