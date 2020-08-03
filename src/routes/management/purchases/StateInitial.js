export const stateInitial = {
    loading: 'show',
    actionReducer: 0,

    purchaseTypeDocument: null,
    purchaseTypeDocumentError: '',
    purchaseTypeDocumentTextError: '',
    purchaseTypeDocumentHide: 'hide',

    nroControl: '',
    nroControlError: false,
    nroControlTextError: '',
    nroControlHide: 'hide',

    dataPurchase: new Date(),
    dataPurchaseError: "",
    dataPurchaseTextError: '',
    dataPurchaseHide: 'hide',

    arrayProvider: null,
    arrayProviderError: '',
    arrayProviderTextError: '',
    arrayProviderHide: 'hide',

    imagen: '',
    imagenError: '',
    imagenTextError: '',
    imagenHide: 'hide',

    collapseProducts: false,
    //optionProduct: false,
    percentageAmountGain: false,

    collapsePayment: false,

    paymentTypeLocal: '0',
    paymentTypeLocalError: false,
    paymentTypeLocalTextError: '',
    paymentTypeLocalHide: 'hide',

    amountLocal: '0.00',
    amountLocalError: false,
    amountLocalTextError: '',
    amountLocalHide: 'hide',

    paymentTypeExchange: '0',
    paymentTypeExchangeError: false,
    paymentTypeExchangeTextError: '',
    paymentTypeExchangeHide: 'hide',

    amountExchange: '0.00',
    amountExchangeError: false,
    amountExchangeTextError: '',
    amountExchangeHide: 'hide',

    modal: false,
    modalHeader: '',
    modalFooter: '',
    buttonFooter: '',
    dataProduct: {},
    keyProduct: -1,
    disabled: '',
    showHide: false,
    option: 0,


}