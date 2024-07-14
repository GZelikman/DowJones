import json
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def sendPrices():
    with open('backend/data.json', 'r') as f:
        data = json.load(f)
    return data