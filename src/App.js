import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Pages/navbar';
import home from './Pages/home';
import Footer from './Pages/footer';
import contactus from './Pages/contactus'
import register from './Pages/register';
import login from './Pages/login';
import findtickets from './Pages/findtickets';
import notfound from './Pages/notfound';
import profile from './Pages/profile';
import transactiondone from './Pages/transactiondone';
import tickets from './Pages/tickets';
import { keeplogin } from './Redux/Action'
import {connect} from 'react-redux';
import adminlogin from './AdminPages/adminlogin';
import adminhome from './AdminPages/adminhome';
import manageadmin from './AdminPages/manageadmin';
import manageuser from './AdminPages/manageuser';
import managepartner from './AdminPages/managepartner';
import managetransactions from './AdminPages/managetransactions';
import partnerdetail from './AdminPages/partnerdetail';
import managecategory from './AdminPages/managecategory';
import manageevent from './AdminPages/manageevent';
import addevents from './AdminPages/addevents';
import addevents2 from './AdminPages/addevents2';
import addevents3 from './AdminPages/addevents3';
import eventdetail from './AdminPages/eventdetail';
import userdetail from './AdminPages/userdetail';
import userhome from './Pages/userhome';
import event from './Pages/event';
import checkout from './Pages/checkout';
import forgotpassword from './Pages/forgotpassword';
import editevent from './AdminPages/editevent';
import feedback from './AdminPages/feedback';
import transactiondetail from './AdminPages/transactiondetail';
import ticketsales from './AdminPages/ticketsales';

class App extends Component{

  // componentDidMount(){
  //   let { keeplogin } = this.props;
  //   keeplogin()
  // }

  render(){
    return(
      <div>
        <Fragment>
        {/* <Header/> */}
        <Switch>
        <Route path='/adminlogin' component={adminlogin} />
        <Route path='/adminhome' component={adminhome} />
        <Route path='/manageadmin' component={manageadmin} />
        <Route path='/manageuser' component={manageuser} />
        <Route path='/managepartner' component={managepartner} />
        <Route path='/managetransactions' component={managetransactions} />
        <Route path='/partnerdetail' component={partnerdetail} />
        <Route path='/userdetail' component={userdetail} />
        <Route path='/feedback' component={feedback} />
        <Route path='/manageevent' component={manageevent} />
        <Route path='/managecategory' component={managecategory} />
        <Route path='/addevents' component={addevents} />
        <Route path='/addevents2' component={addevents2} />
        <Route path='/addevents3' component={addevents3} />
        <Route path='/eventdetail' component={eventdetail} />
        <Route path='/editevent' component={editevent} />
        <Route path='/transactiondetail' component={transactiondetail} />
        <Route path='/ticketsales' component={ticketsales} />

        <Route path='/event' component={event} />
        <Route path='/checkout' component={checkout} />
        <Route path='/forgotpassword' component={forgotpassword} />
        <Route path='/' component={home} exact />
        <Route path='/contactus' component={contactus} />
        <Route path='/transactiondone' component={transactiondone} />
        <Route path='/userhome' component={userhome} />
        <Route path='/register' component={register} />
        <Route path='/login' component={login} />
        <Route path='/findtickets' component={findtickets} />
        <Route path='/profile' component={profile} />
        <Route path='/tickets' component={tickets} />
        <Route path='*' component={notfound}/>
        </Switch>
        {/* <Footer/> */}
        </Fragment>
      </div>  
    )
  }
}

export default connect(null, { keeplogin })(App);