import json
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def sendPrices():
    with open('data.json', 'r') as f:
        data = json.load(f)
    return data