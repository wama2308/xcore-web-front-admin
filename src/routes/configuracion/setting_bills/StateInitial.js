export const stateInitial = {
    loading: 'show',
    actionReducer: 0,
    name: "",
    nameError: false,
    nameTextError: '',
    nameHide: 'hide',
    type: null,
    typeError: '',
    typeTextError: '',
    typeHide: 'hide',
    typeFormat: '0',
    typeFormatError: false,
    typeFormatTextError: '',
    typeFormatHide: 'hide',
    formatTemplate: "",
    formatTemplateError: '',
    formatTemplateTextError: '',
    formatTemplateHide: 'hide',
    collapseFormat: false,
    nameDevices: "",
    nameDevicesError: false,
    nameDevicesTextError: '',
    nameDevicesHide: 'hide',
    ipDevices: "",
    ipDevicesError: '',
    ipDevicesTextError: '',
    ipDevicesHide: 'hide',
    macDevices: "",
    macDevicesError: false,
    macDevicesTextError: '',
    macDevicesHide: 'hide',
    serialPrintDevices: "",
    serialPrintDevicesError: false,
    serialPrintDevicesTextError: '',
    serialPrintDevicesHide: 'hide',
    collapseDevices: false,
    optionsType: [
        {
            label: "Fiscal",
            value:'fiscal'
        },
        {
            label: "Ticket",
            value:'ticket'
        },
        {
            label: "Electronica",
            value:'electronic'
        },
        {
            label: "Recibo",
            value:'receipt'
        }
    ],
    optionsTypeFormat: [        
        {
            label: "Ticket",
            value:'ticket'
        },
        {
            label: "Print",
            value:'print'
        },
        {
            label: "Email",
            value:'email'
        }
    ],
    actionFormat: 'Agregar',
    actionDevices: 'Agregar',
    indexArrayFormat: 0,
    indexArrayDevice: 0,    
}