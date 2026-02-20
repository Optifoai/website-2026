import React from 'react';
import PropTypes from 'prop-types';


function CommonModel({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" >
                <div className="modal-content-react modal-content"
                    onClick={(e) => e.stopPropagation()}  
                >
                    <div className="modal-body custom-modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

CommonModel.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    actionModal: PropTypes.func.isRequired,
    
}

CommonModel.defaultProps = {
    show: false,
}

export default CommonModel;
