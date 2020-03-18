import Axios from "axios"
import { API_URL } from "../../support/API_URL"

export const signinadmin = (adminid, token) =>{   // Action Creator
    return(dispatch) =>{        // Action Reducer
        Axios.get(`http://localhost:2000/admin/getAdminById/${adminid}`)
        .then((res) => {
            dispatch({
            type: 'LOGINADMIN',
            payload: res.data[0]
            })
        })
        .catch((err) =>{
            dispatch({
            type: 'LOGOUTADMIN',
            })
        })
    }
}

export const logoutadmin = () =>{
    return(dispatch) =>{
        localStorage. removeItem('admintoken')
        dispatch({
            type: 'LOGOUTADMIN'
        })
    }
}


export const keeploginadmin = () =>{
    return(dispatch) =>{
        const token = localStorage.getItem('admintoken');
        console.log(token);
        if(token){
            const headers = {
                headers:{
                    'Authorization' : `Bearer ${token}`
                }
            }
        Axios.post(API_URL + '/admin/keeplogin', {}, headers)
        .then((res) => {
            dispatch({
                type: 'LOGINADMIN',
                payload: res.data
            })
        })
        .catch((err) =>{
            dispatch({
                type: 'LOGOUTADMIN'
            })
        })
        }
    }
}