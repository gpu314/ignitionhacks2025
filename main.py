from speech import mode, textospeech, speechtotext
from assistant import translate, food, landmarks

print("Started")

while True:
    try:
        speech_input = speechtotext.listen()
        if not speech_input:
            continue
        print(f"Inputted: {speech_input}")

        mode_type, params = mode.parse(speech_input)
        print(f"Mode: {mode_type}, Params: {params}")

        if mode_type == "translate":
            resp = translate.translate(**params)
        elif mode_type == "food":
            resp = food.food_recs()
        elif mode_type == "landmarks":
            resp = landmarks.landmark_recs()
        else:
            resp = "error"

        textospeech.speak(resp)

    except KeyboardInterrupt:
        print("Exiting")
        break
    except Exception as e:
        print(e)
