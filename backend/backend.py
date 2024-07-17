import json
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from fastapi.exceptions import RequestValidationError

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
    for i in data["drinks"]:
        if i["name"] == buying["drink"]:
            i["change"] = "up"
            if i["price"] + (0.25 * buying["amount"]) < 10:
                i["price"] += (0.25 * buying["amount"])
            else:
                i["price"] = 10.00
    with open('data.json', 'w') as f:
        json.dump(data, f)
    return data