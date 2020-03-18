import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class adminhome extends Component {
    state = { 
      totaluser: null,
      totalpartner: null,
      totalevent: null
     }

    


    componentDidMount = () =>{
      Axios.get(API_URL + '/admin/countuser')
      .then((res) =>  {
        console.log(res.data[0].total)
        this.setState({
          totaluser:res.data[0].total
        })
      })
      Axios.get(API_URL + '/admin/countpartner')
      .then((res) =>  {
        console.log(res.data[0].total)
        this.setState({
          totalpartner:res.data[0].total
        })
      })
      Axios.get(API_URL + '/admin/countevent')
      .then((res) =>  {
        console.log(res.data[0].total)
        this.setState({
          totalevent:res.data[0].total
        })
      })
    }

    
    getDate = () =>{
      return new Date().toDateString();
    }


    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-12 ml-sm-auto col-lg-12 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Welcome, {this.props.username}</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button class="btn btn-sm btn-outline-secondary">Share</button>
                <button class="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Users</h5>
                            <span class="h2 font-weight-bold mb-0">{this.state.totaluser}</span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-users fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                  {/* <span class="text-danger mr-2"><i class="fas fa-arrow-down"></i> 3.48%</span> */}
                  <span class="text-nowrap">Number of Active Users</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Partner</h5>
                            <span class="h2 font-weight-bold mb-0">{this.state.totalpartner}</span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-store fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                  {/* <span class="text-danger mr-2"><i class="fas fa-arrow-down"></i> 3.48%</span> */}
                  <span class="text-nowrap">Number of Active Partner</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Events</h5>
                            <span class="h2 font-weight-bold mb-0">{this.state.totalevent}</span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-globe fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                  {/* <span class="text-danger mr-2"><i class="fas fa-arrow-down"></i> 3.48%</span> */}
                  <span class="text-nowrap">Number of Active Events</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0" style={{paddingBottom:'9%'}}>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-2">Date & Time</h5>
                    <span class="h5 font-weight-bold mb-0">{moment().format('MMMM Do YYYY, HH:mm')}</span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-globe fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                  {/* <span class="text-danger mr-2"><i class="fas fa-arrow-down"></i> 3.48%</span> */}
                  </p>
                </div>
              </div>
            </div>
            </div>
            <center><img className='mt-5' src={require('../img/LogoSS.PNG')} style={{width:750}}/></center>
        </main>
      </div>
    </div>

        </div>  );
    }
}
 
const mapStateToProps = (state) =>{ // Function yang akan terima global state
  return{
    username: state.admin.username, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
    role: state.admin.role,
    adminid: state.admin.id
  }
}

export default connect(mapStateToProps)(adminhome);