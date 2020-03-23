import React, { Component } from 'react'
import '../App.css';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';
import { Redirect } from 'react-router-dom'


class redirectevent extends Component {



    render() { 
        var id = window.location.pathname;
        id = id.replace('/event/', '')  
        if(true){
            return <Redirect to={`event/${id}`}/>;
        }
        return (
            <div className='paddingatas'>
                <Header/>
                <Footer/>
            </div>
          );
    }
}
 
export default redirectevent;