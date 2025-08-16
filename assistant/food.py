import requests

def food_recs(lat=43.655863594186755, lon=-79.38249460259485, radius=1000):
    query = f"""
    [out:json];
    node
      ["amenity"~"restaurant|fast_food|cafe"]
      (around:{radius},{lat},{lon});
    out;
    """

    url = "http://overpass-api.de/api/interpreter"
    resp = requests.get(url, params={"data": query})

    if resp.status_code != 200:
        return "food failure"
    
    data = resp.json()
    elements = data.get("elements", [])
    if not elements:
        return "no food"
    
    recs = []
    for x in elements[:3]:
        name = x["tags"].get("name", "Unnamed")
        cuisine = x["tags"].get("cuisine", "unknown cusine")
        website = x["tags"].get("website", "unknown website")
        lat, lon = x.get("lat"), x.get("lon")
        map_link = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}"
        recs.append(f"{name} ({cuisine})\nWebsite: {website}\nLocation: {lat:.5f}, {lon:.5f}\nMap: {map_link}")
    
    return "\n\n".join(recs)