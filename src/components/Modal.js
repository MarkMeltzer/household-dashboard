import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../css/components/Modal.css";

function Modal({ children, activator }) {
  const [showModal, setShowModal] = useState(false);

	const clickOutside = (e) => {
		if (e.target.classList.contains("modal-container")) {
			setShowModal(false);
		}
	}

	const clickActivator = (e) => {
		setShowModal(true);
	}

  return (
    <>
      <div className="activator" onClick={clickActivator}>{activator}</div>
      {showModal &&
        createPortal(
          <div className="modal-container" onClick={clickOutside}>
            <div className="modal">
              <button
                onClick={() => setShowModal(false)}
                className="close-button"
              >
                Close
              </button>
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Modal;
