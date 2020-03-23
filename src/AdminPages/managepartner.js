import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class managepartner extends Component {
    state = { 
        listpartner:[],
        addImageFileName : 'Select File',
        addImageFile: undefined,
        pagination: 0,
        sortName: true,
        sortEmail: true,
        sortAddedBy: true,
        sortJoinDate: true
     }

     searchpartner = () =>{
      var searchpartner = this.refs.searchpartner.value;
      if(searchpartner == ''){
        this.componentDidMount()
      }else{
        Axios.get(API_URL + `/admin/getAllPartnerLike/${searchpartner}`)
        .then((res) =>  {
            this.setState({
              listpartner:res.data
            })
        })
        .catch((err) =>{
          console.log('Not Found')
        })
      }
      this.renderPagination()
      this.setState({pagination:0})
    }

    renderPagination = () =>{
      var length = this.state.listpartner.length
      var halaman = Math.ceil(length/5)
      var arr = []
      for(var i=0;i<halaman;i++){
        arr.push(i)
      }
      return arr.map((val, index) =>{
        if(val == this.state.pagination){
          return(
            <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1">{val+1}</a>
            </li>
          )
        }else{
          return(
          <li class="page-item"><a class="page-link" style={{color:'#1F5E99'}} onClick={() => this.setState({pagination: val})} >{val+1}</a></li>
          )
        }
    })
}

    deactivatepartner = (id) =>{
      Axios.patch(API_URL + `/admin/deactivatepartner/${id}`)
        .then((res) =>  {
          console.log(res.data);
          this.componentDidMount()
          alert('Account Deactivated')
        })
        .catch((err) =>{
          console.log(err)
        })
    }

     onBtnAddImageFile = (e) => {
      console.log(e.target.files[0])
      if(e.target.files[0]){
          this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })   // state addImageFileName diisi dengan nama file, addImageFile diisi dengan filenya
      }else{
          this.setState({ addImageFileName : 'Select Image', addImageFile : undefined })
      }
    }

    componentDidMount(){
        Axios.get(API_URL + '/admin/getAllPartner')
        .then((res) =>  {
            this.setState({
              listpartner:res.data
            })
        })
        .catch((err) =>{
          console.log(err)
        })
    }

    renderpartnerlist = () =>{
      var x = this.state.listpartner.slice(0+(this.state.pagination*5),5+(this.state.pagination*5))
        return x.map((val, index) =>{
            return(
                <tr class='clickable-row' data-href='url://'>
                    <td className='verticalalignmid'>{index+1+(this.state.pagination*5)}</td>
                    <td className='verticalalignmid'><img src={API_URL + val.partner_pic} style={{height:70}}/></td>
                    <td className='verticalalignmid'>{val.partner_name}</td>
                    <td className='verticalalignmid'>{val.email}</td>
                    <td className='verticalalignmid'>{val.username}</td>
                    <td className='verticalalignmid'>{moment(val.join_date).format('DD-MM-YYYY')}</td>
                    <td className='verticalalignmid'><Link to={`/partnerdetail/${val.idpartner}`} ><button class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> View Detail</button></Link> <button onClick={() => { if(window.confirm('Are You Sure You Want To Deactivate This Partner?')) this.deactivatepartner(val.idpartner) } } class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> Deactivate</button></td>
                </tr>
            )
        })
    }

    sortbyName = () =>{
      if(this.state.sortName){
        var x = this.state.listpartner.sort((a,b) => (a.partner_name > b.partner_name) ? 1 : ((b.partner_name > a.partner_name) ? -1 : 0)); 
      }else{
        var x = this.state.listpartner.sort((a,b) => (a.partner_name < b.partner_name) ? 1 : ((b.partner_name < a.partner_name) ? -1 : 0)); 
      }
      console.log(x)
      this.setState({ sortName: !this.state.sortName, listpartner: x})
    }

    sortbyEmail = () =>{
      if(this.state.sortEmail){
        var x = this.state.listpartner.sort((a,b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0)); 
      }else{
        var x = this.state.listpartner.sort((a,b) => (a.email < b.email) ? 1 : ((b.email < a.email) ? -1 : 0)); 
      }
      console.log(x)
      this.setState({ sortEmail: !this.state.sortEmail, listpartner: x})
    }

    sortbyAddedBy = () =>{
      if(this.state.sortAddedBy){
        var x = this.state.listpartner.sort((a,b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0)); 
      }else{
        var x = this.state.listpartner.sort((a,b) => (a.username < b.username) ? 1 : ((b.username < a.username) ? -1 : 0)); 
      }
      console.log(x)
      this.setState({ sortAddedBy: !this.state.sortAddedBy, listpartner: x})
    }

    sortbyJoinDate = () =>{
      if(this.state.sortJoinDate){
        var x = this.state.listpartner.sort((a,b) => (a.join_date > b.join_date) ? 1 : ((b.join_date > a.join_date) ? -1 : 0)); 
      }else{
        var x = this.state.listpartner.sort((a,b) => (a.join_date < b.join_date) ? 1 : ((b.join_date < a.join_date) ? -1 : 0)); 
      }
      console.log(x)
      this.setState({ sortJoinDate: !this.state.sortJoinDate, listpartner: x})
    }

    addPartner = () =>{
      let { addImageFile } = this.state;
      let partnername = this.refs.partnername.value;
      let email = this.refs.email.value;
      let address = this.refs.address.value;
      let cp = this.refs.cp.value;
      let cpphone = this.refs.cpphone.value;
      var currentTime = new Date()
      var month = currentTime.getMonth() + 1  
      var day = currentTime.getDate()
      var year = currentTime.getFullYear()
      var join_date = year + "-" + month + "-" + day
      if(partnername && email && address && cp && cpphone){
        let formData = new FormData();
        var obj = {}
        if(addImageFile != undefined){
          var obj = {
            email:email,
            partner_name: partnername,
            address: address,
            cp_name: cp,
            phonenum: cpphone,
            join_date: join_date,
            addedd_by: this.props.adminid,
            partner_status: 'Active'
          }
        }else{
          var obj = {
            email:email,
            partner_name: partnername,
            address: address,
            cp_name: cp,
            phonenum: cpphone,
            partner_pic: '/partnerpic/defaultpartner.PNG',
            join_date: join_date,
            addedd_by: this.props.adminid,
            partner_status: 'Active'
          }
        }
        console.log(obj)
        formData.append('data', JSON.stringify(obj))  //obj diubah jadi string format json
        if(addImageFile != undefined){
          formData.append('image', addImageFile) // nambahin image ke formdata
        }
        console.log(formData)
        Axios.post(API_URL+'/admin/addPartner', formData) // formdata berlaku seperti req.body
        .then((res) => {
          console.log(res.data)
          alert('Partner Succesfully Added :D')
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
    


    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className='pgtitle2'>PARTNER</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
              <button class="btnadmin" data-toggle="modal" data-target="#addPartnerModal"> + Add Partner</button>
              </div>
            </div>
          </div>

          <div class="form-group">
              <input type="text" class="form-control" id="searchpartner" ref='searchpartner' placeholder='Search Partner...........' onChange={this.searchpartner}/>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Picture</th>
                  <th><a onClick={() => this.sortbyName()} className='hovercursor'>Name</a></th>
                  <th><a onClick={() => this.sortbyEmail()} className='hovercursor'>Email</a></th>
                  <th><a onClick={() => this.sortbyAddedBy()} className='hovercursor'>Added By</a></th>
                  <th><a onClick={() => this.sortbyJoinDate()} className='hovercursor'>Join Date</a></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {this.renderpartnerlist()}
              </tbody>
            </table>
            <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination()}
              </ul>
            </nav>
          </div>
        </main>
      </div>
    </div>




        {/* Modal Add Partner */}
        <div class="modal fade" id="addPartnerModal" tabindex="-1" role="dialog" aria-labelledby="addPartnerModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add Partner</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Partner Name:</label>
                    <input type="text" class="form-control" id="partnername" ref='partnername'/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Email:</label>
                    <input type="text" class="form-control" id="email" ref='email' />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Address:</label>
                    <input type="pastextsword" class="form-control" id="address" ref='address' />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Contact Person:</label>
                    <input type="text" class="form-control" id="cp" ref='cp' />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Contact Person Phone:</label>
                    <input type="number" class="form-control" id="cpphone" ref='cpphone' />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Partner Pic / Logo (Optional):</label>
                    <input type="file" id='image' class="form-control" placeholder="" onChange={this.onBtnAddImageFile} label={this.state.addImageFileName}/>
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='addadmincancel' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btnbiru" onClick={() => { if (window.confirm('Are You Sure You Want To Submit?')) this.addPartner()} }>Submit</button>
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
 
export default connect(mapStateToProps)(managepartner);