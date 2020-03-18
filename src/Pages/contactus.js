import React, { Component } from 'react'
import '../ContactUs.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import Footer from './footer';
import Header from './navbar';

class contactus extends Component {
    state = { 
        addImageFileName : 'Select File',
        addImageFile: undefined,
    }

    onBtnAddImageFile = (e) => {
        console.log(e.target.files[0])
        if(e.target.files[0]){
            this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })   // state addImageFileName diisi dengan nama file, addImageFile diisi dengan filenya
        }else{
            this.setState({ addImageFileName : 'Select Image', addImageFile : undefined })
        }
    }

    sendFeedback = () =>{
            let { addImageFile } = this.state;
            let name = this.refs.name.value;
            let email = this.refs.email.value;
            let phone = this.refs.phone.value;
            let message = this.refs.message.value;
            if(name && email && phone && message){
              let formData = new FormData();
              let status = 'Unread';
              var currentTime = new Date()
                var month = currentTime.getMonth() + 1  
                var day = currentTime.getDate()
                var year = currentTime.getFullYear()
                var dateposted = year + "-" + month + "-" + day
              let obj = {
                name: name,
                email: email,
                phone: phone,
                message: message,
                date: dateposted,
                statusfeedback: status
              }
              formData.append('data', JSON.stringify(obj))  //obj diubah jadi string format json
              if(addImageFile){
                formData.append('image', addImageFile) // nambahin image ke formdata
              }
              Axios.post(API_URL+'/public/postFeedback', formData) // formdata berlaku seperti req.body
              .then((res) => {
                console.log(res.data)
                document.getElementById("thankyoumodal").click()
                document.getElementById('name').value = ''
                document.getElementById('email').value = ''
                document.getElementById('phone').value = ''
                document.getElementById('message').value = ''
                document.getElementById('image').value = ''
              })
              .catch((err) => {
                alert('Failed')
                console.log(err)
              })
            }else{
                document.getElementById("filloutmodal").click()
            }
    }

    render() { 
        return (<div className='paddingatas'>
            <Header/>
<div class="container contact-form">
            <div class="contact-image">
            </div>
            <form method="post">
                <h3 style={{color:'#495057'}}>CONTACT US</h3>
                <div class="mapouter">
                    <div class="gmap_canvas"><iframe width="800" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=purwadhika%20startup&t=&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><a href="https://www.couponflat.com"></a>
                    </div>
                </div>
                <br/>
               <div class="row">
                    <div class="col-md-6">
                    <label> Name: </label>
                        <div class="form-group">
                            <input type="text" id='name' class="form-control" placeholder="Name" ref='name'/>
                        </div>
                        <label> Email: </label>
                        <div class="form-group">
                            <input type="email" id='email' class="form-control" placeholder="Email" ref='email' />
                        </div>
                        <label> Phone Number: </label>
                        <div class="form-group">
                            <input type="phonenum" id='phone' class="form-control" placeholder="Phone Number" ref='phone' />
                        </div>
                    </div>
                    <div class="col-md-6">
                    <label> Message: </label>
                        <div class="form-group">
                            <textarea ref='message' id='message' class="form-control" style={{height:215}} placeholder="Message..."></textarea>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <label> Image (Optional): </label>
                        <div class="form-group">
                            <input type="file" id='image' class="form-control" placeholder="" onChange={this.onBtnAddImageFile} label={this.state.addImageFileName}/>
                        </div>
                    </div>
                </div>
                <div class="form-group sbmt">
                    <input type="button" data-toggle="modal" data-target="#confirmationModal" name="btnSubmit" class="btnContact" value="Send Message" />
                </div>
            </form>
</div>

                {/* CONFIRMATION MODAL */}
                <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Send Message</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to submit?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id='confirmationmodaldismiss' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btnbiru" onClick={this.sendFeedback} data-dismiss="modal">Submit</button>
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
                <Footer/>
        </div>);
    }
}
 
export default contactus;