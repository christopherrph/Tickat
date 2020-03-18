import React, { Component } from 'react'
import '../Register.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import { Redirect } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';

class register extends Component {
    state = {  
        type:'text',
        choosengender: '',
        redirect: false
    }

    changetype = () =>{
        if(this.state.type == 'text'){
            this.setState({
                type:'date'
              });
        }else{
            this.setState({
                type:'text'
              });
        }
    }

    register = () =>{
        let name = this.refs.name.value;
        let email = this.refs.email.value;
        let password = this.refs.password.value;
        let repassword = this.refs.repassword.value;
        let phone = this.refs.phone.value;
        let birthdate = this.refs.birthdate.value;
        let address = this.refs.address.value;
        let gender = this.state.choosengender;
        var currentTime = new Date()
        var month = currentTime.getMonth() + 1  
        var day = currentTime.getDate()
        var year = currentTime.getFullYear()
        var joindate = year + "-" + month + "-" + day
        if(name && email && phone && password && repassword && phone && birthdate && address && gender){
            if(password == repassword){
                Axios.get(API_URL+`/public/checkemail/${email}`)
                .then((res) => {
                    document.getElementById("emailtaken").click()
                    })
                .catch((err) => {
                        Axios.post(API_URL+'/public/register',{
                            name: name,
                            email: email,
                            password: password,
                            birthdate: birthdate,
                            gender: gender,
                            address: address,
                            phone: phone,
                            joindate: joindate,
                            avatar: 'default.png',
                            status: 'Active'
                        })
                        .then((res) => {
                        console.log(res.data);
                        document.getElementById("thankyoumodal").click();
                        })
                        .catch((err) => {
                            alert('Failed')
                            console.log(err)
                        })
                    })
            }else{
            document.getElementById("passwordnotmatch").click()
            }
        }else{
            document.getElementById("filloutmodal").click()
        }
}


    render() { 
        const { redirect } = this.state;
        if (redirect == true) {
          return <Redirect to='/login'/>;
        }

        return ( 
            <div className='paddingatas'>
            <Header/>
            <div class="container register">
                <div class="row">
                    <div class="col-md-3 register-left">
                        <img src={require('../img/ticketwhite.png')} alt=""/>
                        <h3>Welcome</h3>
                        <p>Already have an account? <Link to='/login' className='link'><u>Click Here!</u></Link></p>
                    </div>
                    <div class="col-md-9 register-right">
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <h3 class="register-heading pgtitle">REGISTER</h3>
                                <div class="row register-form">
                                    <div class="col-md-9" style={{marginLeft:100}}>
                                        <div class="form-group">
                                        <label>Full Name:</label>
                                            <input type="text" class="form-control" placeholder="Full Name" ref='name'  />
                                        </div>
                                        <div class="form-group">
                                        <label>Email:</label>
                                            <input type="email" class="form-control" placeholder="Email" ref='email'  />
                                        </div>
                                        <div class="form-group">
                                        <label>Password:</label>
                                            <input type="password" class="form-control" placeholder="Password" ref='password'  />
                                        </div>
                                        <div class="form-group">
                                        <label>Re-Type Password:</label>
                                            <input type="password" class="form-control"  placeholder="Confirm Password" ref='repassword'  />
                                        </div>
                                        <div class="form-group">
                                        <label>Gender:</label><br/>
                                        <div class="form-check form-check-inline">
                                        <input class="form-check-input" onClick={() => this.setState({choosengender:'Male'})} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male"/>
                                        <label class="form-check-label" for="inlineRadio1">Male</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                        <input class="form-check-input" onClick={() => this.setState({choosengender:'Female'})} type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female"/>
                                        <label class="form-check-label" for="inlineRadio2">Female</label>
                                        </div>
                                        </div>
                                        <div class="form-group">
                                        <label>Birthdate:</label>
                                            <input type="date" class="form-control" type={this.state.type}  onFocus={this.changetype} onBlur={this.changetype} placeholder="Birthdate" ref='birthdate'  />
                                        </div>
                                        <div class="form-group">
                                            <label>Address:</label>
                                            <input type="text" class="form-control" placeholder="Address" ref='address'  />
                                        </div>
                                        <div class="form-group">
                                            <label>Phone Number:</label>
                                            <input type="number" class="form-control" placeholder="Phone Number" ref='phone'  />
                                        </div>
                                        <input type="button" data-toggle="modal" data-target="#confirmationModal" name="btnSubmit" class="btnRegister" value="SUBMIT" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>








            <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Register</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to register your account?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id='confirmationmodaldismiss' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btnbiru" onClick={this.register} data-dismiss="modal">Submit</button>
                    </div>
                    </div>
                </div>
            </div>

            <button  style={{display:'none'}} type="button" class="btn" data-toggle="modal" data-target="#foutmodal" id='filloutmodal'>
                </button>
                <div class="modal fade" id="foutmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-body">
                        <p>Please Fill Out Form</p>
                    </div>
                    </div>
                </div>
            </div>


            <button  style={{display:'none'}} type="button" class="btn" data-toggle="modal" data-target="#passwordmodal" id='passwordnotmatch'>
                </button>
                <div class="modal fade" id="passwordmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-body">
                        <p>Password did not match</p>
                    </div>
                    </div>
                </div>
            </div>

            <button  style={{display:'none'}} type="button" class="btn" data-toggle="modal" data-target="#exampleModal" id='thankyoumodal'>
                </button>
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-body">
                        <img src='http://clipartmag.com/images/animated-thank-you-45.gif'/>
                    </div>
                    </div>
                </div>
            </div>

            <button  style={{display:'none'}} type="button" class="btn" data-toggle="modal" data-target="#emailtakenmodal" id='emailtaken'>
                </button>
                <div class="modal fade" id="emailtakenmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-body">
                        <p>Email already taken</p>
                    </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div> 
         );
    }
}
 
export default register;