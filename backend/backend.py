import json
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from threading import Timer
import random

class RepeatedTimer(object):
    def __init__(self, interval, function, *args, **kwargs):
        self._timer     = None
        self.interval   = interval
        self.function   = function
        self.args       = args
        self.kwargs     = kwargs
        self.is_running = False
        self.start()

    def _run(self):
        self.is_running = False
        self.start()
        self.function(*self.args, **self.kwargs)

    def start(self):
        if not self.is_running:
            self._timer = Timer(self.interval, self._run)
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running = False

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
    print("Hi")
    with open('data.json', 'r') as f:
        data = json.load(f)
    for i in data["drinks"]:
        rand = random.randint(1,2)
        if rand == 1:
            i = updatePrices(i, 0.10)
        else:
            i = updatePrices(i, -0.10)
    with open('data.json', 'w') as f:
        json.dump(data, f)

rt = RepeatedTimer(30, randPriceChange)

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
    print(buying["drink"], buying["price"])
    with open('data.json', 'r') as f:
        data = json.load(f)
    typeDrink = ""
    for i in data["drinks"]:
        if i["name"] == buying["drink"]:
            typeDrink = i["type"]
    for i in data["drinks"]:
        if i["name"] == buying["drink"]:
            updatePrices(i, 0.25)
        elif i["type"] == typeDrink:
            updatePrices(i, -0.10)
    with open('data.json', 'w') as f:
        json.dump(data, f)
    return data