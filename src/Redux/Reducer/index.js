import {combineReducers} from 'redux';
import { authReducer } from './authReducer';
import { adminReducer } from './adminReducer';
import { checkoutReducer } from './checkoutReducer';
//Reducer digunakan untuk mengisi nilai global state dan untuk buat fungsi yang akan dijalankan

export default combineReducers({
    user: authReducer,
    admin: adminReducer,
    checkout: checkoutReducer
})