import java.awt.CardLayout;
import java.awt.event.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.util.ArrayList;

/**
 * Class for GUI interface
 * 
 * Contains buttons for broad cashier and manager pages
 */ 
public class GUI extends JFrame implements ActionListener {
    static JFrame f;
    static CardLayout cardLayout = new CardLayout();
    static JPanel deckPanel = new JPanel(cardLayout);
    static Cashier cashier = new Cashier();
    static Inventory inventory = new Inventory();
    static MenuPage menu = new MenuPage();
    static Employees employees = new Employees();
    static Reports reports = new Reports();

    public static void main(String[] args)
    {
      GUI s = new GUI();
      f = new JFrame("Panda Express GUI");
      f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);


      
      JPanel homePanel = new JPanel();
      JButton choice1 = new JButton("I am a cashier");
      choice1.addActionListener(s);
      homePanel.add(choice1);
      JButton choice2 = new JButton("I am a manager");
      choice2.addActionListener(s);
      homePanel.add(choice2);

      //add all screens to deckpanel so main can switch between them
      deckPanel.add(cashier, "Cashier");
      deckPanel.add(inventory, "Inventory");
      deckPanel.add(menu, "Menu");
      deckPanel.add(employees, "Employees");
      deckPanel.add(reports, "Reports");
      deckPanel.add(homePanel, "Home");
      cardLayout.show(deckPanel, "Home");

      f.add(deckPanel);
      f.setSize(1100, 750);
      f.setVisible(true);
    }
      

    // if button is pressed
    public void actionPerformed(ActionEvent e)
    {
      String s = e.getActionCommand(); 
      //Page Switch buttons
      if (s.equals("I am a cashier")) {
        cardLayout.show(deckPanel, "Cashier");
      } else if (s.equals("I am a manager")) {
        cardLayout.show(deckPanel, "Inventory");
      } else if (s.equals("Close")) {
        cardLayout.show(deckPanel, "Home");
      } else if (s.equals("Inventory")) {
        cardLayout.show(deckPanel, "Inventory");
      } else if (s.equals("Menu")) {
        cardLayout.show(deckPanel, "Menu");
      } else if (s.equals("Employees")) {
        cardLayout.show(deckPanel, "Employees");
      } else if (s.equals("Reports")) {
        cardLayout.show(deckPanel, "Reports");
      //Employee Buttons
      } else if (s.equals("Add a New Employee")) {

        Connection conn = null;
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (Exception er) {
          er.printStackTrace();
          System.err.println(e.getClass().getName()+": "+er.getMessage());
          System.exit(0);
        }

        String employeeName = "";
        String managerStatus = "";
        int employeeId = -1;

        employeeName = JOptionPane.showInputDialog("Enter New Employee's name:");
        //System.out.println(employeeName);
        int isManager = JOptionPane.showConfirmDialog(null, "Is This Employee a Manager?", "Add Employee", JOptionPane.YES_NO_OPTION);

        if (isManager == JOptionPane.YES_OPTION) {
          managerStatus = "true";
        } else if (isManager == JOptionPane.NO_OPTION) {
          managerStatus = "false";
        }

        //System.out.println(managerStatus);

        try {
          Statement stmt = conn.createStatement();
          String sql = "SELECT MAX(employeeid) FROM employee;";

          ResultSet rs = stmt.executeQuery(sql);
          rs.next();
          employeeId = rs.getInt("max") + 1;
          //System.out.println(employeeId);


          if (!employeeName.equals("") && !managerStatus.equals("") && employeeId != -1){
            sql = String.format("INSERT INTO employee(name, employeeid, ismanager) VALUES ('%s','%d','%s');", employeeName, employeeId, managerStatus);
            stmt.executeUpdate(sql);

            DefaultTableModel model = (DefaultTableModel) Employees.table.getModel();
            model.addRow(new Object[]{employeeId, employeeName, managerStatus});
          }
          
        } catch (Exception errr){
          errr.printStackTrace();
          System.err.println(e.getClass().getName()+": "+errr.getMessage());
          System.exit(0);
        }

        try {
          conn.close();
          //JOptionPane.showMessageDialog(null,"Connection Closed.");
        } catch(Exception errr) {
          //JOptionPane.showMessageDialog(null,"Connection NOT Closed.");
        }

      } else if (s.equals("Remove an Employee")) {

        Connection conn = null;
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (Exception er) {
          er.printStackTrace();
          System.err.println(e.getClass().getName()+": "+er.getMessage());
          System.exit(0);
        }

        String employeeId = "";
        employeeId = JOptionPane.showInputDialog("Enter Employee ID of Employee to be Removed:");

        try {

          if (!employeeId.equals("")){
            String sql = String.format("DELETE FROM employee WHERE employeeid=%s;", employeeId);
            conn.createStatement().executeUpdate(sql);

            DefaultTableModel model = (DefaultTableModel) Employees.table.getModel();
            for (int i = 0; i < model.getRowCount(); ++i) {
              if (employeeId.equals(model.getValueAt(i, 0).toString())) {
                model.removeRow(i);
                break;
              }
            }
          }
          
        } catch (Exception errr){
          errr.printStackTrace();
          System.err.println(e.getClass().getName()+": "+errr.getMessage());
          System.exit(0);
        }

        try {
          conn.close();
          //JOptionPane.showMessageDialog(null,"Connection Closed.");
        } catch(Exception errr) {
          //JOptionPane.showMessageDialog(null,"Connection NOT Closed.");
        }

      } else if (s.equals("Promote/Demote an Employee")) {

        Connection conn = null;
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (Exception er) {
          er.printStackTrace();
          System.err.println(e.getClass().getName()+": "+er.getMessage());
          System.exit(0);
        }

        String employeeId = "";
        String managerStatus = "";
        Object[] options = {"Promote", "Demote"};

        employeeId = JOptionPane.showInputDialog("Enter Employee ID of Employee to be Promoted/Demoted:");
        int choice = JOptionPane.showOptionDialog(null, "Employee", "Select Action", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);

        if (choice == JOptionPane.YES_OPTION) {
          managerStatus = "true";
        } else {
          managerStatus = "false";
        }

        try {

          if (!employeeId.equals("")){
            String sql = String.format("UPDATE employee SET ismanager=%s WHERE employeeid=%s;", managerStatus, employeeId);
            conn.createStatement().executeUpdate(sql);

            DefaultTableModel model = (DefaultTableModel) Employees.table.getModel();
            for (int i = 0; i < model.getRowCount(); ++i) {
              if (employeeId.equals(model.getValueAt(i, 0).toString())) {
                model.setValueAt(managerStatus, i, 2);
                break;
              }
            }
          }
          
        } catch (Exception errr){
          errr.printStackTrace();
          System.err.println(e.getClass().getName()+": "+errr.getMessage());
          System.exit(0);
        }

        try {
          conn.close();
          //JOptionPane.showMessageDialog(null,"Connection Closed.");
        } catch(Exception errr) {
          //JOptionPane.showMessageDialog(null,"Connection NOT Closed.");
        }


      //Cashier Buttons
      } else if (s.equals("Checkout") && Cashier.listModel.getSize() > 0) {
          Object[] payments = {"Credit/Debit", "Cash", "Dining Dollars"};
          int choice = JOptionPane.showOptionDialog(null, "Select Payment Method:", s, JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE, null, payments, payments[0]);
          if (choice != JOptionPane.CLOSED_OPTION){
            
            Connection conn = null;
            String database_name = "team_4g_db";
            String database_user = "team_4g";
            String database_password = "goldcheese58";
            String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);
            try {
              conn = DriverManager.getConnection(database_url, database_user, database_password);
            } catch (Exception er) {
              er.printStackTrace();
              System.err.println(e.getClass().getName()+": "+er.getMessage());
              System.exit(0);
            }

            try{
              
            } catch (Exception err){
              
              System.out.println(err);
            }

            try {
              conn.close();
              //JOptionPane.showMessageDialog(null,"Connection Closed.");
            } catch(Exception errr) {
              //JOptionPane.showMessageDialog(null,"Connection NOT Closed.");
            }
            
          }
          
        } else if (s.equals("Remove From Order")){
          int index = Cashier.orders.getSelectedIndex();
          if (index != -1 && Cashier.listModel.getSize() > 0){
            //if container is removed, removes container plus contents of container and update price accordingly
            if(Cashier.listModel.get(index).equals("Bowl") || Cashier.listModel.get(index).equals("Plate") || Cashier.listModel.get(index).equals("Bigger Plate")){
              if (index == Cashier.containerIndex) {
                Cashier.containsSide = false;
                Cashier.numEntrees = 0;
                Cashier.containerIndex = -1;
              }
              
              if (Cashier.listModel.get(index).equals("Bowl")) {
                Cashier.currPrice -= Cashier.bowlPrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              } else if (Cashier.listModel.get(index).equals("Plate")) {
                Cashier.currPrice -= Cashier.platePrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              } else if (Cashier.listModel.get(index).equals("Bigger Plate")) {
                Cashier.currPrice -= Cashier.biggerPlatePrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              }
              
              Cashier.listModel.remove(index);
              int numRemoved = 1;
              while (Cashier.listModel.getSize() > 0 && !Cashier.listModel.get(index).equals("Bowl") && !Cashier.listModel.get(index).equals("Plate") && !Cashier.listModel.get(index).equals("Bigger Plate") && index < Cashier.listModel.getSize() - 1 && !Cashier.checkForApp(Cashier.listModel.get(index), Cashier.appetizers) && !Cashier.listModel.get(index).equals("Drink")){
                if (Cashier.checkForPremium(Cashier.listModel.get(index).substring(5), Cashier.premium)) {
                  Cashier.currPrice -= Cashier.premiumPrice;
                  Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
                }
                
                Cashier.listModel.remove(index);
                ++numRemoved;
              }
              if (Cashier.listModel.getSize() != 0 && !Cashier.listModel.get(index).equals("Bowl") && !Cashier.listModel.get(index).equals("Plate") && !Cashier.listModel.get(index).equals("Bigger Plate") && !Cashier.checkForApp(Cashier.listModel.get(index), Cashier.appetizers) && !Cashier.listModel.get(index).equals("Drink")) {
                if (Cashier.checkForPremium(Cashier.listModel.get(index).substring(5), Cashier.premium)) {
                  Cashier.currPrice -= Cashier.premiumPrice;
                  Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
                }

                Cashier.listModel.remove(index);
                ++numRemoved;
              }

              if (index < Cashier.containerIndex) {
                Cashier.containerIndex -= numRemoved;
              }

            } else if (Cashier.checkForApp(Cashier.listModel.get(index), Cashier.appetizers) || Cashier.listModel.get(index).equals("Drink")) {
              if (Cashier.checkForApp(Cashier.listModel.get(index), Cashier.appetizers)) {
                Cashier.currPrice -= Cashier.appetizerPrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              } else if (Cashier.listModel.get(index).equals("Drink")) {
                Cashier.currPrice -= Cashier.drinkPrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              }

              
              Cashier.listModel.remove(index);
              if (index < Cashier.containerIndex) {
                --Cashier.containerIndex;
              }
            }
          }
        } else {
          //if list is empty or starting a new container
          if (Cashier.listModel.getSize() == 0 || Cashier.containerIndex == -1) {
            if(s.equals("Bowl") || s.equals("Plate") || s.equals("Bigger Plate")) {
              Cashier.listModel.addElement(s);
              Cashier.containerIndex = Cashier.listModel.lastIndexOf(s);
              if (s.equals("Bowl")) {
                Cashier.currPrice += Cashier.bowlPrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              } else if (s.equals("Plate")) {
                Cashier.currPrice += Cashier.platePrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              } else {
                Cashier.currPrice += Cashier.biggerPlatePrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              }

            } else if (s.equals("Drink") || Cashier.checkForApp(s, Cashier.appetizers)) {
              Cashier.listModel.addElement(s);
              if (s.equals("Drink")) {
                Cashier.currPrice += Cashier.drinkPrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              } else {
                Cashier.currPrice += Cashier.appetizerPrice;
                Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
              }
              
            }
          } else if (Cashier.containerIndex != -1 && !s.equals("Bowl") && !s.equals("Plate") && !s.equals("Bigger Plate")) {
            //checks to see what kind of container it is and makes sure that each one has the requrired amounts of food
            if(Cashier.listModel.get(Cashier.containerIndex).equals("Bowl")) {
              if (Cashier.containsSide == false && Cashier.checkForSide(s, Cashier.sides)){
                Cashier.listModel.addElement("     " + s);
                Cashier.containsSide = true;
              } else if (Cashier.containsSide == true && !Cashier.checkForSide(s, Cashier.sides) && !Cashier.checkForApp(s, Cashier.appetizers) && !s.equals("Drink")) {
                Cashier.listModel.addElement("     " + s);
                Cashier.containerIndex = -1;
                Cashier.containsSide = false;
                if (Cashier.checkForPremium(s, Cashier.premium)) {
                  Cashier.currPrice += Cashier.premiumPrice;
                  Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
                }
              }
            } else if (Cashier.listModel.get(Cashier.containerIndex).equals("Plate")) {
              if (Cashier.containsSide == false && Cashier.checkForSide(s, Cashier.sides)) {
                Cashier.listModel.addElement("     " + s);
                Cashier.containsSide = true;
              } else if (Cashier.containsSide == true && !Cashier.checkForSide(s, Cashier.sides) && !Cashier.checkForApp(s, Cashier.appetizers) && !s.equals("Drink") && Cashier.numEntrees < 2) {
                Cashier.listModel.addElement("     " + s);
                if (Cashier.checkForPremium(s, Cashier.premium)) {
                  Cashier.currPrice += Cashier.premiumPrice;
                  Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
                }
                ++Cashier.numEntrees;
                if(Cashier.numEntrees == 2) {
                  Cashier.containerIndex = -1;
                  Cashier.containsSide = false;
                  Cashier.numEntrees = 0;
                }
              }
            } else if (Cashier.listModel.get(Cashier.containerIndex).equals("Bigger Plate")) {
              if (Cashier.containsSide == false && Cashier.checkForSide(s, Cashier.sides)) {
                Cashier.listModel.addElement("     " + s);
                Cashier.containsSide = true;
              } else if (Cashier.containsSide == true && !Cashier.checkForSide(s, Cashier.sides) && !Cashier.checkForApp(s, Cashier.appetizers) && !s.equals("Drink") && Cashier.numEntrees < 3) {
                Cashier.listModel.addElement("     " + s);
                if (Cashier.checkForPremium(s, Cashier.premium)) {
                  Cashier.currPrice += Cashier.premiumPrice;
                  Cashier.price.setText(String.format("<html><h1>Total: $%.2f</h1></html>", Cashier.currPrice));
                }
                ++Cashier.numEntrees;
                if(Cashier.numEntrees == 3) {
                  Cashier.containerIndex = -1;
                  Cashier.containsSide = false;
                  Cashier.numEntrees = 0;
                }
              }
            }
            
            
            
          }
        }
      //Manager Buttons  
      if(s.equals("Add Menu Item"))
      {
        //prompting the user for menu item info
        String name = JOptionPane.showInputDialog("Enter Menu Item Name:");
        String price = JOptionPane.showInputDialog("Enter Menu Item Price:");
        ArrayList<String> ingredientList = new ArrayList<>();

        String ingredient = JOptionPane.showInputDialog("Enter Ingredient for Item (Type \"Stop\" or Leave the Box Empty if Done):");
        while(!ingredient.equals("Stop") && !ingredient.equals("stop") && !ingredient.equals(""))
        {
          ingredientList.add(ingredient);
          ingredient = JOptionPane.showInputDialog("Enter Ingredient for Item (Type \"Stop\" or Leave the Box Empty if Done):");
        }

        //setting up variables for connecting to the databaase and SQL statements that will be executed later
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        Connection conn = null;
        PreparedStatement pstmt = null;
        PreparedStatement stmt = null;
        int newMenuItemId = 0;

        //Try connecting to the database and also retrieving the most recent menu id number
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
          stmt = conn.prepareStatement("SELECT COALESCE(MAX(menuitemid), 0) AS latest_id FROM menuitem");
          ResultSet rs = stmt.executeQuery();
          if (rs.next()) {
            newMenuItemId = rs.getInt("latest_id") + 1; // Get the latest ID and add 1
          }
        } catch (SQLException error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        //create a query, prepare the query, and execute the statement
        String insertQuery = String.format("INSERT INTO menuitem (menuitemid, name, price) VALUES (?,?,?)");

        try
        {
          pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setInt(1, newMenuItemId);  // Set menuitemid
          pstmt.setString(2, name);         // Set name
          pstmt.setDouble(3, Double.parseDouble(price));   

          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        int ingredientId = 0;
        int inventoryitemid = 0;
        for (int i = 0; i < ingredientList.size(); i++)
        {
          ingredientList.get(i);
          try {
            conn = DriverManager.getConnection(database_url, database_user, database_password);
            stmt = conn.prepareStatement("SELECT COALESCE(MAX(id), 0) AS latest_id FROM menuitemingredients");
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
              ingredientId = rs.getInt("latest_id") + 1; // Get the latest ID and add 1
            }
          } catch (SQLException error) {
            error.printStackTrace();
            System.err.println(error.getClass().getName() + ": " + error.getMessage());
            System.exit(0);
          }
          
          try {
            String selectQuery = "SELECT inventoryitemid FROM inventoryitem WHERE name = ?";  // Remove the single quotes
            pstmt = conn.prepareStatement(selectQuery, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, ingredientList.get(i));  // Set the ingredient name
            ResultSet rs = pstmt.executeQuery();
    
            if (rs.next()) {
              inventoryitemid = rs.getInt("inventoryitemid");  // Extract the correct column
            }
          } catch (SQLException error) {
            error.printStackTrace();
            System.err.println(error.getClass().getName() + ": " + error.getMessage());
            System.exit(0);
          }

          insertQuery = String.format("INSERT INTO menuitemingredients (id, menuitemid, inventoryitemid) VALUES (?,?,?)");
          try
          {
            pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, ingredientId);  // Set menuitemid
            pstmt.setInt(2, newMenuItemId);         // Set name
            pstmt.setInt(3, inventoryitemid);   

            pstmt.executeUpdate();
          }
          catch(SQLException error)
          {
            error.printStackTrace();
            System.err.println(error.getClass().getName() + ": " + error.getMessage());
            System.exit(0);
          }
        }
       
        
        try {
          conn.close();
        } catch (Exception error) 
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //update the table that is displayed on the GUI
        menu.refreshtable();
        cashier.updateGUI();
      }
      else if(s.equals("Update Menu Item"))
      {
        //prompting the user for menu item info
        String id = JOptionPane.showInputDialog("Enter the Menu Item ID you wish to update:");
        String name = JOptionPane.showInputDialog("Enter the new menu item name:");
        String price = JOptionPane.showInputDialog("Enter the new menu item price:"); 
        ArrayList<String> ingredientList = new ArrayList<>();

        String ingredient = JOptionPane.showInputDialog("Enter Ingredient for Item (Type \"Stop\" or Leave the Box Empty if Done):");
        while(!ingredient.equals("Stop") && !ingredient.equals("stop") && !ingredient.equals(""))
        {
          ingredientList.add(ingredient);
          ingredient = JOptionPane.showInputDialog("Enter Ingredient for Item (Type \"Stop\" or Leave the Box Empty if Done):");
        }

        //setting up variables for connecting to the databaase and SQL statements that will be executed later
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        Connection conn = null;
        PreparedStatement pstmt = null;

        //Try connecting to the database
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (SQLException error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        //create a query, prepare the query, and execute the statement
        String insertQuery = String.format("UPDATE menuitem SET name = ?, price = ? WHERE menuitemid = ?");

        try
        {
          pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setString(1, name);
          pstmt.setDouble(2, Double.parseDouble(price));   
          pstmt.setInt(3, Integer.parseInt(id));

          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        String deleteQuery = String.format("DELETE FROM menuitemingredients WHERE menuitemid = ?");

        try
        {
          pstmt = conn.prepareStatement(deleteQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setInt(1, Integer.parseInt(id));
          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        int ingredientId = 0;
        int inventoryitemid = 0;
        for (int i = 0; i < ingredientList.size(); i++)
        {
          ingredientList.get(i);
          try {
            conn = DriverManager.getConnection(database_url, database_user, database_password);
            pstmt = conn.prepareStatement("SELECT COALESCE(MAX(id), 0) AS latest_id FROM menuitemingredients");
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
              ingredientId = rs.getInt("latest_id") + 1; // Get the latest ID and add 1
            }
          } catch (SQLException error) {
            error.printStackTrace();
            System.err.println(error.getClass().getName() + ": " + error.getMessage());
            System.exit(0);
          }
          
          try {
            String selectQuery = "SELECT inventoryitemid FROM inventoryitem WHERE name = ?";  // Remove the single quotes
            pstmt = conn.prepareStatement(selectQuery, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, ingredientList.get(i));  // Set the ingredient name
            ResultSet rs = pstmt.executeQuery();
    
            if (rs.next()) {
              inventoryitemid = rs.getInt("inventoryitemid");  // Extract the correct column
            }
          } catch (SQLException error) {
            error.printStackTrace();
            System.err.println(error.getClass().getName() + ": " + error.getMessage());
            System.exit(0);
          }

          insertQuery = String.format("INSERT INTO menuitemingredients (id, menuitemid, inventoryitemid) VALUES (?,?,?)");
          try
          {
            pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, ingredientId);  // Set menuitemid
            pstmt.setInt(2, Integer.parseInt(id));         // Set name
            pstmt.setInt(3, inventoryitemid);   

            pstmt.executeUpdate();
          }
          catch(SQLException error)
          {
            error.printStackTrace();
            System.err.println(error.getClass().getName() + ": " + error.getMessage());
            System.exit(0);
          }
        }
        
       
        //close the database
        try {
          conn.close();
        } catch (Exception error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //update the table that is displayed on the GUI
        menu.refreshtable();
        cashier.updateGUI();
      }
      else if(s.equals("Remove Menu Item"))
      {
        //prompting the user for menu item info        
        String id = JOptionPane.showInputDialog("Enter the Menu Item ID you wish to delete:");

        //setting up variables for connecting to the databaase and SQL statements that will be executed later
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        Connection conn = null;
        PreparedStatement pstmt = null;

        //Try connecting to the database
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (SQLException error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        //create a query, prepare the query, and execute the statement
        String insertQuery = String.format("DELETE FROM menuitem WHERE menuitemid = ?");
        try
        {
          pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setInt(1, Integer.parseInt(id));

          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
       
        String deleteQuery = String.format("DELETE FROM menuitemingredients WHERE menuitemid = ?");

        try
        {
          pstmt = conn.prepareStatement(deleteQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setInt(1, Integer.parseInt(id));
          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //close the database
        try {
          conn.close();
        } catch (Exception error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //update the table that is displayed on the GUI
        menu.refreshtable();
        cashier.updateGUI();
      } if(s.equals("Add Inventory Item"))
      {
        //prompting the user for menu item info
        String name = JOptionPane.showInputDialog("Enter Inventory Item Name:");
        String quantity = JOptionPane.showInputDialog("Enter Inventory Item Quantity:");

        //setting up variables for connecting to the databaase and SQL statements that will be executed later
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        Connection conn = null;
        PreparedStatement pstmt = null;
        PreparedStatement stmt = null;
        int newInventoryItemId = 0;

        //Try connecting to the database and also retrieving the most recent menu id number
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
          stmt = conn.prepareStatement("SELECT COALESCE(MAX(inventoryitemid), 0) AS latest_id FROM inventoryitem");
          ResultSet rs = stmt.executeQuery();
          if (rs.next()) {
            newInventoryItemId = rs.getInt("latest_id") + 1; // Get the latest ID and add 1
          }
        } catch (SQLException error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        //create a query, prepare the query, and execute the statement
        String insertQuery = String.format("INSERT INTO inventoryitem (inventoryitemid, name, quantity) VALUES (?,?,?)");

        try
        {
          pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setInt(1, newInventoryItemId);  // Set menuitemid
          pstmt.setString(2, name);         // Set name
          pstmt.setDouble(3, Integer.parseInt(quantity));   

          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
       
        
        try {
          conn.close();
        } catch (Exception error) 
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //update the table that is displayed on the GUI
        inventory.refreshtable();
      } else if(s.equals("Update Inventory Item"))
      {
        //prompting the user for menu item info
        String id = JOptionPane.showInputDialog("Enter the inventory item ID you wish to update:");
        String name = JOptionPane.showInputDialog("Enter the new inventory item name:");
        String price = JOptionPane.showInputDialog("Enter the new inventory item quantity:"); 

        //setting up variables for connecting to the databaase and SQL statements that will be executed later
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        Connection conn = null;
        PreparedStatement pstmt = null;

        //Try connecting to the database
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (SQLException error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        //create a query, prepare the query, and execute the statement
        String insertQuery = String.format("UPDATE inventoryitem SET name = ?, quantity = ? WHERE inventoryitemid = ?");

        try
        {
          pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setString(1, name);
          pstmt.setDouble(2, Double.parseDouble(price));   
          pstmt.setInt(3, Integer.parseInt(id));

          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
       
        //close the database
        try {
          conn.close();
        } catch (Exception error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //update the table that is displayed on the GUI
        inventory.refreshtable();
      } else if(s.equals("Remove Inventory Item"))
      {
        //prompting the user for menu item info        
        String id = JOptionPane.showInputDialog("Enter the Inventory Item ID you wish to delete:");

        //setting up variables for connecting to the databaase and SQL statements that will be executed later
        String database_name = "team_4g_db";
        String database_user = "team_4g";
        String database_password = "goldcheese58";
        String database_url = String.format("jdbc:postgresql://csce-315-db.engr.tamu.edu/%s", database_name);

        Connection conn = null;
        PreparedStatement pstmt = null;

        //Try connecting to the database
        try {
          conn = DriverManager.getConnection(database_url, database_user, database_password);
        } catch (SQLException error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
        
        //create a query, prepare the query, and execute the statement
        String insertQuery = String.format("DELETE FROM inventoryitem WHERE inventoryitemid = ?");
        try
        {
          pstmt = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
          pstmt.setInt(1, Integer.parseInt(id));

          pstmt.executeUpdate();
        }
        catch(SQLException error)
        {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }
       
        //close the database
        try {
          conn.close();
        } catch (Exception error) {
          error.printStackTrace();
          System.err.println(error.getClass().getName() + ": " + error.getMessage());
          System.exit(0);
        }

        //update the table that is displayed on the GUI
        inventory.refreshtable();
      }
}
}


