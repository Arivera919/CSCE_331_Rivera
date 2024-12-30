import "./Modal.css";

//This file just shows how the modal will looked. This was mostly used to show menuitem reviews and nutritional data
function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}