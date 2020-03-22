import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'
import NumberFormat from 'react-number-format';

class partnerdetail extends Component {
    state = { 
       transactiondetails:[{}]
     }

    componentDidMount(){
      var transid = window.location.pathname;
      transid = transid.replace('/transactiondetail/', '')  
      console.log(transid)
      Axios.get(API_URL + `/admin/getTickets/${transid}`)
      .then((res) =>  {
          this.setState({
            transactiondetails:res.data
          })
      })
      .catch((err) =>{
        console.log(err)
      })
    }

    renderTicket = () =>{
      return this.state.transactiondetails.map((val, index) =>{
        return(
            <tr>
                <td className='verticalalignmid'>{index+1}</td>
                <td className='verticalalignmid'>{val.idtransactionticket}</td>
                <td className='verticalalignmid'>{val.ticket_name}</td>
                <td className='verticalalignmid'><NumberFormat value={val.harga_beli} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
            </tr>
        )
    })
    }

    

    render() { 
        const  { from, month, year } = this.props.location.state
        return ( <div>
        <Navbar/>
        <div class="emp-profile">
            <form method="post">
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-img">
                        <img src={API_URL + this.state.transactiondetails[0].event_pic} className='boxshadow'/>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="profile-head">
                                    <h5>
                                      {this.state.transactiondetails[0].idtransaction}
                                    </h5>
                                    <h5 style={{color:'#1F5E99'}}>
                                      {this.state.transactiondetails[0].event_name}
                                    </h5>
                                    <p class="proile-rating"> Transaction Time: {moment(this.state.transactiondetails[0].transaction_time).format('MMMM Do YYYY, HH:mm:ss')}</p>
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Info</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Tickets</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-2">
                            <Link 
                                to={{
                                pathname: `${from}`,
                                state: {
                                    month:`${month}`,
                                    year: `${year}`
                                }
                                }}
                            ><button class="btnadmin" style={{width:'90px'}}> Back</button></Link>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-work">
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab" style={{marginTop: '-5%'}}>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Name: </label>
                                            </div>
                                            <div class="col-md-6">
                                                <p> {this.state.transactiondetails[0].name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Email: </label>
                                            </div>
                                            <div class="col-md-6">
                                                <p> {this.state.transactiondetails[0].email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Phone Number</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.transactiondetails[0].phone}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Total Ticket:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.transactiondetails[0].totalticket}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Total Price:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p><NumberFormat value={this.state.transactiondetails[0].totalprice} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Event Date:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{moment(this.state.transactiondetails[0].event_date).format('D MMMM YYYY')}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Event Location: </label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.transactiondetails[0].event_location}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Payment Method: </label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.transactiondetails[0].payment_method}</p>
                                            </div>
                                        </div>
                                        {
                                          this.state.transactiondetails[0].payment_method == 'Transfer'
                                          ?
                                          <div class="row">
                                            <div class="col-md-4">
                                                <label>Payment Receipt: </label>
                                            </div>
                                            <div class="col-md-6">
                                              <img style={{height: 400}} src={API_URL + this.state.transactiondetails[0].receipt} className='boxshadow'/>
                                            </div>
                                          </div>
                                          :
                                          <div/>
                                        }
                                        
                                        
                            </div>

                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <table class="table table-striped" style={{marginTop:-40, width: 700}}>
                            <thead>
                                <tr>
                                <th scope="col">No.</th>
                                <th scope="col">Ticket ID</th>
                                <th scope="col">Ticket Type</th>
                                <th scope="col">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTicket()}
                            </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>           
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
 
export default connect(mapStateToProps)(partnerdetail);