import json

words = []
with open("wordlewords.txt") as f:
  for line in f:
    newWords = line.rstrip().split('\t')
    newWords = list(filter(lambda w: len(w)==5, newWords))
    words.extend(newWords)
print(len(words))

data = {}
data["solutions"] = []
for i in range(len(words)):
  data["solutions"].append({"id": i, "word": words[i]})

data["letters"] = []
for i in range(ord('a'), ord('z')+1):
  data["letters"].append({"key": chr(i)})

with open('../public/db.json', 'w') as f:
  json.dump(data, f)