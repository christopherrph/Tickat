import React, { Component } from 'react';
import '../App.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class findtickets extends Component {
    state = {
        listcategory:[],
        listevent:[],
        eventcategoryid: null,
        eventcategoryname: null,
        pagination: 0
      }

    componentDidMount(){
        Axios.get(API_URL + '/admin/getAllCategory')
        .then((res) =>  {
            this.setState({
                listcategory:res.data
            })
        })
        .catch((err) =>{
          console.log(err)
        })

        Axios.get(API_URL + '/admin/getAllEventLater')
        .then((res) =>  {
            this.setState({
                listevent:res.data
            })
        })
        .catch((err) =>{
          console.log(err)
        })

        this.setState({eventcategoryid: null})
    }

    renderPagination = () =>{
        var length = this.state.listevent.length
        var halaman = Math.ceil(length/8)
        var arr = []
        for(var i=0;i<halaman;i++){
          arr.push(i)
        }
        return arr.map((val, index) =>{
          if(val == this.state.pagination){
            return(
              <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1">{val+1}</a>
              </li>
            )
          }else{
            return(
            <li class="page-item"><a class="page-link" style={{color:'#1F5E99'}} onClick={() => this.setState({pagination: val})} >{val+1}</a></li>
            )
          }
      })
  }

    rendercategory = () =>{
        return this.state.listcategory.map((val, index) =>{
          return(
            <a className='hovergede' onClick={() => this.choosecategory(val.idcategory, val.category_name)}>{val.category_name}</a>
          )
      })
    }

    choosecategory = (id, name) =>{
        this.setState({eventcategoryid: id, eventcategoryname: name})
        Axios.get(API_URL + `/user/getEventbyCategory/${id}`)
        .then((res) =>  {
            this.setState({
                listevent:res.data,
                pagination: 0
            })
            console.log(this.state.listevent)
        })
        .catch((err) =>{
          console.log(err)
        })
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

    renderevent = () =>{
    var x = this.state.listevent.slice(0+(this.state.pagination*8),8+(this.state.pagination*8))
        return x.map((val, index) =>{
          return(
            <div class="card" style={{width: '18rem'}}>
                    <img class="card-img-top" src={API_URL + val.event_pic} alt="Card image cap"/>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold" style={{fontSize:18}}>{this.cutsentence(val.event_name)}</h5>
                        <p class="card-text" style={{fontSize:15, color:'#333333'}}><i class="fas fa-map-marker-alt"></i> {this.cutsentence2(val.event_location)}</p>
                    </div>
                    {/* <p class="card-text font-weight-bold"  style={{color:'#333333'}}><i class="fas fa-money"></i>{startingfrom}</p> */}
                    <p class="card-text font-weight-bold"  style={{color:'#333333'}}><i class="fas fa-calendar"></i> {moment(val.event_date).format('D MMMM YYYY')}</p>
                    {/* <p class="card-text font-weight-bold"  style={{color:'#333333'}}>Last Transaction: {
                        val.LastTransaction
                        ?
                        moment(val.LastTransaction).format('D MMMM YYYY')
                        :
                        "Not Found"
                    }</p> */}
                    <Link to={`/event/${val.idevent}`}><a href="#" class="btn btnbiru mb-3 hovergede">View Ticket</a></Link>
            </div>
          )
      })
    }

    searchEvent = () =>{
        let search = this.refs.searchevent.value;
        Axios.get(API_URL + `/admin/getAllEventLikeUser/${search}`)
        .then((res) =>  {
            this.setState({
                listevent:res.data
            })
            console.log(this.state.listevent)
        })
        .catch((err) =>{
          console.log(err)
        })
    }

    render() { 
        return ( 
            <div className='paddingatas'>
                <Header/>
                <center>
                    <h2 className='pgtitle' style={{marginTop:'3%'}}>FIND TICKETS</h2>
                    <div className='searchbox border'>
                        <div className='row'>
                        <div className='col-3' style={{marginRight:-30}}>
                        <div class="dropdown">
                        <button class="dropbtn form-control" >Choose Categories <i class="fa fa-arrow-down" style={{paddingLeft:'10%', color:'#1F5E99'}} aria-hidden="true"></i></button>
                        <div class="dropdown-content">
                            <a className='hovergede' onClick={() => this.componentDidMount()}>All Category</a>
                            {this.rendercategory()}
                        </div>
                        </div>
                        </div>
                        <div className='col-6'>
                        <input class="form-control"  ref='searchevent' type='text' placeholder='Search Events Name....' id='searchbox'/>
                        </div>
                        <div className='col-3'>
                        <button class="btnbiru" id='searchbutton' onClick={this.searchEvent}>SEARCHS</button>
                        </div>
                        </div>
                    </div>

                    {
                        this.state.eventcategoryid == null
                        ?
                        <div>
                            <h4 className='pgtitle'>DISCOVER EVENTS</h4>
                            <h6 style={{color:'grey'}}>Best prices just for you</h6>
                        </div>
                        :
                        <div>
                            <h4 className='pgtitle text-uppercase'>{this.state.eventcategoryname}</h4>
                        </div>
                    }
                    

                    <div className='row discoverevent mb-5'>
                    {this.renderevent()}
                    </div>

                    <nav aria-label="..." style={{marginLeft:'48%', marginRight:'0%'}}>
                        <ul class="pagination pagination-sm">
                            {this.renderPagination()}
                        </ul>
                    </nav>
                    <div style={{height:100}}></div>
                </center>
                <Footer/>
            </div>
         );
    }
}

export default findtickets;