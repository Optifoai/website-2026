import React from "react";

function Spinner() {
   
    return (
        <div className="loader-main">
                          <div class="lds-ellipsis">
                            <div><small className="x-large" >.</small></div>
                            <div><small>.</small></div>
                            <div><small>.</small></div>
                            <div></div>
                          </div>
                        </div>
    )
}

export default Spinner;