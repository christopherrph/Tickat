import React, { Component } from 'react'
import '../App.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'
import {logout} from '../Redux/Action'
import { Redirect } from 'react-router-dom'
import { keeplogin } from '../Redux/Action'

class navbar extends Component {

    componentDidMount(){
        let { keeplogin } = this.props;
        keeplogin()
    }

    logout = () =>{
        this.props.logout();
        this.setState({ redirect: true })
    }

    state = {  }
    render() { 
        const { redirect } = this.state;
        if (redirect) {
          return <Redirect to='/'/>;
        }

        return ( 
                <div className='Navbar row '>
                    <img src={require('../img/LogoSS.PNG')} style={{height:60, marginLeft:150}}/>
                    <div className='menu row'>
                    <Link to='/' className='pilihanmenu'>Home</Link>
                    <Link to='/findtickets' className='pilihanmenu'>Find Tickets</Link>
                        <a href='' className='pilihanmenu'>About Us</a>
                    <Link to='/contactus' className='pilihanmenu'>Contact Us</Link>
                    {
                        this.props.id
                        ?
                        <Link to={{
                            pathname: '/profile',
                            state: {
                              userid: this.props.id
                            }
                          }} className='pilihanmenu'>{this.props.name}</Link>
                        :
                        <Link to='/login' className='pilihanmenu'>Login</Link>
                    }

                    {
                        this.props.id
                        ?
                        <a href='' onClick={this.logout} className='pilihanmenu'>Sign Out</a>
                        :
                        <Link to='/register' className='pilihanmenu'>Register</Link>
                    }
                    </div>
                </div>
         );
    }
}


const mapStateProps = (state) =>{ // Function yang akan terima global state
    return{
      name: state.user.name, //state.user(merujuk ke index.js reducer).username(masuk ke global state di authReducer)
      id: state.user.id,
      email: state.user.email
    }
}
 
export default connect(mapStateProps,{logout, keeplogin})(navbar);     //parameter connect memiliki 2 parameter. parameter pertama untuk mengambil gstate, parameter kedua untuk menuliis ke dalam gstate