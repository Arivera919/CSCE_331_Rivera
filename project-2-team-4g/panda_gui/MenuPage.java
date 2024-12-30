import java.sql.*;
import java.awt.*;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class MenuPage extends JPanel {

    static DefaultListModel<String> listModel;
    static JList<String> orders;
    private JTable table;

     /** * Creates a new GUI, loads all of the buttons and tables into it and displays it
    * <p>
    * This method establishes the GUI of the Inventory tab. 
    * Whenever the inventory button is clicked in another tab,
    * this method is ran and the GUI is established
    *
    * @author Noah DeLage
    * @throws Exception If the database fails to open or close
    */
    public MenuPage() {
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

        // Customize panels for layout and size
        viewPanel.setLayout(new GridLayout(5, 1, 10, 10));

        //add buttons
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

        JButton b = new JButton("Close");
        b.addActionListener(s);

        // make container panel to house other panels
        JPanel containerPanel = new JPanel();
        containerPanel.setLayout(new BorderLayout());
        containerPanel.add(viewPanel, BorderLayout.EAST); 


        JPanel closePanel = new JPanel();
        closePanel.setLayout(new FlowLayout(FlowLayout.CENTER));
        closePanel.add(b);
        containerPanel.add(closePanel, BorderLayout.SOUTH);

        //Adding the manager actions buttons
        JPanel managerActions = new JPanel();
        managerActions.setLayout(new FlowLayout(FlowLayout.CENTER));
        managerActions.setLayout(new GridLayout(5, 1, 10, 10));

        JButton add = new JButton("Add Menu Item");
        add.setPreferredSize(new Dimension(150, 30));
        add.addActionListener(s);
        JButton update = new JButton("Update Menu Item");
        update.setPreferredSize(new Dimension(150, 30));
        update.addActionListener(s);
        JButton remove = new JButton("Remove Menu Item");
        remove.addActionListener(s);
        remove.setPreferredSize(new Dimension(150, 30));

        
        managerActions.add(add);
        managerActions.add(update);
        managerActions.add(remove);
        containerPanel.add(managerActions, BorderLayout.WEST);

        //taking in Query and column names
        String[] columnNames = { "Menu Item ID", "Name", "Price" };
        String sql = "SELECT menuitemid, name, price FROM menuitem";
        Object[][] data = fetchData(sql, conn); // Initialize with no data

        //make the table
        table = new JTable(new DefaultTableModel(data, columnNames));
        JScrollPane tablePane = new JScrollPane(table);

        //TODO: style and size conatiner
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

    /** * Fetches data from the database and puts it into a 2d array based on the provided query
    * <p>
    * This method returns a 2d Object array with all of the pulled
    * information from the database. When the method is run, it opens the database,
    * executes the query, and loads all of the data into the array.
    *
    * @author Noah DeLage
    * @param query a string with a query to pull information from the database
    * @param conn a connection object that is connected to the database we are getting the data from
    * @return a 2d array with the data from the database
    * @throws SQLException If the database fails to open or close
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

    /** * Updates the table that is displayed in the GUI so that it reflects the database
    * <p>
    * This method opens up the database, pulls all of the updated
    * information from the database, and then displays it to the GUI
    * This method should be ran after the database is updated and we want to
    * display the changes
    *
    * @author Noah DeLage
    * @throws Exception If the database fails to open, close, or load data from the daatabse
    */
    public void refreshtable()
    {
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
        
        String sql = "SELECT menuitemid, name, price FROM menuitem";
        Object[][] data = fetchData(sql, conn); // Initialize with no data

        DefaultTableModel model = (DefaultTableModel) table.getModel(); // Get the existing model
        model.setRowCount(0); // Clear existing data

        for (Object[] row : data) {
            model.addRow(row); // Add new rows from the fetched data
        }

        try {
            conn.close();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Connection NOT Closed.");
        }
    }
}
