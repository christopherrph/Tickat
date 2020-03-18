import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class manageuser extends Component {
    state = { 
        listuser:[],
        pagination: 0
     }

    searchuser = () =>{
      var searchuser = this.refs.searchuser.value;
      if(searchuser == ''){
        this.componentDidMount()
      }else{
        Axios.get(API_URL + `/admin/getAllUserLike/${searchuser}`)
        .then((res) =>  {
            this.setState({
                listuser:res.data
            })
        })
        .catch((err) =>{
          console.log('Not Found')
        })
      }
      this.setState({pagination:0})
    }

    componentDidMount(){
        Axios.get(API_URL + '/admin/getAllUser')
        .then((res) =>  {
            this.setState({
                listuser:res.data
            })
        })
        .catch((err) =>{
          console.log(err)
        })
    }

    renderPagination = () =>{
      var length = this.state.listuser.length
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

    renderuserlist = () =>{
      if(this.state.listuser.length == 0){
        return(
            <tr class='clickable-row' data-href='url://'>
                <td colSpan='8' style={{textAlign:'center'}}>User Not Found</td>
            </tr>
        )
      }else{
        var x = this.state.listuser.slice(0+(this.state.pagination*5),5+(this.state.pagination*5))
        return x.map((val, index) =>{
            return(
              <tr  class='clickable-row' data-href='url://'>
                  <td className='verticalalignmid'>{index+1+(this.state.pagination*5)}</td>
                  <td className='verticalalignmid'><img src={API_URL+'/avatar/'+val.avatar} style={{height:40}}/></td>
                  <td className='verticalalignmid'>{val.name}</td>
                  <td className='verticalalignmid'>{val.email}</td>
                  <td className='verticalalignmid'>{val.gender}</td>
                  <td className='verticalalignmid'>{val.phone}</td>
                  <td className='verticalalignmid'>{moment(val.joindate).format('DD-MM-YYYY')}</td>
                  <td className='verticalalignmid'><Link to={`/userdetail/${val.iduser}`} ><button class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> View Detail</button></Link></td>
              </tr>
          )
        })
      }
    }
    


    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className='pgtitle2'>USER</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
                <button class="btnadmin"> Button Ya Button</button>
              </div>
            </div>
          </div>

          <div class="form-group">
              <input type="text" class="form-control" id="searchuser" ref='searchuser' placeholder='Search User...........' onChange={this.searchuser}/>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {this.renderuserlist()}
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

        </div>  );
    }
}

const mapStateToProps = (state) =>{ // Function yang akan terima global state
  return{
    username: state.admin.username, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
    role: state.admin.role
  }
}
 
export default connect(mapStateToProps)(manageuser);