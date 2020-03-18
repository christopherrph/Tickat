import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'
import { Redirect } from 'react-router-dom'
import NumberFormat from 'react-number-format';

class manageadmin extends Component {
    state = { 
        listTransaction:[],
        pagination: 0,
        sortEvent: true,
        sortIduser: true,
        sortTotalticket: true,
        sortTotalprice: true,
        sortMethod: true,
        sortTime: true,
     }

    componentDidMount(){
      Axios.get(API_URL + '/admin/getAllTransaction')
      .then((res) =>  {
          this.setState({
            listTransaction:res.data
          })
      })
      .catch((err) =>{
        console.log(err)
      })
  }

    renderPagination = () =>{
      var length = this.state.listTransaction.length
      var halaman = Math.ceil(length/10)
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
    var x = this.state.listTransaction.slice(0+(this.state.pagination*10),10+(this.state.pagination*10))
    return x.map((val, index) =>{
      return(
          <tr>
              <td className='verticalalignmid'>{index+1}</td>
              <td className='verticalalignmid'>{val.event_name}</td>
              <td className='verticalalignmid'>{val.iduser}</td>
              <td className='verticalalignmid'>{val.totalticket}</td>
              <td className='verticalalignmid'><NumberFormat value={val.totalprice} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
              <td className='verticalalignmid'>{val.payment_method}</td>
              <td className='verticalalignmid'>{moment(val.transaction_time).format('MMMM Do YYYY, HH:mm:ss')}</td>
              <td>
                <Link 
                    to={{
                      pathname: `/transactiondetail/${val.idtransaction}`,
                      state: {
                        from:'/managetransactions'
                      }
                    }}
                ><button class="btn btn-sm btnadmin"> View</button></Link>
              </td>
          </tr>
      )
  })
  }

  sortbyEvent = () =>{
    if(this.state.sortEvent){
      var x = this.state.listTransaction.sort((a,b) => (a.event_name > b.event_name) ? 1 : ((b.event_name > a.event_name) ? -1 : 0)); 
    }else{
      var x = this.state.listTransaction.sort((a,b) => (a.event_name < b.event_name) ? 1 : ((b.event_name < a.event_name) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortEvent: !this.state.sortEvent, listTransaction: x})
  }

  sortbyUser = () =>{
    if(this.state.sortIduser){
      var x = this.state.listTransaction.sort((a,b) => (a.iduser > b.iduser) ? 1 : ((b.iduser > a.iduser) ? -1 : 0)); 
    }else{
      var x = this.state.listTransaction.sort((a,b) => (a.iduser < b.iduser) ? 1 : ((b.iduser < a.iduser) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortIduser: !this.state.sortIduser, listTransaction: x})
  }

  sortbyTicket = () =>{
    if(this.state.sortTotalticket){
      var x = this.state.listTransaction.sort((a,b) => (a.totalticket > b.totalticket) ? 1 : ((b.totalticket > a.totalticket) ? -1 : 0)); 
    }else{
      var x = this.state.listTransaction.sort((a,b) => (a.totalticket < b.totalticket) ? 1 : ((b.totalticket < a.totalticket) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortTotalticket: !this.state.sortTotalticket, listTransaction: x})
  }

  sortbyPrice = () =>{
    if(this.state.sortTotalprice){
      var x = this.state.listTransaction.sort((a,b) => (a.totalprice > b.totalprice) ? 1 : ((b.totalprice > a.totalprice) ? -1 : 0)); 
    }else{
      var x = this.state.listTransaction.sort((a,b) => (a.totalprice < b.totalprice) ? 1 : ((b.totalprice < a.totalprice) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortTotalprice: !this.state.sortTotalprice, listTransaction: x})
  }

  sortbyMethod = () =>{
    if(this.state.sortMethod){
      var x = this.state.listTransaction.sort((a,b) => (a.payment_method > b.payment_method) ? 1 : ((b.payment_method > a.payment_method) ? -1 : 0)); 
    }else{
      var x = this.state.listTransaction.sort((a,b) => (a.payment_method < b.payment_method) ? 1 : ((b.payment_method < a.payment_method) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortMethod: !this.state.sortMethod, listTransaction: x})
  }

  sortbyTime = () =>{
    if(this.state.sortTime){
      var x = this.state.listTransaction.sort((a,b) => (a.transaction_time > b.transaction_time) ? 1 : ((b.transaction_time > a.transaction_time) ? -1 : 0)); 
    }else{
      var x = this.state.listTransaction.sort((a,b) => (a.transaction_time < b.transaction_time) ? 1 : ((b.transaction_time < a.transaction_time) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortTime: !this.state.sortTime, listTransaction: x})
  }

    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className='pgtitle2'>ALL TRANSACTIONS</h3>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th><a onClick={() => this.sortbyEvent()} className='hovercursor'>Event</a></th>
                  <th><a onClick={() => this.sortbyUser()} className='hovercursor'>ID User</a></th>
                  <th><a onClick={() => this.sortbyTicket()} className='hovercursor'>Total Ticket</a></th>
                  <th><a onClick={() => this.sortbyPrice()} className='hovercursor'>Total Price</a></th>
                  <th><a onClick={() => this.sortbyMethod()} className='hovercursor'>Payment Method</a></th>
                  <th><a onClick={() => this.sortbyTime()} className='hovercursor'>Transaction Time</a></th>
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
 
export default connect(mapStateProps,{})(manageadmin);