import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.Insets;
import javax.swing.*;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.util.Random;

/**
 * Class for cashier user GUI
 * 
 * Creates a screen containing all the current menu items.
 * Allows users to create orders that are reflected in the database
 */
public class Cashier extends JPanel {

  static DefaultListModel<String> listModel;
  static JList<String> orders;
  static JLabel price = new JLabel("<html><h1>Total: $0.00</h1></html>");

  // constants
  static double bowlPrice = 8.30;
  static double platePrice = 9.80;
  static double biggerPlatePrice = 11.30;
  static double appetizerPrice = 2.00;
  static double drinkPrice = 2.10;
  static double premiumPrice = 1.50;
  static int containerIndex = -1;
  static int numEntrees = 0;
  static boolean containsSide = false;
  static double currPrice = 0;
  // Current database does not differentiate sides from entrees
  static String[] sides = { "Fried Rice", "Super Greens", "White Steamed Rice", "Chow Mein" };
  static String[] appetizers;
  static String[] premium;
  private Connection conn;

  /**
   * checks to see if current item is a side
   * Makes exception for sides that are also entrees
   * 
   * @author Abdiel Rivera
   * @param s
   * @param sides
   * @return true
   */
  public static boolean checkForSide(String s, String[] sides) {
    if (containsSide == true && s.equals("Super Greens")) {
      return false;
    }
    for (String side : sides) {
      if (side.equals(s)) {
        return true;
      }     
    }
    return false;
   }
  
  /**
   * checks to see if current item is an appetizer
   * 
   * @author Abdiel Rivera
   * @param s
   * @param apps
   * @return true if s is found within apps, false otherwise
   */
  public static boolean checkForApp(String s, String[] apps) {
    for (String app : apps) {
      if (app.equals(s)) {
        return true;
      }
    }
    return false;
  }

  /**
   * checks to see if current item is a premium item
   * 
   * @author Abdiel Rivera
   * @param s
   * @param premium
   * @return true if s is found within premium, false otherwise
   */
  public static boolean checkForPremium(String s, String[] premium) {
    for (String item : premium) {
      if (item.equals(s)) {
        return true;
      }
     }
    return false;
  }

  /**
   * * Changes the inventory based on what was ordered
   * 
   * @author Dylan Hoang
   * @param conn The name of the connection to the database
   * @return returns nothing (void function)
   * 
   * throws SQLException if connection is closed when ordering
   */
  private static void updateInventory(Connection conn) {
    try {
      // Loop through the orders in the listModel
   
      for (int i = 0; i < listModel.size(); i++) {
        String itemName = listModel.get(i);

        // Get the menuitemid for the current item
        String sql = "SELECT menuitemid FROM menuitem WHERE name = ?";

        if (conn == null || conn.isClosed()) {
          throw new SQLException("Connection is closed or null.");
        }
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, itemName.trim());
        ResultSet rs = pstmt.executeQuery();

        if (rs.next()) {
          int menuitemid = rs.getInt("menuitemid");

          // Get the associated inventoryitemids for this menu item
          String inventoryQuery = "SELECT inventoryitemid FROM menuitemingredients WHERE menuitemid = ?";
          PreparedStatement inventoryStmt = conn.prepareStatement(inventoryQuery);
          inventoryStmt.setInt(1, menuitemid);
          ResultSet inventoryResult = inventoryStmt.executeQuery();

          while (inventoryResult.next()) {
            int inventoryitemid = inventoryResult.getInt("inventoryitemid");

            // Subtract the quantity from the inventory table (assuming we subtract 1 per
            // order item because of how we did the database)
            String updateQuery = "UPDATE inventoryitem SET quantity = quantity - 1 WHERE inventoryitemid = ?";
            PreparedStatement updateStmt = conn.prepareStatement(updateQuery);
            updateStmt.setInt(1, inventoryitemid);
            updateStmt.executeUpdate();
            updateStmt.close();
          }
          inventoryResult.close();
          inventoryStmt.close();
        }
        rs.close();
        pstmt.close();
      }

      JOptionPane.showMessageDialog(null, "Inventory updated successfully!");
    } catch (Exception e) {
      JOptionPane.showMessageDialog(null, "Error updating inventory: " + e.getMessage());
    }

  }

  /**
   * * Adds the order to the order database table
   * 
   * @author Dylan Hoang
   * @param conn The name of the connection to the database
   * @return returns nothing (void function)
   * @throws SQLException if connection is closed when ordering
   */
  private void addOrder(Connection conn) {
    try {
      Random rand = new Random();
      int orderId = 0;
      double totalCost = Math.round(currPrice * 100.0) / 100.0;
      String comboList = "";
      String menuItemList = "";
      int numCombos = 0;
      int numMenuItems = 0;
      LocalDate currentDate = LocalDate.now();
      LocalTime currentTime = LocalTime.now();
      int cashierId = rand.nextInt(7) + 1;
      ArrayList<String> combos = new ArrayList<String>();
      ArrayList<String> menus = new ArrayList<String>();
      if (conn == null || conn.isClosed()) {
        throw new SQLException("Connection is closed or null.");
      }
      // find the values of combo and menu
      for (int i = 0; i < listModel.size(); i++) {
        String curr = listModel.get(i);
        curr = curr.trim();
        if (curr.equals("Bowl") || curr.equals("Plate") || curr.equals("Bigger Plate") || curr.equals("Drink")
            || curr.equals("Appetizer")) {
          combos.add(curr);
          numCombos++;
        } else if (checkForApp(curr, appetizers)) {
          combos.add("Appetizer");
          numCombos++;
          menus.add(curr);
          numMenuItems++;

        } else {
          menus.add(curr);
          numMenuItems++;
        }

      }
      comboList = String.join(", ", combos);
      menuItemList = String.join(", ", menus);
      String getMaxOrderId = "SELECT MAX(orderid) + 1 as nextOrderId FROM orders";
      PreparedStatement getMaxOrderIdStmt = conn.prepareStatement(getMaxOrderId);
      ResultSet rs = getMaxOrderIdStmt.executeQuery();
      if (rs.next()) {
        orderId = rs.getInt("nextOrderId");
      }
      orderId = rs.getInt("nextOrderId");
      String insertOrderQuery = "INSERT INTO orders (orderid, cost, combolist, menuitem, numcombos, nummenuitems, dateof, time, cashierid) "
          + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      PreparedStatement insertOrderStmt = conn.prepareStatement(insertOrderQuery);
      // set the queries
      insertOrderStmt.setInt(1, orderId);
      insertOrderStmt.setDouble(2, totalCost);
      insertOrderStmt.setString(3, comboList);
      insertOrderStmt.setString(4, menuItemList);
      insertOrderStmt.setInt(5, numCombos);
      insertOrderStmt.setInt(6, numMenuItems);
      insertOrderStmt.setDate(7, java.sql.Date.valueOf(currentDate));
      insertOrderStmt.setTime(8, java.sql.Time.valueOf(currentTime));
      insertOrderStmt.setInt(9, cashierId);
      System.out.println(insertOrderStmt);
      insertOrderStmt.executeUpdate();

      System.out.println(orderId);

    } catch (Exception e) {
      JOptionPane.showMessageDialog(null, "Database error: " + e.getMessage());
    }

  }

  JPanel menuPanel;
  public Cashier() {
    // Building the connection
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
    // JOptionPane.showMessageDialog(null,"Opened database successfully");

    // ties all actionListeners together
    GUI s = new GUI();
    listModel = new DefaultListModel<>();
    orders = new JList<>(listModel);
    JScrollPane orderList = new JScrollPane(orders);

    // Create all the panels
    JPanel screenPanel = new JPanel();
    menuPanel = new JPanel();
    JPanel containerPanel = new JPanel();
    JPanel foodPanel = new JPanel();
    JPanel cashierPanel = new JPanel();
    JPanel orderPanel = new JPanel();
    JPanel orderHeaderPanel = new JPanel();

    // Customize panels for layout and size
    screenPanel.setLayout(new BoxLayout(screenPanel, BoxLayout.Y_AXIS));
    foodPanel.setLayout(new BoxLayout(foodPanel, BoxLayout.Y_AXIS));
    menuPanel.setLayout(new GridLayout(5, 5));
    containerPanel.setLayout(new GridLayout(1, 3));
    orderPanel.setLayout(new BoxLayout(orderPanel, BoxLayout.Y_AXIS));
    orderHeaderPanel.setLayout(new BoxLayout(orderHeaderPanel, BoxLayout.X_AXIS));

    orderPanel.setPreferredSize(new Dimension(350, 650));
    orderList.setPreferredSize(new Dimension(350, 550));
    containerPanel.setPreferredSize(new Dimension(700, 100));
    menuPanel.setPreferredSize(new Dimension(700, 500));

    JButton menuItem;
    try {
      Statement stmt = conn.createStatement();

      // Grabs name of all menu items and creates a grid of buttons
      String sqlStatement = "SELECT * FROM menuitem;";
      ResultSet result = stmt.executeQuery(sqlStatement);

      while (result.next()) {
        menuItem = new JButton(result.getString("name"));
        menuItem.addActionListener(s);
        menuItem.setMargin(new Insets(0, 0, 0, 0));
        menuPanel.add(menuItem);
      }
      result.close();

      // Gets name of and number of appetizers on the menu and updates sides array
      sqlStatement = "SELECT COUNT(*) FROM menuitem WHERE price=2.00;";
      result = stmt.executeQuery(sqlStatement);
      result.next();
      int numApps = result.getInt("count");
      appetizers = new String[numApps];

      sqlStatement = "SELECT * FROM menuitem WHERE price=2.00;";
      result = stmt.executeQuery(sqlStatement);
      int i = 0;
      while (result.next()) {
        appetizers[i] = result.getString("name");
        ++i;
      }
      result.close();

      // Gets name of and number of premium items on the menu and updates premium
      // array;
      sqlStatement = "SELECT COUNT(*) FROM menuitem WHERE price=1.50;";
      result = stmt.executeQuery(sqlStatement);
      result.next();
      int numPremium = result.getInt("count");
      premium = new String[numPremium];

      sqlStatement = "SELECT * FROM menuitem WHERE price=1.50;";
      result = stmt.executeQuery(sqlStatement);
      i = 0;
      while (result.next()) {
        premium[i] = result.getString("name");
        ++i;
      }
      result.close();

    } catch (Exception e) {
      // JOptionPane.showMessageDialog(null,"Error accessing Database.");
      System.out.println(e);
    }

    // Initialize non-menu buttons
    JButton bowl = new JButton("Bowl");
    bowl.addActionListener(s);
    JButton plate = new JButton("Plate");
    plate.addActionListener(s);
    JButton biggerPlate = new JButton("Bigger Plate");
    biggerPlate.addActionListener(s);JButton checkout = new JButton("Checkout");
    checkout.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            Object[] payments = {"Credit/Debit", "Cash", "Dining Dollars"};
            int choice = JOptionPane.showOptionDialog(null, "Select Payment Method:", "Checkout", JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE, null, payments, payments[0]);
            if (choice != JOptionPane.CLOSED_OPTION) {
                JOptionPane.showMessageDialog(null, "Processing...");
    
                // Update sales report
                if (choice == 0) {  // Credit/Debit
                    Reports.addCard(Cashier.currPrice);
                } else if (choice == 1) {  // Cash
                    Reports.addCash(Cashier.currPrice);
                } else if (choice == 2) {  // Dining Dollars
                    Reports.addDining(Cashier.currPrice);
                }
    
                updateInventory(conn);
                addOrder(conn);
                listModel.clear();
                Cashier.currPrice = 0.00;
                price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
            }
        }
    });

    JButton b = new JButton("Close");
    b.addActionListener(s);
    JButton removeButton = new JButton("Remove From Order");
    removeButton.addActionListener(s);

    JLabel orderHeader = new JLabel("<html><h1>Current Order</h1></html>");

    // Add components to the proper panels
    containerPanel.add(bowl);
    containerPanel.add(plate);
    containerPanel.add(biggerPlate);

    foodPanel.add(containerPanel);
    foodPanel.add(menuPanel);
    foodPanel.add(checkout);

    cashierPanel.add(orderPanel);
    cashierPanel.add(foodPanel);

    orderHeaderPanel.add(orderHeader);
    orderHeaderPanel.add(removeButton);
    orderPanel.add(orderHeaderPanel);
    orderPanel.add(orderList);
    orderPanel.add(price);

    screenPanel.add(cashierPanel);
    screenPanel.add(b);

    // this is necessary to make visible in GUI main()
    add(screenPanel);

    // closing the connection
    try {
      System.out.print("close later");
      // JOptionPane.showMessageDialog(null,"Connection Closed.");
    } catch (Exception e) {
      // JOptionPane.showMessageDialog(null,"Connection NOT Closed.");
    }
  }

  public void updateGUI()
  {
    try {
      Statement stmt = conn.createStatement();
      // Clear existing buttons
      menuPanel.removeAll();

      // Fetch menu items
      String sqlStatement = "SELECT * FROM menuitem;";
      ResultSet result = stmt.executeQuery(sqlStatement);
      
      while (result.next()) {
          String itemName = result.getString("name");
          JButton menuItem = new JButton(itemName);
          menuItem.addActionListener(new GUI()); // Make sure to define a proper action listener
          menuItem.setMargin(new Insets(0, 0, 0, 0));
          menuPanel.add(menuItem);
      }
      result.close();
      menuPanel.revalidate(); // Refresh the panel to show updated buttons
      menuPanel.repaint(); // Repaint the panel
  } catch (SQLException e) {
      e.printStackTrace();
  }
  }

}
