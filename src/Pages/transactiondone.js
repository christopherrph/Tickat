import React, { Component } from 'react'
import '../ContactUs.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import Footer from './footer';
import Header from './navbar';

class contactus extends Component {
    render() { 
        return (<div className='paddingatas'>
            <Header/>
                <div class="container">
                    <center>
                        <h1 className='mt-5'>THANK YOU</h1>
                            <img src={require('../img/undraw_completed_ngx6.png')} style={{width:500}}/>
                    </center>
                </div>
            <Footer/>
        </div>);
    }
}
 
export default contactus;