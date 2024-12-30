import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ManagerTable.css";
import { useContext } from "react";
import {employeeContext} from "../index";
function Employee() {
    const location = useLocation();
    const navigate = useNavigate();

    const {employees, setEmployees, addEmployee, deleteEmployee, updateEmployee} = useContext(employeeContext);
//This is the function that handles adding new employees and give you input on how you want to add them
    const addEmployees = () => {
        const name = window.prompt("Enter name of employee");
        const isManager = window.prompt("Are they a manager? Answer True or False").toLowerCase() == "true";

        const id = 0;

        const newEmployee = {
            name,
            id,
            isManager
        }

        addEmployee(newEmployee);
    }
//This function handles updating the emplyees, and gives you windows on how you want to update them.
    const updateEmployees = () => {
        const id = window.prompt("Enter id of the employee you wish to update")
        const name = window.prompt("Enter updated name of employee");
        const isManager = window.prompt("Are they a manager? Answer True or False").toLowerCase() == "true";

        const updatedEmployee = {
            name,
            id,
            isManager
        }
        updateEmployee(updatedEmployee);
    }
//This function deletes employees depending on which id you put into the window
    const deleteEmployees = () => 
    {
        const id = window.prompt("Enter the id of the employee you would like to remove");

        deleteEmployee(id);
    }
    //This parts displays the managers' view of the employyes
    return (
        <div>
            <div className="header">
                <div>
                    <h1>Panda Express</h1>
                    {location.pathname !== "/employee" && <button onClick={() => navigate(-1)}>Back</button>}
                </div>
            </div>
            <div className="button-container">
                <button class = "inventory-button" onClick = {addEmployees}>Add Employee Item</button>
                <button class = "inventory-button" onClick = {updateEmployees}>Update Employee Item</button>
                <button class = "inventory-button" onClick = {deleteEmployees}>Delete Employee Item</button>
            </div>
            <div className="inventory-body">
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Employee ID</th>
                        <th>Is Manager</th>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.employeeid}>
                            <td>{employee.name}</td>
                            <td>{employee.employeeid}</td>
                            <td>{employee.ismanager ? "Yes" : "No"}</td>
                        </tr>
                    ))}
            </tbody>
                </table>
            </div>
        </div>
    );
}

export default Employee;
