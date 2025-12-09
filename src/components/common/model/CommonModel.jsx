import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'bootstrap';

function CommonModel({ show, onClose,size, children }) {
    const modalRef = useRef();

    useEffect(() => {
        // Dynamically import bootstrap to avoid SSR issues if any
        // const { Modal } = require('bootstrap');
        const modalElement = modalRef.current;
        // Get or create a modal instance
        const bsModal = Modal.getOrCreateInstance(modalElement);

        // Show or hide the modal based on the 'show' prop
        if (show) {
            bsModal.show();
        } else {
            bsModal.hide();
        }

        // Cleanup: When the modal is closed by Bootstrap events (e.g., clicking 'x' or backdrop), update React state.
        const handleHidden = () => onClose();
        modalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => modalElement.removeEventListener('hidden.bs.modal', handleHidden);

    }, [show, onClose]);

    return (
        <div className={`modal fade ${size ? size : ""}`} ref={modalRef} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!show}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
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
}

CommonModel.defaultProps = {
    show: false,
}

export default CommonModel;
