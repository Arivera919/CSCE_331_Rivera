import java.awt.*;
import java.sql.*;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

/**
 * Class for manager user GUI
 * 
 * Creates a screen containing a table where information on all current employees can be found
 * User can add, remove, promote, and demote employees with the corresponding function updating the database accordingly
 */
public class Employees extends JPanel {

    static JTable table;

    public Employees() {
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
        //JOptionPane.showMessageDialog(null, "Opened database successfully");

        // ties all actionListeners together
        GUI s = new GUI();

        // Create all the panels
        JPanel viewPanel = new JPanel();

        // Customize panels for layout and size
        viewPanel.setLayout(new GridLayout(5, 1, 10, 10));
        viewPanel.setPreferredSize(new Dimension(250, 600));

        //add buttons
        JButton inventory = new JButton("Inventory");
        inventory.addActionListener(s);
        inventory.setPreferredSize(new Dimension(200, 150));
        JButton menu = new JButton("Menu");
        menu.addActionListener(s);
        menu.setPreferredSize(new Dimension(200, 150));
        JButton employees = new JButton("Employees");
        employees.addActionListener(s);
        employees.setPreferredSize(new Dimension(200, 150));
        JButton reports = new JButton("Reports");
        reports.addActionListener(s);
        reports.setPreferredSize(new Dimension(200, 150));

        viewPanel.add(inventory);
        viewPanel.add(menu);
        viewPanel.add(employees);
        viewPanel.add(reports);

        JButton b = new JButton("Close");
        b.addActionListener(s);

        // make container panel to house other panels
        JPanel containerPanel = new JPanel();
        containerPanel.setLayout(new BorderLayout());

        JButton add = new JButton("Add a New Employee");
        add.addActionListener(s);
        JButton remove = new JButton("Remove an Employee");
        remove.addActionListener(s);
        JButton promote = new JButton("Promote/Demote an Employee");
        promote.addActionListener(s);

        JPanel editPanel = new JPanel();
        editPanel.setLayout(new FlowLayout(FlowLayout.CENTER));
        editPanel.add(add);
        editPanel.add(promote);
        editPanel.add(remove);
        containerPanel.add(editPanel, BorderLayout.NORTH);
        containerPanel.add(viewPanel, BorderLayout.EAST); 


        JPanel closePanel = new JPanel();
        closePanel.setLayout(new FlowLayout(FlowLayout.CENTER));
        closePanel.add(b);
        containerPanel.add(closePanel, BorderLayout.SOUTH);


        //taking in Query and column names
        String[] columnNames = { "Employee ID", "Name", "Manager" };
        String sql = "SELECT employeeId, name, isManager FROM employee";
        Object[][] data = fetchData(sql, conn); // Initialize with no data

        //make the table
        table = new JTable(new DefaultTableModel(data, columnNames));
        JScrollPane tablePane = new JScrollPane(table);
        tablePane.setPreferredSize(new Dimension(650, 600));

        //TODO: style and size conatiner
        containerPanel.add(tablePane, BorderLayout.CENTER);

        add(containerPanel);

        // closing the connection
        try {
            conn.close();
            //JOptionPane.showMessageDialog(null, "Connection Closed.");
        } catch (Exception e) {
            //JOptionPane.showMessageDialog(null, "Connection NOT Closed.");
        }
    }

    /**
     * Gets result from database of a query
     * 
     * @param query SQL query string
     * @param conn connection to database
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
            //JOptionPane.showMessageDialog(null, "Error accessing Database.");
            e.printStackTrace();
        }
        return data;
    }


}
