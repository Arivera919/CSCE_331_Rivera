import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Manager.css";


//This function just displays the managers display
//most used as a navigation page to the other things that the manager can do
function Manager() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div>
            <div className="manager-header">
                <div>
                    <h1>Panda Express</h1>
                    {location.pathname !== "/manager" && <button onClick={() => navigate(-1)}>Back</button>}
                </div>
            </div>
            <div className="manager-body">
                <div className="manager-container">
                    <Link to={"/manager/inventory"}><button className="manager-button">Inventory</button></Link>
                    <Link to={"/manager/menuitem"}><button className="manager-button">Menu Items</button></Link>
                    <Link to={"/manager/employee"}><button className="manager-button">Employees</button></Link>
                    <Link to={"/manager/report"}><button className="manager-button">Reports</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Manager;
