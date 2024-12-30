# opens and reads a .csv file and converts it into SQL insert statements
# csv file first row is used as column names
# other rows have insert statements generated from them

import csv

filePath = "insert full file path of csv here"
tableName = "insert table name here"

openFile = open(filePath, 'r', encoding="utf8")
csvFile = list(csv.reader(openFile))

intList = []

length = len(csvFile)
innerLength = len(csvFile[0])
for x in range(1, length):
    # first build start of print String
    printString = "INSERT INTO " + tableName + "( "
    for j in range(0,innerLength):
        if j != innerLength-1:
            endValue = ", "
        else:
            endValue = ""

        printString += csvFile[0][j] + endValue
    printString += ") VALUES ("

    for i in range(0, innerLength):
        # if last in set then we don't need a comma
        if i != innerLength-1:
            endValue = ", "
        else:
            endValue = ""
        
        if i in intList:
            # process as int (don't need quote marks)
            printString += csvFile[x][i] + endValue
        elif csvFile[x][i] == "":
            # handle empty data
            printString += "null" + endValue
        else:
            # handle strings (default value)
            printString += "'" + csvFile[x][i] + "'" + endValue


    printString += ");"
    print(printString)