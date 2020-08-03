export const stateInitial = {
    loading: 'show',
    expirationDate: new Date(),
    expirationDateError: "",
    expirationDateTextError: '',
    expirationDateHide: 'hide',

    amountOffees: '0',
    amountOffeesError: false,
    amountOffeesTextError: '',
    amountOffeesHide: '',
    arrayCycleOptions: [
        {
            label: 'Diario', value: 'diario',
        },
        {
            label: 'Mensual', value: 'mensual'
        }
    ],
    arrayCycle: null,
    arrayCycleError: '',
    arrayCycleTextError: '',
    arrayCycleHide: 'hide',
    timeCycle: '0',
    timeCycleError: false,
    timeCycleTextError: '',
    timeCycleHide: 'hide',
    interestPercentage: '0',
    interestPercentageError: false,
    interestPercentageTextArea: '',
    interestPercentageHide: '',    
}