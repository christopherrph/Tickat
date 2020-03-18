import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import {signinadmin} from '../Redux/Action'
import { Redirect } from 'react-router-dom'

class adminlogin extends Component {
    state = {  }

    login = () =>{
        var username = this.refs.username.value
        var password = this.refs.password.value
        if(username && password){
            Axios.post(API_URL + '/admin/login',{
                username: username,
                password: password
              })
              .then((res) => {
                console.log(res.data);
                localStorage.setItem('admintoken',res.data.token)
                this.props.signinadmin(res.data.idadmin, res.data.token)
                alert("Welcome")
                this.setState({ redirect: true })
              })
              .catch((err) => {
                alert('Wrong Username or Password')
                console.log(err)
              })
        }else{
            alert("Don't Leave Field Empty")
        }
    }

    render() { 
        const { redirect } = this.state;
      if (redirect) {
        return <Redirect to='/adminhome'/>;
      }

        return ( <div>
        <div class="col-sm-9 col-md-7 col-lg-4 mx-auto">
            <div class="card card-signin my-5">
                <div class="card-body">
                    <h5 class="card-title text-center pgtitle">ADMIN LOGIN</h5>
                    <center><img src={require('../img/LogoSS.PNG')} style={{height:50}}/></center>
                    <div class="form-signin">
                    <div class="form-label-group">
                    <label>Username:</label>
                        <input type="email" id="inputEmail" class="form-control" ref='username' placeholder="Username" required autofocus/>
                    </div>
                    <div class="form-label-group">
                    <label>Password:</label>
                        <input type="password" id="inputPassword" class="form-control" ref='password' placeholder="Password" required/>
                    </div>
                    <button class="btn btn-lg btnbiru btn-block text-uppercase" onClick={this.login} type="submit">Sign in</button>
                    <hr class="my-4"/>
                    </div>
                </div>
            </div>
        </div>

        </div>  );
    }
}
export default connect(null,{signinadmin})(adminlogin);