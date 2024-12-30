import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

/**
 * Creates the panel for accessing charts and reports
 */
public class Reports extends JPanel {

    static DefaultListModel<String> listModel;
    static JList<String> orders;
    private JTable table;
    static double cardSales = 0.0;
    static double cashSales = 0.0;
    static double diningSales = 0.0;

    public Reports() {
        // Building the connection
        Connection conn = null;
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        try {
            conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        JOptionPane.showMessageDialog(null, "Opened database successfully");

        // ties all actionListeners together
        GUI s = new GUI();
        listModel = new DefaultListModel<>();

        // Create all the panels
        JPanel viewPanel = new JPanel();
        JPanel reportPanel = new JPanel();

        // Customize panels for layout and size
        viewPanel.setLayout(new GridLayout(5, 1, 10, 10));
        reportPanel.setLayout(new GridLayout(6, 1, 10, 10));

        // add buttons
        JButton inventory = new JButton("Inventory");
        inventory.addActionListener(s);
        inventory.setPreferredSize(new Dimension(200, 50));
        JButton menu = new JButton("Menu");
        menu.addActionListener(s);
        menu.setPreferredSize(new Dimension(200, 50));
        JButton employees = new JButton("Employees");
        employees.addActionListener(s);
        employees.setPreferredSize(new Dimension(200, 50));
        JButton reports = new JButton("Reports");
        reports.addActionListener(s);
        reports.setPreferredSize(new Dimension(200, 50));

        viewPanel.add(inventory);
        viewPanel.add(menu);
        viewPanel.add(employees);
        viewPanel.add(reports);

        // add specific report tab buttons
        JButton productUsageBtn = new JButton("Product Usage Chart");
        JButton xReportBtn = new JButton("X-Report");
        JButton zReportBtn = new JButton("Z-Report");
        JButton salesReportBtn = new JButton("Sales Report");
        productUsageBtn.addActionListener(e -> productUsageChart());
        xReportBtn.addActionListener(e -> xReport());
        zReportBtn.addActionListener(e -> zReport());
        salesReportBtn.addActionListener(e -> salesReport());
        reportPanel.add(productUsageBtn);
        reportPanel.add(xReportBtn);
        reportPanel.add(zReportBtn);
        reportPanel.add(salesReportBtn);

        JButton b = new JButton("Close");
        b.addActionListener(s);

        // make container panel to house other panels
        JPanel containerPanel = new JPanel();
        containerPanel.setLayout(new BorderLayout());
        containerPanel.add(viewPanel, BorderLayout.EAST);
        containerPanel.add(reportPanel, BorderLayout.WEST);

        JPanel closePanel = new JPanel();
        closePanel.setLayout(new FlowLayout(FlowLayout.CENTER));
        closePanel.add(b);
        containerPanel.add(closePanel, BorderLayout.SOUTH);

        // taking in Query and column names
        String[] columnNames = { "Week Number", "Order Count" };
        String sql = "SELECT EXTRACT(WEEK FROM dateof) AS week_number, COUNT(orderID) AS order_count\r\n" + //
                "FROM orders\r\n" + //
                "GROUP BY EXTRACT(WEEK FROM dateof)\r\n" + //
                "ORDER BY week_number;";
        Object[][] data = fetchData(sql, conn); // Initialize with no data

        // make the table
        table = new JTable(new DefaultTableModel(data, columnNames));
        JScrollPane tablePane = new JScrollPane(table);
        tablePane.setPreferredSize(new Dimension(650, 600));

        containerPanel.add(tablePane, BorderLayout.CENTER);

        add(containerPanel);

        // closing the connection
        try {
            conn.close();
            JOptionPane.showMessageDialog(null, "Connection Closed.");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Connection NOT Closed.");
        }
    }

    /**
     * Gives a table for the ingredients used in the time range given
     * 
     * @throws Exception error with database connection
     * @author Dylan Hoang
     */
    private void productUsageChart() {
        JFrame dategetter = new JFrame();
        JButton submitbutton = new JButton("Submit");

        JPanel panel = new JPanel();
        JLabel startDateLabel = new JLabel("Start Date (yyyy-mm-dd):");
        JTextField startDateField = new JTextField(10);
        JLabel endDateLabel = new JLabel("End Date (yyyy-mm-dd):");
        JTextField endDateField = new JTextField(10);
        panel.add(startDateLabel);
        panel.add(startDateField);
        panel.add(endDateLabel);
        panel.add(endDateField);
        panel.setLayout(new FlowLayout());
        dategetter.setSize(800, 400);
        panel.add(submitbutton);
        dategetter.add(panel);
        dategetter.setVisible(true);

        submitbutton.addActionListener((ActionListener) new ActionListener() {
            public void actionPerformed(ActionEvent ae) {
                try {
                    Connection conn = null;
                    String database_name = "team_4g_db";
                    String database_user = "team_4g";
                    String database_password = "goldcheese58";
                    String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s",
                            database_name);
                    try {
                        conn = DriverManager.getConnection(database_url, database_user, database_password);
                    } catch (Exception er) {
                        er.printStackTrace();
                        System.err.println(er.getClass().getName() + ": " + er.getMessage());
                        System.exit(0);
                    }
                    String start = startDateField.getText();
                    String end = endDateField.getText();
                    String getdates = "SELECT inventoryitem.name AS ingredient, " +
                            "SUM(orders.nummenuitems) AS total_quantity " +
                            "FROM orders " +
                            "JOIN LATERAL unnest(string_to_array(orders.menuitem, ', ')) AS menuitem_name ON TRUE " +
                            "JOIN menuitem ON menuitem.name = menuitem_name " +
                            "JOIN menuitemingredients ON menuitem.menuitemid = menuitemingredients.menuitemid " +
                            "JOIN inventoryitem ON menuitemingredients.inventoryitemid = inventoryitem.inventoryitemid "
                            +
                            "WHERE orders.dateof BETWEEN CAST(? AS date) AND CAST(? AS date) " +
                            "GROUP BY inventoryitem.name " +
                            "ORDER BY inventoryitem.name";
                    PreparedStatement pstmt = conn.prepareStatement(getdates, ResultSet.TYPE_SCROLL_INSENSITIVE,
                            ResultSet.CONCUR_READ_ONLY);

                    pstmt.setString(1, start);
                    pstmt.setString(2, end);
                    ResultSet rs = pstmt.executeQuery();
                    // Prepare data for JTable
                    rs.last();
                    int rowCount = rs.getRow();
                    rs.beforeFirst();

                    String[] columnNames = { "Ingredient", "Total Quantity" };
                    Object[][] data = new Object[rowCount][2];
                    int rowIndex = 0;

                    while (rs.next()) {
                        data[rowIndex][0] = rs.getString("ingredient");
                        data[rowIndex][1] = rs.getInt("total_quantity");
                        rowIndex++;
                    }

                    // Create a new frame for displaying the table
                    // JFrame tableFrame = new JFrame("Ingredient Usage");
                    // tableFrame.setSize(600, 300);
                    // JTable table = new JTable(data, columnNames);
                    // JScrollPane scrollPane = new JScrollPane(table);
                    // tableFrame.add(scrollPane);
                    // tableFrame.setVisible(true);
                    DefaultTableModel tmodel = new DefaultTableModel(data, columnNames);
                    table.setModel(tmodel);

                } catch (SQLException e) {
                    e.printStackTrace();
                }

            }
        });

    }

    // Updates the total card sales
    static void addCard(double price) {
        cardSales += price;
    }

    // Updates the total cash sales 
    static void addCash(double price) {
        cashSales += price;
    }

    // Updates the total dining dollar sales
    static void addDining(double price) {
        diningSales += price;
    }


    /**
     * Print out the X-Report of the sales per hour for the current day.
     * Shows hourly order counts, sales, combos sold and menu items sold.
     * 
     * @author Karthik Nakka
     * @throws Exception Throws error when there is a problem with the database connection
     */
    private void xReport() {
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        String[] columnNames = { "Hour", "Order Count", "Sales", "Combos Sold", "Menu Items Sold" };
        String sql = "SELECT EXTRACT(HOUR FROM time) AS hour, COUNT(orderID) AS order_count, SUM(cost) AS sales, SUM(numcombos) AS combos_sold, SUM(nummenuitems) AS menu_items_sold FROM orders WHERE dateof = CURRENT_DATE GROUP BY EXTRACT(HOUR FROM time) ORDER BY hour;";
        Object[][] data = fetchData(sql, conn); // Initialize with no data
        DefaultTableModel model = new DefaultTableModel(data, columnNames);
        table.setModel(model);
    }

    /**
     * Print out the Z-Report of the totals for the day, and resets the totals to
     * zero.
     * Currently prints the sales and the tax, as well as the total.
     * 
     * @author Shawn Gao
     */
    private void zReport() {
        Date currentDate = new Date();
        double totalSales = cashSales + cardSales + diningSales;
        double totalTaxes = totalSales * 0.07;
        double grandTotal = totalSales * 1.07;

        String[] columnNames = { "Category", "Value" };
        Object[][] data = {
                { "Date", currentDate},
                { "Cash Sales", String.format("%.2f", cashSales) },
                { "Card Sales", String.format("%.2f", cardSales) },
                { "Dining Sales", String.format("%.2f", diningSales) },
                { "Total Sales", String.format("%.2f", totalSales) },
                { "Total Taxes", String.format("%.2f", totalTaxes) },
                { "Grand Total", String.format("%.2f", grandTotal) }
        };
        DefaultTableModel model = new DefaultTableModel(data, columnNames);
        table.setModel(model);

        cardSales = 0;
        cashSales = 0;
        diningSales = 0;
    }

    /**
     * Given two dates and times in the "yyyy-mm-dd" and "HH:mm:ss" formats
     * respectively, displays a table of the total amount sold of each
     * item over the course of the time frame
     * 
     * @author Abdiel Rivera
     */
    private void salesReport() {
        Connection conn = null;
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);
        try {
            conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        String date1 = JOptionPane.showInputDialog(null, "Enter First Date (yyyy-MM-dd):");
        String time1 = JOptionPane.showInputDialog(null, "Enter First Time (HH:mm:ss):");
        String date2 = JOptionPane.showInputDialog(null, "Enter Second Date (yyyy-MM-dd):");
        String time2 = JOptionPane.showInputDialog(null, "Enter Second Time (HH:mm:ss):");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        date1 += " " + time1;
        date2 += " " + time2;
        // DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("HH:mm:ss");

        try {
            Date date_1 = dateFormat.parse(date1);
            Date date_2 = dateFormat.parse(date2);

            if (date_2.compareTo(date_1) > 0) {

                String sqlStatement = String.format("SELECT * FROM orders WHERE dateof BETWEEN '%s' AND '%s';", date1,
                        date2);
                ResultSet rs = conn.createStatement().executeQuery(sqlStatement);
                String[] columnNames = { "Item",
                        "Total Units Sold Between " + date1.substring(0, 10) + " And " + date2.substring(0, 10) };
                Object[][] data = new Object[0][0];
                int columnCount = 2;
                java.util.List<Object[]> rows = new java.util.ArrayList<>();
                Map<String, Integer> count = new HashMap<>();

                while (rs.next()) {

                    String timeString = rs.getString("time");
                    String dateString = rs.getString("dateof");
                    dateString += " " + timeString;
                    Date dbDate = dateFormat.parse(dateString);

                    if (dbDate.compareTo(date_1) >= 0 && dbDate.compareTo(date_2) <= 0) {
                        String[] menuStrings = rs.getString("menuItem").split(", ");
                        String[] comboStrings = rs.getString("comboList").split(", ");

                        for (String item : menuStrings) {
                            // System.out.println(item);
                            count.put(item, count.getOrDefault(item, 0) + 1);
                        }

                        for (String combo : comboStrings) {
                            if (!combo.equals("Appetizer")) {
                                // System.out.println(combo);
                                count.put(combo, count.getOrDefault(combo, 0) + 1);
                            }
                        }
                    }
                }

                for (Map.Entry<String, Integer> entry : count.entrySet()) {
                    Object[] row = new Object[columnCount];
                    row[0] = entry.getKey();
                    row[1] = entry.getValue();

                    rows.add(row);
                }

                data = rows.toArray(new Object[0][0]);
                DefaultTableModel tmodel = new DefaultTableModel(data, columnNames);
                table.setModel(tmodel);

            } else {
                JOptionPane.showMessageDialog(null, "Date 2 is not greater than date 1");
            }
        } catch (Exception e) {
            System.err.println(e);
            JOptionPane.showMessageDialog(null, "Invalid Input Please Try Again");
        }

    }

    /**
     * Gets result from database of a query
     * 
     * @param query SQL query string
     * @param conn  connection to database
     * @throws SQLException error with database connection
     */
    private Object[][] fetchData(String query, Connection conn) {
        Object[][] data = new Object[0][0];
        try (Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(query)) {

            int columnCount = rs.getMetaData().getColumnCount();
            java.util.List<Object[]> rows = new java.util.ArrayList<>();

            while (rs.next()) {
                Object[] row = new Object[columnCount];
                for (int i = 0; i < columnCount; i++) {
                    row[i] = rs.getObject(i + 1);
                }
                rows.add(row);
            }
            data = rows.toArray(new Object[0][0]);

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Error accessing Database.");
            e.printStackTrace();
        }
        return data;
    }

}
