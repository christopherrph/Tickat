import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'
import { Redirect } from 'react-router-dom'

class managecategory extends Component {
    state = { 
        listcategory:[],
        editcategory:[
          {
          }
      ]
     }

    componentDidMount(){
      Axios.get(API_URL + '/admin/getAllCategory')
      .then((res) =>  {
          this.setState({
              listcategory:res.data
          })
          console.log(this.state.listcategory)
      })
      .catch((err) =>{
        console.log(err)
      })
  }

  getEditCategory = (id) =>{
    Axios.get(API_URL + `/admin/getCategoryById/${id}`)
      .then((res) =>  {
          this.setState({
            editcategory:res.data
          })
          console.log(this.state.editcategory)
      })
      .catch((err) =>{
        console.log(err)
      })
  }

  renderTableCategory = () =>{
    return this.state.listcategory.map((val, index) =>{
      return(
          <tr>
              <td className='verticalalignmid'>{index+1}</td>
              <td className='verticalalignmid'>{val.category_name}</td>
              <td className='verticalalignmid'>{moment(val.date_added).format('MMMM Do YYYY')}</td>
              <td>
                <button onClick={() => {this.getEditCategory(val.idcategory)}} class="btn btn-sm btnadmin" data-toggle="modal" data-target="#editCategoryModal"> Edit</button>
                <button onClick={() => { if(window.confirm('Are You Sure You Want To Deactivate This Category?')) this.deactivateCategory(val.idcategory) } } class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> Deactivate</button>
              </td>
          </tr>
      )
  })
  }

  addCategory = () =>{
    let category_name = this.refs.category.value;
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1  
    var day =currentTime.getDate()
    var year = currentTime.getFullYear()
    var date_added = year + "-" + month + "-" + day
    let category_status = 'Active';
    if(category_name){
        Axios.post(API_URL+'/admin/addCategory', {
          category_name,
          date_added,
          category_status
        })
        .then((res) => {
          console.log(res.data)
          document.getElementById("addcategorycancel").click()
          alert('Category Succesfully Added :D')
          this.componentDidMount()
        })
        .catch((err) => {
          alert('Failed')
          console.log(err)
        })
    }else{
      alert('Please Fill Out Form')
    }
  }

  deactivateCategory = (id) =>{
    Axios.patch(API_URL + `/admin/deactivatecategory/${id}`)
        .then((res) =>  {
          console.log(res.data);
          this.componentDidMount()
          alert('Category Deactivated')
        })
  }

  editcategory = (id) =>{
    let category_name = this.refs.editcategory.value;
    if(category_name){
      Axios.patch(API_URL + `/admin/editcategory`,{
        id,
        category_name
      })
        .then((res) =>  {
          console.log(res.data);
          document.getElementById("editcategorycancel").click()
          this.componentDidMount()
          alert('Category Edited')
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
            <h3 className='pgtitle2'>EVENT CATEGORY LIST</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button class="btnadmin" data-toggle="modal" data-target="#addCategoryModal"> + Add Category</button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Category</th>
                  <th>Date Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableCategory()}
              </tbody>
            </table>
          </div>
        </main>
    </div>

    {/* Modal Add Category */}
    <div class="modal fade" id="addCategoryModal" tabindex="-1" role="dialog" aria-labelledby="addCategoryModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Add Category</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Category Name:</label>
                    <input type="text" class="form-control" id="category" ref='category'/>
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='addcategorycancel' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btnbiru" onClick={() => { if (window.confirm('Are You Sure You Want To Submit?')) this.addCategory()} }>Submit</button>
            </div>
          </div>
        </div>
    </div>

    {/* Modal Edit Category */}
    <div class="modal fade" id="editCategoryModal" tabindex="-1" role="dialog" aria-labelledby="editCategoryModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Edit Category</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">Category Name:</label>
                    <input type="text" class="form-control" id="editcategory" ref='editcategory' defaultValue={this.state.editcategory[0].category_name} />
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='editcategorycancel' class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btnbiru" onClick={() => { if (window.confirm('Are You Sure You Want To Edit?')) this.editcategory(this.state.editcategory[0].idcategory)} }>Submit</button>
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
 
export default connect(mapStateProps,{})(managecategory);