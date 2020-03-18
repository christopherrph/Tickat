import { API_URL } from "../../support/API_URL"

export const in_checkout = () =>{
    return(dispatch) =>{
        dispatch({
            type: 'CHECKOUT_TRUE'
        })
    }
}

export const cancel_checkout = () =>{
    return(dispatch) =>{
        dispatch({
            type: 'CHECKOUT_FALSE'
        })
    }
}