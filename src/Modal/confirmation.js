import React, { Component } from 'react';

//idmodal, message, title

const Confirmation = (props) => {
    return (
        <div>
        <div class="modal fade" id={props.idmodal} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{props.title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{props.message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id={props.idmodal+'dismiss'} class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        {props.children}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirmation;