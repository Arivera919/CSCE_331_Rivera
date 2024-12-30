/**
 * Creates Inventory Page for Manager View. The first page that the manager will be sent to. Allows manager to add, remove and update inventory items.
    @author @Karthiknakka1
 */


 import java.sql.*;
 import java.awt.*;
 import javax.swing.*;
 import javax.swing.table.DefaultTableModel;
 
 public class Inventory extends JPanel {
 
     static DefaultListModel<String> listModel;
     static JList<String> orders;
     private JTable table;
 
     /**
      * @param none
      * @return No return but creates the inventory page
      * @throws Exception if the connection to the databse is invalid
      */
     public Inventory() {
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
 
         // Adding the manager actions buttons
         JPanel managerActions = new JPanel();
         managerActions.setLayout(new FlowLayout(FlowLayout.CENTER));
         managerActions.setLayout(new GridLayout(5, 1, 10, 10));
 
         JButton add = new JButton("Add Inventory Item");
         add.setPreferredSize(new Dimension(150, 30));
         add.addActionListener(s);
         JButton update = new JButton("Update Inventory Item");
         update.setPreferredSize(new Dimension(150, 30));
         update.addActionListener(s);
         JButton remove = new JButton("Remove Inventory Item");
         remove.addActionListener(s);
         remove.setPreferredSize(new Dimension(150, 30));
 
         managerActions.add(add);
         managerActions.add(update);
         managerActions.add(remove);
         containerPanel.add(managerActions, BorderLayout.WEST);
 
         // taking in Query and column names
         String[] columnNames = { "Inventory Item ID", "Name", "Quantity" };
         String sql = "SELECT inventoryitemid, name, quantity FROM inventoryitem ORDER BY quantity";
         Object[][] data = fetchData(sql, conn); // Initialize with no data
 
         // make the table
         table = new JTable(new DefaultTableModel(data, columnNames));
         JScrollPane tablePane = new JScrollPane(table);
 
         // TODO: style and size conatiner
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
      * Returns data of a sql query into a 2d array.
      * 
      * @param query a string of the query that should be returned
      * @param conn the connection with the database
      * @return a 2d array with all the data of the table returned from the sql query
      * @throws SQLException If the sql query is invalid
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
 
     /**
      * Refreshes the table after the the table is changed from the add/remove/update buttons.
      * 
      * @return none Changes table to show updated info
      * @throws Exception Throws if there is an error when connecting to databse
      * 
      */
 
     public void refreshtable() {
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
 
         String sql = "SELECT inventoryitemid, name, quantity FROM inventoryitem ORDER BY quantity";
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
 