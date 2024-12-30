import csv
import random
from datetime import datetime, timedelta, time

def generateOrdersForYear():
    fileName = "orders.csv"

    headers = ['orderId', 'cost', 'comboList', 'menuItem', 'numCombos', 'numMenuItems', 'date', 'time', 'cashierId']
    
    entreesList = ["Hot Ones Blazing Bourbon Chicken", "The Original Orange Chicken", "Black Pepper Sirloin Steak", "Honey Walnut Shrimp", "Grilled Teriyaki Chicken", "Broccoli Beef", "Kung Pao Chicken", "Honey Sesame Chicken Breast", "Beijing Beef", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken Breast", "Black Pepper Chicken", "Super Greens"]

    sidesList = ["Super Greens", "Chow Mein", "Fried Rice", "White Steamed Rice"]

    appetizersList = ["Chicken Egg Roll", "Veggie Spring Roll", "Cream Cheese Rangoon", "Apple Pie Roll"]

    itemsList = ["Bowl", "Plate", "Bigger Plate"]

    costs = {"Bowl" : 8.30, "Plate" : 9.80, "Bigger Plate" : 11.30, "Appetizer" : 2.00, "Drink": 2.10}
    numItems = [1, 2, 3, 4, 5, 6]
    weightsNumItems = [70, 10, 7, 5, 4, 4]

    itemsWeights = [50, 35, 15]

    totalSales = 0.0
    with open(fileName, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)

        orderId = 1
        startDate = datetime.now() - timedelta(days = 365)

        for day in range(365):
            #generate day
            currentDate = startDate + timedelta(days = day)

            # Panda is closed on weekends so no sales
            if (currentDate.weekday() == 5 or currentDate.weekday() == 6):
                continue

            dailySales = 0.0

            currentDate_only = currentDate.date()

            dailySalesMin = random.gauss(4000, 1000)
            if(currentDate_only == datetime(2024, 8, 19).date() or currentDate_only == datetime(2023, 10, 7).date()):
                dailySalesMin = (random.gauss(8500, 500))
            while dailySales < dailySalesMin:
                #Setting up Lists for the items and entrees
                items = []
                entrees = []

                orderCost = 0.0

                #generating possible cashier ids
                cashierIds = random.sample(range(1, 7), 4)

                itemTotal = random.choices(numItems, weights = weightsNumItems, k = 1)[0]

                #Populate items
                for i in range (itemTotal):
                    if i == 0 :
                        items.append(random.choices(itemsList, weights = itemsWeights, k=1)[0])
                    else:
                        appOrCombo = random.randint(1,2)
                        if(appOrCombo == 1): #combo
                            items.append(random.choices(itemsList, weights = itemsWeights, k=1)[0])
                            drinkOrNah = random.randint(1,2)
                            if(drinkOrNah == 1):
                                items.append("Drink")
                        else: #appetizer
                            items.append("Appetizer")

                
                #Populate entrees
                appTotal = 0
                entreeTotal = 0
                for i in range (itemTotal):
                    if items[i] == "Bowl" :
                        entreeTotal += 1
                        entrees.append(sidesList[random.randint(0,3)])
                    elif items[i] == "Plate" :
                        entreeTotal += 2
                        entrees.append(sidesList[random.randint(0,3)])
                    elif items[i] == "Bigger Plate" :
                        entreeTotal += 3
                        entrees.append(sidesList[random.randint(0,3)])
                    elif items[i] == "Appetizer" :
                        appTotal += 1
                for i in range (entreeTotal):
                    entreeIndex = random.randint(0,len(entreesList)-1)
                    entrees.append(entreesList[entreeIndex])
                    if entreesList[entreeIndex] == "Black Pepper Sirloin Steak" or entreesList[entreeIndex] == "Honey Walnut Shrimp" :
                        orderCost += 1.50
                
                for i in range(appTotal):
                    entrees.append(appetizersList[random.randint(0,3)])
                    entreeTotal += 1


                #generating time of day
                startHour = 10  # 10 AM
                endHour = 21    # 9 PM

                randomHour = random.randint(startHour, endHour)
                randomMinute = random.randint(0, 59)

                timeofSale = time(randomHour, randomMinute)

                #pick cashier
                moringOrEveningShift = random.randint(1,2)
                if (moringOrEveningShift == 1):
                    whichEmployee = random.randint(1,2)
                    if(whichEmployee == 1):
                        cashierId = cashierIds[0]
                    else:
                        cashierId = cashierIds[1]   
                else:
                    whichEmployee = random.randint(1,2)
                    if(whichEmployee == 1):
                        cashierId = cashierIds[2]
                    else:
                        cashierId = cashierIds[3]

                #Tabulate order cost
                for i in range(len(items)):
                    orderCost += costs[items[i]]
                
                #Create list of attributes describing order and write it to the csv file
                order = [orderId, "{:.2f}".format(orderCost), ', '.join(items), ', '.join(entrees), len(items), len(entrees), currentDate.strftime("%Y-%m-%d"), timeofSale, cashierId]
                writer.writerow(order)

                #increment orderId for next order and add orderCost to daily sales
                orderId += 1
                dailySales += orderCost
            totalSales += dailySales 

            
            


def main():
    generateOrdersForYear()
    return

if __name__ == "__main__":
    main()