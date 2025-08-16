import asyncio
from googletrans import Translator

translator = Translator()

def translate(text, lang="fr"):
    loop = asyncio.get_event_loop()
    resp = loop.run_until_complete(translator.translate(text, dest=lang))
    return resp.text
