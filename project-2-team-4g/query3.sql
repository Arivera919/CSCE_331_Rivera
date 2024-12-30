-- Special Query #3: "Peak Sales Day"
-- pseudocode: select top 10 sums of order total grouped by day in descending order by order total
-- about: given a specific day, what was the sum of the top 10 order totals?
-- example: "30 August has $12345 of top sales"
SELECT orders.dateof AS order_day, SUM(cost) AS total_sales
FROM orders
GROUP BY order_day
ORDER BY total_sales DESC
LIMIT 10;
