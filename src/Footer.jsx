import "./Footer.css"

//Footer component that appears at bottom of screen
function Footer({isOpen, children}) {
    if(!isOpen) return null;

    return (
        <div className="footer">
            {children}
        </div>
    )

}

export default Footer;