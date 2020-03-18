const INITIAL_STATE = {
    checkout: 'false'
}

export const checkoutReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'CHECKOUT_TRUE':
            return{
                ...state, checkout: 'true'
            }
        case 'CHECKOUT_FALSE':
            return{
                ...state, checkout: 'false'
            }
        default:
            return state
    }
}
