import React, { Component } from 'react';

//idmodal, idbutton, message


const Alert = (props) => {
    return (
        <div>
        <button  style={{display:'none'}} type="button" class="btn" data-toggle="modal" data-target={"#"+props.idmodal} id={props.idbutton}>
                </button>
                <div class="modal fade" id={props.idmodal} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-body">
                        <p>{props.message}</p>
                    </div>
                    </div>
                </div>
        </div>
        </div>
    )
}

export default Alert;