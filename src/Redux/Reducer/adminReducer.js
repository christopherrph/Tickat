const INITIAL_STATE = {
    id: '',
    username: '',
    role: ''
}

export const adminReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOGINADMIN':
            return{
                ...state, 
                id: action.payload.idadmin,
                username: action.payload.username,
                role: action.payload.role,
            }
        case 'LOGOUTADMIN':
            return INITIAL_STATE
        default:
            return state
    }
}
