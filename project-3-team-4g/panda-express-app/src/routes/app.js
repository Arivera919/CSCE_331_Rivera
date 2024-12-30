
const sqlite3 = require("sqlite3").verbose()
let sql;


//connect database
const db = new sqlite3.Database("./test.db",sqlite3.OPEN_READWRITE,(err)=>{
   if (err) return console.error(err.message);
});
// db.run("Drop TABLE employee");

//This was just our local database while the AWS one wasn't working

// //create employee table
// sql = 'CREATE TABLE employee(employeeid INTEGER PRIMARY KEY,name,ismanager)';
// db.run(sql);
// //insert into employee table
// sql = 'INSERT INTO employee(name,ismanager) VALUES(?,?)'
// db.run(sql,["Dylan",false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,["Abdiel",false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,["Shawn",false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,["Karthik",false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,["Noah",true],err=>{
//     if (err) return console.error(err.message);
// })
//query employees
// sql = 'SELECT * from employee';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })


// //create inventoryitem table
// sql = 'CREATE TABLE inventoryitem(inventoryitemid,name,quantity,comingin)';
// db.run(sql);


//Drop inventoryitem
// db.run("Drop TABLE inventoryitem");




// //insert into employee table
// sql = 'INSERT INTO inventoryitem(inventoryitemid,name,quantity,comingin) VALUES(?,?,?,?)'
// db.run(sql,[0,"Rice",79,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[1,"Noodles",77,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[2,"Vegetables",80,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[3,"Chicken",76,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[4,"Shrip",85,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[5,"Beef",89,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[6,"Steak",96,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[7,"Chicken Egg Roll",95,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[8,"Veggie Spring Roll",96,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[9,"Cream Cheese Rangoon",91,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[10," Apple Pie Roll",96,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[11,"Sweet Sour Sauce",97,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[12,"Ginger Soy Sauce",100,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[13,"Honey Sauce",84,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[14,"Sweet Tangy Sauce ",95,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[15,"Teriyaki Sauce",81,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[16,"Vegetables",80,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[17,"Black Pepper Sauce",94,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[18,"Savory Sauce",100,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[19,"Bags",100,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[20,"To-go Boxes",100,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[21,"Flatware",100,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[22,"Napkins",100,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[23,"Straws",65,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[24,"Cups",65,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[25,"Fortune Cookies",80,0],err=>{
//     if (err) return console.error(err.message);
// })
//query inventoryitem
// sql = 'SELECT * from inventoryitem';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })


// //create menuitem table
// sql = 'CREATE TABLE menuitem(menuitemid,name,price,isentree,isappetizer,isside)';
// db.run(sql);
// //insert into employee table
// sql = 'INSERT INTO menuitem(menuitemid,name,price,isentree,isappetizer,isside) VALUES(?,?,?,?,?,?)'
// db.run(sql,[0,"Hot Ones Blazing Bourbon Chicken",1.50,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[1,"The Original Orange Chicken",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[2,"Black Pepper Sirloin Steak",1.50,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[3," Honey Walnut Shrimp",1.50,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[4,"Grilled Teriyaki Chicken",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[5,"Broccoli Beef",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[6,"Kung Pao Chicken",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[7,"Honey Sesame Chicken Breast ",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[8,"Beijing Beef",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[9,"Mushroom Chicken",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[10,"Sweetfire Chicken Breast",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[11,"String Bean Chicken Breast ",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[12,"Black Pepper Chicken",0.00,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[14,"Chow Mein",0.00,false,false,true],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[13,"Super Greens",0.00,true,false,true],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[15,"Fried Rice",0.00,false,false,true],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[16,"White Steamed Rice",0.00,false,false,true],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[17,"Chicken Egg Roll",2.00,false,true,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[18,"Veggie Spring Roll",2.00,false,true,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[19,"Cream Cheese Rangoon",2.00,false,true,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[20,"Apple Pie Roll",2.00,false,true,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[21,"Drink",2.10,false,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[22,"Sick Chicken",1.50,true,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[23,"Bowl",8.30,false,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[24,"Plate",9.80,false,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[25,"Bigger Plate",11.30,false,false,false],err=>{
//     if (err) return console.error(err.message);
// })
// query menuitem
// sql = 'SELECT * from menuitem';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })


// //create menuitemingredients table
// sql = 'CREATE TABLE menuitemingredients(id,menuitemid,inventoryitemid)';
// db.run(sql);
//insert menuitemingredients


// sql = 'INSERT INTO menuitemingredients(id,menuitemid,inventoryitemid) VALUES(?,?,?)'
// db.run(sql,[1,0,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[2,0,16],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[3,1,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[4,1,11],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[5,1,14],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[6,2,6],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[7,2,16],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[8,3,4],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[9,3,13],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[10,4,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[11,4,15],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[12,5,2],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[13,5,5],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[14,6,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[15,6,2],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[16,6,16],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[17,7,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[18,7,13],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[19,8,5],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[20,8,2],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[21,8,15],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[22,9,2],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[23,9,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[24,10,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[25,10,14],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[26,11,2],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[27,11,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[28,11,12],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[29,12,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[30,12,16],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[31,13,2],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[32,14,1],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[33,15,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[34,16,0],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[35,17,7],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[36,18,8],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[37,19,9],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[38,20,10],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[39,21,24],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[40,21,23],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[41,22,3],err=>{
//     if (err) return console.error(err.message);
// })
// db.run(sql,[42,22,0],err=>{
//     if (err) return console.error(err.message);
// })


// query menuitem
// sql = 'SELECT * from menuitemingredients';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })


// //create employee table
// sql = 'CREATE TABLE orders(orderid,cost,numcombos,nummenuitems,dateof,time,cashierid)';
// db.run(sql);


// //insert into orders table
// sql = 'INSERT INTO orders(orderid,cost,numcombos,nummenuitems,dateof,time,cashierid) VALUES(?,?,?,?,?,?,?)'
// db.run(sql,[0,8.9,1,1,"2022-09-08","10:00",5],err=>{
//     if (err) return console.error(err.message);
// })
// // query menuitem
// sql = 'SELECT * from orders';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })


//create ordertomenuitem table
// sql = 'CREATE TABLE ordertomenuitem(ordertomenuitemid,menuitemid,orderid)';
// db.run(sql);


// insert into orders table
// sql = 'INSERT INTO ordertomenuitem(ordertomenuitemid,menuitemid,orderid) VALUES(?,?,?)'
// db.run(sql,[0,0,0],err=>{
//     if (err) return console.error(err.message);
// })
// query menuitem
// sql = 'SELECT * from ordertomenuitem';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })


// create timesheet table
// sql = 'CREATE TABLE timesheet(timesheetid,cashierid,dateof,timeclockedin,timeclockedout)';
// db.run(sql);


//  db.run("Drop TABLE timesheet");


// insert into timesheet table
// sql = 'INSERT INTO timesheet(timesheetid,cashierid,dateof,timeclockedin,timeclockedout) VALUES(?,?,?,?,?)'
// db.run(sql,[0,0,"2022-09-09","08:00","16:00"],err=>{
//     if (err) return console.error(err.message);
// })timesheet
// query menuitem
// sql = 'SELECT * from ordertomenuitem';
// db.all(sql,[],(err,rows)=>{
//     if (err) return console.error(err.message);
//     rows.forEach(row=>{
//         console.log(row);
//     })
// })







