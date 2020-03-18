import React, { Component } from 'react'
import '../AdminApp.css';
import '../AddEvents.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'

class addevents extends Component {
    state = { 
      listpartner:[],
      pagination: 0
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

  renderPagination = () =>{
    var length = this.state.listpartner.length
    var halaman = Math.ceil(length/10)
    var arr = []
    for(var i=0;i<halaman;i++){
      arr.push(i)
    }
    return arr.map((val, index) =>{
      if(val == this.state.pagination){
        return(
          <li class="page-item disabled">
                <a class="page-link font-weight-bold" href="#" tabindex="-1">{val+1}</a>
          </li>
        )
      }else{
        return(
        <li class="page-item"><a class="page-link" style={{color:'#1F5E99'}} onClick={() => this.setState({pagination: val})} >{val+1}</a></li>
        )
      }
  })
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

  renderpartner = () =>{
    var x = this.state.listpartner.slice(0+(this.state.pagination*10),10+(this.state.pagination*10))
      return x.map((val, index) =>{
          return(
            <div class="card p-1" style={{width:'12rem'}}>
              <Link to={`/addevents2/${val.idpartner}`} ><img class="card-img-top" src={API_URL + val.partner_pic} alt="Card image cap" /></Link>
              <div class="card-body centermain">
                <p class="card-text pgtitle2 mt-2">{val.partner_name}</p>
              </div>
            </div>
          )
      })
  }
    

    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h5 className='pgtitle2'>ADD EVENT</h5>
            <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
                <Link to='/manageevent'><button class="btnadmin" style={{width:'80px'}}> BACK </button></Link>
              </div>
            </div>
          </div>

        <div class="container">
        <div class="mt-4 mb-4 text-center">
          <h2 className='pgtitle2'>CHOOSE PARTNER</h2>
        </div>
        <ul class="step d-flex flex-nowrap mb-5">
        <li class="step-item active">
          <a class=""><i class="fas fa-store-alt"></i></a>
        </li>
        <li class="step-item">
          <a class=""><i class="fas fa-pencil-alt" style={{color:'grey'}}></i></a>
        </li>
        {/* <li class="step-item">
          <a class=""><i class="fas fa-clipboard-list" style={{color:'grey'}}></i></a>
        </li> */}
        <li class="step-item">
          <a class=""><i class="fas fa-check" style={{color:'grey'}}></i></a>
        </li>
      </ul> 
      </div>

      <div class="form-group">
              <input type="text" class="form-control" id="searchpartner" ref='searchpartner' placeholder='Search Partner...........' onChange={this.searchpartner}/>
      </div>

      <div className='row' style={{width:1400}}>
      {this.renderpartner()}
      </div>

      <nav aria-label="...">
              <ul class="pagination pagination-sm">
                {this.renderPagination()}
              </ul>
      </nav>
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
 
export default connect(mapStateToProps)(addevents);