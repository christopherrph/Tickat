import React, { Component } from 'react'
import '../App.css';
import {connect} from 'react-redux' // Harus ada untuk akses global state
import Axios from 'axios';
import { Link } from 'react-router-dom'

class footer extends Component {
    state = {  }
    render() { 
        return ( 
        <div>

        <section id="footer">
        <center>
		<div class="container">
			<div class="row text-center text-xs-center text-sm-left text-md-left" style={{marginLeft:250}}>
				<div class="col-sm-3">
					<h5>Quick links</h5>
					<ul class="list-unstyled quick-links">
						<li><a href="javascript:void();"><i class="fa fa-angle-double-right"></i>Home</a></li>
						<li><a href="javascript:void();"><i class="fa fa-angle-double-right"></i>Find Tickets</a></li>
						<li><a href="javascript:void();"><i class="fa fa-angle-double-right"></i>About Us</a></li>
						<li><a href="javascript:void();"><i class="fa fa-angle-double-right"></i>Contact Us</a></li>
					</ul>
				</div>
				<div class="col-sm-8">
                <div class="col-sm-8 text-center text-white">
					<ul class="list-unstyled list-inline social text-center">
						<li class="list-inline-item"><a href=""><i class="fa fa-facebook"></i></a></li>
						<li class="list-inline-item"><a href=""><i class="fa fa-twitter"></i></a></li>
						<li class="list-inline-item"><a href=""><i class="fa fa-instagram"></i></a></li>
						<li class="list-inline-item"><a href=""><i class="fa fa-google-plus"></i></a></li>
						<li class="list-inline-item"><a href="" target="_blank"><i class="fa fa-envelope"></i></a></li>
					</ul>
                </div>    
                <div class="col-sm-8 text-center text-white">
					<p style={{fontSize:16}}>Tickat</p>
					<h5>Copyright © 2020 Tickat. All Rights Reserved.</h5>
				</div>
				</div>
			</div>
            
		</div>
        </center>
	</section>
    
    </div>
         );
    }
}
 
export default footer;