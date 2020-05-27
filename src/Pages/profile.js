import React, { Component } from 'react'
import '../Profile.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import Footer from './footer';
import Header from './navbar';
import moment from 'moment'
import {Helmet} from "react-helmet";
import Modal from '../Modal/modal';
import Alert from '../Modal/alert';
import NumberFormat from 'react-number-format';
import { Redirect } from 'react-router-dom'


class profile extends Component {
    state = { 
        addImageFileName : 'Select File',
        addImageFile: undefined,
        userdetail: [{}],
        avatar: undefined,
        changepasserror: '',
        editprofileerror: '',
        newBirthdate: null,
        transactionlist: []
     }

    btnChangePass = () =>{
        const { userid } = this.props.location.state
        let oldpass = this.refs.oldpass.value;
        let newpass = this.refs.newpass.value;
        let renewpass = this.refs.renewpass.value;
        if(oldpass && newpass && renewpass){
            if(newpass == renewpass){
                Axios.patch(API_URL + `/user/editpass/${userid}`,{
                    newpass,
                    oldpass
                  })
                .then((res) => {
                    this.refs.oldpass.value = ''
                    this.refs.newpass.value = ''
                    this.refs.renewpass.value = ''
                    this.setState({changepasserror: ''})
                    document.getElementById("editpassdismiss").click()
                    document.getElementById("changesuccess").click()
                    })
                .catch((err) => {
                    console.log(err)
                    this.setState({changepasserror: 'Wrong Old Password :( '})
                    })
            }else{
                this.setState({changepasserror: 'New Password Did Not Match :( '})
            }
        }else{
            this.setState({changepasserror: 'Please Fill All Fields :( '})
        }
    }

    btnEditProfile = () =>{
        const { userid } = this.props.location.state
        let birthdate = ''
        if(this.state.newBirthdate == null){
            birthdate = moment(this.state.userdetail[0].birthdate).format('YYYY-MM-DD')
        }else{
            birthdate = this.state.newBirthdate
        }
        let name = this.refs.name.value;
        let phonenum = this.refs.phonenum.value;
        let address = this.refs.address.value;

        if(name && phonenum && address){
            Axios.patch(API_URL + `/user/editprofile/${userid}`,{
                name, birthdate, phonenum, address
              })
            .then((res) => {
                console.log(res)
                this.setState({editprofileerror: ''})
                document.getElementById("editprofiledismiss").click()
                document.getElementById("changesuccess").click()
                this.componentDidMount()
                })
            .catch((err) => {
                console.log(err)
                })
        }else{
            this.setState({editprofileerror: 'Please Fill All Fields :( '})
        }
    }

    changebirthdate = (val) =>{
        let birthdate = this.refs.birthdate.value;
        this.setState({newBirthdate: birthdate})
    }

    componentDidMount(){
        if(this.props.location.state){
            const { userid } = this.props.location.state
            Axios.get(API_URL + `/public/getUsersById/${userid}`)
            .then((res) =>  {
                this.setState({
                  userdetail:res.data
                })
                console.log(this.state.userdetail)
                this.setState({
                  avatar: this.state.userdetail[0].avatar
                })
            })
            .catch((err) =>{
              console.log(err)
            })
  
            Axios.get(API_URL + `/user/getTransactionByUser/${userid}`)
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
        }

    changeavatar = (val) =>{
        this.setState({
            avatar:val
          })
    }

    editavatar = () =>{
        const { userid } = this.props.location.state
        Axios.post(API_URL + `/user/changeAvatar/${userid}`, {avatar: this.state.avatar})
          .then((res) =>  {
            console.log(res)
          })
          .catch((err) =>{
            console.log(err)
          })
    }

    renderTransaction = () =>{
        return this.state.transactionlist.map((val, index) =>{
            return(
                <tr>
                    <td className='verticalalignmid'>{index+1}</td>
                    <td className='verticalalignmid'>{val.event_name}</td>
                    <td className='verticalalignmid'>{val.totalticket}</td>
                    <td className='verticalalignmid'><NumberFormat value={val.totalprice} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></td>
                    <td className='verticalalignmid'>{moment(val.transaction_time).format('MMMM Do YYYY, HH:mm:ss')}</td>
                    <td>
                      <Link to={{
                            pathname: '/tickets',
                            state: {
                              idtransaction: val.idtransaction,
                              idevent: val.idevent
                            }
                          }}><button class="btn btnbiru"> View</button></Link>
                    </td>
                </tr>
            )
        })
    }



    render() { 
        if(!this.props.id){
            return <Redirect to='/login'/>;
          }
        return (<div className='paddingatas'>
            <Header/>
<div class="container mb-5 mt-5 pb-5">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title mb-4">
                            <div class="d-flex justify-content-start">
                                <div class="image-container">
                                    <img src={API_URL+'/avatar/'+ this.state.avatar} id="imgProfile" style={{width: '150px', height: '150px'}} class="img-thumbnail" />
                                    <div class="middle">
                                        <input type="button" data-toggle="modal" data-target="#avatarModal" id='avatarModal' class="btn btn-secondary" id="btnChangePicture" value="Change" />
                                    </div>
                                </div>
                                <div class="userData ml-3">
                                    <h2 class="d-block"><a>{this.state.userdetail[0].name}</a></h2>
                                    <h6 class="d-block"><a>Join Date: </a> {moment(this.state.userdetail[0].joindate).format('D MMMM YYYY')}</h6>
                                    <h6 class="d-block"><a> </a></h6>
                                </div>
                                <div class="ml-auto">
                                    <input type="button" class="btn btn-primary d-none" id="btnDiscard" value="Discard Changes" />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link active" style={{color:'#1F5E99'}} id="basicInfo-tab" data-toggle="tab" href="#basicInfo" role="tab" aria-controls="basicInfo" aria-selected="true">My Info</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" style={{color:'#1F5E99'}} id="connectedServices-tab" data-toggle="tab" href="#connectedServices" role="tab" aria-controls="connectedServices" aria-selected="false">Transaction & Ticket</a>
                                    </li>
                                </ul>
                                <div class="tab-content ml-1" id="myTabContent">
                                    <div class="tab-pane fade show active" id="basicInfo" role="tabpanel" aria-labelledby="basicInfo-tab">
                                        <div class="row">
                                            <div class="col-sm-3 col-md-2 col-5">
                                                <label>Full Name</label>
                                            </div>
                                            <div class="col-md-8 col-6">
                                                {this.state.userdetail[0].name}
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row">
                                            <div class="col-sm-3 col-md-2 col-5">
                                                <label>Email</label>
                                            </div>
                                            <div class="col-md-8 col-6">
                                                {this.state.userdetail[0].email}
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row">
                                            <div class="col-sm-3 col-md-2 col-5">
                                                <label>Birth Date</label>
                                            </div>
                                            <div class="col-md-8 col-6">
                                                {moment(this.state.userdetail[0].birthdate).format('D MMMM YYYY')}
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row">
                                            <div class="col-sm-3 col-md-2 col-5">
                                                <label>Phone Number</label>
                                            </div>
                                            <div class="col-md-8 col-6">
                                                {this.state.userdetail[0].phone}
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="row">
                                            <div class="col-sm-3 col-md-2 col-5">
                                                <label>Address</label>
                                            </div>
                                            <div class="col-md-8 col-6">
                                                {this.state.userdetail[0].address}
                                            </div>
                                        </div>
                                        <hr />

                                        <button data-toggle="modal" data-target="#editprofile" className='btnbiru' style={{borderRadius: 70, padding:8, marginRight:10, fontSize:13}}>Edit Profile <i class="fas fa-edit"></i></button> 
                                        <button data-toggle="modal" data-target="#editpass" className='btnbiru' style={{borderRadius: 70, padding:8, fontSize:13}}>Change Password <i class="fas fa-key"></i></button> 
                                        <Modal idmodal="editpass" body={
                                        <div>
                                        <label>Old Password:</label>
                                        <div class="form-group">
                                            <input type="password" ref='oldpass' class="form-control" placeholder=""/>
                                        </div>
                                        <label>New Password:</label>
                                        <div class="form-group">
                                            <input type="password" ref='newpass' class="form-control" placeholder=""/>
                                        </div>
                                        <label>Re-Type New Password:</label>
                                        <div class="form-group">
                                            <input type="password" ref='renewpass' class="form-control" placeholder=""/>
                                        </div>
                                        <label style={{color:'red'}}>{this.state.changepasserror}</label>
                                        </div>
                                        } title='Change Password'>
                                        <button type='button' onClick={this.btnChangePass} className='btn btnbiru'>Confirm</button>
                                        </Modal>

                                        <Modal idmodal="editprofile" body={
                                        <div>
                                        <label>Name:</label>
                                        <div class="form-group">
                                            <input type="text" ref='name' defaultValue= {this.state.userdetail[0].name} class="form-control" placeholder=""/>
                                        </div>
                                        <label>Birthdate: {moment(this.state.userdetail[0].birthdate).format('YYYY/MM/DD')}</label><br/>
                                        <label>New Birthdate: </label>
                                        <div class="form-group">
                                            <input placeholder='New Birthdate' ref='birthdate' class="form-control" onChange={(val) => this.changebirthdate(val)} type='date' ref='birthdate'/>
                                        </div>
                                        <label>Phone Number:</label>
                                        <div class="form-group">
                                            <input type="number" ref='phonenum' defaultValue={this.state.userdetail[0].phone} class="form-control" placeholder=""/>
                                        </div>
                                        <label>Address:</label>
                                        <div class="form-group">
                                            <input type="text" ref='address' defaultValue={this.state.userdetail[0].address} class="form-control" placeholder=""/>
                                        </div>
                                        <label style={{color:'red'}}>{this.state.editprofileerror}</label>
                                        </div>
                                        } title='Edit Profile'>
                                            <button type='button' onClick={this.btnEditProfile} className='btn btnbiru'>Confirm</button>
                                        </Modal>
                                    </div>
                                    <div class="tab-pane fade" id="connectedServices" role="tabpanel" aria-labelledby="ConnectedServices-tab">
                                    <table class="table">
                                        <thead>
                                            <tr style={{color:'#1F5E99'}}>
                                            <th scope="col">No</th>
                                            <th scope="col">Event</th>
                                            <th scope="col">Total Ticket</th>
                                            <th scope="col">Total Price</th>
                                            <th scope="col">Transaction Date & Time</th>
                                            <th scope="col"></th>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
            <Footer/>
            
            <Alert idbutton="changesuccess" idmodal="changesuccessmodal" message="Changes Made Successfully"/>

            {/* CHANGE AVATAR MODAL */}
            <div class="modal fade" id="avatarModal" tabindex="-1" role="dialog" aria-labelledby="avatarModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Choose an Avatar</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className='row'>
                            <div className='col-2'>
                            <img src={API_URL+'/avatar/default.png'} className='chooseavatar' onClick={() => {this.changeavatar('default.png')}}/>
                            </div>
                            <div className='col-2'>
                            <img src={API_URL+'/avatar/tuyul.png'} value='tuyul.png' className='chooseavatar' onClick={() => {this.changeavatar('tuyul.png')}}/>
                            </div>
                            <div className='col-2'>
                            <img src={API_URL+'/avatar/man.png'} value='man.png' className='chooseavatar' onClick={() => {this.changeavatar('man.png')}}/>
                            </div>
                            <div className='col-2'>
                            <img src={API_URL+'/avatar/woman.png'} value='woman.png' className='chooseavatar' onClick={() => {this.changeavatar('woman.png')}}/>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id='confirmationmodaldismiss' class="btn btn-secondary" data-dismiss="modal" onClick={() => {this.changeavatar(this.state.userdetail[0].avatar)}}>Cancel</button>
                        <button type="button" class="btn btnbiru" onClick={this.editavatar} data-dismiss="modal">Save Changes</button>
                    </div>
                    </div>
                </div>
            </div>




        </div>);
    }
}
 
const mapStateProps = (state) =>{ // Function yang akan terima global state
    return{
      name: state.user.name, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
      id: state.user.id,
      email: state.user.email
    }
}
 
export default connect(mapStateProps)(profile);  