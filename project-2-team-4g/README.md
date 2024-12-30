# project-2-team-4g
Project 2 for CSCE 331

Requirements:

Data

You will create data to be stored in your database:

    Create at least 52 weeks of sales history -- starting about one year ago and ending about today -- to store in your database that in total have approximately $1 million in sales.
            9/30/2023 to 9/30/2024
        Include 2 peak(s) days where sales are significantly higher, which typically occur at the start of the regular semester. You might also consider peak days like game days vs. away games for football.

    Create inventory items for at least 20 different menu items. Remember that a given menu item will have multiple ingredients.
        You will also need other items such as cups, straws, napkins, flatware, to-go boxes, bags, and so on.

You are strongly encouraged to use scripting (e.g. Python) to generate `.sql` files that contain sequences of SQL commands to populate the database. You should end up with several thousand insert statements (if not tens or hundreds of thousands of them). Save all of these scripts so you can recreate anything at any time.


Queries

You will also create at least 15 SQL queries that can be run as an input file to verify the low-level design and interactions in your database, but you are encouraged to build additional SQL queries for extra practice.

    These queries should have some examples of a desired question that can be answered through this query.
    They should also demonstrate that your database has been correctly populated and you have supplied the additional data as requested above.
    You will submit this query list on Canvas and demo these queries in lab.


Special Queries

Every team must include the first 4 special queries which will be used to verify the seeding of the database:

Special Query #1: "Weekly Sales History"

    pseudocode: select count of orders grouped by week
    about: given a specific week, how many orders were placed?
    example: "week 1 has 98765 orders"

Special Query #2: "Realistic Sales History"

    pseudocode: select count of orders, sum of order total grouped by hour
    about: given a specific hour of the day, how many orders were placed and what was the total sum of the orders?
    example: e.g., "12pm has 12345 orders totaling $86753"

Special Query #3: "Peak Sales Day"

    pseudocode: select top 10 sums of order total grouped by day in descending order by order total
    about: given a specific day, what was the sum of the top 10 order totals?
    example: "30 August has $12345 of top sales"

Special Query #4: "Menu Item Inventory"

    pseudocode: select count of inventory items from inventory and menu grouped by menu item
    about: given a specific menu item, how many items from the inventory does that menu item use?
    example: "chicken fingers uses 12 items"



