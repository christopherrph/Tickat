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

class login extends Component {

  state={
    message: ''
  }

  login = () =>{
    var email = this.refs.email.value
    var password = this.refs.password.value
    if(email && password){
      Axios.post(API_URL + '/public/login',{
        email: email,
        password: password
      })
      .then((res) => {
        console.log(res.data);
        console.log(res.data.iduser);
        this.props.signin(res.data.iduser, res.data.token)
        this.setState({ redirect: true })
      })
      .catch((err) => {
        this.setState({ message: 'Wrong Email or Password' })
        console.log(err)
      })
    }else{
      this.setState({ message: "Don't Leave Field Empty" })
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
    <div class="row">
    <div className='col-6'>
    <img src={require('../img/undraw_Login_v483.png')} style={{width:400, paddingTop:'8%'}}/>
    </div>
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center pgtitle">LOG IN</h5>
            <div class="form-signin">
              <div class="form-label-group">
              <label>Email:</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email Address" ref='email' autofocus/>
              </div>
              <div class="form-label-group">
              <label>Password:</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" ref='password'/>
              </div>

              <center><label style={{color:'black'}}>{this.state.message}</label></center>

              <button class="btn btn-lg btnbiru btn-block text-uppercase" onClick={this.login} type="submit">Sign in</button>
              <hr class="my-4"/>
              <Link to='/forgotpassword' className='removedecoration'><button class="btn btn-lg btn-block text-uppercase forgotbutton" type="submit"><i class="fas fa-lock"></i> Forgot Password?</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
</div>
          );
    }
}
 
export default connect(null,{signin})(login);