import json

with open('data.json', 'r') as f1:
    data = json.load(f1)

with open('prices.json', 'r') as f2:
    prices = json.load(f2)

for i in data["drinks"]:
    price = i["price"]
    prices["prices"].append({data["drinks"]:[{"value" : price},{"value" : price},{"value" : price},{"value" : price}, {"value" : price}, {"value" : price},{"value" : price},{"value" : price},{"value" : price},{"value" : price}]})

with open('prices.json', 'w') as f2:
    json.dump(prices, f2)