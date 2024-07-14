import json 

longdong = '{"name": "Long Dong", "min":"5.00", "max":"10.00", "akt":"5.00", type="cocktail"}'

with open('backend/data.json', 'w') as f:
    json.dump(longdong, f)
