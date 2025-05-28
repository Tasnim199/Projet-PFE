import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

export default function ModalWrapper({ isOpen, onRequestClose, children }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="custom-overlay"
      className="custom-modal"
      portalClassName="modal-portal"
    >
      {children}
    </ReactModal>
  );
} 
