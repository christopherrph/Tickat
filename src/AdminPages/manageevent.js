import React, { Component } from 'react'
import '../AdminApp.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Navbar from './adminnavbar';
import { Redirect } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import moment from 'moment'


class manageevent extends Component {
    state = { 
      listevent:[],
      pagination: 0,
      sortPartner: true,
      sortName: true,
      sortEventDate: true,
      sortDate: true,
      sortCategory: true,
      activeonly: false
     }

     searchevent = () =>{
      var searchevent = this.refs.searchevent.value;
      if(searchevent == ''){
        this.componentDidMount()
      }else{
        Axios.get(API_URL + `/admin/getAllEventLike/${searchevent}`)
        .then((res) =>  {
            this.setState({
                listevent:res.data
            })
        })
        .catch((err) =>{
          console.log('Not Found')
        })
      }
      this.renderPagination()
      this.setState({pagination:0})
    }

    componentDidMount(){
        Axios.get(API_URL + '/admin/getAllEvent')
        .then((res) =>  {
            this.setState({
                listevent:res.data
            })
        })
        .catch((err) =>{
          console.log(err)
        })
    }

    renderPagination = () =>{
      var length = this.state.listevent.length
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

    renderevent = () =>{
      var x = this.state.listevent.slice(0+(this.state.pagination*5),5+(this.state.pagination*5))
      return x.map((val, index) =>{
          return(
              <tr class='clickable-row' data-href='url://'>
                  <td className='verticalalignmid'>{index+1+(this.state.pagination*5)}</td>
                  <td className='verticalalignmid'>{val.event_name}</td>
                  <td className='verticalalignmid'>{val.partner_name}</td>
                  <td className='verticalalignmid'>{val.category_name}</td>
                  <td className='verticalalignmid'>{moment(val.event_date).format('DD-MM-YYYY')}</td>
                  <td className='verticalalignmid'>{moment(val.dateposted).format('DD-MM-YYYY')}</td>
                  <td className='verticalalignmid'><Link to={`/eventdetail/${val.idevent}`} ><button class="btn btn-sm btnadmin" style={{marginLeft:'2%'}}> View Detail</button></Link></td>
              </tr>
          )
      })
  }

  sortbyPartner = () =>{
    if(this.state.sortPartner){
      var x = this.state.listevent.sort((a,b) => (a.partner_name > b.partner_name) ? 1 : ((b.partner_name > a.partner_name) ? -1 : 0)); 
    }else{
      var x = this.state.listevent.sort((a,b) => (a.partner_name < b.partner_name) ? 1 : ((b.partner_name < a.partner_name) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortPartner: !this.state.sortPartner, listevent: x})
  }

  sortbyName = () =>{
    if(this.state.sortName){
      var x = this.state.listevent.sort((a,b) => (a.event_name > b.event_name) ? 1 : ((b.event_name > a.event_name) ? -1 : 0)); 
    }else{
      var x = this.state.listevent.sort((a,b) => (a.event_name < b.event_name) ? 1 : ((b.event_name < a.event_name) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortName: !this.state.sortName, listevent: x})
  }

  sortbyDate = () =>{
    if(this.state.sortDate){
      var x = this.state.listevent.sort((a,b) => (a.dateposted > b.dateposted) ? 1 : ((b.dateposted > a.dateposted) ? -1 : 0)); 
    }else{
      var x = this.state.listevent.sort((a,b) => (a.dateposted < b.dateposted) ? 1 : ((b.dateposted < a.dateposted) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortDate: !this.state.sortDate, listevent: x})
  }

  sortbyEventDate = () =>{
    if(this.state.sortEventDate){
      var x = this.state.listevent.sort((a,b) => (a.event_date > b.event_date) ? 1 : ((b.event_date > a.event_date) ? -1 : 0)); 
    }else{
      var x = this.state.listevent.sort((a,b) => (a.event_date < b.event_date) ? 1 : ((b.event_date < a.event_date) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortEventDate: !this.state.sortEventDate, listevent: x})
  }

  sortbyCategory = () =>{
    if(this.state.sortCategory){
      var x = this.state.listevent.sort((a,b) => (a.category_name > b.category_name) ? 1 : ((b.category_name > a.category_name) ? -1 : 0)); 
    }else{
      var x = this.state.listevent.sort((a,b) => (a.category_name < b.category_name) ? 1 : ((b.category_name < a.category_name) ? -1 : 0)); 
    }
    console.log(x)
    this.setState({ sortCategory: !this.state.sortCategory, listevent: x})
  }

  activeonly = (checkbox) =>{
    this.setState({activeonly: !this.state.activeonly})
    if(this.state.activeonly == false){
      Axios.get(API_URL + '/admin/getAllEventLater')
      .then((res) =>  {
          this.setState({
              listevent:res.data
          })
      })
      .catch((err) =>{
        console.log(err)
      })
    }else if(this.state.activeonly == true){
      this.componentDidMount()
    }
  }
    

    render() { 
        return ( <div>
        <Navbar/>
    <div class="container-fluid paddingatas2">
      <div class="row">
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4 centermain">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className='pgtitle2'>EVENT</h3>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2 ml-2">
                <Link to='/addevents'><button class="btnadmin">+ CREATE EVENT</button></Link>
              </div>
            </div>
          </div>

          <div class="form-group">
              <input type="text" class="form-control" id="searchevent" ref='searchevent' placeholder='Search Event...........' onChange={this.searchevent}/>
              <div className='ml-4 mt-2'>
                <label class="form-check-label" for="exampleCheck1" style={{fontSize:15}}><input type="checkbox" class="form-check-input" onChange={this.activeonly} id="exampleCheck1"/>Only Show Active Events</label>
              </div>         
          </div>

          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th><a onClick={this.componentDidMount} className='hovercursor'>No</a></th>
                  <th><a onClick={this.sortbyName} className='hovercursor'>Events Name</a></th>
                  <th><a onClick={this.sortbyPartner} className='hovercursor'>Events Partner</a></th>
                  <th><a onClick={this.sortbyCategory} className='hovercursor'>Category</a></th>
                  <th><a onClick={this.sortbyEventDate} className='hovercursor'>Event Date</a></th>
                  <th><a onClick={this.sortbyDate} className='hovercursor'>Date Posted</a></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.renderevent()}
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
 
export default connect(mapStateToProps)(manageevent);