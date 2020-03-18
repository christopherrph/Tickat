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

class addevents3 extends Component {
    state = { 
      listpartner:[]
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

  renderpartner = () =>{
      return this.state.listpartner.map((val, index) =>{
          return(
            <div class="card p-2 mr-sm-auto" style={{width:'12rem'}}>
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
              </div>
            </div>
          </div>

        <div class="container">
        <div class="mt-4 mb-4 text-center">
          <h2 className='pgtitle2'>EVENT SUCCESSFULLY ADDED</h2>
        </div>
        <ul class="step d-flex flex-nowrap mb-5">
        <li class="step-item">
          <a class=""><i class="fas fa-store-alt"></i></a>
        </li>
        <li class="step-item">
          <a class=""><i class="fas fa-pencil-alt"></i></a>
        </li>
        {/* <li class="step-item">
          <a class=""><i class="fas fa-clipboard-list" style={{color:'grey'}}></i></a>
        </li> */}
        <li class="step-item active">
          <a class=""><i class="fas fa-check"></i></a>
        </li>
      </ul> 
      </div>

      <center>
        {/* <video height="400" autoPlay>
          <source src={require('../img/animated-check.mp4')} type="video/mp4"/>
          Your browser does not support the video tag.
        </video> */}
        <img src="https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-max-1mb.gif"/>
        <br/>
        <div class="btn-group mr-2 mt-5">
                <Link to='/manageevent'><button class="btnadmin"> RETURN TO EVENTS </button></Link>
        </div>

      </center>

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
 
export default connect(mapStateToProps)(addevents3);