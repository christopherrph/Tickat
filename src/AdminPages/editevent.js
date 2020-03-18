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
import moment from 'moment'
import {Helmet} from "react-helmet";

class editevent extends Component {
    state = { 
       eventdetail:[{}],
       ticketlist:[],
       categorylist:[],
       addImageFileName : 'Select File',
       addImageFile: undefined,
       event_description: null,
       event_terms: null,
       selectedid: null 
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
      var id = window.location.pathname;
      id = id.replace('/editevent/', '')  
      console.log(id)
      Axios.get(API_URL + `/admin/getEventById/${id}`)
        .then((res) =>  {
            this.setState({
                eventdetail:res.data
            })
            console.log(this.state.eventdetail)
        })
        .catch((err) =>{
          console.log(err)
      })

      Axios.get(API_URL + `/admin/getTicketByEvent/${id}`)
        .then((res) =>  {
            this.setState({
              ticketlist:res.data
            })
            this.setState({
              ticketcount: this.state.ticketlist.length
            })
            console.log(this.state.ticketlist)
        })
        .catch((err) =>{
          console.log(err)
      })

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
                return this.state.ticketlist.map((val, index) =>{
                  if(index+1 <= this.state.ticketcount){
                      if(val.idticket == this.state.selectedid){
                        return(
                          <tr id={index}>
                              <td className='verticalalignmid'>{index+1}</td>
                              <td className='verticalalignmid'><input type='text' ref='editedticketname' defaultValue={val.ticket_name} style={{width:'150px'}}/></td>
                              <td className='verticalalignmid'><input type='number' ref='editedticketprice' defaultValue={val.ticket_price} style={{width:'90px'}}/></td>
                              <td className='verticalalignmid'><input type='number' ref='editedticketstock' defaultValue={val.ticket_stock} style={{width:'50px'}}/></td>
                              <td>
                                  <button class="btn btn-sm btnadmin" style={{marginLeft:'2%'}} onClick={this.canceledit} > Cancel </button>
                                  <button class="btn btn-sm btnadmin" style={{marginLeft:'2%'}} onClick={() => this.saveedit(index)} > Save </button>
                              </td>
                          </tr>
                        )
                      }else{
                        return(
                          <tr id={index}>
                              <td className='verticalalignmid'>{index+1}</td>
                              <td className='verticalalignmid'>{val.ticket_name}</td>
                              <td className='verticalalignmid'>{val.ticket_price}</td>
                              <td className='verticalalignmid'>{val.ticket_stock}</td>
                              <td>
                                  <button class="btn btn-sm btnadmin" style={{marginLeft:'2%'}} onClick={() => this.edit(val.idticket)} > Edit </button>
                              </td>
                          </tr>
                        )
                      }
                }
                else{
                    return(
                      <tr id={index}>
                          <td className='verticalalignmid'>{index+1}</td>
                          <td className='verticalalignmid'>{val.ticket_name}</td>
                          <td className='verticalalignmid'>{val.ticket_price}</td>
                          <td className='verticalalignmid'>{val.ticket_stock}</td>
                          <td>
                            <button onClick={() => this.deleteticketlist(index) } class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> Delete</button>
                          </td>
                      </tr>
                    )
                  }
                })
    }

    saveedit = (index) =>{
      var newticketname = this.refs.editedticketname.value;
      var newticketprice = this.refs.editedticketprice.value;
      var newticketstock = this.refs.editedticketstock.value;
      if(newticketname && newticketprice && newticketstock){
        this.state.ticketlist[index].ticket_name = newticketname;
        this.state.ticketlist[index].ticket_price = newticketprice;
        this.state.ticketlist[index].ticket_stock = newticketstock;
        this.setState({selectedid:null})
      }else{
        alert("Don't Leave Field Empty")
      }
      
    }

    edit = (id) => {
      this.setState({selectedid:id}) // Mengubah nilai selectedid dalam state
    }

    canceledit = () =>{
      this.setState({selectedid:null}) 
    }

    addTicketToList = () =>{
      let { ticketlist } = this.state;
      let ticket_name = this.refs.tickettype.value;
      let ticket_price = this.refs.ticketprice.value;
      let ticket_stock = this.refs.ticketstock.value;
      var ticket = {
        ticket_name,
        ticket_price,
        ticket_stock
      }
      if(ticket_name && ticket_price && ticket_stock){
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

    editEvent = () =>{
      let idevent = window.location.pathname;
      idevent = idevent.replace('/editevent/', '')  
      let idcategory = this.refs.eventcategory.value;
      let event_name = this.refs.eventname.value;
      let event_date = this.refs.eventdate.value;
      let event_location = this.refs.eventlocation.value;
      let { addImageFile } = this.state;
      if(this.state.event_description != null && this.state.event_terms != null && event_location && event_name && idcategory && event_date){
          let formData = new FormData();
          var obj = {}
          if(addImageFile != undefined){
            var obj = {
              event_name,
              event_location,
              event_description: this.state.event_description,
              event_terms: this.state.event_terms,
              idcategory,
              event_date
            }
          }else{
            var obj = {
              event_name,
              event_location,
              event_description: this.state.event_description,
              event_terms: this.state.event_terms,
              idcategory,
              event_date,
              event_pic: this.state.eventdetail[0].event_pic
            }
          }
          console.log(obj)
          formData.append('data', JSON.stringify(obj))  //obj diubah jadi string format json
          if(addImageFile != undefined){
            formData.append('image', addImageFile) // nambahin image ke formdata
          }
          console.log(formData)
          Axios.post(API_URL+`/admin/editEvent/${idevent}`, formData) // formdata berlaku seperti req.body
          .then((res) => {
            console.log(res.data)
            console.log(this.state.ticketlist)
              Axios.post(API_URL+`/admin/editEventTicket/${idevent}`,this.state.ticketlist)
                  .then((res) => {
                    alert('Event Succesfully Edited :D')
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
        alert("Please Don't Leave Field Empty")
      } 
    }

    

    render() { 
      const { redirect } = this.state;			//REDIRECT
     if (redirect) {
       return <Redirect to={`/eventdetail/${this.state.eventdetail[0].idevent}`}/>;
     }
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h5 className='pgtitle2'>EDIT EVENT</h5>
            <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <Link to={`/eventdetail/${this.state.eventdetail[0].idevent}`} ><button class="btnadmin" style={{width:'80px'}}> BACK </button></Link>
              </div>
            </div>
          </div>

        <div class="container">
        <div class="mt-4 mb-4 text-center">
          <h2 className='pgtitle2'>{this.state.eventdetail[0].event_name}</h2>
        </div>
        <center>
                <div class="col-md-8">
                        <div class="profile-img">
                        <img src={API_URL + this.state.eventdetail[0].event_pic} onClick={this.openimage} className='boxshadow'/>
                        </div>
        </div>
        </center>
      </div>



          <div className='container row mb-5'>
            <div className='col-6 border-right'>
            <h4 className='pgtitle2'>EVENT INFORMATION</h4>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Events Name:</label>
                    <input type="text" class="form-control" id="eventname" ref='eventname' defaultValue={this.state.eventdetail[0].event_name}/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Date: {moment(this.state.eventdetail[0].event_date).format('YYYY-MM-DD')}</label>
                    <input type="date" class="form-control" id="eventdate" ref='eventdate' defaultValue={moment(this.state.eventdetail[0].event_date).format('YYYY-MM-DD')}/>
                  </div>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Events Location:</label>
                    <input type="text" class="form-control" id="eventlocation" ref='eventlocation' defaultValue={this.state.eventdetail[0].event_location}/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Category:</label>
                    <select class="form-control" id="eventcategory" ref='eventcategory'>
                      <option selected value={this.state.eventdetail[0].idcategory}>{this.state.eventdetail[0].category_name}</option>
                      {this.renderCategoryList()}
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Events Description:</label>
                    <CKEditor
                    editor={ ClassicEditor }
                    data={this.state.eventdetail[0].event_description}
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
                    data={this.state.eventdetail[0].event_terms}
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
                    <label for="message-text" class="col-form-label">New Pic:</label>
                    <input type="file" id='image' class="form-control" placeholder="" onChange={this.onBtnAddImageFile} label={this.state.addImageFileName}/>
                    <br></br>
                    <img id="preview" src="" alt="" style={{marginLeft:'10%',height:200}}/>
                  </div>
            </div>

            <div className='col-6'>
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
          <center><button type="button" id='addtickettolist' onClick={() => { if (window.confirm('Are You Sure You Want To Edit This Event?')) this.editEvent()} } class="btn btnbiru mb-5 ">Submit</button></center>

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
 
export default connect(mapStateToProps)(editevent);