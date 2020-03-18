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
        listevent:[],
        partnerdetail:[{}],
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
      id = id.replace('/partnerdetail/', '')  
      console.log(id)
        Axios.get(API_URL + `/admin/getPartnerById/${id}`)
        .then((res) =>  {
            this.setState({
              partnerdetail:res.data
            })
            console.log(this.state.partnerdetail)
        })
        .catch((err) =>{
          console.log(err)
        })

        Axios.get(API_URL + `/admin/getEventByPartner/${id}`)
        .then((res) =>  {
            this.setState({
                listevent:res.data
            })
            console.log(this.state.listevent)
        })
        .catch((err) =>{
          console.log(err)
        })


      }

    editPartner = (id) =>{
        let { addImageFile } = this.state;
        let partnername = this.refs.newpartnername.value;
        let email = this.refs.newemail.value;
        let address = this.refs.newaddress.value;
        let cp = this.refs.newcp.value;
        let cpphone = this.refs.newcpphone.value;
        if(partnername && email && address && cp && cpphone){
          let formData = new FormData();
          var obj = {}
          if(addImageFile != undefined){
            var obj = {
              email:email,
              partner_name: partnername,
              address: address,
              cp_name: cp,
              phonenum: cpphone
            }
          }else{
            var obj = {
              email:email,
              partner_name: partnername,
              address: address,
              cp_name: cp,
              phonenum: cpphone,
              partner_pic: this.state.partnerdetail[0].partner_pic
            }
          }
          console.log(obj)
          formData.append('data', JSON.stringify(obj))  //obj diubah jadi string format json
          if(addImageFile != undefined){
            formData.append('image', addImageFile) // nambahin image ke formdata
          }
          console.log(formData)
          Axios.post(API_URL+`/admin/editPartner/${id}`, formData) // formdata berlaku seperti req.body
          .then((res) => {
            console.log(res.data)
            alert('Partner Succesfully Edited :D')
            window.location.reload();
          })
          .catch((err) => {
            alert('Failed')
            console.log(err)
          })
        }else{
            alert("Please Don't Leave Field Empty")
        }
    }

    cutsentence = (kalimat) =>{
        var sentence = kalimat.split('')
        console.log(sentence)
        var hasil = '';
        if(sentence.length <= 26){
            return kalimat
        }else{
            for(var i=0; i<21; i++){
                hasil += sentence[i] + '';
            }
            return `${hasil}...`
        }
    }

    cutsentence2 = (kalimat) =>{
        var sentence = kalimat.split('')
        console.log(sentence)
        var hasil = '';
        if(sentence.length <= 95){
            return kalimat
        }else{
            for(var i=0; i<95; i++){
                hasil += sentence[i] + '';
            }
            return `${hasil}...`
        }
    }

    renderevent = () =>{
        return this.state.listevent.map((val, index) =>{
          return(
            <tr>
            <th scope="row">{index+1}</th>
            <td>{val.event_name}</td>
            <td>{moment(val.event_date).format('D MMMM YYYY')}</td>
            <td><Link to={{
               pathname: `/eventdetail/${val.idevent}`,
               propsnya:{
                   from:'partner-detail'
               }
                }}><a href="#" class="btn btnbiru mb-3">View</a></Link></td>
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
                        <img src={API_URL + this.state.partnerdetail[0].partner_pic} className='boxshadow'/>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="profile-head">
                                    <h5>
                                      {this.state.partnerdetail[0].partner_name}
                                    </h5>
                                    <h6>
                                      Join Date: {moment(this.state.partnerdetail[0].join_date).format('D MMMM YYYY')}
                                    </h6>
                                    <p class="proile-rating">ADDED BY: <span>{this.state.partnerdetail[0].username}</span></p>
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Events</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btnadmin" type='button' data-toggle="modal" data-target="#editPartnerModal" style={{width:'90px', marginBottom:'5%'}}> Edit </button>
                        <Link to='/managepartner'><button class="btnadmin" style={{width:'90px'}}> Back </button></Link>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-work">
                        <p style={{fontSize:15}} className='border-bottom'>Events</p>
                            <a>Number of Events: {this.state.listevent.length} </a><br/>
                            {/* <a>Total Tickets Bought: {this.sum(this.state.transactionlist,'totalticket')} </a><br/>
                            <a>Total Money Spent: <NumberFormat value={this.sum(this.state.transactionlist,'totalprice')}  displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></a><br/> */}
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div class="row" style={{marginTop:-40}}>
                                            <div class="col-md-3">
                                                <label>User Id</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.partnerdetail[0].idpartner}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Partner Name</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.partnerdetail[0].partner_name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Email</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.partnerdetail[0].email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Address</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.partnerdetail[0].address}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Contact Person</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.partnerdetail[0].cp_name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Phone Number</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{this.state.partnerdetail[0].phonenum}</p>
                                            </div>
                                        </div>
                            </div>

                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <table class="table table-striped" style={{marginTop:-40}}>
                            <thead>
                                <tr>
                                <th scope="col">No.</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderevent()}
                            </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>           
        </div>


{/* MODAL EDIT PARTNER */}
<div class="modal fade" id="editPartnerModal" tabindex="-1" role="dialog" aria-labelledby="editPartnerModal" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
            <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit Partner</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            <div class="profile-img" style={{paddingLeft:'38%'}}><img src={API_URL + this.state.partnerdetail[0].partner_pic} className='boxshadow'/></div>
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Partner Name:</label>
                    <input type="text" class="form-control" id="partnername" ref='newpartnername' defaultValue={this.state.partnerdetail[0].partner_name}/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Email:</label>
                    <input type="text" class="form-control" id="email" ref='newemail' defaultValue={this.state.partnerdetail[0].email} />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Address:</label>
                    <input type="pastextsword" class="form-control" id="address" ref='newaddress'  defaultValue={this.state.partnerdetail[0].address} />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Contact Person:</label>
                    <input type="text" class="form-control" id="cp" ref='newcp'  defaultValue={this.state.partnerdetail[0].cp_name} />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Contact Person Phone:</label>
                    <input type="number" class="form-control" id="cpphone" ref='newcpphone'  defaultValue={this.state.partnerdetail[0].phonenum} />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">New Partner Pic / Logo (Optional):</label>
                    <input type="file" id='image' class="form-control" placeholder="" onChange={this.onBtnAddImageFile} label={this.state.addImageFileName}/>
                    <br></br>
                    <img id="preview" src="" alt="" style={{paddingLeft:'38%', height:200}}/>
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='addadmincancel' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btnbiru" onClick={() => { if (window.confirm('Are You Sure You Want To Edit?')) this.editPartner(this.state.partnerdetail[0].idpartner)} }>Submit</button>
            </div>
          </div>
                </div>
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