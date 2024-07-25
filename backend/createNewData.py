import json

with open('data.json', 'r') as f:
    data = json.load(f)

with open('prices.json', 'r') as f1:
    prices = json.load(f1)

what = input("brink prices back to default? (y/n): ")
if what == "y":
    for i in data["drinks"]:
        i["price"] = i["min"]
        i["change"] = "down"
else:
    what = input("add a new drink? (y/n): ")
    if what == "y":
        type = input("type(cocktail/beer/shots/softdrinks): ")
        name = input("name: ")
        min = float(input("min price: "))
        max = float(input("max price: "))
        data["drinks"].append({"type": type, "name": name, "price": min, "min": min, "max": max, "change": "down"})
        price = min
        arr = [price, price, price, price, price, price, price, price, price, price]
        prices["prices"].append({name:arr})
with open('data.json', 'w') as f:
    json.dump(data, f)

with open('prices.json', 'w') as f1:
    json.dump(prices, f1)