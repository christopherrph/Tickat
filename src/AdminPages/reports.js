import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'
import '../HorizontalChart.css'
import NumberFormat from 'react-number-format';

class adminhome extends Component {
    state = { 
      totaluser: null,
      totalpartner: null,
      totalevent: null,
      totalallevent: null,
      totaldoneevent: null,
      totalinactiveevent: null,
      UserGender:[],
      UserAge:[],
      EventCategory:[],
      MonthlyTransaction: [],
      pagination: 0
     }

    


    async componentDidMount(){
      const countuser = await Axios.get(API_URL + '/admin/countuser') // Total User
      this.setState({totaluser:countuser.data[0].total})

      const countpartner = await Axios.get(API_URL + '/admin/countpartner') // Total Partner
      this.setState({totalpartner:countpartner.data[0].total})

      const countevent = await Axios.get(API_URL + '/admin/countevent') // Total Event Active dan Berlangsung
      this.setState({totalevent:countevent.data[0].total})

      const countallevent = await Axios.get(API_URL + '/admin/countallevent') // Total Event Berlangsung, Selesai, Inactive
      this.setState({totalallevent:countallevent.data[0].total})

      const countdoneevent = await Axios.get(API_URL + '/admin/countdoneevent') // Total Event Selesai
      this.setState({totaldoneevent:countdoneevent.data[0].total})

      const countinactiveevent = await Axios.get(API_URL + '/admin/countinactiveevent') // Total Event Non-Active
      this.setState({totalinactiveevent:countinactiveevent.data[0].total})

      const usergender = await Axios.get(API_URL + '/admin/getUserGender')
      this.setState({UserGender: usergender.data})

      const userage = await Axios.get(API_URL + '/admin/getUserAge')
      this.setState({UserAge: userage.data})

      const eventcategory = await Axios.get(API_URL + '/admin/getEventCategory')
      this.setState({EventCategory: eventcategory.data})

      const monthlytransaction = await Axios.get(API_URL + '/admin/getMonthlyTransaction')
      this.setState({MonthlyTransaction: monthlytransaction.data})
    }

    renderPagination = () =>{
      var length = this.state.MonthlyTransaction.length
      var halaman = Math.ceil(length/5)
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

    rendergender = () =>{
      var x = this.state.totaluser
      return this.state.UserGender.map((val, index) =>{
        var persentase = Math.round(val.jumlah * 100 / x)
        return(
        <dd className={ `percentage percentage-${persentase}` }><span class="text">{val.gender}: {val.jumlah} ({persentase}%)</span></dd>
        )
    })
    }

    renderage = () =>{
      var x = this.state.totaluser
      return this.state.UserAge.map((val, index) =>{
        var persentase = Math.round(val.Total * 100 / x)
        return(
        <dd className={ `percentage percentage-${persentase}` }><span class="text">{val.Age}: {val.Total} ({persentase}%)</span></dd>
        )
    })
    }

    rendereventcategory = () =>{
      var x = this.state.totalallevent
      return this.state.EventCategory.map((val, index) =>{
        var persentase = Math.round(val.Total * 100 / x)
        return(
        <dd className={ `percentage percentage-${persentase}` }><span class="text text-right">{val.category_name}: <br/> {val.Total} ({persentase}%)</span></dd>
        )
    })
    }

    rendermonthlytrans = () =>{
        var x = this.state.MonthlyTransaction.slice(0+(this.state.pagination*5),5+(this.state.pagination*5))
        return x.map((val, index) =>{
            return(
              <tr  class='clickable-row' data-href='url://'>
                  <td className='verticalalignmid'>{index+1+(this.state.pagination*5)}</td>
                  <td className='verticalalignmid'>{val.Month}</td>
                  <td className='verticalalignmid'>{val.Year}</td>
                  <td className='verticalalignmid'>{val.Total_Transaction}</td>
                  <td className='verticalalignmid'><NumberFormat value={val.Total_Money} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
                  <td className='verticalalignmid'>{val.Total_Ticket}</td>
              </tr>
          )
        })
    }


    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <center><img className='mt-2 mb-2' src={require('../img/LogoSS.PNG')} style={{width:300}}/></center>
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
            <div className='row'>
              <div className='col-6 p-4 border-right'>
                <h3 className='pgtitle2 border-bottom'>USER</h3>

                <div className='col-8'>
                  <dl>
                    <dt>
                      User Gender
                    </dt>
                    {this.rendergender()}
                  </dl>
                </div>

                <div className='col-8'>
                  <dl>
                    <dt>
                      User Age
                    </dt>
                    {this.renderage()}
                  </dl>
                </div>
              </div>

              <div className='col-6 p-4'>
                <h3 className='pgtitle2 border-bottom'>EVENT</h3>
                <div className='col-8'>
                  <dl>
                    <dt>
                      Event Category (All Events)
                    </dt>
                    {this.rendereventcategory()}
                  </dl>
                </div>

                  <div class="table-responsive">
                    <center>
                      <table class="table table-bordered " style={{width: '60%'}}>
                        <tbody>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Total Events</td>
                              <td className='verticalalignmid'>{this.state.totalallevent}</td>
                          </tr>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Active Events</td>
                              <td className='verticalalignmid'>{this.state.totalevent}</td>
                          </tr>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Done Events</td>
                              <td className='verticalalignmid'>{this.state.totaldoneevent}</td>
                          </tr>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Deactivated Events</td>
                              <td className='verticalalignmid'>{this.state.totalinactiveevent}</td>
                          </tr>
                        </tbody>
                      </table>
                      </center>
                  </div>
              </div>
            </div>

            <center><h3 className='pgtitle2 mt-3'>MONTHLY SALES</h3>
            <div class="table-responsive col-8">
            <table class="table table-striped table-sm" style={{textAlign:'center'}}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Total Transaction</th>
                  <th>Total Money</th>
                  <th>Total Ticket Sold</th>
                </tr>
              </thead>
              <tbody>
                  {this.rendermonthlytrans()}
              </tbody>
            </table>
            <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination()}
              </ul>
            </nav>
          </div></center>

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