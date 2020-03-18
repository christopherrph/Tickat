import React, { Component } from 'react';
import '../AdminApp.css';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import {logoutadmin, keeploginadmin} from '../Redux/Action'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { API_URL } from '../support/API_URL';
import Axios from 'axios';

class adminnavbar extends Component {
    state = { 
      unreadfeedback: null
     }


    componentDidMount(){
      Axios.get(API_URL + '/admin/countfeedback')
        .then((res) =>  {
          console.log(res.data[0].total)
          this.setState({
            unreadfeedback:res.data[0].total
          })
        })

      console.log('masuk home')
      var tokenadmin = localStorage.getItem('admintoken');
      console.log(tokenadmin)
        if(!tokenadmin){
            this.setState({ redirecterror: true })
        }

        let { keeploginadmin } = this.props;
        keeploginadmin()
    }

    logout = () =>{
      this.props.logoutadmin();
      this.setState({ redirect: true })
    }

    render() { 
      const { redirect } = this.state;
      if (redirect) {
        return <Redirect to='/adminlogin'/>;
      }

      const { redirecterror } = this.state;
     if (redirecterror) {
       return <Redirect to='/adminlogin'/>;
     }

        return (
            <div>

<Helmet>
<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</Helmet>

<nav class="navbar navbar-icon-top navbar-expand-lg navbar-dark" style={{backgroundColor:'#1F5E99'}}>
<Link to='/adminhome'> <a class="navbar-brand pgtitle" href="#">TICKAT</a> </Link>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
      <Link to='/adminhome'><a class="nav-link" href="#">
          <i class="fa fa-home"></i>
          Home
          </a></Link>
      </li>
      {
        this.props.role == 'Super Admin'
        ?
        <li class="nav-item">
        <Link to='/manageadmin'><a class="nav-link" href="#">
          <i class="fa fa-users"></i>
          Admin
          </a></Link>
        </li>
        :
        <div></div>
      }

      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-user">
          </i>
          Manage User
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
        <Link to='/manageuser'><a class="dropdown-item" href="#">User</a></Link>
        <Link to='/managepartner'><a class="dropdown-item" href="#">Partner</a></Link>
          <div class="dropdown-divider"></div>
        </div>
      </li>

      {
        this.props.role == 'Super Admin'
        ?      
        <li class="nav-item">
        <Link to='/managecategory'><a class="nav-link" href="#">
          <i class="fa fa-list" aria-hidden="true"></i>
          Category
          </a></Link>
        </li>
        :
        <div></div>
      }

      <li class="nav-item">
        <Link to='/manageevent'><a class="nav-link" href="#">
          <i class="fa fa-calendar"></i>
          Event
          </a></Link>
      </li>

      <li class="nav-item">
        <Link to='/managetransactions'><a class="nav-link" href="#">
          <i class="fa fa-money"></i>
          Transactions
          </a></Link>
      </li>

      <li class="nav-item">
        <Link to='/feedback'><a class="nav-link" href="#">
        <i class="fa fa-commenting-o" aria-hidden="true">
          {
            this.state.unreadfeedback > 0
            ?
            <span class="badge badge-danger">{this.state.unreadfeedback}</span>
            :
            <div></div>
          }
        </i>
          Feedback
          </a></Link>
      </li>
    </ul>




    <ul class="navbar-nav ">
      <li class="nav-item">
        <a class="nav-link" href="#">
        <i class="fa fa-smile-o" aria-hidden="true"></i>
          Hello, {this.props.username}
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" onClick={this.logout}>
          <i class="fa fa-sign-out">
          </i>
          Logout
        </a>
      </li>
    </ul>
  </div>
</nav>
                
            </div>
          );
    }
}

const mapStateProps = (state) =>{ // Function yang akan terima global state
  return{
    username: state.admin.username, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
    role: state.admin.role
  }
}
 
export default connect(mapStateProps,{logoutadmin, keeploginadmin})(adminnavbar);