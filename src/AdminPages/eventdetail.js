import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class partnerdetail extends Component {
    state = { 
        listticket:[{}],
        eventdetail:[{}],
        addImageFileName : 'Select File',
        addImageFile: undefined,
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
      id = id.replace('/eventdetail/', '')  
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
              listticket:res.data
          })
      })
      .catch((err) =>{
        console.log(err)
      })
      }

      renderlistticket = () =>{
        return this.state.listticket.map((val, index) =>{
            return(
              <tr id={index}>
                  <td className='verticalalignmid'>{index+1}</td>
                  <td className='verticalalignmid'>{val.ticket_name}</td>
                  <td className='verticalalignmid'>{val.ticket_price}</td>
                  <td className='verticalalignmid'>{val.ticket_stock}</td>
              </tr>
            )
          })
      }

      deactivateevent = (id) =>{
          var pilihan = prompt("Please Type 'I WANT TO DEACTIVATE THIS EVENT' 😟")
          if(pilihan == 'I WANT TO DEACTIVATE THIS EVENT'){
            Axios.patch(API_URL + `/admin/deactivateevent/${id}`)
            .then((res) =>  {
              console.log(res.data);
              alert('Event Deactivated');
              this.setState({ redirect: true })
            })
            .catch((err) =>{
                alert('error')
                console.log(err)
            })
          }
      }

      openimage = () =>{
        window.open(API_URL + this.state.eventdetail[0].event_pic);
      }

    render() { 
    const { redirect } = this.state;			//REDIRECT
    if (redirect) {
        return <Redirect to='/manageevent'/>;
    }
        return ( <div>
        <Navbar/>
        <div class="container emp-profile" style={{marginTop:-10}}>
            <form method="post">
                <center>
                <div class="col-md-8">
                        <div class="profile-img">
                        <img src={API_URL + this.state.eventdetail[0].event_pic} onClick={this.openimage} className='boxshadow'/>
                        </div>
                </div></center>

                <div class="row">
                    <div class="col-md-7" style={{marginLeft:'20%'}}>
                        <div class="profile-head">
                                    <h5>
                                      {this.state.eventdetail[0].event_name}
                                    </h5>
                                    <h6>
                                        Date Posted: {moment(this.state.eventdetail[0].dateposted).format('D MMMM YYYY')}
                                    </h6>
                                    <p class="proile-rating">ADDED BY: <span>{this.state.eventdetail[0].username}</span></p>
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Events Info</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Description</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile2-tab" data-toggle="tab" href="#profile2" role="tab" aria-controls="profile2" aria-selected="false">Terms & Condition</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile3-tab" data-toggle="tab" href="#profile3" role="tab" aria-controls="profile3" aria-selected="false">Tickets</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <Link to={`/editevent/${this.state.eventdetail[0].idevent}`}><button class="btnadmin" type='button' data-toggle="modal" data-target="#editPartnerModal" style={{width:'90px', marginBottom:'5%'}}> Edit </button></Link>
                        <button class="btnadmin" type='button' style={{width:'90px', marginBottom:'5%'}} onClick={() => { if (window.confirm('Are You Sure You Want To Deactivate This Event?')) this.deactivateevent(this.state.eventdetail[0].idevent)} }> Deactivate </button>
                        <Link to='/manageevent'><button class="btnadmin" style={{width:'90px'}}> Back </button></Link>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-8" style={{marginLeft:'25%'}}>
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Events ID</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.eventdetail[0].idevent}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Events Name</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.eventdetail[0].event_name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Events Date</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{moment(this.state.eventdetail[0].event_date).format('D MMMM YYYY')}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Events Category</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.eventdetail[0].category_name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Location</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.eventdetail[0].event_location}</p>
                                            </div>
                                        </div>
                            </div>

                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div id='description' className='eventdescription' dangerouslySetInnerHTML={{ __html: `${this.state.eventdetail[0].event_description}`}}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="profile2" role="tabpanel" aria-labelledby="profile2-tab">
                                <div class="row">
                                    <div class="col-md-12"><br/>
                                        <div id='terms' dangerouslySetInnerHTML={{ __html: `${this.state.eventdetail[0].event_terms}`}}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="profile3" role="tabpanel" aria-labelledby="profile3-tab">
                                <div class="row">
                                    <div class="col-md-12" style={{marginLeft:'-7%'}}><br/>
                                    <table class="table table-striped table-sm" style={{width:'90%'}}>
                                        <thead>
                                            <tr>
                                            <th>No</th>
                                            <th>Ticket Type</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderlistticket()}
                                        </tbody>
                                    </table>
                                    <center><Link to={`/ticketsales/${this.state.eventdetail[0].idevent}`}><button class="btnadmin mr-5" type='button' style={{width: 600}}> View Ticket Sales </button></Link></center>
                                    </div>
                                </div>
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