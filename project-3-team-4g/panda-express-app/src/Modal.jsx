import "./Modal.css";

//Modal screen component
function Modal({ isOpen, onClose, children}) {
    if (!isOpen) return null;

    return (
        <div className="outer-box" onClick={onClose}>
            <div className="inner-box">
                {children}
            </div>
        </div>
    )
}

export default Modal;