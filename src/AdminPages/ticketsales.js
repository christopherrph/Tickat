import React, { Component } from 'react'
import '../AdminApp.css';
import '../HorizontalChart.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'
import { Redirect } from 'react-router-dom'
import NumberFormat from 'react-number-format';

class ticketsales extends Component {
    state = { 
        listTransaction:[],
        eventname:'',
        eventid: '',
        paymentmethodsales: [],
        tickettypesales: [],
        totalticketsold: 0,
        pagination: 0,
        totalpayment: 0
     }

    async componentDidMount(){
      var id = window.location.pathname;
      id = id.replace('/ticketsales/', '') 
      const res2 = await Axios.get(API_URL + `/admin/getEventById/${id}`)
      this.setState({eventname: res2.data[0].event_name, eventid: id})
      Axios.get(API_URL + `/admin/getAllTransactionById/${id}`)
      .then((res) =>  {
          this.setState({
            listTransaction:res.data
          })
          console.log(this.state.listTransaction)
          var totalterjual = 0
          for(var i=0; i<this.state.listTransaction.length; i++){
            totalterjual += this.state.listTransaction[i].totalticket
          }
          var totalpayment = 0
          for(var i=0; i<this.state.listTransaction.length; i++){
            totalpayment += this.state.listTransaction[i].totalprice
          }
          this.setState({
            totalticketsold: totalterjual,
            totalpayment: totalpayment
          })

      })
      .catch((err) =>{
        console.log(err)
      })

      Axios.get(API_URL + `/admin/countpaymentmethodbyevent/${id}`)
      .then((res) =>  {
          this.setState({
            paymentmethodsales:res.data
          })
          console.log(this.state.paymentmethodsales)
      })
      .catch((err) =>{
        console.log(err)
      })

      Axios.get(API_URL + `/admin/counttickettypebyevent/${id}`)
      .then((res) =>  {
          this.setState({
            tickettypesales:res.data
          })
          console.log(this.state.tickettypesales)
      })
      .catch((err) =>{
        console.log(err)
      })
  }

  renderPagination = () =>{
    var length = this.state.listTransaction.length
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

  renderTransactionList = () =>{
    var x = this.state.listTransaction.slice(0+(this.state.pagination*5),5+(this.state.pagination*5))
    return x.map((val, index) =>{
      return(
          <tr>
              <td className='verticalalignmid'>{index+1+(this.state.pagination*5)}</td>
              <td className='verticalalignmid'>{val.iduser}</td>
              <td className='verticalalignmid'>{val.totalticket}</td>
              <td className='verticalalignmid'><NumberFormat value={val.totalprice} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
              <td className='verticalalignmid'>{val.payment_method}</td>
              <td className='verticalalignmid'>{moment(val.transaction_time).format('MMMM Do YYYY, HH:mm:ss')}</td>
              <td>
                <Link to={{
                      pathname: `/transactiondetail/${val.idtransaction}`,
                      state: {
                        from:`/ticketsales/${this.state.eventid}`
                      }
                    }}><button class="btn btn-sm btnadmin"> View</button></Link>
              </td>
          </tr>
      )
  })
  }

  renderpaymentmethod = () =>{
    var x = this.state.listTransaction.length
    return this.state.paymentmethodsales.map((val, index) =>{
      var persentase = Math.round(val.jumlah * 100 / x)
      return(
      <dd className={ `percentage percentage-${persentase}` }><span class="text">{val.payment_method}: {val.jumlah} - {persentase}%</span></dd>
      )
  })
  }

  rendertickettype = () =>{
    return this.state.tickettypesales.map((val, index) =>{
      var persentase = Math.round(val.jumlah * 100 / this.state.totalticketsold)
      return(
      <dd className={ `percentage percentage-${persentase}` }><span class="text">{val.ticket_name}: {val.jumlah} - {persentase}%</span></dd>
      )
  })
  }

  sumOfArrayWithParameter = (array, parameter) => {
    let sum = null;
    if (array && array.length > 0 && typeof parameter === 'string') {
      sum = 0;
      for (let e of array) if (e && e.hasOwnProperty(parameter)) sum += e[parameter];
    }
    return sum;
  }

  getAVGprice = (arr,parameter) =>{
    var rata2 = this.sumOfArrayWithParameter(arr, `${parameter}`) / arr.length
    return rata2 
  }

    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className='pgtitle2'>{this.state.eventname} </h3>
          <Link to={`/eventdetail/${this.state.eventid}`}><button class="btnadmin" style={{width:'90px'}}> Back </button></Link>
          </div>

          <div className='row'>
            <div className='col-5'>
                <dl>
                  <dt>
                    Payment Method
                  </dt>
                  {this.renderpaymentmethod()}
              </dl>
            </div>
            <div className='col-4' style={{marginLeft: '8%'}}>
                <dl>
                  <dt>
                    Ticket Type
                  </dt>
                  {this.rendertickettype()}
              </dl>
            </div>
          </div>

          <div class="row mb-5">
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0" style={{height:105}}>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Tickets Sold</h5>
                            <span class="h2 font-weight-bold mb-0">{this.state.totalticketsold}</span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-ticket-alt fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0" style={{height:105}}>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-3">Total Payment</h5>
                            <span class="h5 font-weight-bold mb-0"><NumberFormat value={this.state.totalpayment} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-money-bill-wave fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0" style={{height:105}}>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 style={{fontSize:15}} class="card-title text-uppercase text-muted mb-2">AVG Tickets / Transaction</h5>
                            <span class="h5 font-weight-bold mb-">{this.getAVGprice(this.state.listTransaction, "totalticket")}</span>
                    </div>
                    <div class="col-auto">
                    <i class="far fa-chart-bar fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0" style={{height:105}}>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 style={{fontSize:15}} class="card-title text-uppercase text-muted mb-2">AVG Price / Transaction</h5>
                            <span class="h5 font-weight-bold mb-0"><NumberFormat value={this.getAVGprice(this.state.listTransaction, "totalprice")} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></span>
                    </div>
                    <div class="col-auto">
                    <i class="far fa-chart-bar fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID User</th>
                  <th>Total Ticket</th>
                  <th>Total Price</th>
                  <th>Payment Method</th>
                  <th>Transaction Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.renderTransactionList()}
              </tbody>
            </table>
            <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination()}
              </ul>
            </nav>
          </div>
        </main>
    </div>
        </div>  );
    }
}

const mapStateProps = (state) =>{ // Function yang akan terima global state
  return{
    username: state.admin.username, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
    role: state.admin.role
  }
}
 
export default connect(mapStateProps,{})(ticketsales);