-- Special Query #1: "Weekly Sales History"
-- pseudocode: select count of orders grouped by week
-- about: given a specific week, how many orders were placed?
-- example: "week 1 has 98765 orders"
SELECT EXTRACT(WEEK FROM dateof) AS week_number, COUNT(orderID) AS order_count
FROM orders
WHERE EXTRACT(WEEK FROM dateof) = 2
GROUP BY EXTRACT(WEEK FROM dateof);