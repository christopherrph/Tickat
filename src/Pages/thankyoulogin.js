import React, { Component } from 'react'
import '../App.css';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';


class thankyoulogin extends Component {
    render() { 
        return (
            <div className='paddingatas'>
                <Header/>
                <center>
                <img src={require('../img/undraw_done_a34v.png')} style={{height:400, marginBottom:30, marginTop:30}}/>
                <h1 style={{color:'#1F5E99'}} >
                        REGISTER COMPLETE!
                </h1>
                <Link to='/login' className='removedecoration'><h5 style={{color:'gray', fontSize: 15}} className='hovergede' >
                        Click Here to Login
                </h5></Link>
                <br></br>
                </center>
                <Footer/>
            </div>
          );
    }
}
 
export default thankyoulogin;