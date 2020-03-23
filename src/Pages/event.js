import React, { Component } from 'react'
import '../Profile.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { API_URL } from '../support/API_URL';
import Footer from './footer';
import Header from './navbar';
import moment from 'moment'
import {Helmet} from "react-helmet";
import Alert from '../Modal/alert';
import Confirmation from '../Modal/confirmation';
import NumberFormat from 'react-number-format';
import { GoTrashcan } from 'react-icons/go';
import { Redirect } from 'react-router-dom'

class event extends Component {
    state = { 
        LocalCart: [],
        TotalPriceCart: 0,
        addImageFileName : 'Select File',
        addImageFile: undefined,
        eventdetail: [{}],
        ticketlist: [{}],
        ticketleft: 0,
        redirect: false,
        eventbycategory:[]
     }

    async componentDidMount(){
        var id = window.location.pathname;
        id = id.replace('/event/', '')  
        console.log(id)

        const getEventById = await Axios.get(API_URL + `/admin/getEventById/${id}`)
        this.setState({eventdetail: getEventById.data})

        const getEventByCategory = await Axios.get(API_URL + `/user/getEventByCategory/${this.state.eventdetail[0].idcategory}`)
        this.setState({eventbycategory: getEventByCategory.data})
        console.log(this.state.eventbycategory)

        Axios.get(API_URL + `/admin/getTicketByEvent/${id}`)
          .then((res) =>  {
              this.setState({
                ticketlist:res.data
              })
          })
          .catch((err) =>{
            console.log(err)
        })
        Axios.get(API_URL + `/user/countTicketLeft/${id}`)
          .then((res) =>  {
              this.setState({
                ticketleft:res.data[0].TotalStock
              })
          })
          .catch((err) =>{
            console.log(err)
        })
        }

        findWithAttr = (array, attr, value) => {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        addtoLocalCart = (idtiket, namatiket, harga) =>{
            if(!this.props.id){
                document.getElementById("loginfirst").click()
            }else{
                var searchindex = this.findWithAttr(this.state.LocalCart, 'idtiket', idtiket)
                if(searchindex != -1 ){
                let { LocalCart } = this.state;   
                let amount = document.getElementById(`${idtiket}`).value;
                amount = parseInt(amount)
                LocalCart[searchindex].amount = amount;
                this.setState({
                    LocalCart: LocalCart
                })

                }else{
                let { LocalCart } = this.state;
                let amount = document.getElementById(`${idtiket}`).value
                amount = parseInt(amount)
                var tiket={
                    idtiket,
                    namatiket,
                    harga,
                    amount
                }
                LocalCart.push(tiket)
                    this.setState({
                    LocalCart: LocalCart
                })
                console.log(this.state.LocalCart)
                }
            }
        }

        cutsentence = (kalimat) =>{
            var sentence = kalimat.split('')
            var hasil = '';
            if(sentence.length <= 26){
                return kalimat
            }else{
                for(var i=0; i<21; i++){
                    hasil += sentence[i] + '';
                }
                return `${hasil}...`
            }
        }

        renderevent = () =>{
            var x = this.state.eventbycategory.slice(0,4)
                return x.map((val, index) =>{
                  return(
                    <div class="card" style={{width: '18rem'}}>
                            <img class="card-img-top" src={API_URL + val.event_pic} alt="Card image cap"/>
                            <div class="card-body">
                                <h5 class="card-title font-weight-bold" style={{fontSize:15}}>{this.cutsentence(val.event_name)}</h5>
                            </div>
                            <Link to={`/event/${val.idevent}`} onClick={this.refreshPage}><a href="#" class="btn btnbiru mb-3 hovergede">View Ticket</a></Link>
                    </div>
                  )
              })
            }

        refreshPage = () =>{
            setTimeout(function(){ 
                window.location.reload()
                window.scrollTo(0, 0)
                ; }, 500);
        }

        renderTotalTicket = () =>{
            var total = 0;
            for(var i=0; i<this.state.LocalCart.length; i++){
                var amount = this.state.LocalCart[i].amount
                total = total + amount
            }
            return(
                <label style={{fontSize:18}}>Total Tickets: {total}</label>
            )
        }

        renderTotal = () =>{
            var total = 0
            for(var i=0; i<this.state.LocalCart.length; i++){
                total += this.state.LocalCart[i].harga * this.state.LocalCart[i].amount
            }
            return(
                <label style={{fontSize:18}}>Total Price: <NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></label>
            )
        }

        async CheckOut(ticket){
            console.log(ticket)
            var length = ticket.length;
            var siap = true
            for(var i=0; i<length; i++){
                console.log(ticket[i].amount)
                const amountleft = await Axios.get(API_URL + `/user/getticketamount/${ticket[i].idtiket}`)
                console.log(amountleft.data[0].ticket_stock)
                var amount = ticket[i].amount
                var idtiket = ticket[i].idtiket
                var sisa = amountleft.data[0].ticket_stock - amount
                if(sisa < 0){
                    siap = false
                }
            }
            this.subticket(siap)
        }

        async subticket(siap){
            if(siap == false){
                document.getElementById("soldout").click()
                this.componentDidMount()
            }else{
                var ticket = this.state.LocalCart
                var length = this.state.LocalCart.length;
                for(var i=0; i<length; i++){
                    console.log(ticket[i].amount)
                    const amountleft = await Axios.get(API_URL + `/user/getticketamount/${ticket[i].idtiket}`)
                    console.log(amountleft.data[0].ticket_stock)
                    var amount = ticket[i].amount
                    var idtiket = ticket[i].idtiket
                    var sisa = amountleft.data[0].ticket_stock - amount
                    const ticketcut = await Axios.patch(API_URL + `/user/ticketsub`,{
                        sisa,
                        idtiket
                    })
                }
                this.setState({ redirect: true });
            }
        }

        renderLocalCart = () =>{
            return this.state.LocalCart.map((val, index) =>{
                var total = val.harga * val.amount
                return(
                    <div class="row border-bottom mb-4 mt-3">
                        <div class="col-3">
                        <label style={{fontSize:18}}>{val.namatiket}</label>
                        </div>
                        <div class="col-3">
                        <label style={{fontSize:18}}>{val.amount} Tickets</label>
                        </div>
                        <div class="col-2">
                        <label style={{fontSize:18}}><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></label>
                        </div>
                        <div class="col-2 ml-5 mb-2">
                        <GoTrashcan className='hovercursor' onClick={() => this.removeLocalCart(index)} color='#b3b3b3' size='1.5em'/>
                        </div>
                    </div>
                )
              })
        }

        removeLocalCart = (index) =>{
            var array = this.state.LocalCart;
            array.splice(index,1)
            this.setState({
                LocalCart: array
            })
        }

        renderTicket = () =>{
            return this.state.ticketlist.map((val, index) =>{
                var harga = val.ticket_price;
                return(
                    <div class="row border-bottom mb-5 mt-5">
                        <div class="col-3">
                        <label style={{fontSize:23}}>{val.ticket_name}</label>
                        </div>
                        <div class="col-3">
                        <NumberFormat value={harga} displayType={'text'} thousandSeparator={true} prefix={'IDR '} />
                        </div>
                        <div class="col-3">
                        {val.ticket_stock} Tickets Available
                        </div>
                        <div class="col-1">
                        {
                            val.ticket_stock > 5
                            ?
                            <input type='number' id={val.idticket} min='1' max='5' placeholder='0' defaultValue='1' className='mw-100'/>
                            :
                                val.ticket_stock == 0
                                ?
                                <input type='number' className='mw-100' placeholder='0' disabled/>
                                :
                                <input type='number' id={val.idticket} min='1' max={val.ticket_stock} placeholder='0' defaultValue='1' className='mw-100'/>
                        }
                        </div>
                        <div class="col-1 ml-5">
                        {
                             val.ticket_stock == 0
                             ?
                             <button className='btn btn-block btnbiru' onClick={() => this.addtoLocalCart(val.idticket, val.ticket_name, val.ticket_price)} disabled>Buy</button>
                             :
                             <button className='btn btn-block btnbiru' onClick={() => this.addtoLocalCart(val.idticket, val.ticket_name, val.ticket_price)}>Buy</button>
                        }
                        
                        </div>
                    </div>
                )
            })
        }


    render() { 
    const { redirect } = this.state;

     if (redirect) {
       return <Redirect to={{
        pathname: '/checkout',
        state: {
        LocalCart: this.state.LocalCart,
        eventdetail:  this.state.eventdetail
        }}}/>;
     }


        return (<div className='paddingatas'>
            <Header/>
    <div class="container mb-5 mt-5 pb-2">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title mb-4">
                            <div class="d-flex justify-content-start">
                                <div class="userData ml-3">
                                    <h6 class="d-block"> <Link to='/findtickets'><a style={{color:'#1F5E99'}}>Tickets</a></Link> > <a>{this.state.eventdetail[0].event_name}</a></h6>
                                    <h2 class="d-block"><a className='pgtitle'> {this.state.eventdetail[0].event_name} </a></h2>
                                </div>  
                            </div>
                        </div>

                        <div className='row mb-3 ml-1'>
                            <div className='col-6'>
                            <img src={API_URL+this.state.eventdetail[0].event_pic} style={{height: '100%', maxHeight: '350px',width: 'auto', maxWidth:'650px'}}/>
                            </div>
                            <div className='col-6' style={{paddingLeft:'15%'}}>
                            <div class="" style={{width:'18rem'}}>
                                <div class="card-body">
                                    <h5 class="card-title pgtitle">{this.state.eventdetail[0].event_name}</h5>
                                    <p class="card-text border-bottom pb-2"> <i class="fa fa-calendar mr-4" aria-hidden="true"></i> {moment(this.state.eventdetail[0].event_Date).format('D MMMM YYYY')}</p>
                                    <p class="card-text border-bottom pb-2"><i class="fa fa-map-marker mr-4" aria-hidden="true"></i> {this.state.eventdetail[0].event_location}</p>
                                    <p class="card-text border-bottom pb-2"><i class="fa fa-ticket mr-4" aria-hidden="true"></i> {this.state.ticketleft} Tickets Available </p>
                                    <p class="card-text pb-2"><i class="fa fa-tag mr-4" aria-hidden="true"></i> {this.state.eventdetail[0].category_name}</p>
                                </div>
                                {/* <div class="card-body">
                                    <button className='btn btn-block btnbiru'>Buy Tickets</button>
                                </div> */}
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link active" id="basicInfo-tab" data-toggle="tab" href="#basicInfo" role="tab" aria-controls="basicInfo" aria-selected="true">Tickets</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="connectedServices-tab" data-toggle="tab" href="#connectedServices" role="tab" aria-controls="connectedServices" aria-selected="false">Description</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="connectedServices-tab" data-toggle="tab" href="#connectedServices1" role="tab" aria-controls="connectedServices1" aria-selected="false">Terms & Conditions</a>
                                    </li>
                                </ul>
                                <div class="tab-content ml-1" id="myTabContent">
                                    <div class="tab-pane fade show active" id="basicInfo" role="tabpanel" aria-labelledby="basicInfo-tab">
                                        {this.renderTicket()}
                                    </div>
                                    <div class="tab-pane fade" id="connectedServices" role="tabpanel" aria-labelledby="ConnectedServices-tab">
                                        <div id='description' dangerouslySetInnerHTML={{ __html: `${this.state.eventdetail[0].event_description}`}}>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="connectedServices1" role="tabpanel" aria-labelledby="ConnectedServices1-tab">
                                        <div id='terms' dangerouslySetInnerHTML={{ __html: `${this.state.eventdetail[0].event_terms}`}}>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3 mb-2 bg-light text-dark">
                                    <label className='border-bottom' style={{fontSize:20}}>Your Tickets</label>
                                    {this.renderLocalCart()}
                                    <br/>
                                    <div className='row'>
                                        <div className='col-4'>
                                        {this.renderTotalTicket()}
                                        </div>
                                        <div className='col-4'>
                                        {this.renderTotal()}
                                        </div>
                                        <div className='col-2'>
                                        {
                                            this.state.LocalCart.length == 0
                                            ?
                                            <button className='btn btn-block btnbiru' disabled>Check Out</button>
                                            :
                                            // <Link to={{
                                            //     pathname: '/checkout',
                                            //     state: {
                                            //         LocalCart: this.state.LocalCart
                                            //     }
                                            // }}><button className='btn btn-block btnbiru' onClick={this.CheckOut}>Check Out</button></Link>
                                            <button className='btn btn-block btnbiru' data-toggle="modal" data-target="#checkoutconfirmation">Check Out</button>
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <center><h3 className='pgtitle mt-5'>OTHER SIMILAR EVENTS</h3></center>
                <div className='row discoverevent'>
                    {this.renderevent()}
                </div>
            </div>
        </div>
    </div>
        
        <Alert idbutton="soldout" idmodal="soldoutmodal" message="Tickets Sold Out :("/>
        <Alert idbutton="loginfirst" idmodal="loginfirstmodal" message="Please Login To Buy Tickets"/>

        <Confirmation idmodal="checkoutconfirmation" message="Are You Sure You Want To Check Out?" title='Check Out'>
                <button type='button' data-dismiss="modal" className='btn btnbiru' onClick={() => this.CheckOut(this.state.LocalCart)}>Check Out</button>
        </Confirmation>

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
 
export default connect(mapStateProps)(event);  