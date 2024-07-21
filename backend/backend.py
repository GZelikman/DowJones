import json
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
import threading, time
import random
import math

class reqthread(threading.Thread):
    def __init__(self,sleep):
        threading.Thread.__init__(self)
        self.sleep = sleep

    def run(self):
        while True:
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

    def sleep(self, sleep):
        self.sleep = sleep

def updatePrices(data, change):
    if change > 0:
        data["change"] = "up"
        if data["price"] + change < data["max"]:
            data["price"] += change
        else:
            data["price"] = data["max"]
    else:
        data["change"] = "down"
        if data["price"] + change > data["min"]:
            data["price"] += change
        else:
            data["price"] = data["min"]
    return data


def randPriceChange():
    with open('data.json', 'r') as f:
        data = json.load(f)
    for i in data["drinks"]:
        rand = random.randint(1,3)
        if rand == 1 or rand == 2:
            i = updatePrices(i, 0.25)
        else:
            i = updatePrices(i, -0.25)
    with open('data.json', 'w') as f:
        json.dump(data, f)

def isMarketCrash(data, amount, thread):
    with open('backendSpeicher.json', 'r') as f:
        buyedDrinks = json.load(f)
    buyedDrinks["buyedDrinks"] += amount
    if buyedDrinks["buyedDrinks"] >= 50:
        thread.stop()
        for i in data["drinks"]:
            i["change"] = "down"
            i["price"] = i["min"]
        buyedDrinks["buyedDrinks"] = 0
        thread.sleep(120)
        thread.start(60)
    with open('backendSpeicher.json', 'w') as f:
        json.dump(buyedDrinks, f)
    return data
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
    print(thread)
    data = isMarketCrash(data, buying["amount"], thread)
    with open('data.json', 'w') as f:
        json.dump(data, f)
    return data