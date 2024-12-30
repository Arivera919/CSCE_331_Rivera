-- Special Query #2: "Realistic Sales History"
-- pseudocode: select count of orders, sum of order total grouped by hour
-- about: given a specific hour of the day, how many orders were placed and what was the total sum of the orders?
-- example: e.g., "12pm has 12345 orders totaling $86753"
SELECT EXTRACT(hour from time) as timeoforder, count(orderID) as order_count, sum(cost) as total from orders where 
EXTRACT(hour from time) = 12 group by EXTRACT(hour from time);
