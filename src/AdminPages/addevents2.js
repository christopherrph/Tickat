import React, { Component } from 'react'
import '../AdminApp.css';
import '../AddEvents.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { API_URL } from '../support/API_URL';
import { Redirect } from 'react-router-dom'
import {Helmet} from "react-helmet";

class addevents2 extends Component {
    state = { 
       ticketlist:[],
       categorylist:[],
       addImageFileName : 'Select File',
       addImageFile: undefined,
       event_description: '',
       event_terms: ''
     }

     onBtnAddImageFile = (e) => {
      console.log(e.target.files[0])
      if(e.target.files[0]){
          this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })   // state addImageFileName diisi dengan nama file, addImageFile diisi dengan filenya
          var preview = document.getElementById('preview');
          preview.src = URL.createObjectURL(e.target.files[0]);
      }else{
          this.setState({ addImageFileName : 'Select Image', addImageFile : undefined })
      }
    }

     componentDidMount(){
      Axios.get(API_URL + '/admin/getAllCategory')
      .then((res) =>  {
          this.setState({
            categorylist:res.data
          })
          console.log(this.state.categorylist)
      })
      .catch((err) =>{
        console.log(err)
      })

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
       if(dd<10){
              dd='0'+dd
          } 
          if(mm<10){
              mm='0'+mm
          } 
      today = yyyy+'-'+mm+'-'+dd;
      document.getElementById("eventdate").setAttribute("min", today);
    }

    renderCategoryList = () =>{
                return this.state.categorylist.map((val, index) =>{
                  return(
                  <option value={val.idcategory}>{val.category_name}</option>
                  )
                })
    }

    renderTableTicket = () =>{
      if(this.state.ticketlist.length == 0){
        return(
          <tr>
              <td className='verticalalignmid text-center' colSpan='5'>NO TICKET ADDEDD</td>
          </tr>
      )
      }else{
                return this.state.ticketlist.map((val, index) =>{
                  return(
                    <tr id={index}>
                        <td className='verticalalignmid'>{index+1}</td>
                        <td className='verticalalignmid'>{val.ticket_type}</td>
                        <td className='verticalalignmid'>{val.ticket_price}</td>
                        <td className='verticalalignmid'>{val.ticket_stock}</td>
                        <td>
                          <button onClick={() => this.deleteticketlist(index) } class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> Delete</button>
                        </td>
                    </tr>
                  )
                })
      }
    }

    makeid = (length) => {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }


    addEvent = () =>{
      let idpartner = window.location.pathname;
      idpartner = idpartner.replace('/addevents2/', '')  
      let idcategory = this.refs.eventcategory.value;
      let event_name = this.refs.eventname.value;
      let event_date = this.refs.eventdate.value;
      let event_location = this.refs.eventlocation.value;
      let { addImageFile } = this.state;
      var currentTime = new Date()
      var month = currentTime.getMonth() + 1  
      var day = currentTime.getDate()
      var year = currentTime.getFullYear()
      var dateposted = year + "-" + month + "-" + day
      let idevent = `EVT${day}${month}${this.makeid(8)}`;
      let event_status = 'Active'
      if(this.state.event_description && this.state.event_terms && event_location && event_name && idcategory && event_date && addImageFile != undefined){
        if(this.state.ticketlist.length > 0){
        let formData = new FormData();
        var obj = {}
          var obj = {
            idevent,
            idpartner,
            idcategory,
            event_name,
            event_date,
            event_location,
            event_description: this.state.event_description,
            event_terms: this.state.event_terms,
            idadmin: this.props.idadmin,
            dateposted,
            event_status
          }
          console.log(obj)
          formData.append('data', JSON.stringify(obj))  //obj diubah jadi string format json
          formData.append('image', addImageFile) // nambahin image ke formdata
          console.log(formData)
          Axios.post(API_URL+'/admin/addEvent', formData) // formdata berlaku seperti req.body
          .then((res) => {
                Axios.post(API_URL+`/admin/addTicket/${idevent}`,this.state.ticketlist)
                .then((res) => {
                  this.setState({ redirect: true })
                })
                .catch((err) => {
                  alert('Failed')
                  console.log(err)
                })
          })
          .catch((err) => {
            alert('Failed')
            console.log(err)
          })

        }else{
        alert("Please Add Ticket")
        }
      }else{
        alert("Please Don't Leave Field Empty")
      } 
    }

    addTicketToList = () =>{
      let { ticketlist } = this.state;
      let ticket_type = this.refs.tickettype.value;
      let ticket_price = this.refs.ticketprice.value;
      let ticket_stock = this.refs.ticketstock.value;
      var ticket = {
        ticket_type,
        ticket_price,
        ticket_stock
      }
      if(ticket_type && ticket_price && ticket_stock){
        ticketlist.push(ticket)
        this.setState({
          ticketlist: ticketlist
      })
        console.log(this.state.ticketlist)
        document.getElementById('tickettype').value = ''
        document.getElementById('ticketprice').value = ''
        document.getElementById('ticketstock').value = ''
      }else{
        alert('Please Fill In Field')
      }
    }

    deleteticketlist = (index) =>{
      let { ticketlist } = this.state;
      ticketlist.splice(index,1)
      this.setState({
        ticketlist: ticketlist
      })
    }

    

    render() { 
      const { redirect } = this.state;			//REDIRECT
     if (redirect) {
       return <Redirect to='/addevents3'/>;
     }

        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h5 className='pgtitle2'>ADD EVENT</h5>
            <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
                <Link to='/addevents'><button class="btnadmin" style={{width:'80px'}}> BACK </button></Link>
              </div>
            </div>
          </div>

        <div class="container">
        <div class="mt-4 mb-4 text-center">
          <h2 className='pgtitle2'>EVENT DETAIL FORM</h2>
        </div>
        <ul class="step d-flex flex-nowrap mb-5">
        <li class="step-item">
          <a class=""><i class="fas fa-store-alt"></i></a>
        </li>
        <li class="step-item active">
          <a class=""><i class="fas fa-pencil-alt"></i></a>
        </li>
        {/* <li class="step-item">
          <a class=""><i class="fas fa-clipboard-list" style={{color:'grey'}}></i></a>
        </li> */}
        <li class="step-item">
          <a class=""><i class="fas fa-check" style={{color:'grey'}}></i></a>
        </li>
      </ul> 
      </div>



          <div className='container row mb-5'>
            <div className='col-7 border-right'>
            <h4 className='pgtitle2'>EVENT INFORMATION</h4>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Events Name:</label>
                    <input type="text" class="form-control" id="eventname" ref='eventname'/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Date:</label>
                    <input type="date" class="form-control" id="eventdate" ref='eventdate' />
                  </div>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Events Location:</label>
                    <input type="text" class="form-control" id="eventlocation" ref='eventlocation'/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Category:</label>
                    <select class="form-control" id="eventcategory" ref='eventcategory'>
                      <option selected disabled>Select Category</option>
                      {this.renderCategoryList()}
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Description:</label>
                    <CKEditor
                    editor={ ClassicEditor }
                    data="<p></p>"
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.setState({
                          event_description: data
                        })
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                  />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Terms & Condition:</label>
                    <CKEditor
                    editor={ ClassicEditor }
                    data="<p></p>"
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.setState({
                          event_terms: data
                        })
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                  />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Event Pic:</label>
                    <input type="file" id='image' class="form-control" placeholder="" onChange={this.onBtnAddImageFile} label={this.state.addImageFileName}/>
                    <br></br>
                    <img id="preview" src="" alt="" style={{marginLeft:'10%',height:200}}/>
                  </div>
            </div>

            <div className='col-5'>
            <h4 className='pgtitle2'>TICKET DETAIL</h4>

            <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Ticket Type</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableTicket()}
              </tbody>
            </table>
          </div>


                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Ticket Type:</label>
                    <input type="text" class="form-control" id="tickettype" ref='tickettype'/>
                  </div>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Ticket Price (IDR):</label>
                    <input type="number" class="form-control removenumarrow" id="ticketprice" ref='ticketprice'/>
                  </div>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Ticket Stock:</label>
                    <input type="number" class="form-control removenumarrow" id="ticketstock" ref='ticketstock'/>
                  </div>
                  <center><button type="button" id='addtickettolist' onClick={this.addTicketToList} class="btn btnbiru ">Add Ticket</button></center>
            </div>
          </div>
          <center><button type="button" id='addtickettolist' onClick={() => { if (window.confirm('Are You Sure You Want To Add This Event?')) this.addEvent()} } class="btn btnbiru mb-5 ">Submit</button></center>

        </main>
      </div>
    </div>

        </div>  );
    }
}

const mapStateToProps = (state) =>{ // Function yang akan terima global state
  return{
    idadmin: state.admin.id,
    username: state.admin.username, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
    role: state.admin.role
  }
}
 
export default connect(mapStateToProps)(addevents2);