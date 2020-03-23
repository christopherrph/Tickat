import React, { Component } from 'react'
import '../App.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class userhome extends Component {
    state = {
        listevent:[],
        listpartner:[]
      }

      cutsentence = (kalimat) =>{
        var sentence = kalimat.split('')
        var hasil = '';
        if(sentence.length <= 26){
            return kalimat
        }else{
            for(var i=0; i<21; i++){
                hasil += sentence[i] + '';
            }
            return `${hasil}...`
        }
    }

    cutsentence2 = (kalimat) =>{
        var sentence = kalimat.split('')
        var hasil = '';
        if(sentence.length <= 95){
            return kalimat
        }else{
            for(var i=0; i<95; i++){
                hasil += sentence[i] + '';
            }
            return `${hasil}...`
        }
    }

    async componentDidMount(){
        Axios.get(API_URL + '/admin/getAllEventLater')
        .then((res) =>  {
            this.setState({
                listevent:res.data
            })
        })
        .catch((err) =>{
          console.log(err)
        })

        const partnertop5 = await Axios.get(API_URL + '/user/getPartnerTop5Acara')
        this.setState({listpartner: partnertop5.data})
    }

    renderpartner = () =>{
        return this.state.listpartner.slice(0,5).map((val, index) =>{
            return(
                <img className='mr-3 ml-3' style={{height: 150}} src={API_URL + val.partner_pic} alt="Card image cap"/>
            )
        })
    }

    renderevent = () =>{
        return this.state.listevent.slice(0,4).map((val, index) =>{
          return(
            <div class="card" style={{width: '18rem'}}>
                    <img class="card-img-top" src={API_URL + val.event_pic} alt="Card image cap"/>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold" style={{fontSize:18}}>{this.cutsentence(val.event_name)}</h5>
                        <p class="card-text" style={{fontSize:13, color:'#666666'}}><i class="fas fa-map-marker-alt"></i> {this.cutsentence2(val.event_location)}</p>
                    </div>
                        <p class="card-text font-weight-bold">{moment(val.event_date).format('D MMMM YYYY')}</p>
                    <Link to={`/event/${val.idevent}`}><a href="#" class="btn btnbiru mb-3">View Ticket</a></Link>
            </div>
          )
      })
    }

    render() { 
        return ( 
            <div className='paddingatas'>
                <Header/>
                <div className='col-12 textsec1'>
                <center>
                    <a href='https://kitabisa.com/campaign/indonesialawancorona' target='_blank'><img src={require('../img/Corona.PNG')} className='mb-4' style={{height:300}}/></a>
                    <h1 class='text-uppercase' style={{color:'white'}} >
                        HELLO {this.props.name}
                    </h1>
                        <p style={{width:600, color:'white'}}>We're the world’s largest secondary marketplace for tickets to live events. Prices are set by sellers and may be below or above face value.</p>            
                    <Link to='/findtickets'><button class="btn btn-primary btn-primary btnputih anim">FIND TICKETS</button></Link>
                </center>
                </div>
            <div className='homesec2'>
                <h2 style={{color:'#5D5D5D'}}>
                    NEAREST EVENTS
                </h2>
                <hr className='garisbiru3'></hr>  
                <div className='row discoverevent mb-5'>
                    {this.renderevent()}
                </div>
                <h2 style={{color:'#5D5D5D'}}>
                    OUR PARTNERS
                </h2>
                <hr className='garisbiru3'></hr>  
                <center>
                <div className='row discoverevent mb-5 col-8'>
                   {this.renderpartner()}
                </div>
                </center>
            </div>
            <hr></hr>
            <Footer/>
            </div>
         );
    }
}

const mapStateProps = (state) =>{ // Function yang akan terima global state
    return{
      name: state.user.name, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
      id: state.user.id,
      email: state.user.email
    }
}
 
 
export default connect(mapStateProps,{})(userhome); 