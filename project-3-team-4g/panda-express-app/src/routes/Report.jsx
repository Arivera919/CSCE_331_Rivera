import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Report.css";
import { useContext } from "react";
import {reportContext} from "../index";
import { orderContext } from "../index";


function Report() {
    const location = useLocation();
    const navigate = useNavigate();

    const {reportRows, reportCols,setReportCols, setReportRows, productUsageChart, salesReport, xReport} = useContext(reportContext);

    const{cardSales, cashSales, diningSales, setCardSales, setCashSales, setDiningSales} = useContext(orderContext);

    //shows the product usage chart based on the window prompts
    const productUsageCharts = () => {
        const startDate = window.prompt("Start Date (yyyy-mm-dd): ");
        const endDate = window.prompt("End Date (yyyy-mm-dd): ");

        productUsageChart(startDate, endDate);
    }

    //shows x reports
    const xReports = () => 
    {
        xReport();
    }
//shows z reports
    const zReports = () => 
    {
        setReportCols(["Category", "Amount ($)"]);

        const totalSales = (Number(cashSales) + Number(cardSales) + Number(diningSales)).toFixed(2);
        const totalTaxes = (Number(totalSales) * 0.07).toFixed(2);
        const grandTotal = (Number(totalSales) * 1.07).toFixed(2);

        const reportData = [
            { Category: "Cash Sales", Amount:  cashSales },
            { Category: "Card Sales", Amount: cardSales },
            { Category: "Dining Sales", Amount: diningSales },
            { Category: "Total Sales", Amount: totalSales },
            { Category: "Total Taxes", Amount:  totalTaxes },
            { Category: "Grand Total", Amount:  grandTotal }
        ];

        setReportRows(reportData);

        setCardSales(0);
        setCashSales(0);
        setDiningSales(0);
    }
//shows sales reports
    const salesReports = () => {
        const startDate = window.prompt("Start Date (yyyy-mm-dd): ");
        const startTime = window.prompt("Enter Start Time (HH:mm:ss): ")
        const endDate = window.prompt("End Date (yyyy-mm-dd): ");
        const endTime = window.prompt("Enter Start Time (HH:mm:ss):")

        salesReport(startDate, startTime, endDate, endTime);
    }
//Shows the buttons that are used to see each type of report
    return (
        <div>
            <div className="header">
                <div>
                    <h1>Panda Express</h1>
                    {location.pathname !== "/inventory" && <button onClick={() => navigate(-1)}>Back</button>}
                </div>
            </div>
            <div className="button-container">
                <button class = "report-button" onClick = {productUsageCharts}>Product Usage Chart</button>
                <button class = "report-button" onClick = {xReports}>X Report</button>
                <button class = "report-button" onClick = {zReports}>Z Report</button>
                <button class = "report-button" onClick = {salesReports}>Sales Report</button>
            </div>
            <div className="report-body">
                <table>
                    <thead>
                        <tr>
                            {reportCols.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reportRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.entries(row).map(([key, value], cellIndex) => (<td key={cellIndex}>{value}</td>))}
                            </tr> ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Report;
