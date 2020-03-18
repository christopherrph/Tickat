import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class feedback extends Component {
    state = { 
        listfeedback:[],
        message:'',
        imgaddress:'',
        name:'',
        listread:[],
        pagination: 0,
        pagination2: 0
     }

    componentDidMount(){
      Axios.get(API_URL + '/admin/getAllFeedback')
      .then((res) =>  {
          this.setState({
            listfeedback:res.data
          })
      })

      Axios.get(API_URL + '/admin/getAllReadFeedback')
      .then((res) =>  {
          this.setState({
            listread:res.data
          })
      })
  }

  renderPagination = () =>{
    var length = this.state.listfeedback.length
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

renderPagination2 = () =>{
  var length = this.state.listread.length
  var halaman = Math.ceil(length/5)
  var arr = []
  for(var i=0;i<halaman;i++){
    arr.push(i)
  }
  return arr.map((val, index) =>{
    if(val == this.state.pagination2){
      return(
        <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1">{val+1}</a>
        </li>
      )
    }else{
      return(
      <li class="page-item"><a class="page-link" style={{color:'#1F5E99'}} onClick={() => this.setState({pagination2: val})} >{val+1}</a></li>
      )
    }
})
}

  markasread = (id) =>{
    Axios.patch(API_URL + `/admin/markasreadfeedback/${id}`)
    .then((res) =>  {
      console.log(res.data);
      this.componentDidMount()
    })
  }

  markasunread = (id) =>{
    Axios.patch(API_URL + `/admin/markasunreadfeedback/${id}`)
    .then((res) =>  {
      console.log(res.data);
      this.componentDidMount()
    })
  }


  renderfeedback = () =>{
  var x = this.state.listfeedback.slice(0+(this.state.pagination*5),5+(this.state.pagination*5))
    return x.map((val, index) =>{
      return(
          <tr>
              <td className='verticalalignmid'>{index+1+(this.state.pagination*5)}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{val.name}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{val.email}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{val.phone}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{moment(val.date).format('DD-MM-YYYY')}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}><a onClick={()=>this.setState({message: val.message, name:val.name})} data-toggle="modal" className='btn btn-sm btnadmin' data-target="#messageModal" >View Message</a></td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>
                {
                  val.img
                  ?
                  <a onClick={()=>this.setState({image: val.img})} data-toggle="modal" className='btn btn-sm btnadmin' data-target="#imageModal" >View Image</a>
                  :
                  <a className='btn-sm'>-------------</a>
                }
              </td>
              <td className='verticalalignmid ' style={{textAlign:'center'}}><i onClick={() => this.markasread(val.id_feedback)} class="fa fa-check hovergede" style={{color:'green', fontSize:30}}></i></td>
          </tr>
      )
  })
  }

  renderreadfeedback = () =>{
    var x = this.state.listread.slice(0+(this.state.pagination2*5),5+(this.state.pagination2*5))
    return x.map((val, index) =>{
      return(
          <tr>
              <td className='verticalalignmid'>{index+1+(this.state.pagination2*5)}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{val.name}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{val.email}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{val.phone}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>{moment(val.date).format('DD-MM-YYYY')}</td>
              <td className='verticalalignmid' style={{textAlign:'center'}}><a onClick={()=>this.setState({message: val.message, name:val.name})} data-toggle="modal" className='btn btn-sm btnadmin' data-target="#messageModal" >View Message</a></td>
              <td className='verticalalignmid' style={{textAlign:'center'}}>
                {
                  val.img
                  ?
                  <a onClick={()=>this.setState({image: val.img})} data-toggle="modal" className='btn btn-sm btnadmin' data-target="#imageModal" >View Image</a>
                  :
                  <a className='btn-sm'>-------------</a>
                }
              </td>
              <td className='verticalalignmid ' style={{textAlign:'center'}}><i onClick={() => this.markasunread(val.id_feedback)} class="fa fa-times hovergede" style={{color:'darkred', fontSize:30}}></i></td>
          </tr>
      )
  })
  }

    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <h3 className='pgtitle2 border-bottom'>UNREAD FEEDBACK</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th style={{textAlign:'center'}}>Name</th>
                  <th style={{textAlign:'center'}}>Email</th>
                  <th style={{textAlign:'center'}}>Phone</th>
                  <th style={{textAlign:'center'}}>Date</th>
                  <th style={{textAlign:'center'}}>Message</th>
                  <th style={{textAlign:'center'}}>Image</th>
                  <th style={{textAlign:'center'}}>Mark as Read</th>
                </tr>
              </thead>
              <tbody>
            {this.renderfeedback()}
              </tbody>
            </table>
            <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination()}
              </ul>
            </nav>
          </div>
        </main>




        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <h3 className='pgtitle2 border-bottom'>READ FEEDBACK</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th style={{textAlign:'center'}}>Name</th>
                  <th style={{textAlign:'center'}}>Email</th>
                  <th style={{textAlign:'center'}}>Phone</th>
                  <th style={{textAlign:'center'}}>Date</th>
                  <th style={{textAlign:'center'}}>Message</th>
                  <th style={{textAlign:'center'}}>Image</th>
                  <th style={{textAlign:'center'}}>Mark as UnRead</th>
                </tr>
              </thead>
              <tbody>
                {this.renderreadfeedback()}
              </tbody>
            </table>
            <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination2()}
              </ul>
            </nav>
          </div>
        </main>
    </div>


    <div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="messageModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Message</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                  <div class="form-group">
                    <label for="recipient-name" class="col-form-label">{this.state.name}:</label> <br></br>
                    {this.state.message}
                  </div>
            </div>
            <div class="modal-footer">
              <button type="button" id='addcategorycancel' class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
          </div>
      </div>

      <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModal" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Image</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <img src={API_URL + this.state.image} style={{height:300}} className='boxshadow'/>
            </div>
            <div class="modal-footer">
              <button type="button" id='addcategorycancel' class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
          </div>
      </div>


        </div>  );
    }
}
 
export default feedback;