import json
from fastapi import FastAPI, Request, Response
from starlette.middleware.cors import CORSMiddleware
import threading, time
import random
import math
import matplotlib.pyplot as plt
import io
import base64
import ast

class reqthread(threading.Thread):
    def __init__(self,sleep):
        threading.Thread.__init__(self)
        self.sleep = sleep

    def run(self):
        while True:
            with open('backendSpeicher.json', 'r') as f1:
                zs = json.load(f1)
            if zs["marketCrash"] == 0:
                with open('data.json', 'r') as f:
                    data = json.load(f)
                for i in data["drinks"]:
                    rand = random.randint(1,5)
                    if rand == 1 or rand == 2:
                        i = updatePrices(i, (rand *0.25))
                    elif rand == 3 or rand == 4:
                        i = updatePrices(i, (math.floor(rand // 2) * -0.25))
                    else:
                        i = updatePrices(i, 0)
                with open('data.json', 'w') as f:
                    json.dump(data, f)
                time.sleep(self.sleep)
            else:
                time.sleep(120)
                with open('backendSpeicher.json', 'w') as f1:
                    zs["marketCrash"] = 0
                    json.dump(zs, f1)

def updatePrices(data, change):
    with open('backendSpeicher.json', 'r') as f:
        zs = json.load(f)
    if zs["marketCrash"] == 0:
        if change > 0:
            data["change"] = "up"
            if data["price"] + change < data["max"]:
                data["price"] += change
                updatePriceArr(data["name"], data["price"])
            else:
                data["price"] = data["max"]
                updatePriceArr(data["name"], data["price"])
        else:
            data["change"] = "down"
            if data["price"] + change > data["min"]:
                data["price"] += change
                updatePriceArr(data["name"], data["price"])
            else:
                data["price"] = data["min"]
                updatePriceArr(data["name"], data["price"])
        return data
    else:
        data["change"] = "down"
        data["price"] = data["min"]
        return data

def isMarketCrash(data, amount):
    with open('backendSpeicher.json', 'r') as f:
        buyedDrinks = json.load(f)
    if buyedDrinks["marketCrash"] == 1:
        amount = 0
    buyedDrinks["buyedDrinks"] += amount
    if buyedDrinks["buyedDrinks"] >= 50:
        for i in data["drinks"]:
            i["change"] = "down"
            i["price"] = i["min"]
            updatePriceArr(i["name"], i["price"])
        buyedDrinks["buyedDrinks"] = 0
        buyedDrinks["marketCrash"] = 1
    with open('backendSpeicher.json', 'w') as f:
        json.dump(buyedDrinks, f)
    return data

def updatePriceArr(name, newPrice):
    with open('prices.json', 'r') as f:
        prices = json.load(f)
    for i in prices["prices"]:
        for key in i:
            if key == name:
                i[key].pop(0)
                i[key].append(newPrice)
    with open('prices.json', 'w') as f:
        json.dump(prices, f)

def orders(drinks, price, amount, tisch):
    with open('tische.json', 'r') as f:
        data = json.load(f)
    for i in data["Tische"]:
        if tisch in i:
            numberOrder = len(i[tisch]) +1
            i[tisch].append({numberOrder:{"orders":[drinks, price, amount]}})
            break
        else:
            arr = [drinks, price, amount]
            data["Tische"].append({tisch:{"orders":arr}})
            break
    if data["Tische"] == []:
        print("hi")
        arr = [drinks, price, amount]
        data["Tische"].append({tisch:[{1:{"orders":arr}}]})
    with open('tische.json', 'w') as f:
        json.dump(data, f)

try:
    thread = reqthread(60)
    thread.daemon = True
    thread.start()
except KeyboardInterrupt:
    print("hi")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods = ["*"],
    allow_headers = ["*"],
        expose_headers=["*"]
    )

@app.get("/")
async def sendPrices():
    with open('data.json', 'r') as f:
        data = json.load(f)
    return data

@app.get("/getOrders")
async def sendOrders():
    with open('tische.json','r') as f:
        data = json.load(f)
    return data

@app.post("/getPricesOfName")
async def getPricesOfName(request: Request):
    name = await request.json()
    with open('prices.json', 'r') as f:
        prices = json.load(f)
    for i in prices["prices"]:
        for key in i:
            if key == name["drink"]:
                xValues = i[key]
                plt.plot(xValues, color='red')
                ax = plt.gca()
                ax.get_xaxis().set_visible(False)
                bio = io.BytesIO()
                plt.savefig(bio, format="png")
                plt.clf()
                return Response(base64.b64encode(bio.getvalue()), media_type='image/png')

@app.post("/buyDrinks")     
async def buyDrinks(request: Request):
    buying = await request.json()
    with open('data.json', 'r') as f:
        data = json.load(f)
    typeDrink = ""
    for i in data["drinks"]:
        if i["name"] == buying["drink"]:
            typeDrink = i["type"]
    for i in data["drinks"]:
        if i["name"] == buying["drink"]:
            updatePrices(i, (0.25 * buying["amount"]))
        elif i["type"] == typeDrink:
            updatePrices(i, (-0.10 * buying["amount"]))
    data = isMarketCrash(data, buying["amount"])
    orders(buying["drink"], buying["price"], buying["amount"], buying["tisch"])
    with open('data.json', 'w') as f:
        json.dump(data, f)
    return data

@app.post("/drinkReady")
async def drinkReady(request: Request):
    ready = await request.json()
    with open('tische.json', 'r') as f:
        data = json.load(f)
    for i in range(len(data["Tische"])):
        if int(list(data["Tische"][i].keys())[0]) == int(ready["tisch"]):
            del data["Tische"][i]
            with open('tische.json', 'w') as f:
                json.dump(data, f)
    return data

@app.post("/cancelDrink")
async def cancelDrink(request: Request):
    ready = await request.json()
    with open('tische.json', 'r') as f:
        data = json.load(f)
    for i in range(len(data["Tische"])):
        if int(list(data["Tische"][i].keys())[0]) == int(ready["tisch"]):
            del data["Tische"][i]
            with open('tische.json', 'w') as f:
                json.dump(data, f)
    return data