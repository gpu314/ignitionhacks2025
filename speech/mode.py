def parse(text):
    if "translate" in text and " to " in text:
        pharse, lang = text.replace("translate", "").split(" to ")
        return "translate", {"text": pharse, "lang": lang}
    if "food" in text:
        return "food", {"food": "recs"}
    if "landmark" in text:
        return "landmarks", {"landmark": "recs"}
