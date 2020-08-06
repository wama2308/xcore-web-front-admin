export const stateInitial = {
    actionReducer: 0,

    name: "",
    name_error: false,
    name_text_error: '',
    name_hide: 'hide',

    menu_icon: null,
    menu_icon_error: '',
    menu_icon_text_error: '',
    menu_icon_hide: 'hide',

    description: '',
    description_error: false,
    description_text_error: '',
    description_hide: 'hide',

    type: null,
    type_error: '',
    type_text_error: '',
    type_hide: 'hide',

    new_item: false,
    new_item_error: '',
    new_item_text_error: '',
    new_item_hide: 'hide',

    open: false,
    open_error: '',
    open_text_error: '',
    open_hide: 'hide',

    position: "",
    position_error: false,
    position_text_error: '',
    position_hide: 'hide',

    individual_amount: "0",
    individual_amount_error: false,
    individual_amount_text_error: '',
    individual_amount_hide: 'hide',

    test: false,
    test_error: '',
    test_text_error: '',
    test_hide: 'hide',

    test_end_date: new Date(),
    test_end_date_error: "",
    test_end_date_text_error: '',
    test_end_date_hide: 'hide',   
    
    array_type_category: [
        {
            label:'Dash',
            value:'dash',
        },
        {
            label:'Client',
            value:'client',
        },
        {
            label:'Admin',
            value:'admin',
        },
    ]
    
}