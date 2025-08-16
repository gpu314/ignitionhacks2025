import requests

def landmark_recs(lat=43.655863594186755, lon=-79.38249460259485, radius=1000):
    query = f"""
    [out:json];
    node
      ["tourism"~"attraction|museum|gallery|zoo|aquarium|theme_park|viewpoint|monument"]
      (around:{radius},{lat},{lon});
    node
      ["historic"]
      (around:{radius},{lat},{lon});
    out;
    """

    url = "http://overpass-api.de/api/interpreter"
    resp = requests.get(url, params={"data": query})

    if resp.status_code != 200:
        return "landmarks failure"
    
    data = resp.json()
    elements = data.get("elements", [])
    if not elements:
        return "no landmarks"
    
    recs = []
    for x in elements[:3]:
        name = x["tags"].get("name", "Unnamed")
        lat, lon = x.get("lat"), x.get("lon")
        recs.append(f"{name}\nLocation: {lat:.5f}, {lon:.5f}")
    
    return "\n\n".join(recs)