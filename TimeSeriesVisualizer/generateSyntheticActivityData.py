import random

NUM_RECORDS = 1000

out = "recNum,calls,label,prediction"

for i in range(NUM_RECORDS):
    record = str(i) + ",\""
    # 2/3 chance of being a record of an active participant
    if random.randint(0,2):
        # Make a stream between 100 and 1000
        for j in range(random.randint(100,1000)):
            # Random value from a gaussian mean 5 std 2, min 0 max 9
            record += str(min(max(int(random.gauss(5,2)),0),9)) + ","
        record = record[:-1]
        record += "\",Active"
        # Model is 90% accurate
        if random.randint(0,9):
            record += ",Active"
        else:
            record += ",Sedentary"
    else:
        # Make a stream between 100 and 1000
        for j in range(random.randint(100,1000)):
            # Random value from a gaussian mean 3 std 1, min 0 max 9
            record += str(min(max(int(random.gauss(3,1)),0),9)) + ","
        record = record[:-1]
        record += "\",Sedentary"
        # Model is 90% accurate
        if random.randint(0,9):
            record += ",Sedentary"
        else:
            record += ",Active"
    out += '\n' + record
with open("syntheticActivityData.csv", 'w+') as file:
    file.write(out)
    file.close()
