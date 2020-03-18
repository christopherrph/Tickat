import React, { Component } from 'react'
import '../App.css';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';


class notfound extends Component {
    render() { 
        return (
            <div className='paddingatas'>
                <Header/>
                <center>
                <img src={require('../img/undraw_empty_xct9.png')} style={{height:400, marginBottom:30, marginTop:30}}/>
                <h1 style={{color:'#1F5E99'}} >
                        404 NOT FOUND
                </h1>
                <br></br>
                </center>
                <Footer/>
            </div>
          );
    }
}
 
export default notfound;