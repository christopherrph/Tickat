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

class userdetail extends Component {
    state = { 
        listevent:[],
        userdetail:[{}],
        addImageFileName : 'Select File',
        addImageFile: undefined,
        transactionlist: []
     }

     sum(array,prop) {
      var total = 0
      for ( var i = 0, _len = array.length; i < _len; i++ ) {
          total += array[i][prop]
      }
    return total
      }

    componentDidMount(){
      var id = window.location.pathname;
      id = id.replace('/userdetail/', '')  
      console.log(id)
        Axios.get(API_URL + `/public/getUsersById/${id}`)
        .then((res) =>  {
            this.setState({
              userdetail:res.data
            })
            console.log(this.state.userdetail)
        })
        .catch((err) =>{
          console.log(err)
        })

        Axios.get(API_URL + `/user/getTransactionByUser/${id}`)
          .then((res) =>  {
              this.setState({
                transactionlist:res.data
              })
              console.log(this.state.transactionlist)
          })
          .catch((err) =>{
            console.log(err)
          })
      }

      renderTransaction = () =>{
        var id = window.location.pathname;
        id = id.replace('/userdetail/', '')  
        return this.state.transactionlist.map((val, index) =>{
          return(
              <tr style={{fontSize:15}}>
                  <td className='verticalalignmid'>{index+1}</td>
                  <td className='verticalalignmid'>{val.event_name}</td>
                  <td className='verticalalignmid'>{val.totalticket}</td>
                  <td className='verticalalignmid'><NumberFormat value={val.totalprice} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
                  <td className='verticalalignmid'>{moment(val.transaction_time).format('MMMM Do YYYY, HH:mm:ss')}</td>
                  <td>
                    <Link 
                      to={{
                        pathname: `/transactiondetail/${val.idtransaction}`,
                        state: {
                          from:`/userdetail/${id}`
                        }
                      }}
                  ><button class="btn btn-sm btnadmin"> View</button></Link>
                  </td>
              </tr>
          )
      })
      }

    render() { 
        return ( <div>
        <Navbar/>
        <div class="container emp-profile">
            <form method="post">
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-img">
                        <img src={API_URL+ '/avatar/' + this.state.userdetail[0].avatar} style={{maxHeight:180}} className='boxshadow'/>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="profile-head">
                                    <h5>
                                      {this.state.userdetail[0].name}
                                    </h5>
                                    <h6>
                                      Join Date: {moment(this.state.userdetail[0].joindate).format('D MMMM YYYY')}
                                    </h6>
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Transactions</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <Link to='/manageuser'><button class="btnadmin" style={{width:'90px'}}> Back </button></Link>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-work">
                            <p style={{fontSize:15}} className='border-bottom'>Transactions</p>
                            <a>Number of Transactions: {this.state.transactionlist.length} </a><br/>
                            <a>Total Tickets Bought: {this.sum(this.state.transactionlist,'totalticket')} </a><br/>
                            <a>Total Money Spent: <NumberFormat value={this.sum(this.state.transactionlist,'totalprice')}  displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></a><br/>
                        </div>
                    </div>
                    <div class="col-md-8" style={{marginTop:-50}}>
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div class="row" style={{marginTop:-30}}>
                                            <div class="col-md-3">
                                                <label>User ID</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.userdetail[0].iduser}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Gender</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.userdetail[0].gender == 'Male'
                                                ? 
                                                <i class="fas fa-male"></i>
                                                :
                                                <i class="fas fa-female"></i>
                                                }</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Name</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.userdetail[0].name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Email</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.userdetail[0].email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Birthdate</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p> {moment(this.state.userdetail[0].birthdate).format('D MMMM YYYY')}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Address</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.userdetail[0].address}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Phone Number</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.userdetail[0].phone}</p>
                                            </div>
                                        </div>
                            </div>

                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <table class="table table-striped" style={{marginTop:-40}}>
                            <thead>
                                <tr>
                                <th scope="col">No.</th>
                                <th scope="col">Event Name</th>
                                <th scope="col">Ticket</th>
                                <th scope="col">Price</th>
                                <th scope="col">Time</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTransaction()}
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
 
export default connect(mapStateToProps)(userdetail);