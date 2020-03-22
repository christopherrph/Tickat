import React, { Component } from 'react'
import '../App.css';
import { Link } from 'react-router-dom'
import Axios from 'axios';
import { API_URL } from '../support/API_URL';
import {signin} from '../Redux/Action'
import {connect} from 'react-redux' // Harus ada untuk akses global state
import { Redirect } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';
import Confirmation from '../Modal/confirmation';

class login extends Component {

  state={
    message: '',
    isLoading: false
  }

  async ResetPassword(){
    this.setState({message:''})
    this.setState({isLoading: true})
    var email = this.refs.email.value
    if(email){
    const res = await Axios.get(API_URL + `/public/checkemail/${email}`)
    if(res.data.length != 0){
      Axios.patch(API_URL+`/public/forgotpassword/${email}`) // formdata berlaku seperti req.body
              .then((res) => {
                this.setState({message:'New password has been sent to your email'})
                this.setState({isLoading: false})
              })
              .catch((err) => {
                alert('Failed')
                this.setState({isLoading: false})
                console.log(err)
              })
    }else{
      this.setState({message:'Email not found'})
      this.setState({isLoading: false})
    }}
    else{
      this.setState({message:'Please insert email'})
      this.setState({isLoading: false})
    }
  }

    render() { 
      const { redirect } = this.state;
      if (redirect) {
        return <Redirect to='/userhome'/>;
      }
      return (
<div className='paddingatas'>
<Header/>
<div class="container">
    <div class="row mt-5 mb-5">
    <div className='col-6'>
    <img src={require('../img/undraw_forgot_password_gi2d.png')} style={{width:400, paddingTop:'8%'}}/>
    </div>
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center pgtitle">FORGOT PASSWORD</h5>
            <div class="form-signin">
              <div class="form-label-group">
              <label>Email:</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email Address" ref='email' autofocus/>
              </div>
              <center>
              {
                this.state.isLoading == true
                ?
                <div class="spinner-border mb-2" role="status">
                <span class="sr-only">Loading...</span>
                </div>
                :
                null
              }
                <label style={{color:'black'}}>{this.state.message}</label>
              </center>
              <button class="btn btn-lg btnbiru btn-block text-uppercase" data-toggle="modal" data-target="#forogtpassconfirm">Reset Password</button>
              <hr class="my-4"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Confirmation idmodal="forogtpassconfirm" message="Are You Sure You Want To Reset Your Password?" title='Reset Password'>
                <button type='button' data-dismiss="modal" className='btn btnbiru' onClick={() => this.ResetPassword()}>Confirm</button>
  </Confirmation>
  <Footer/>
</div>
          );
    }
}
 
export default connect(null,{signin})(login);