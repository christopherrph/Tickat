import React, { Component } from 'react'
import '../App.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import Footer from './footer';
import Header from './navbar';
import { Redirect } from 'react-router-dom'
import NumberFormat from 'react-number-format';
import { API_URL } from '../support/API_URL';
import moment from 'moment';
import Alert from '../Modal/alert';
import Confirmation from '../Modal/confirmation';
import Modal from '../Modal/modal';
import {in_checkout, cancel_checkout} from '../Redux/Action'

class checkout extends Component {

    state = { 
        Ticket: [],
        eventdetail: [{}],
        addImageFileName : 'Select File',
        addImageFile: undefined,
        ticketready: true
     }

    async componentWillUnmount(){   // EVENT SCHEDULER
        window.removeEventListener('beforeunload', this.keepOnPage);
        if(this.state.redirect != 'kehabisan' && this.state.redirect != 'done' ){
        var ticket = this.state.Ticket
        var length = this.state.Ticket.length;
                for(var i=0; i<length; i++){
                    var amount = ticket[i].amount
                    var idtiket = ticket[i].idtiket
                    const ticketadd = await Axios.patch(API_URL + `/user/ticketadd`,{
                        amount,
                        idtiket
                    })
                }
        }
    }

    keepOnPage(e) {
        var message = 'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
        e.returnValue = this.componentWillUnmount
      }


    async componentDidMount(){
        window.addEventListener('beforeunload', this.keepOnPage);
        if(!this.props.location.state){
            this.setState({ redirecterror: true })
        }else{
        const  { LocalCart } = this.props.location.state
        const  { eventdetail } = this.props.location.state
        const res = await this.setState({
                    Ticket: LocalCart,
                    eventdetail: eventdetail
                }, () => {
                    console.log(this.state.Ticket);
                    console.log(this.state.eventdetail);
                })
        }
    }

    onBtnAddImageFile = (e) => {
        console.log(e.target.files[0])
        if(e.target.files[0]){
            this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })   // state addImageFileName diisi dengan nama file, addImageFile diisi dengan filenya
        }else{
            this.setState({ addImageFileName : '', addImageFile : undefined })
        }
      }

    renderTicket = () =>{
        return this.state.Ticket.map((val, index) =>{
            return(
                  <li style={{fontWeight:400}}><p>{val.namatiket} x {val.amount}</p></li>
            )
          })
    }

    renderTicketPayment = () =>{
        return this.state.Ticket.map((val, index) =>{
            var total = val.harga * val.amount
            return(
            <div class="row mt-1">
                <div class="col-6">
                <p style={{fontSize:15}}>{val.namatiket} x {val.amount}</p>
                </div>
                <div class="col-6">
                <p style={{fontSize:15}}><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'IDR '} /></p>
                </div>
            </div>
            )
          })
    }

    renderTotal = () =>{
        var total = 0
        for(var i=0; i<this.state.Ticket.length; i++){
            total += this.state.Ticket[i].harga * this.state.Ticket[i].amount
        }
        return(
            <NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'IDR '}/>
        )
    }

    makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    CheckOutConfirm = (method) =>{
        console.log(this.state.Ticket)
        var stateticket = this.state.Ticket
        var payment_method = method
        var transaction_status = 'Done'
        var transaction_time = moment().format('YYYY-MM-DD HH:mm:ss')
        var date = new Date()
        var month = date.getMonth() + 1  
        var day = date.getDate()
        var year = date.getFullYear()
        let idtransaction = `TRX${day}${month}${this.makeid(8)}`;
        var idevent = this.state.eventdetail[0].idevent
        var iduser = this.props.id
        var totalticket = 0
        for(var i=0; i<this.state.Ticket.length; i++){
            totalticket += this.state.Ticket[i].amount
        }
        var totalprice = 0
        for(var i=0; i<this.state.Ticket.length; i++){
            totalprice += this.state.Ticket[i].harga * this.state.Ticket[i].amount
        }
        Axios.post(API_URL+'/user/addTransaction', {
            idtransaction,idevent,iduser,totalticket, totalprice, payment_method, transaction_time, transaction_status
        }) // formdata berlaku seperti req.body
          .then((res) => {
              this.setState({ redirect: 'done' })
              var email=  this.props.email
              Axios.post(API_URL+'/user/addTransactionTicket', {
                stateticket, idtransaction, idevent, ticket_status: 'Active', email, event_name: this.state.eventdetail[0].event_name, totalticket, totalprice, transaction_time
              })
          })
          .catch((err) => {
            console.log(err)
          })
        
    }

    CheckOutTransfer = () =>{
        let { addImageFile } = this.state;
        var stateticket = this.state.Ticket
        var payment_method = 'Transfer'
        var transaction_status = 'Done'
        var transaction_time = moment().format('YYYY-MM-DD HH:mm:ss')
        var date = new Date()
        var month = date.getMonth() + 1  
        var day = date.getDate()
        let idtransaction = `TRX${day}${month}${this.makeid(8)}`;
        var idevent = this.state.eventdetail[0].idevent
        var iduser = this.props.id
        var totalticket = 0
        for(var i=0; i<this.state.Ticket.length; i++){
            totalticket += this.state.Ticket[i].amount
        }
        var totalprice = 0
        for(var i=0; i<this.state.Ticket.length; i++){
            totalprice += this.state.Ticket[i].harga * this.state.Ticket[i].amount
        }
        let formData = new FormData();
        let obj = {idtransaction, idevent, iduser, totalticket, totalprice, payment_method, transaction_time, transaction_status}
        formData.append('data', JSON.stringify(obj))  //obj diubah jadi string format json
        if(addImageFile){
            formData.append('image', addImageFile) // nambahin image ke formdata
        }
        Axios.post(API_URL+'/user/addTransactionTransfer', formData) // formdata berlaku seperti req.body
        .then((res) => {
            this.setState({ redirect: 'done' })
            var email=  this.props.email
            Axios.post(API_URL+'/user/addTransactionTicket', {
                stateticket, idtransaction, idevent, ticket_status: 'Active', email, event_name: this.state.eventdetail[0].event_name, totalticket, totalprice, transaction_time
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    render() { 
    const { redirecterror } = this.state;			//REDIRECT
     if (redirecterror) {
       return <Redirect to='/404'/>;
     }
    const { redirect } = this.state;			//REDIRECT
     if (redirect == 'kehabisan' ) {
       return <Redirect to='/findtickets'/>;
     }else if(redirect == 'done'){
       return <Redirect to='/transactiondone'/>;
     }
        return ( 
            <div className='paddingatas'>
                <Header/>
                <div class="container mb-5 mt-5 pb-5">
                    <div className='row'>
                        <div class="p-3 mb-2 bg-light text-dark col-7 mt-4 mb-5">
                            <label className='' style={{fontSize:25}}>Order Summary</label>
                            <br/>
                            <h6>{this.state.eventdetail[0].event_name}</h6>
                            <hr/>
                                <div className='row' style={{marginBottom:-20}}>
                                    <div className='col-6' style={{fontWeight:500}}>
                                        <label style={{fontSize:18}}>Ticket Type: </label>
                                        <ul style={{marginLeft:-20}}>
                                            {this.renderTicket()}
                                        </ul>
                                    </div>
                                    <div className='col-6'>
                                        <label style={{fontSize:18, paddingRight:10}}>Date: </label> <br/>
                                        {moment(this.state.eventdetail[0].event_date).format('dddd Do MMMM YYYY')}
                                    </div>
                                </div>
                            <br/>
                        </div>

                        <div class="p-3 mb-2 bg-light text-dark col-4 ml-4 mt-4 mb-5">
                            <label style={{fontSize:25}}>Payment Summary</label>
                            <hr/>
                            {this.renderTicketPayment()}
                            <hr/>
                            <div class="row">
                                <div class="col-6">
                                <p style={{fontSize:15}}>Total Payment:</p>
                                </div>
                                <div class="col-6">
                                {this.renderTotal()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div class="mb-2 bg-light text-dark col-7 pt-4 mb-5">
                                <label style={{fontSize:25}}>Other Payment Method</label>
                                <hr/>
                                <div className='col-10 hovercursorpointer' data-toggle="modal" data-target="#bca">
                                    <label className='hovercursorpointer' style={{fontSize:20, color:'#595959'}}> BCA Virtual Account </label> 
                                    <img style={{height:45, float:'right'}} src={API_URL+'/payment/bca.png'}/>
                                    <Modal idmodal="bca" body={
                                        <div>
                                        <img style={{height:80}} src={API_URL+'/payment/bca.png'}/><br/>
                                        <label>Important Notice:</label>
                                        <p style={{fontSize:12}}>Any payment made to another bank account will not be processed.</p>
                                        <hr/>
                                        <p style={{fontSize:19}}>Virtual Account Number: 3947 1001 0166 6969</p>
                                        <hr/>
                                        <label style={{fontSize:19}}>Total Payment : {this.renderTotal()}</label>
                                        </div>
                                    } title='BCA Virtual Account'>
                                    <button type='button' data-dismiss="modal" data-toggle="modal" data-target="#checkoutconfirmationbca" className='btn btnbiru' onClick={this.CheckOut}>Confirm</button>
                                    </Modal>
                                </div>
                                <hr/>
                                <div className='col-10 hovercursorpointer'  data-toggle="modal" data-target="#methodunavailable">
                                    <label className='hovercursorpointer' style={{fontSize:20, color:'#595959'}}> Mandiri Virtual Account </label> 
                                    <img style={{height:45, float:'right'}} src={API_URL+'/payment/mandiri.png'}/>
                                    <Alert idbutton="unavail" idmodal="methodunavailable" message="This Payment Method Is Currently Unavailable :("/>
                                </div>
                                <hr/>
                                <div className='col-10 hovercursorpointer'  data-toggle="modal" data-target="#methodunavailable">
                                    <label className='hovercursorpointer' style={{fontSize:20, color:'#595959'}}> BNI Virtual Account </label> 
                                    <img style={{height:45, float:'right'}} src={API_URL+'/payment/bni.png'}/>
                                </div>
                                <hr/>
                                <div className='col-10 hovercursorpointer'  data-toggle="modal" data-target="#methodunavailable">
                                    <label className='hovercursorpointer' style={{fontSize:20, color:'#595959'}}> BRI Virtual Account </label> 
                                    <img style={{height:45, float:'right'}} src={API_URL+'/payment/briva.png'}/>
                                </div>
                                <hr/>
                                <div className='col-10 hovercursorpointer' data-toggle="modal" data-target="#gopay">
                                    <label className='hovercursorpointer' style={{fontSize:20, color:'#595959'}}> Gopay </label> 
                                    <img style={{height:45, float:'right'}} src={API_URL+'/payment/gopay.png'}/>
                                    <Modal idmodal="gopay" body={
                                        <div>
                                        <img style={{height:80}} src={API_URL+'/payment/gopay.png'}/><br/>
                                        <label>Important Notice:</label>
                                        <p style={{fontSize:12}}>Please make sure you have an active Gojek account. You will be redirected to the Gojek apps to finish your transactions</p>
                                        <center>
                                            <img style={{height:200}} src={API_URL+'/payment/gojekqr.png'}/><br/>
                                            <label>Total Payment : {this.renderTotal()}</label>
                                        </center>
                                        <ol style={{fontSize: 12}}>
                                            <li>Open your Gojek App</li>
                                            <li>Choose "Pay" and scan the QR code above</li>
                                            <li>Check your payment and press "Pay & Confirm"</li>
                                            <li>Enter your pin code</li>
                                            <li>Click "Confirm" on the Tickat website</li>
                                            <li>Transaction Finished</li>
                                        </ol>
                                        </div>
                                    } title='Gopay'>
                                    <button type='button' data-dismiss="modal" className='btn btnbiru' data-toggle="modal" data-target="#checkoutconfirmationgopay">Confirm</button>
                                    </Modal>
                                </div>
                                <hr/>
                        </div>
                        <div class="p-3 mb-2 bg-light text-dark col-4 ml-4 mb-5">
                        <label style={{fontSize:25}}>Bank Transfer</label>
                                <hr/>
                                <div className='col-10 hovercursorpointer' data-toggle="modal" data-target="#banktransfer">
                                        <div>
                                        <label>Important Notice:</label>
                                        <p style={{fontSize:12}}>Any payment made to bank account other than the following will not be processed.</p>
                                        <hr/>
                                        <img style={{height:50}} src={API_URL+'/payment/BCA.png'}/><br/>
                                        <p style={{fontSize:19}}>BCA: 6900 2020 03</p>
                                        <hr/>
                                        <img style={{height:50}} src={API_URL+'/payment/Mandiri.png'}/><br/>
                                        <p style={{fontSize:19}}>Mandiri: 6900 2020 03</p>
                                        <hr/>
                                        <img style={{height:50}} src={API_URL+'/payment/BNI.png'}/><br/>
                                        <p style={{fontSize:19}}>BNI: 6900 2020 03</p>
                                        <hr/>
                                        <label style={{fontSize:19}}>Total Payment : {this.renderTotal()}</label><br/>
                                        <label>Payment Receipt:</label>
                                        <input type="file" id='image' class="form-control" placeholder="" onChange={this.onBtnAddImageFile} label={this.state.receiptfilename}/>
                                        <br/>
                                        <center>
                                            {
                                                this.state.addImageFile == undefined
                                                ?
                                                <button type='button' className='btn btnbiru'disabled>Confirm</button>
                                                :
                                                <button type='button' className='btn btnbiru' onClick={this.CheckOutTransfer}>Confirm</button>
                                            }
                                            
                                        </center>
                                        </div>
                                </div>
                                <hr/>
                        </div>
                    </div>


                <Confirmation idmodal="checkoutconfirmationgopay" message="Are You Sure You Want To Check Out?" title='Check Out'>
                <button type='button' data-dismiss="modal" className='btn btnbiru' onClick={() => this.CheckOutConfirm("Gopay")}>Check Out</button>
                </Confirmation>
                <Confirmation idmodal="checkoutconfirmationbca" message="Are You Sure You Want To Check Out?" title='Check Out'>
                <button type='button' data-dismiss="modal" className='btn btnbiru' onClick={() => this.CheckOutConfirm("BCA")}>Check Out</button>
                </Confirmation>
                </div>
                <Footer/>
            </div>
         );
    }
}

const mapStateToProps = (state) =>{ // Function yang akan terima global state
    return{
      name: state.user.name, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
      id: state.user.id,
      email: state.user.email,
      checkout: state.checkout.checkout
    }
}
 
export default connect (mapStateToProps,{in_checkout, cancel_checkout})(checkout);