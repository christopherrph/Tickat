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
			<div class="row text-center text-xs-center text-sm-left text-md-left pb-3" style={{marginLeft:'25%'}}>
				<div class="col-sm-12">
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
					<p style={{fontSize:16}}>Copyright © 2020 Tickat. All Rights Reserved.</p>
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