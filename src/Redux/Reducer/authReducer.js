const INITIAL_STATE = {
    id: '',
    name: '',
    email: ''
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOGIN':
            return{
                ...state, 
                id: action.payload.iduser,
                name: action.payload.name,
                email: action.payload.email,
            }
        case 'LOGOUT':
            return INITIAL_STATE
        default:
            return state
    }
}
