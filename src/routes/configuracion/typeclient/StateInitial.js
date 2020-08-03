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

    stars: "",
    starsError: false,
    starsTextError: '',
    starsHide: 'hide',

    type_comparison: "",
    type_comparison_error: false,
    type_comparison_text_error: '',
    type_comparison_hide: 'hide',

    time_cycle: null,
    time_cycle_error: "",
    time_cycle_text_error: '',
    time_cycle_hide: 'hide',

    time_amount: "",
    time_amount_error: false,
    time_amount_text_error: '',
    time_amount_hide: 'hide',

    percentage: null,
    percentage_error: "",
    percentage_text_error: '',
    percentage_hide: 'hide',

    percentage_amount: "",
    percentage_amount_error: false,
    percentage_amount_text_error: '',
    percentage_amount_hide: 'hide',

    restart_season: false,
    
    restart_season_time: null,
    restart_season_time_error: "",
    restart_season_time_text_error: "",
    restart_season_time_hide: "hide",

    restart_season_amount: "",
    restart_season_amount_error: false,
    restart_season_amount_text_error: "",
    restart_season_amount_hide: "hide",

    general: true,

    collapseAreas: false,
    arrayAreas: null,
    arrayAreasError: "",
    arrayAreasTextError: "",
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

    collapsePackages: false,
    arrayPackages: null,
    arrayPackagesError: '',
    arrayPackagesTextError: '',
    arrayPackagesHide: 'hide',

    collapseProducts: false,
    tableProductsTextError: '',

    collapseServices: false,
    tableServicesTextError: '',

    options_time: [
        { label: 'Mensual', value: true },
        { label: 'Diario', value: false }
    ],

    options_amounts: [
        { label: 'Porcentaje', value: true },
        { label: 'Monto', value: false }
    ],


}