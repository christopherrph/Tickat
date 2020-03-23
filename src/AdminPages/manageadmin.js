import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'
import { Redirect } from 'react-router-dom'

class manageadmin extends Component {
    state = { 
        listadmin:[],
        editadmin:[
          {
          }
      ]
     }

    componentDidMount(){
      Axios.get(API_URL + '/admin/getAllAdmin')
      .then((res) =>  {
          this.setState({
              listadmin:res.data
          })
      })
      .catch((err) =>{
        console.log(err)
      })
  }

  getEditAdmin = (id) =>{
    Axios.get(API_URL + `/admin/getAdminById/${id}`)
      .then((res) =>  {
          this.setState({
              editadmin:res.data
          })
          console.log(this.state.editadmin)
      })
      .catch((err) =>{
        console.log(err)
      })
  }

  renderTableAdmin = () =>{
    return this.state.listadmin.map((val, index) =>{
      return(
          <tr>
              <td className='verticalalignmid'>{index+1}</td>
              <td className='verticalalignmid'>{val.username}</td>
              <td className='verticalalignmid'>{moment(val.dateadded).format('MMMM Do YYYY')}</td>
              <td>
                <button onClick={() => {this.getEditAdmin(val.idadmin)}} class="btn btn-sm btnadmin" data-toggle="modal" data-target="#editAdminModal"> Edit</button>
                <button onClick={() => { if(window.confirm('Are You Sure You Want To Deactivate This Admin?')) this.deactivateAdmin(val.idadmin) } } class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> Deactivate</button>
              </td>
          </tr>
      )
  })
  }

  addAdmin = () =>{
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    let repassword = this.refs.repassword.value;
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1  
    var day =currentTime.getDate()
    var year = currentTime.getFullYear()
    var dateadded = year + "-" + month + "-" + day
    let role = 'Admin';
    let status = 'Active';
    if(username && password && repassword){
      if(password == repassword){
        Axios.post(API_URL+'/admin/addAdmin', {
          username,
          password,
          role,
          dateadded,
          status
        })
        .then((res) => {
          console.log(res.data)
          document.getElementById("addadmincancel").click()
          document.getElementById('username').value = ''
          document.getElementById('password').value = ''
          document.getElementById('repassword').value = ''
          alert('Admin Succesfully Added :D')
          document.getElementById("addadmincancel").click()
          this.componentDidMount()
        })
        .catch((err) => {
          alert('Failed')
          console.log(err)
        })
      }else{
        alert('Password Did Not Match')
      }
    }else{
      alert('Please Fill Out Form')
    }
  }

  deactivateAdmin = (id) =>{
    Axios.patch(API_URL + `/admin/deactivateadmin/${id}`)
        .then((res) =>  {
          console.log(res.data);
          this.componentDidMount()
          alert('Account Deactivated')
        })
  }

  editadmin = (id) =>{
    let username = this.refs.editusername.value;
    let password = this.refs.editpassword.value;
    if(username && password){
      Axios.patch(API_URL + `/admin/editadmin`,{
        id,
        username,
        password
      })
        .then((res) =>  {
          console.log(res.data);
          alert('Account Edited')
          document.getElementById("editadmincancel").click()
          this.componentDidMount()
        })
        .catch((err)=>{
          console.log(err)
        })
    }else{
      alert("Please Don't Leave Field Empty")
    }
  }


    render() { 
        if(this.props.role !== 'Super Admin'){
          return <Redirect to='/adminhome'/>;
        }
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className='pgtitle2'>ADMIN LIST</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button class="btnadmin" data-toggle="modal" data-target="#addAdminModal"> + Add Admin</button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Admin Username</th>
                  <th>Date Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableAdmin()}
              </tbody>
            </table>
          </div>
        </main>
    </div>

    {/* Modal Add Admin */}
    <div class="modal fade" id="addAdminModal" tabindex="-1" role="dialog" aria-labelledby="addAdminModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Add Admin</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Username:</label>
                    <input type="text" class="form-control" id="username" ref='username'/>
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Password:</label>
                    <input type="password" class="form-control" id="password" ref='password' />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Re-Type Password:</label>
                    <input type="password" class="form-control" id="repassword" ref='repassword' />
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='addadmincancel' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btnbiru" onClick={() => { if (window.confirm('Are You Sure You Want To Submit?')) this.addAdmin()} }>Submit</button>
            </div>
          </div>
        </div>
    </div>

    {/* Modal Edit Admin */}
    <div class="modal fade" id="editAdminModal" tabindex="-1" role="dialog" aria-labelledby="editAdminModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Edit Admin</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Username:</label>
                    <input type="text" class="form-control" id="editusername" ref='editusername' defaultValue={this.state.editadmin[0].username} />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">New Password:</label>
                    <input type="text" class="form-control" id="editpassword" ref='editpassword' />
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='editadmincancel' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btnbiru" onClick={() => { if (window.confirm('Are You Sure You Want To Edit?')) this.editadmin(this.state.editadmin[0].idadmin)} }>Submit</button>
            </div>
          </div>
        </div>
    </div>
        </div>  );
    }
}

const mapStateProps = (state) =>{ // Function yang akan terima global state
  return{
    username: state.admin.username, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
    role: state.admin.role
  }
}
 
export default connect(mapStateProps,{})(manageadmin);