import pandas as pd
import numpy as np

FILEPATH = 'syntheticActivityData.csv'
MAX_LEN = 2000


data = pd.read_csv(FILEPATH)
df = pd.DataFrame(data)
lengthOfCalls = []
numUniqueCalls = []
variability = []

totalRecords = len(df)

for line in range(totalRecords):
    if line % 1000 == 0:
        print("Metric Calculation Complete upto Record: {record} of {totalRecords}".format(record=line, totalRecords=totalRecords))
    arrConvert = eval('[' + df['stream'][line] + ']')
    lengthOfCalls.append(len(arrConvert))
    numUniqueCalls.append(len(set(arrConvert)))
    # variability
    variabilityCounter = 0
    for i in range(len(arrConvert) - 1):
        if arrConvert[i] != arrConvert[i + 1]:
            variabilityCounter += 1
    variability.append(variabilityCounter / len(arrConvert))


moredata = pd.DataFrame({'lengthOfCalls': lengthOfCalls, 'numUniqueCalls': numUniqueCalls, 'variability': variability})
df = df.join(moredata)
# This filter should be applied earlier so that more complex metrics are not slowed down
print(len(df))
df = df[df['lengthOfCalls'] <= MAX_LEN]
df.reset_index(inplace=True)
jsonOut = "["
totalFilteredRecords = len(df)
print(totalFilteredRecords)
for line in range(totalFilteredRecords):
    if line % 1000 == 0:
        print("JSON-ifing Record Complete upto: {record} of {totalRecords}".format(record=line, totalRecords=totalFilteredRecords))
    lengthOfCall = df["lengthOfCalls"][line]
    uniques = df["numUniqueCalls"][line]
    variability = df["variability"][line]
    label = df["label"][line]
    predicted = df["prediction"][line]
    recordOut = ''\
          '\n{\n'\
            '\t"recNum": %d,\n'\
            '\t"label": "%s",\n'\
            '\t"predicted": "%s",\n'\
            '\t"lengthOfCalls": %d,\n'\
            '\t"numUniqueCalls": %d,\n'\
            '\t"variability": %.3f\n'\
          '},' % (line, label, predicted, lengthOfCall, uniques, variability)
    jsonOut += recordOut
jsonOut = jsonOut[:-1] + "]"

with open('timeSeries.json', 'w+') as file:
    file.write(jsonOut)
    file.close()

uniqueLabels = list(np.unique(df['label'].values))
with open("labels.js", 'w+') as file:
    file.write("labels = " + str(uniqueLabels))
    file.close()