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

class monthlyreport extends Component {
    state = { 
       monthangka: '',
       month:'',
       year:'',
       totaluser: 0,
       totalpartner: 0,
       totalevent: 0,
       listTransaction: [],
       paymentmethodsales: [],
       EventCategory: [],
       pagination: 0,
       pagination2: 0,
       pagination3: 0,
       sortEvent: true,
       sortIduser: true,
       sortTotalticket: true,
       sortTotalprice: true,
       sortMethod: true,
       sortTime: true,
       listevent: [],
       listeventlaku:[]
     }

    


    async componentDidMount(){
      if(!this.props.location.state){
        this.setState({ redirecterror: true })
      }else{
        const  { month } = this.props.location.state
        const  { year } = this.props.location.state

        await this.setState({month, year})

        var months = this.state.month.toLowerCase();
        var arraymonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var monthangka = arraymonths.indexOf(months) + 1;
        await this.setState({monthangka})
  
        const countuser = await Axios.get(API_URL + `/admin/countusermonth/${this.state.monthangka}/${this.state.year}`,{
          params:{
            month: this.state.monthangka,
            year: this.state.year
           }
          }) // Total User
        this.setState({totaluser:countuser.data[0].total})
  
        const countpartner = await Axios.get(API_URL + `/admin/countpartnermonth/${this.state.monthangka}/${this.state.year}`,{
          params:{
            month: this.state.monthangka,
            year: this.state.year
           }
          }) // Total User
        this.setState({totalpartner:countpartner.data[0].total})
  
        const countevent = await Axios.get(API_URL + `/admin/countalleventmonth/${this.state.monthangka}/${this.state.year}`,{
          params:{
            month: this.state.monthangka,
            year: this.state.year
           }
          }) // Total User
        this.setState({totalevent:countevent.data[0].total})
  
        const getTransactions = await Axios.get(API_URL + `/admin/getAllTransactionmonth/${this.state.monthangka}/${this.state.year}`,{
          params:{
            month: this.state.monthangka,
            year: this.state.year
           }
          }) // Total User
        this.setState({listTransaction:getTransactions.data})
  
        const getPaymentMethod = await Axios.get(API_URL + `/admin/countpaymentmethodbymonth/${this.state.monthangka}/${this.state.year}`)
        this.setState({paymentmethodsales:getPaymentMethod.data})
  
        const eventcategory = await Axios.get(API_URL + `/admin/getEventCategorybymonth/${this.state.monthangka}/${this.state.year}`)
        this.setState({EventCategory: eventcategory.data})
  
        const getevent = await Axios.get(API_URL + `/admin/getAllEventmonth/${this.state.monthangka}/${this.state.year}`)
        this.setState({listevent: getevent.data})
  
        const geteventlaku = await Axios.get(API_URL + `/admin/getEventLaku/${this.state.monthangka}/${this.state.year}`)
        this.setState({listeventlaku: geteventlaku.data})
      }

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

    rendereventcategory = () =>{
      var x = this.state.totalevent
      return this.state.EventCategory.map((val, index) =>{
        var persentase = Math.round(val.Total * 100 / x)
        return(
        <dd className={ `percentage percentage-${persentase}` }><span class="text text-right">{val.category_name}: <br/> {val.Total} ({persentase}%)</span></dd>
        )
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

  renderPagination2 = () =>{
    var length = this.state.listevent.length
    var halaman = Math.ceil(length/5)
    var arr = []
    for(var i=0;i<halaman;i++){
      arr.push(i)
    }
    return arr.map((val, index) =>{
      if(val == this.state.pagination2){
        return(
          <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1">{val+1}</a>
          </li>
        )
      }else{
        return(
        <li class="page-item"><a class="page-link" style={{color:'#1F5E99'}} onClick={() => this.setState({pagination2: val})} >{val+1}</a></li>
        )
      }
  })
}

renderPagination3 = () =>{
  var length = this.state.listeventlaku.length
  var halaman = Math.ceil(length/5)
  var arr = []
  for(var i=0;i<halaman;i++){
    arr.push(i)
  }
  return arr.map((val, index) =>{
    if(val == this.state.pagination3){
      return(
        <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1">{val+1}</a>
        </li>
      )
    }else{
      return(
      <li class="page-item"><a class="page-link" style={{color:'#1F5E99'}} onClick={() => this.setState({pagination3: val})} >{val+1}</a></li>
      )
    }
})
}

    renderTransactionList = () =>{
      var x = this.state.listTransaction.slice(0+(this.state.pagination*10),10+(this.state.pagination*10))
      return x.map((val, index) =>{
        return(
            <tr>
                <td className='verticalalignmid'>{index+1+(this.state.pagination*10)}</td>
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
                          from:'/monthlyreport',
                          month: this.state.month,
                          year: this.state.year
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

  renderevent = () =>{
    var x = this.state.listevent.slice(0+(this.state.pagination2*5),5+(this.state.pagination2*5))
    return x.map((val, index) =>{
        return(
            <tr class='clickable-row' data-href='url://'>
                <td className='verticalalignmid'>{index+1+(this.state.pagination2*5)}</td>
                <td className='verticalalignmid'>{val.event_name}</td>
                <td className='verticalalignmid'>{val.category_name}</td>
                <td className='verticalalignmid'>{moment(val.event_date).format('DD-MM-YYYY')}</td>
            </tr>
        )
    })
}

renderticketsold = () =>{
  var x = this.state.listeventlaku.slice(0+(this.state.pagination3*5),5+(this.state.pagination3*5))
  return x.map((val, index) =>{
      return(
          <tr class='clickable-row' data-href='url://'>
              <td className='verticalalignmid'>{index+1+(this.state.pagination3*5)}</td>
              <td className='verticalalignmid'>{val.event_name}</td>
              <td className='verticalalignmid'>{val.TotalTicket}</td>
              <td className='verticalalignmid'><NumberFormat value={val.TotalEarn} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
          </tr>
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

getAVG = (arr,parameter) =>{
  var rata2 = this.sumOfArrayWithParameter(arr, `${parameter}`) / arr.length
  rata2 = Math.round(rata2)
  return rata2 
}


    render() { 
      if(this.props.role !== 'Super Admin'){
        return <Redirect to='/adminhome'/>;
      }

      const { redirecterror } = this.state;
      if (redirecterror) {
        return <Redirect to='/reports'/>;
      }
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <center>
          <img className='mt-2 mb-2' src={require('../img/LogoSS.PNG')} style={{width:300}}/>
        </center>

        <center><h3 className='pgtitle2 mt-3 text-uppercase'>{this.state.month} {this.state.year} SALES</h3>
            <div class="table-responsive col-10">
            <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination()}
              </ul>
            </nav>
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
          </div></center>

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
                  <span class="text-nowrap">New User This Month</span>
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
                  <span class="text-nowrap">New Partner This Month</span>
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
                  <span class="text-nowrap">Events This Month</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Transactions</h5>
                            <span class="h2 font-weight-bold mb-0">{this.state.listTransaction.length}</span>
                    </div>
                    <div class="col-auto">
                    <i class="fas fa-money fa-2x" style={{color:'#1F5E99'}}></i>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                  {/* <span class="text-danger mr-2"><i class="fas fa-arrow-down"></i> 3.48%</span> */}
                  <span class="text-nowrap">Transactions This Month</span>
                  </p>
                </div>
              </div>
            </div>
            </div>
            <div className='row'>
              <div className='col-6 p-4 border-right'>
                <h3 className='pgtitle2 border-bottom'>TRANSACTION</h3>
                <div className='col-8'>
                  <dl>
                    <dt>
                      Payment Method 
                    </dt>
                    {this.renderpaymentmethod()}
                  </dl>
                </div>

                <div class="table-responsive">
                    <center>
                      <table class="table table-bordered " style={{width: '60%'}}>
                        <tbody>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Total Transaction</td>
                              <td className='verticalalignmid'>{this.state.listTransaction.length}</td>
                          </tr>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Total Earned</td>
                              <td className='verticalalignmid'><NumberFormat value={this.sumOfArrayWithParameter(this.state.listTransaction, 'totalprice')}  displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
                          </tr>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Average Transactions</td>
                              <td className='verticalalignmid'><NumberFormat value={this.getAVG(this.state.listTransaction, 'totalprice')}  displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
                          </tr>
                          <tr class='clickable-row'>
                              <td className='verticalalignmid'>Average Ticket Bought</td>
                              <td className='verticalalignmid'>{this.getAVG(this.state.listTransaction, 'totalticket')}</td>
                          </tr>
                        </tbody>
                      </table>
                      </center>
                  </div>
                  <br/>

                  <div className='col-12'>
                  <center><h5 style={{fontWeight:700}}>Tickets Sales Per Event</h5></center>
                <div class="table-responsive col-12">
                <nav aria-label="...">
                    <ul class="pagination pagination-sm">
                      {this.renderPagination3()}
                    </ul>
                  </nav>
                  <table class="table table-striped table-sm">
                    <thead>
                    <tr>
                      <th><a>No</a></th>
                      <th><a>Events Name</a></th>
                      <th><a>Tickets Sold</a></th>
                      <th><a>Total Sales</a></th>
                    </tr>
                    </thead>
                    <tbody>
                      {this.renderticketsold()}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>

              <div className='col-6 p-4'>
                <h3 className='pgtitle2 border-bottom'>EVENT</h3>
                <div className='col-8'>
                  <dl>
                    <dt>
                      Event Category On {this.state.month} {this.state.year}
                    </dt>
                    {this.rendereventcategory()}
                  </dl>
                </div>

                <div className='col-12'>
                  <center><h5 style={{fontWeight:700}}>Event On {this.state.month} {this.state.year}</h5></center>
                <div class="table-responsive col-12">
                  <nav aria-label="...">
                    <ul class="pagination pagination-sm">
                      {this.renderPagination2()}
                    </ul>
                  </nav>
                  <table class="table table-striped table-sm">
                    <thead>
                    <tr>
                      <th><a>No</a></th>
                      <th><a>Events Name</a></th>
                      <th><a>Category</a></th>
                      <th><a>Event Date</a></th>
                    </tr>
                    </thead>
                    <tbody>
                      {this.renderevent()}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            </div>
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

export default connect(mapStateToProps)(monthlyreport);