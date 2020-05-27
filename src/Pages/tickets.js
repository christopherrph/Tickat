import React, { Component } from 'react'
import '../Ticket.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import Footer from './footer';
import Header from './navbar';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import Pdf from "react-to-pdf";
import { Redirect } from 'react-router-dom'
const ref = React.createRef();

class tickets extends Component {

    state = {
        idtransaction: '',
        idevent: '',
        ticketList:[],
        eventdetail:[{}]
    }

    async componentDidMount(){
        if(this.props.location.state){
            const  { idtransaction } = this.props.location.state
            const  { idevent } = this.props.location.state
            const res = await this.setState({
                idtransaction: idtransaction,
                idevent: idevent
            }, () => {
                console.log(this.state.idtransaction);
                console.log(this.state.idevent);
            })
                        Axios.get(API_URL + `/admin/getEventById/${this.state.idevent}`)
                        .then((res) =>  {
                            this.setState({
                                eventdetail:res.data
                            })
                        })
                        .catch((err) =>{
                          console.log(err)
                        })
    
                        Axios.get(API_URL + `/user/getTickets/${this.state.idtransaction}`)
                        .then((res) =>  {
                            this.setState({
                                ticketList:res.data
                            })
                            console.log(this.state.ticketList);
                        })
                        .catch((err) =>{
                          console.log(err)
                        })
        }else{
            this.setState({ redirecterror: true })
        }
    }

    renderTicket = () =>{
        return this.state.ticketList.map((val, index) =>{
            return(
                <div class="ticket boxshadow">
                            <div class="stub">
                                <div class="top">
                                <span class="admit">TICKAT</span>
                                <span class="line"></span>
                                <span class="" style={{color:'white'}}>
                                <NumberFormat value={val.ticket_price} displayType={'text'} thousandSeparator={true} prefix={'IDR '} />
                                </span>
                                </div>
                                <div className='mt-3 text-center' style={{color:'white'}}>
                                {this.state.eventdetail[0].event_name}<br/>
                                <img className='mt-3' src='https://store-images.s-microsoft.com/image/apps.33967.13510798887182917.246b0a3d-c3cc-46fc-9cea-021069d15c09.392bf5f5-ade4-4b36-aa63-bb15d5c3817a' style={{height:80}}/>
                                </div>
                            </div>
                            <div class="check">
                            <img src={require('../img/LogoSS.PNG')} style={{height:100}}/>
                                <div class="number"></div>
                                <div class="info">
                                <section>
                                    <div class="title font-weight-bold">Event Date</div>
                                    <div>{moment(val.event_date).format('D MMMM YYYY')}</div>
                                </section>
                                <section>
                                    <div class="title font-weight-bold">Type</div>
                                    <div>{val.ticket_name}</div>
                                </section>
                                <section>
                                    <div class="title font-weight-bold">Ticket ID</div>
                                    <div>{val.idtransactionticket}</div>
                                </section>
                                </div>
                            </div>
                            </div>
          )
        })
    }

    render() { 
        const { redirecterror } = this.state;			//REDIRECT
     if (redirecterror) {
       return <Redirect to='/404'/>;
     }
        return (<div className='paddingatas'>
            <Header/>
                <div class="row mb-5">
                            <div class="col-4 mt-5 ml-5 mb-5">
                                <center><h3 className='pgtitle'>{this.state.eventdetail[0].event_name} Tickets</h3></center>
                                <img style={{width: 500}} src={API_URL + this.state.eventdetail[0].event_pic} className='boxshadow mb-3'/>
                                    <div class="">
                                            <div class="ml-3">
                                                <label>Event Date: </label>
                                            </div>
                                            <div class="col-md-8 col-6">
                                            {moment(this.state.eventdetail[0].event_date).format('D MMMM YYYY')}
                                            </div>
                                    </div>
                                    <hr/>
                                    <div class="mb-3">
                                            <div class="ml-3">
                                                <label>Event Location: </label>
                                            </div>
                                            <div class="col-md-12 col-8">
                                            {this.state.eventdetail[0].event_location}
                                            </div>
                                    </div>

                                    <center>
                                    <Link to={{
                                    pathname: '/profile',
                                    state: {
                                    userid: this.props.id
                                    }
                                    }} style={{marginLeft:-15}}><button className='btn btnbiru'>Back</button></Link>

                                    <Pdf targetRef={ref} filename="tickat.pdf">
                                        {({ toPdf }) => <button onClick={toPdf} className='btn btnbiru ml-3'>Print Ticket</button>}
                                    </Pdf>
                                    
                                    </center>
                                    
                            </div>

                            <div className='col-7 mt-5' ref={ref}>
                           {this.renderTicket()}
                            </div>
                </div>
            <Footer/>
        </div>);
    }
}

const mapStateProps = (state) =>{ // Function yang akan terima global state
    return{
      name: state.user.name, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
      id: state.user.id,
      email: state.user.email
    }
}
 
export default connect(mapStateProps,{})(tickets);