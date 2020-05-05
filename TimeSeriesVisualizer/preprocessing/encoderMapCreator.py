'''
Builds an encoder json from python dictionary

Accepts:
txt files -> if you wrote the python dictionary as a string to a file
pkl file -> if you serialized the file with pickle

Author: Matthew Schofield
Version: 4/26/2020
'''
import pickle as pkl

# Set this to your encoder file
FILEPATH = "syntheticActivityMap.txt"


# Reads in file
if FILEPATH[-3:] == "txt":
    encodingMap = eval(open(FILEPATH, 'r').read())
elif FILEPATH[-3:] == "pkl" or FILEPATH[-6:] == "pickle":
    encodingMap = pkl.load(open(FILEPATH, 'rb'))
else:
    raise Exception("Please use a txt or pkl/pickle file")

# Builds json
out = "["

for k in encodingMap.keys():
    out += '\n{ "code": "' + str(encodingMap[k]) + '", "object": "' + str(k) + '"},'

# Clears last ',' , JSON is sensitive
out = out[:-1]
out += "]"


with open("encoder.json", 'w+') as file:
    file.write(out)
    file.close()
print("Successfully built the encoder.json file, drop this into the app/static/data/ directory")