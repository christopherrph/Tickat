import React, { Component } from 'react'
import '../App.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';
import { Redirect } from 'react-router-dom'

class home extends Component {

    componentDidMount(){
        if(this.props.id){
            this.setState({ redirect: true })
        }
    }

    state = {  }
    render() { 
    const { redirect } = this.state;			//REDIRECT
     if (redirect) {
       return <Redirect to='/userhome'/>;
     }

        return ( 
            <div className='paddingatas'>
                <Header/>
                <div className='row'>
                    <div className='col-4'>
                    <center>
                        <img src={require('../img/undraw_events_2p66.png')} style={{width:400}}/>
                    </center>
                    </div>
                    <div className='col-4'>
                    <center>
                        <img src={require('../img/undraw_newspaper_k72w.png')} style={{width:400}}/>
                    </center>
                    </div>
                    <div className='col-4'>
                    <center>
                        <img src={require('../img/undraw_directions_x53j.png')} style={{width:400, paddingTop:'5%'}}/>
                    </center>
                    </div>
                </div>
                <div className='col-12 textsec1'>
                <center>
                    <h1 style={{color:'white'}} >
                        TICKETS FOR <br/>ANYTHING, ANYWHERE
                    </h1>
                        <p style={{width:600, color:'white'}}>If you want to sell event tickets on your website and deliver them to your buyers digitally, Tickat is exactly what you need.</p>            
                    <Link to='/register'><button class="btn btn-primary btn-primary btnputih anim">GET STARTED</button></Link>
                </center>
                </div>
            <hr></hr>
            <div className='homesec2'>
                <h2 style={{color:'#5D5D5D'}}>
                    SELL YOUR EVENTS TICKET WITH US
                </h2>
                <hr className='garisbiru1'></hr>
                <div style={{width:900, margin:'auto'}}>
                <p style={{color: "#585858", opacity: 0.8}}>If you want to sell event tickets on OUR website and deliver them to your buyers digitally, Tickat is exactly what you need. When you use Tickat to sell and send tickets, you are essentially setting up your own hosted ticketing solution wherein you control the profits with no requirement to send a cut to a third party.</p>            
                <Link to='/contactus'><button class="btn btn-primary btn-primary btnbiru anim">CONTACT US</button></Link>
                </div>           
            </div>
            <hr></hr>
            <div className='homesec2'>
                <h2 style={{color:'#5D5D5D'}} >
                    EASIER WAY TO GET YOUR TICKETS
                </h2>
                <div className='row'>
                    <div className='col-md-4'>
                        <img src={require('../img/why1.png')} className='gambarwhyus'/>
                        <p>SHOPPING CART <br/> 
                        <hr className='garisbiru2'/>
                        <span style={{color: "#585858", opacity: 0.8}}>Purchase any multiple tickets for an event</span></p>
                    </div>
                    <div className='col-md-4'>
                        <img src={require('../img/why2.png')} className='gambarwhyus'/>
                        <p>E-TICKET <br/> 
                        <hr className='garisbiru2'/>
                        <span style={{color: "#585858", opacity: 0.8}}>Get your ticket just by loggin in to your account.</span></p>
                    </div>
                    <div className='col-md-4'>
                        <img src={require('../img/why3.png')} className='gambarwhyus'/>
                        <p>TICKET TYPES <br/> 
                        <hr className='garisbiru2'/>
                        <span style={{color: "#585858", opacity: 0.8}}>We provide various ticket type for each event.</span></p>
                    </div>
                    <div className='col-md-4'>
                        <img src={require('../img/why4.png')} className='gambarwhyus'/>
                        <p>MULTIPLE EVENTS <br/> 
                        <hr className='garisbiru2'/>
                        <span style={{color: "#585858", opacity: 0.8}}>    Purchase tickets for all kinds of events</span></p>
                    </div>
                    <div className='col-md-4'>
                        <img src={require('../img/why5.png')} className='gambarwhyus'/>
                        <p>EASY PAYMENT METHOD <br/> 
                        <hr className='garisbiru2'/>
                        <span style={{color: "#585858", opacity: 0.8}}> Pay for your ticket by uploading your payment receipt and other payment methods.</span></p>
                    </div>
                    <div className='col-md-4'>
                        <img src={require('../img/why6.png')} className='gambarwhyus'/>
                        <p>CHEAPER PRICE <br/> 
                        <hr className='garisbiru2'/>
                        <span style={{color: "#585858", opacity: 0.8}}> We provide cheaper tickets just for you.</span></p>
                    </div>
                </div>           
            </div>
            <Footer/>
            </div>
         );
    }
}

const mapStateToProps = (state) =>{ // Function yang akan terima global state
    return{
      name: state.user.name, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
      id: state.user.id,
      email: state.user.email
    }
}
 
export default connect (mapStateToProps,{})(home);