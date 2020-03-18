import Axios from "axios"
import { API_URL } from "../../support/API_URL"

export const signin = (id, token) =>{   // Action Creator
    return(dispatch) =>{        // Action Reducer
        Axios.get(`http://localhost:2000/public/getUsersById/${id}`)
        .then((res) => {
            localStorage.setItem('token',token)
            dispatch({
            type: 'LOGIN',
            payload: res.data[0]
            })
        })
        .catch((err) =>{
            dispatch({
            type: 'LOGOUT',
            })
        })
    }
}


export const logout = () =>{
    return(dispatch) =>{
        localStorage. removeItem('token')
        dispatch({
            type: 'LOGOUT'
        })
    }
}

export const keeplogin = () =>{
    return(dispatch) =>{
        const token = localStorage.getItem('token');
        console.log(token);
        if(token){
            const headers = {
                headers:{
                    'Authorization' : `Bearer ${token}`
                }
            }
        Axios.post(API_URL + '/public/keeplogin', {}, headers)
        .then((res) => {
            dispatch({
                type: 'LOGIN',
                payload: res.data
            })
        })
        .catch((err) =>{
            dispatch({
                type: 'LOGOUT'
            })
        })
        }
    }
}